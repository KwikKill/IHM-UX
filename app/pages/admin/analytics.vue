<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { $fetch } from 'ofetch'

// Types and interfaces
interface SessionEvent {
  type: 'click' | 'pageView' | 'customEvent' | 'sessionStart'
  data: any
  timestamp: number
}

interface Session {
  sessionId: string
  startTime: number
  events: SessionEvent[]
  userAgent: string
  screenWidth: number
  screenHeight: number
}

// Reactive state
const sessions = ref<Session[]>([])
const selectedSession = ref<Session | null>(null)
const viewMode = ref<'list' | 'session' | 'heatmap' | 'replay'>('list')
const heatmapPage = ref<string>('/')
const autoRefresh = ref(false)
let refreshInterval: NodeJS.Timeout | null = null

const replayIndex = ref(0)
const replaySession = ref<Session | null>(null)

const previewScrollContainer = ref<HTMLElement | null>(null)
const scrollOffset = ref({ x: 0, y: 0 })

// Helper functions
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const getDuration = (session: Session) => {
  if (!session.events.length) return '0s'
  const lastEvent = session.events[session.events.length - 1]
  const duration = lastEvent.timestamp - session.startTime
  return `${Math.round(duration / 1000)}s`
}

const getEventCount = (session: Session) => {
  return session.events.length
}

const getClickCount = (session: Session) => {
  return session.events.filter(e => e.type === 'click').length
}

const getPageViews = (session: Session) => {
  return session.events.filter(e => e.type === 'pageView')
}

const fetchSessions = async () => {
  try {
    const data = await $fetch<Session[]>('/api/analytics/sessions')
    sessions.value = data
  } catch (error) {
    console.error('[Analytics] Failed to fetch sessions:', error)
  }
}

const selectSession = (session: Session) => {
  selectedSession.value = session
  viewMode.value = 'session'
}

const goBack = () => {
  viewMode.value = 'list'
  selectedSession.value = null
}

const showHeatmap = () => {
  viewMode.value = 'heatmap'
}

const startReplay = (session: Session) => {
  replaySession.value = session
  replayIndex.value = 0
  viewMode.value = 'replay'
}

const nextAction = () => {
  if (replaySession.value && replayIndex.value < replaySession.value.events.length - 1) {
    replayIndex.value++
  }
}

const previousAction = () => {
  if (replayIndex.value > 0) {
    replayIndex.value--
  }
}

const backToAdmin = () => {
  viewMode.value = 'list'
  replaySession.value = null
  replayIndex.value = 0
}

const getCurrentEvent = computed(() => {
  if (!replaySession.value) return null
  return replaySession.value.events[replayIndex.value]
})

const getCurrentPage = computed(() => {
  if (!replaySession.value) return '/'
  
  // Find the most recent pageView event up to current index
  for (let i = replayIndex.value; i >= 0; i--) {
    const event = replaySession.value.events[i]
    if (event.type === 'pageView') {
      return event.data.page
    }
  }
  return '/'
})

const trackScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollOffset.value = {
    x: target.scrollLeft,
    y: target.scrollTop
  }
}

// Computed properties
const heatmapData = computed(() => {
  if (!sessions.value) return []
  
  const clicks: Array<{x: number, y: number}> = []
  sessions.value.forEach(session => {
    session.events
      .filter(e => e.type === 'click' && e.data.page === heatmapPage.value)
      .forEach(e => {
        clicks.push({ x: e.data.pageX, y: e.data.pageY })
      })
  })
  
  return clicks
})

const availablePages = computed(() => {
  if (!sessions.value) return ['/']
  
  const pages = new Set<string>()
  sessions.value.forEach(session => {
    session.events
      .filter(e => e.type === 'pageView')
      .forEach(e => pages.add(e.data.page))
  })
  
  return Array.from(pages).sort()
})

// Watchers
watch(viewMode, (mode) => {
  if (mode === 'list' && autoRefresh.value) {
    refreshInterval = setInterval(() => {
      fetchSessions()
    }, 10000)
  } else if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

watch(autoRefresh, (enabled) => {
  if (enabled && viewMode.value === 'list') {
    refreshInterval = setInterval(() => {
      fetchSessions()
    }, 10000)
  } else if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})

// Lifecycle hooks
onMounted(() => {
  fetchSessions()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Header -->
    <Card>
      <CardHeader>
        <CardTitle>Analytics Admin Panel</CardTitle>
        <CardDescription>Track user sessions, clicks, and navigation patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Button @click="viewMode = 'list'" :variant="viewMode === 'list' ? 'default' : 'outline'">
            <Icon name="mdi:view-list" class="w-4 h-4 mr-2" />
            Sessions List
          </Button>
          <Button @click="showHeatmap" :variant="viewMode === 'heatmap' ? 'default' : 'outline'">
            <Icon name="mdi:heat-wave" class="w-4 h-4 mr-2" />
            Heatmap
          </Button>
          <div class="ml-auto flex items-center gap-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox v-model:checked="autoRefresh" />
              Auto-refresh
            </label>
            <Button @click="fetchSessions" variant="outline" size="sm">
              <Icon name="mdi:refresh" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Sessions List View -->
    <div v-if="viewMode === 'list'" class="space-y-4">
      <Card v-if="!sessions || sessions.length === 0">
        <CardContent class="py-8 text-center text-muted-foreground">
          <Icon name="mdi:information-outline" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No sessions recorded yet</p>
          <p class="text-sm mt-2">Start using the app to collect analytics data</p>
        </CardContent>
      </Card>

      <Card v-for="session in sessions" :key="session.sessionId" class="hover:bg-accent/50 transition-colors">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="text-base">Session {{ session.sessionId.substring(8, 20) }}</CardTitle>
              <CardDescription>{{ formatDate(session.startTime) }}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <div class="text-muted-foreground text-xs mb-1">Duration</div>
              <div class="font-medium">{{ getDuration(session) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-xs mb-1">Events</div>
              <div class="font-medium">{{ getEventCount(session) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-xs mb-1">Clicks</div>
              <div class="font-medium">{{ getClickCount(session) }}</div>
            </div>
            <div>
              <div class="text-muted-foreground text-xs mb-1">Page Views</div>
              <div class="font-medium">{{ getPageViews(session).length }}</div>
            </div>
          </div>
          <div class="mt-3 text-xs text-muted-foreground truncate flex items-center gap-2 mb-3">
            <Icon name="mdi:monitor" class="w-4 h-4" />
            {{ session.screenWidth }} x {{ session.screenHeight }}
          </div>
          <div class="flex gap-2">
            <Button @click="selectSession(session)" variant="outline" size="sm">
              <Icon name="mdi:eye" class="w-4 h-4 mr-1" />
              View Details
            </Button>
            <Button @click="startReplay(session)" variant="outline" size="sm">
              <Icon name="mdi:play" class="w-4 h-4 mr-1" />
              Replay Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Session Detail View -->
    <div v-else-if="viewMode === 'session' && selectedSession" class="space-y-4">
      <Card>
        <CardHeader>
          <div class="flex items-center gap-2">
            <Button @click="goBack" variant="outline" size="sm">
              <Icon name="mdi:arrow-left" class="w-4 h-4 mr-1" />
              Back
            </Button>
            <CardTitle>Session Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-sm text-muted-foreground mb-1">Session ID</div>
              <div class="font-mono text-sm">{{ selectedSession.sessionId }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground mb-1">Start Time</div>
              <div class="text-sm">{{ formatDate(selectedSession.startTime) }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground mb-1">Duration</div>
              <div class="text-sm">{{ getDuration(selectedSession) }}</div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground mb-1">Screen Size</div>
              <div class="text-sm">{{ selectedSession.screenWidth }} x {{ selectedSession.screenHeight }}</div>
            </div>
            <div class="md:col-span-2">
              <div class="text-sm text-muted-foreground mb-1">User Agent</div>
              <div class="text-xs break-all">{{ selectedSession.userAgent }}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Events Timeline -->
      <Card>
        <CardHeader>
          <CardTitle>Events Timeline ({{ selectedSession.events.length }} events)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2 max-h-[600px] overflow-y-auto">
            <div 
              v-for="(event, index) in selectedSession.events" 
              :key="index"
              class="p-3 rounded-lg border"
              :class="{
                'bg-blue-500/10 border-blue-500/30': event.type === 'pageView',
                'bg-green-500/10 border-green-500/30': event.type === 'click',
                'bg-purple-500/10 border-purple-500/30': event.type === 'customEvent',
                'bg-yellow-500/10 border-yellow-500/30': event.type === 'sessionStart'
              }"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-1">
                  <Icon 
                    :name="event.type === 'pageView' ? 'mdi:eye' : event.type === 'click' ? 'mdi:cursor-default-click' : event.type === 'sessionStart' ? 'mdi:play-circle' : 'mdi:lightning-bolt'" 
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="font-semibold capitalize">{{ event.type }}</span>
                    <span class="text-xs text-muted-foreground">
                      {{ formatDate(event.timestamp) }}
                    </span>
                    <span class="text-xs text-muted-foreground">
                      (+{{ Math.round((event.timestamp - selectedSession.startTime) / 1000) }}s)
                    </span>
                  </div>
                  
                  <!-- Page View Details -->
                  <div v-if="event.type === 'pageView'" class="text-sm space-y-1">
                    <div><strong>Page:</strong> {{ event.data.page }}</div>
                    <div v-if="event.data.referrer"><strong>From:</strong> {{ event.data.referrer }}</div>
                  </div>
                  
                  <!-- Click Details -->
                  <div v-else-if="event.type === 'click'" class="text-sm space-y-1">
                    <div><strong>Position:</strong> ({{ event.data.x }}, {{ event.data.y }})</div>
                    <div><strong>Page:</strong> {{ event.data.page }}</div>
                    <div><strong>Element:</strong> {{ event.data.target.tagName }}</div>
                    <div v-if="event.data.target.text" class="text-xs text-muted-foreground truncate">
                      "{{ event.data.target.text }}"
                    </div>
                  </div>
                  
                  <!-- Custom Event Details -->
                  <div v-else-if="event.type === 'customEvent'" class="text-sm">
                    <div><strong>Event:</strong> {{ event.data.eventName }}</div>
                    <pre class="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto">{{ JSON.stringify(event.data.data, null, 2) }}</pre>
                  </div>
                  
                  <!-- Session Start Details -->
                  <div v-else-if="event.type === 'sessionStart'" class="text-sm">
                    <div class="text-muted-foreground">Session initialized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Heatmap View -->
    <div v-else-if="viewMode === 'heatmap'" class="space-y-4">
      <Card>
        <CardHeader>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Click Heatmap</CardTitle>
              <CardDescription>Visualize where users are clicking</CardDescription>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm whitespace-nowrap">Page:</label>
              <select v-model="heatmapPage" class="px-3 py-1.5 rounded-md border bg-background text-sm min-w-[150px]">
                <option v-for="page in availablePages" :key="page" :value="page">
                  {{ page }}
                </option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div v-if="heatmapData.length === 0" class="py-12 text-center text-muted-foreground">
            <Icon name="mdi:cursor-default-click-outline" class="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p>No click data available for this page</p>
            <p class="text-sm mt-2">Navigate to {{ heatmapPage }} and interact to see the heatmap</p>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-red-500"></div>
                High density
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-red-500/40"></div>
                Low density
              </div>
              <div class="ml-auto">
                Total clicks: <strong class="text-foreground">{{ heatmapData.length }}</strong>
              </div>
            </div>
            <div class="relative bg-muted/30 rounded-lg border overflow-hidden" style="min-height: calc(100vh - 400px);">
              <!-- Heatmap visualization -->
              <div class="absolute inset-0">
                <!-- Blur layer for heatmap effect -->
                <div 
                  v-for="(click, index) in heatmapData" 
                  :key="`blur-${index}`"
                  class="absolute w-12 h-12 rounded-full bg-red-500/30 blur-xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  :style="{
                    left: `${click.x}px`,
                    top: `${click.y}px`
                  }"
                />
                <!-- Dot layer for precise location -->
                <div 
                  v-for="(click, index) in heatmapData" 
                  :key="`dot-${index}`"
                  class="absolute w-2 h-2 rounded-full bg-red-600 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  :style="{
                    left: `${click.x}px`,
                    top: `${click.y}px`
                  }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Replay View -->
    <div v-else-if="viewMode === 'replay' && replaySession" class="space-y-4">
      <!-- Replay Controls -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Session Replay</CardTitle>
              <CardDescription>
                Step {{ replayIndex + 1 }} of {{ replaySession.events.length }}
              </CardDescription>
            </div>
            <Button @click="backToAdmin" variant="outline" size="sm">
              <Icon name="mdi:close" class="w-4 h-4 mr-1" />
              Back to Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 justify-center">
            <Button 
              @click="previousAction" 
              :disabled="replayIndex === 0"
              variant="outline"
            >
              <Icon name="mdi:chevron-left" class="w-5 h-5 mr-1" />
              Previous Action
            </Button>
            <div class="px-4 py-2 bg-muted rounded-md text-sm font-medium min-w-[100px] text-center">
              {{ replayIndex + 1 }} / {{ replaySession.events.length }}
            </div>
            <Button 
              @click="nextAction" 
              :disabled="replayIndex >= replaySession.events.length - 1"
              variant="outline"
            >
              Next Action
              <Icon name="mdi:chevron-right" class="w-5 h-5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Current Event Display -->
      <Card v-if="getCurrentEvent">
        <CardHeader>
          <CardTitle>Current Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            class="p-4 rounded-lg border-2"
            :class="{
              'bg-blue-500/10 border-blue-500': getCurrentEvent.type === 'pageView',
              'bg-green-500/10 border-green-500': getCurrentEvent.type === 'click',
              'bg-purple-500/10 border-purple-500': getCurrentEvent.type === 'customEvent',
              'bg-yellow-500/10 border-yellow-500': getCurrentEvent.type === 'sessionStart'
            }"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <Icon 
                  :name="getCurrentEvent.type === 'pageView' ? 'mdi:eye' : getCurrentEvent.type === 'click' ? 'mdi:cursor-default-click' : getCurrentEvent.type === 'sessionStart' ? 'mdi:play-circle' : 'mdi:lightning-bolt'" 
                  class="w-8 h-8"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-xl font-bold capitalize">{{ getCurrentEvent.type }}</span>
                  <span class="text-sm text-muted-foreground">
                    {{ formatDate(getCurrentEvent.timestamp) }}
                  </span>
                  <span class="text-sm text-muted-foreground">
                    (+{{ Math.round((getCurrentEvent.timestamp - replaySession.startTime) / 1000) }}s from start)
                  </span>
                </div>
                
                <!-- Page View Details -->
                <div v-if="getCurrentEvent.type === 'pageView'" class="space-y-2">
                  <div class="text-lg"><strong>Navigated to:</strong> <code class="bg-muted px-2 py-1 rounded">{{ getCurrentEvent.data.page }}</code></div>
                  <div v-if="getCurrentEvent.data.referrer" class="text-sm text-muted-foreground">
                    <strong>From:</strong> {{ getCurrentEvent.data.referrer }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    <strong>Full URL:</strong> {{ getCurrentEvent.data.url }}
                  </div>
                </div>
                
                <!-- Click Details -->
                <div v-else-if="getCurrentEvent.type === 'click'" class="space-y-2">
                  <div class="text-lg"><strong>Clicked on:</strong> {{ getCurrentEvent.data.target.tagName }}</div>
                  <div class="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <strong>Position:</strong> ({{ getCurrentEvent.data.pageX }}, {{ getCurrentEvent.data.pageY }})
                    </div>
                    <div>
                      <strong>Page:</strong> <code class="bg-muted px-2 py-1 rounded text-xs">{{ getCurrentEvent.data.page }}</code>
                    </div>
                  </div>
                  <div v-if="getCurrentEvent.data.target.id" class="text-sm">
                    <strong>Element ID:</strong> <code class="bg-muted px-2 py-1 rounded text-xs">{{ getCurrentEvent.data.target.id }}</code>
                  </div>
                  <div v-if="getCurrentEvent.data.target.className" class="text-sm">
                    <strong>Classes:</strong> <code class="bg-muted px-2 py-1 rounded text-xs">{{ getCurrentEvent.data.target.className }}</code>
                  </div>
                  <div v-if="getCurrentEvent.data.target.text" class="text-sm p-3 bg-muted rounded mt-2">
                    <strong>Text content:</strong> "{{ getCurrentEvent.data.target.text }}"
                  </div>
                </div>
                
                <!-- Session Start Details -->
                <div v-else-if="getCurrentEvent.type === 'sessionStart'" class="text-lg">
                  User started a new session
                </div>
                
                <!-- Custom Event Details -->
                <div v-else-if="getCurrentEvent.type === 'customEvent'" class="space-y-2">
                  <div class="text-lg"><strong>Custom Event:</strong> {{ getCurrentEvent.data.eventName }}</div>
                  <pre class="text-sm p-3 bg-muted rounded overflow-x-auto">{{ JSON.stringify(getCurrentEvent.data.data, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Page Preview Frame -->
      <Card>
        <CardHeader>
          <CardTitle>Current Page: {{ getCurrentPage }}</CardTitle>
          <CardDescription>Read-only preview (interaction disabled)</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="relative border rounded-lg overflow-hidden bg-muted/30" style="max-height: 80vh;">
            <div class="absolute top-2 right-2 z-10 bg-yellow-500 text-yellow-950 px-3 py-1 rounded-md text-sm font-medium shadow-lg">
              Read-Only Preview
            </div>
            
            <!-- Scrollable iframe container with scroll tracking -->
            <div 
              ref="previewScrollContainer"
              @scroll="trackScroll"
              class="overflow-y-auto" 
              style="max-height: 80vh;"
            >
              <iframe 
                :src="getCurrentPage" 
                class="w-full pointer-events-none"
                style="height: 100vh; border: none;"
              />
              
              <!-- Click indicator overlay moved inside scrollable container -->
              <div 
                v-if="getCurrentEvent && getCurrentEvent.type === 'click'" 
                class="absolute pointer-events-none z-20"
                :style="{
                  left: `${getCurrentEvent.data.pageX - scrollOffset.x}px`,
                  top: `${getCurrentEvent.data.pageY - scrollOffset.y}px`,
                  transform: 'translate(-100%, -50%)'
                }"
              >
                <div class="relative">
                  <div class="w-8 h-8 bg-red-500 rounded-full animate-ping absolute"></div>
                  <div class="w-8 h-8 bg-red-500 rounded-full relative flex items-center justify-center">
                    <Icon name="mdi:cursor-default-click" class="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Timeline Overview -->
      <Card>
        <CardHeader>
          <CardTitle>Session Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-1">
            <div 
              v-for="(event, index) in replaySession.events" 
              :key="index"
              class="flex items-center gap-2 p-2 rounded cursor-pointer transition-colors"
              :class="{
                'bg-primary text-primary-foreground': index === replayIndex,
                'hover:bg-accent': index !== replayIndex
              }"
              @click="replayIndex = index"
            >
              <div class="w-6 h-6 flex items-center justify-center text-xs font-bold rounded bg-muted">
                {{ index + 1 }}
              </div>
              <Icon 
                :name="event.type === 'pageView' ? 'mdi:eye' : event.type === 'click' ? 'mdi:cursor-default-click' : event.type === 'sessionStart' ? 'mdi:play-circle' : 'mdi:lightning-bolt'" 
                class="w-4 h-4"
              />
              <span class="text-sm capitalize">{{ event.type }}</span>
              <span class="text-xs opacity-70 ml-auto">+{{ Math.round((event.timestamp - replaySession.startTime) / 1000) }}s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
