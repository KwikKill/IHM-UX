<template>
  <Card class="p-4 gap-4">
    <!-- Alerts -->
    <Card
      v-for="(alert, index) in paginatedData"
      :key="index"
      class="overflow-hidden bg-secondary text-background gap-0"
    >
      <CardHeader class="pb-3">
        <div class="flex items-start gap-4">
          <!-- Bus Line Logo -->
          <div class="relative flex justify-center items-center p-2">
            <img
              :src="`/pictos/${alert.idligne}.png`"
              :alt="`Logo ligne ${alert.nomcourtligne}`"
              class="h-12 w-12 rounded-md object-contain"
            >
            <div
              class="absolute top-0 right-0 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              :class="{
                'bg-red-600': alert.niveau.includes('Majeure'),
                'bg-orange-500': alert.niveau.includes('Bloquante') && !alert.niveau.includes('Majeure'),
                'bg-green-500': alert.niveau.includes('Mineure') && !alert.niveau.includes('Majeure') && !alert.niveau.includes('Bloquante'),
              }"
            />
          </div>

          <!-- Reason and Time -->
          <div class="flex-1 min-w-0">
            <CardTitle class="text-lg font-semibold mb-1">
              {{ alert.titre }}
            </CardTitle>
            <p class="text-sm text-muted-foreground">
              {{ new Date(alert.debutvalidite).toLocaleString() }} -
              {{ alert.finvalidite ? new Date(alert.finvalidite).toLocaleString() : 'Indefinite' }}
            </p>
            <Separator class="bg-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p class="text-sm leading-relaxed">
          {{ alert.description }}
        </p>
      </CardContent>
    </Card>

    <!-- Empty State -->
    <div v-if="paginatedData.length === 0" class="text-center py-12 text-muted-foreground">
      <p>No traffic alerts at this time</p>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 pt-4">
      <Button
        class="cursor-pointer"
        :disabled="nbPage === 0"
        @click="prevPage"
      >
        Previous
      </Button>
      <span class="text-sm">
        Page {{ nbPage + 1 }} / {{ totalPages }}
      </span>
      <Button
        class="cursor-pointer"
        :disabled="nbPage >= totalPages - 1"
        @click="nextPage"
      >
        Next
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TrafficData } from '~/models/models'
import { ref, computed } from 'vue'
import Button from './ui/button/Button.vue'
import Separator from './ui/separator/Separator.vue'

const nbPage = ref(0)
const pageSize = ref(4)

const dataStore = useDataStore()

// --- Base data getter (existing logic) ---
const getData = (): TrafficData[] => {
  const niveauOrder = ['Majeure', 'Bloquante', 'Mineure']
  const map = new Map()
  for (const a of dataStore.trafficData) {
    let idx = niveauOrder.findIndex(n => a.niveau.includes(n))
    if (idx === -1) idx = niveauOrder.length
    const key = a.idligne
    if (!map.has(key) || idx < map.get(key).idx) {
      map.set(key, { alert: a, idx })
    }
  }
  return Array.from(map.values())
    .map(v => v.alert)
    .sort((a, b) => {
      const aIndex = niveauOrder.findIndex(n => a.niveau.includes(n))
      const bIndex = niveauOrder.findIndex(n => b.niveau.includes(n))
      return aIndex - bIndex
    })
}

// --- Pagination logic ---
const totalPages = computed(() => Math.ceil(getData().length / pageSize.value))

const paginatedData = computed(() => {
  const start = nbPage.value * pageSize.value
  const end = start + pageSize.value
  return getData().slice(start, end)
})

function nextPage() {
  if (nbPage.value < totalPages.value - 1) nbPage.value++
}

function prevPage() {
  if (nbPage.value > 0) nbPage.value--
}
</script>
