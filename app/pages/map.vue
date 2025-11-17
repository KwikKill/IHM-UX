<template>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-3 flex-1">
        <!-- Left column: alerts + favorites -->
        <div class="md:col-span-1 lg:col-span-1 flex flex-col gap-4 flex-1">
            <LightTrafficAlert />
        </div>

        <!-- Map -->
        <div class="md:col-span-2 lg:col-span-3 flex flex-col gap-4 flex-1">
            <Card class="flex-1 p-0">
                <div id="leaflet-map" class="flex-1 h-full w-full rounded-md" />
            </Card>
        </div>

        <!-- Filters -->
        <div class="md:col-span-1 lg:col-span-1 p-4 flex flex-col gap-4">
        <Card class="">
            <CardHeader class="px-0">
                <div class="mb-2 px-6">
                    <CardTitle class="text-2xl font-bold">Filtres</CardTitle>
                </div>
                <Separator class="bg-border" />
            </CardHeader>

            <CardContent class="flex flex-col gap-3 px-2">
                <div class="flex items-start gap-2">
                    <Checkbox id="pmrFilter" v-model="pmrFilter" class="border-white cursor-pointer" />
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
            <Favorites />
        </div>

        <!-- Modal for selected stop -->
        <div v-if="showModal" class="fixed inset-0 z-[100000] flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60" @click="closeModal" />
            <div class="relative w-full max-w-md bg-card text-card-foreground rounded-md shadow-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold">{{ selectedStop?.nom ?? 'Arrêt' }}</h3>
                    <button class="text-muted-foreground" @click="closeModal">✕</button>
                </div>

                <div class="flex flex-col gap-2">
                    <div v-if="stopBuses.length === 0" class="text-sm text-muted-foreground">
                        Aucun bus prévu à cet arrêt dans les prochaines minutes.
                    </div>
                    <div v-else class="flex flex-col gap-2 text-muted-foreground">
                        <div
                            v-for="(item, index) in stopBuses"
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

                            <div class="bg-primary text-white rounded-full px-3 py-1 text-sm font-semibold">
                                4m
                            </div>
                        </div>
                    </div>

                    <div class="pt-3 flex justify-end">
                        <Button @click="closeModal">Fermer</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import type { BusTopology } from '~/models/models'
import type * as LeafletTypes from 'leaflet'
import LightTrafficAlert from '~/components/LightTrafficAlert.vue'
import Favorites from '~/components/Favorites.vue'
import Separator from '~/components/ui/separator/Separator.vue'
import Button from '~/components/ui/button/Button.vue'
import Checkbox from '~/components/ui/checkbox/Checkbox.vue'
import Select from '~/components/ui/select/Select.vue'
import SelectTrigger from '~/components/ui/select/SelectTrigger.vue'
import SelectValue from '~/components/ui/select/SelectValue.vue'
import SelectContent from '~/components/ui/select/SelectContent.vue'
import SelectItem from '~/components/ui/select/SelectItem.vue'
import Card from '~/components/ui/card/Card.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import CardContent from '~/components/ui/card/CardContent.vue'

const dataStore = useDataStore()

// Filters (same as search.vue)
const searchQuery = ref('')
const lineFilter = ref('all')
const pmrFilter = ref(false)
const stopType = ref('all')
const precision = ref('all')

// --- Unique bus lines for filter dropdown ---
const uniqueLines = computed(() => {
    let lines = dataStore.busInfo

    // Remove duplicates based on idligne
    lines = lines.filter((line, index, self) =>
        index === self.findIndex((l) => l.idligne === line.idligne)
    )

    return Array.from(new Set(lines)).sort((a, b) => Number(a.idligne.toString()) - Number(b.idligne.toString()))
})

/*function getLineColor(id: string) {
    const line = dataStore.getBusByLineId(String(id))
    const record = line as unknown as Record<string, unknown>
    const c = record?.['color']
    return typeof c === 'string' ? c : '#7c3aed'
}*/

// Map state
let L: typeof import('leaflet') | null = null
let map: LeafletTypes.Map | null = null
let markersLayer: LeafletTypes.LayerGroup | null = null

const showModal = ref(false)
const selectedStop = ref<BusTopology | null>(null)

const filteredStops = computed(() => {
    // Use busTopology stops and filter according to controls and search
    return dataStore.busTopology.filter(stop => {
        const matchesText = stop.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesPmr = !pmrFilter.value || stop.estaccessiblepmr === 'true'
        const matchesType = stopType.value === 'all' || (stop.mobilier === stopType.value)
        // lineFilter and precision are applied on nextBus entries when selecting markers
        return matchesText && matchesPmr && matchesType
    })
})

const stopBuses = computed(() => {
    const s = selectedStop.value
    console.log('Selected stop:', s)
    if (!s) return []
    const filtered = dataStore.nextBus.filter(
        b => b.idarret === s.id
        || b.idarret === s.stop_id
    )
    // for each filtered entry, only keep one by line + destination (the first one to arrive)
    const uniqueMap = new Map<string, typeof filtered[0]>()
    for (const entry of filtered) {
        const key = `${entry.idligne}-${entry.destination}`
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, entry)
        } else {
            const existing = uniqueMap.get(key)!
            if (
                new Date(entry.arrivee)
                < new Date(existing.arrivee)
            ) {
                uniqueMap.set(key, entry)
            }
        }
    }
    return Array.from(uniqueMap.values())
})

/*function timeToNow(timeStr: string | undefined) {
    if (!timeStr) return '—'
    try {
        const t = new Date(timeStr)
        const diff = Math.max(0, Math.floor((t.getTime() - Date.now()) / 60000))
        return diff <= 0 ? '0m' : `${diff}m`
    } catch {
        return timeStr
    }
}*/

function closeModal() {
    showModal.value = false
    selectedStop.value = null
}

// Initialize Leaflet map on client
onMounted(async () => {
    if (import.meta.server) return
    L = (await import('leaflet')) as typeof import('leaflet')
    await import('leaflet/dist/leaflet.css')

    // fix icon paths for some setups
    try {
        L.Icon.Default.mergeOptions({
            // dynamic imports return ESM modules with default exports for images
            iconRetinaUrl: (await import('leaflet/dist/images/marker-icon-2x.png')).default,
            iconUrl: (await import('leaflet/dist/images/marker-icon.png')).default,
            shadowUrl: (await import('leaflet/dist/images/marker-shadow.png')).default,
        })
    } catch {
        // ignore if icons cannot be patched
    }

    // create map
    map = L.map('leaflet-map', { zoomControl: true }).setView([48.117266, -1.6777926], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    markersLayer = L.layerGroup().addTo(map)
    updateMarkers()

    // update when data or filters change
    watch([() => dataStore.busTopology, filteredStops, lineFilter, pmrFilter, stopType, precision, searchQuery], () => {
        nextTick(() => updateMarkers())
    })
})

function updateMarkers() {
    if (!L || !markersLayer) return
    markersLayer.clearLayers()

    for (const stop of filteredStops.value) {
        const coords = (stop as BusTopology).coordonnees ?? null
        if (!coords || typeof coords.lat !== 'number' || typeof coords.lon !== 'number') continue

        const marker = L.circleMarker([coords.lat, coords.lon], {
            radius: 8,
            fillColor: '#7c3aed',
            color: '#fff',
            weight: 1,
            fillOpacity: 1
        })

        marker.on('click', () => {
            selectedStop.value = stop
            showModal.value = true
        })

        marker.addTo(markersLayer)
    }
}
</script>

<style scoped>
#leaflet-map { height: 520px; }
</style>