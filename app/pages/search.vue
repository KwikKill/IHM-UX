<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-3">
    <!-- Traffic alert -->
    <LightTrafficAlert class="md:col-span-1 lg:col-span-1 hidden md:flex" />

    <!-- Main content: search + listing -->
    <div class="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
      <!-- Search bar -->
      <Card class="p-0">
        <div class="flex items-center gap-2 rounded-md p-2">
          <Icon name="mdi:magnify" class="w-5 h-5 ml-3 text-primary" />
          <Separator orientation="vertical" class="h-6 bg-primary/50" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un arrêt ou une ligne..."
            class="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </Card>

      <!-- Listing -->
      <Card class="flex-1">
        <div class="text-center py-4 text-muted-foreground">
          <div
            v-for="(item, index) in paginatedBuses"
            :key="index"
            class="border-b border-border last:border-0 py-2"
          >
            <p>{{ item.nomarret }} - Ligne {{ item.idligne }} : Arrivée dans {{ item.arriveetheorique }} minutes</p>
          </div>

          <!-- Empty state -->
          <div v-if="filteredBuses.length === 0" class="py-12">
            <p>Aucun bus trouvé</p>
          </div>
        </div>

        <!-- Pagination controls -->
        <div v-if="totalPages > 1" class="flex flex-wrap justify-center items-center gap-2 pt-4">
          <Button :disabled="currentPage === 0" @click="prevPage">Previous</Button>
          <span class="text-sm">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
          <Button :disabled="currentPage >= totalPages - 1" @click="nextPage">Next</Button>
        </div>
      </Card>
    </div>

    <!-- Filters -->
    <Card class="md:col-span-1 lg:col-span-1">
      <div class="text-center py-12 text-muted-foreground">
        <p>Filtres</p>
      </div>
    </Card>

    <!-- Traffic alert (Mobile) -->
    <LightTrafficAlert class="md:col-span-1 lg:col-span-1 md:hidden flex" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Separator from '~/components/ui/separator/Separator.vue'
import Button from '~/components/ui/button/Button.vue'

const dataStore = useDataStore()
const searchQuery = ref('')

// --- Pagination state ---
const currentPage = ref(0)
const pageSize = 10

// --- Filtered buses ---
const filteredBuses = computed(() => {
  return dataStore.nextBus.filter(bus =>
    bus.nomarret.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    bus.idligne.toString().includes(searchQuery.value)
  )
})

// --- Pagination logic ---
const totalPages = computed(() => Math.ceil(filteredBuses.value.length / pageSize))

const paginatedBuses = computed(() => {
  const start = currentPage.value * pageSize
  const end = start + pageSize
  return filteredBuses.value.slice(start, end)
})

// --- Pagination actions ---
function nextPage() {
  if (currentPage.value < totalPages.value - 1) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 0) currentPage.value--
}

// Reset page when search query changes
watch(searchQuery, () => {
  currentPage.value = 0
})
</script>
