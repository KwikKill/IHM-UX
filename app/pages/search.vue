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
                    >
                </div>
            </Card>

            <!-- Listing -->
            <Card class="flex-1">
                <div class="text-center p-4 py-2 text-muted-foreground flex flex-col gap-2 text-2xl">
                    <div
                        v-for="(item, index) in paginatedBuses"
                        :key="index"
                        class="py-2 flex items-center bg-secondary rounded-md px-4 gap-3 justify-between"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex items-center justify-center h-8 w-8 rounded-md text-sm font-bold text-white shadow"
                                :style="{ backgroundColor: '#7c3aed' }"
                            >
                                {{ dataStore.getBusByLineId(item.idligne)?.nomcourtligne }}
                            </div>

                            <div class="flex items-center">
                                <img
                                    :src="dataStore.getBusByLineId(item.idligne)?.image.url"
                                    :alt="`Logo de la ligne ${dataStore.getBusByLineId(item.idligne)?.nomcourtligne}`"
                                    class="inline h-7 w-7 mr-2 object-contain"
                                >
                                <p class="text-sm">
                                    {{ item.nomarret }} -> {{ item.destination }} (200m)
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="bg-primary text-white rounded-full px-3 py-1 text-sm font-semibold">
                                4m
                            </div>
                            <Button class="ml-2" @click="userStore.toggleStopFavorite(item.idarret)">
                                <span v-if="userStore.stopFavorites && userStore.stopFavorites.includes(item.idarret)">
                                    ★
                                </span>
                                <span v-else>
                                    ☆
                                </span>
                            </Button>
                        </div>
                    </div>
                            

                    <!-- Empty state -->
                    <div v-if="filteredBuses.length === 0" class="py-12">
                        <p>Aucun bus trouvé</p>
                    </div>
                </div>

                <!-- Pagination controls -->
                <div v-if="totalPages > 1" class="flex flex-wrap justify-center items-center gap-2 pt-4">
                    <Button
                        :disabled="currentPage === 0"
                        class="cursor-pointer"
                        @click="prevPage"
                    >
                        Previous
                    </Button>
                    <span class="text-sm">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
                    <Button
                        :disabled="currentPage >= totalPages - 1"
                        class="cursor-pointer"
                        @click="nextPage"
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </div>

        <!-- Filters -->
        <Card class="md:col-span-1 lg:col-span-1 p-4 flex flex-col gap-4">
            <CardHeader class="px-0">
                <div class="mb-2 px-6">
                    <CardTitle class="text-2xl font-bold">
                        Filtres
                    </CardTitle>
                </div>
                <Separator class="bg-border" />
            </CardHeader>

            <CardContent class="flex flex-col gap-3 px-2">
                <div class="flex items-start gap-2">
                    <Checkbox id="pmrFilter" v-model="pmrFilter" />
                    <div class="text-sm">
                        <label for="pmrFilter" class="block font-medium">Accessible mobilité réduite</label>
                        <span class="text-xs text-muted-foreground">Afficher uniquement les arrêts accessibles</span>
                    </div>
                </div>

                <div>
                    <label class="block text-xs mb-1">Type d'arrêt :</label>
                    <Select v-model="stopType">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="Abri simple">Abri simple</SelectItem>
                            <SelectItem value="Abri double">Abri double</SelectItem>
                            <SelectItem value="Abri auvent">Abri auvent</SelectItem>
                            <SelectItem value="Poteau">Poteau</SelectItem>
                            <SelectItem value="Non matérialisé">Non matérialisé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label class="block text-xs mb-1">Précision de l'estimation:</label>
                    <Select v-model="precision">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Toutes les précisions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="Temps réel">Temps réel</SelectItem>
                            <SelectItem value="Applicable">Applicable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label class="block text-xs mb-1">Lignes de bus ({{ uniqueLines.length }}) :</label>
                    <Select v-model="lineFilter">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Toutes les lignes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les lignes</SelectItem>
                            <SelectItem
                                v-for="line in uniqueLines"
                                :key="line.idligne"
                                :value="line.idligne"
                            >
                                <div class="flex items-center">
                                            <img
                                                :src="line.image?.url"
                                                :alt="`Logo de la ligne ${line.nomcourtligne}`"
                                                class="inline h-5 w-5 mr-2 object-contain"
                                            >
                                    Ligne {{ line.nomcourtligne }}
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <!-- Traffic alert (Mobile) -->
        <LightTrafficAlert class="md:col-span-1 lg:col-span-1 md:hidden flex" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Separator from '~/components/ui/separator/Separator.vue'
import Button from '~/components/ui/button/Button.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import Select from '~/components/ui/select/Select.vue'
import SelectTrigger from '~/components/ui/select/SelectTrigger.vue'
import SelectValue from '~/components/ui/select/SelectValue.vue'
import SelectContent from '~/components/ui/select/SelectContent.vue'
import SelectItem from '~/components/ui/select/SelectItem.vue'

const userStore = useUserStore()

const dataStore = useDataStore()
const searchQuery = ref('')
const lineFilter = ref('all')
const pmrFilter = ref(false)
const stopType = ref('all')
const precision = ref('all')

// --- Pagination state ---
const currentPage = ref(0)
const pageSize = 10

// --- Unique bus lines for filter dropdown ---
const uniqueLines = computed(() => {
    let lines = dataStore.busInfo

    // Remove duplicates based on idligne
    lines = lines.filter((line, index, self) =>
        index === self.findIndex((l) => l.idligne === line.idligne)
    )

    return Array.from(new Set(lines)).sort((a, b) => Number(a.idligne.toString()) - Number(b.idligne.toString()))
})

// --- Filtered buses ---
const filteredBuses = computed(() => {
    return dataStore.nextBus.filter(bus => {
        // basic text / line filter
        const matchesText = bus.nomarret.toLowerCase().includes(searchQuery.value.toLowerCase()) || bus.idligne.toString().includes(searchQuery.value)
        const matchesLine = lineFilter.value === 'all' || bus.idligne.toString() === lineFilter.value

        // optional PMR filter: if pmrFilter is true, require bus.pmr === true (guard when field missing)
        const busRecord = bus
        const matchesPmr = !pmrFilter.value || dataStore.getBusStopById(busRecord.idarret)?.estaccessiblepmr === "true"

        // optional stop type filter (guard when field missing)
        const matchesType = stopType.value === 'all' || (dataStore.getBusStopById(busRecord.idarret)?.mobilier === stopType.value)

        // optional precision filter: if precision is not 'all', require bus.precision === precision.value (guard when field missing)
        const busPrecision = busRecord.precision
        const matchesPrecision = precision.value === 'all' || (typeof busPrecision === 'string' && busPrecision === precision.value)

        return matchesText && matchesLine && matchesPmr && matchesType && matchesPrecision
    })
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

// Reset page when search query or filter changes
watch([searchQuery, lineFilter, pmrFilter, stopType, precision], () => {
    currentPage.value = 0
})
</script>
