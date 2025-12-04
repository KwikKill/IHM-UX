<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useDataStore } from '~/stores/data.store'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import FeedbackOverlay from '~/components/FeedbackOverlay.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const dataStore = useDataStore()
const feedbackEnabled = ref(false)

// global click listener: record UI clicks app-wide when enabled
onMounted(() => {
  try {
    // initialize flag from localStorage
    const f = localStorage.getItem('feedbackEnabled')
    feedbackEnabled.value = f === 'true'
  } catch {}

  const route = useRoute()

  const handler = (e: MouseEvent) => {
    try {
      if (!feedbackEnabled.value) return
      const x = e.clientX
      const y = e.clientY
      const w = window.innerWidth
      const h = window.innerHeight
      const target = (e.target && (e.target as Element).tagName) || 'unknown'
      const entry = { x, y, w, h, ts: Date.now(), target, path: (route && (route.fullPath ?? route.path)) }
      const raw = localStorage.getItem('userClicksUI')
      const arr = raw ? JSON.parse(raw) : []
      arr.push(entry)
      localStorage.setItem('userClicksUI', JSON.stringify(arr))
      // also dispatch a storage-like event locally for same-tab listeners
      window.dispatchEvent(new CustomEvent('userClicksUI:update', { detail: entry }))
    } catch (err) { console.error('feedback capture error', err) }
  }

  window.addEventListener('click', handler, true)
  // listen for changes from overlay in same tab
  const onToggle = (ev: any) => {
    try { feedbackEnabled.value = !!ev.detail } catch {}
  }
  window.addEventListener('feedbackEnabled:change', onToggle)
  // keep storage in sync across tabs
  const onStorage = (ev: StorageEvent) => {
    if (ev.key === 'feedbackEnabled') {
      try { feedbackEnabled.value = ev.newValue === 'true' } catch {}
    }
  }
  window.addEventListener('storage', onStorage)

  // cleanup when app unmounts
  onUnmounted(() => {
    window.removeEventListener('click', handler, true)
    window.removeEventListener('feedbackEnabled:change', onToggle)
    window.removeEventListener('storage', onStorage)
  })
})

onMounted(async () => {
  dataStore.setLoading(true)

  const fake = true;

  await Promise.all([
    dataStore.fetchNextBuses(fake),
    dataStore.fetchBusStops(fake),
    dataStore.fetchBusTopology(fake),
    dataStore.fetchItineraries(fake),
    dataStore.fetchNetworkData(fake),
    dataStore.fetchTrafficData(fake),
    dataStore.fetchBusInfo(fake),
  ]).catch((e) => {
    console.error('Initial data fetch failed', e)
  }).finally(() => {
    dataStore.setLoading(false)

    // Download initial data
    /*const data = dataStore.getAllDataAsJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'app-data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)*/
  })
})

// Required for shadcn absolute components
onMounted(() => {
  document.body.classList.add('dark')
})
</script>

<template>
  <div class="dark bg-background text-foreground flex-1 flex flex-col">
    <Header />
    <NuxtRouteAnnouncer />

    <div class="flex flex-1 flex-col">
      <Suspense>
        <template #default>
          <NuxtPage />
        </template>

        <template #fallback>
          <!-- Simple Tailwind spinner / loading placeholder -->
          <div class="flex flex-1 items-center justify-center p-8">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4" />
              <div class="text-sm text-gray-600">Loading…</div>
            </div>
          </div>
        </template>
      </Suspense>
    </div>

    <Footer />

    <FeedbackOverlay />

    <div 
      v-if="dataStore.loading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
        <div class="text-sm">Loading application data…</div>
      </div>
    </div>
  </div>
</template>
