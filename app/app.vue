<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useDataStore } from '~/stores/data.store'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const dataStore = useDataStore()

onMounted(async () => {
  dataStore.setLoading(true)

  await Promise.all([
    dataStore.fetchNextBuses(),
    dataStore.fetchBusStops(),
    dataStore.fetchBusTopology(),
    dataStore.fetchNetworkData(),
    dataStore.fetchTrafficData(),
  ]).catch((e) => {
    console.error('Initial data fetch failed', e)
  }).finally(() => {
    dataStore.setLoading(false)
    console.log("fetch", dataStore.trafficData)
  })
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

    <div 
      v-if="dataStore.loading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/75 dark:bg-black/50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4" />
        <div class="text-sm">Loading application data…</div>
      </div>
    </div>
  </div>
</template>
