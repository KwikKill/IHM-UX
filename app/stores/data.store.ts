import { sortLines } from "~/lib/utils"
import type { NextBus, BusStops, BusTopology, NetworkData, TrafficData, BusInfo, ItineraryRaw, Itinerary, ItinerarySegment } from "~/models/models"
// Fake data modules are imported dynamically inside each fetchX when `fake` is true

interface DataState {
  loading: boolean
  nextBus: NextBus[]
  busStops: BusStops[]
  busTopology: BusTopology[]
  networkData: NetworkData[]
  trafficData: TrafficData[]
  busInfo: BusInfo[]
  itineraries: Itinerary[]
  tosUpdated: string
}

export const useDataStore = defineStore('dataStore', {
  state: (): DataState => ({
    loading: false,
    nextBus: [],
    busStops: [],
    busTopology: [],
    networkData: [],
    trafficData: [],
    busInfo: [],
      itineraries: [],
    tosUpdated: "24 octobre 2025"
  }),
  actions: {
    
    // Fetch itineraries (lines geometry + color) and process into segments usable by Leaflet
    async fetchItineraries(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_itineraries.json')
          if (!res.ok) throw new Error(`Failed to load fake itineraries: ${res.status}`)
          this.itineraries = (await res.json()) as Itinerary[]
        } catch (err) {
          console.error('fetchItineraries (fake) error:', err)
          this.itineraries = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/star_itineraires_actifs/records'
      try {
        const raw = await this.fetchData<ItineraryRaw>(initialUrl, true)

        const processed: Itinerary[] = raw.map((r: ItineraryRaw) => {
          const coords = (r.geo_shape && r.geo_shape.geometry && (r.geo_shape.geometry.coordinates as unknown)) as unknown
          const segments: ItinerarySegment[] = []

          if (Array.isArray(coords)) {
            // coords is expected to be MultiLineString: array of LineStrings
            for (const line of coords as unknown as number[][][]) {
              if (!Array.isArray(line)) continue
              const seg: ItinerarySegment = []
              for (const pt of line) {
                if (!Array.isArray(pt) || pt.length < 2) continue
                const lon = Number(pt[0])
                const lat = Number(pt[1])
                if (Number.isFinite(lat) && Number.isFinite(lon)) {
                  seg.push({ lat, lon })
                }
              }
              if (seg.length > 0) segments.push(seg)
            }
          }

          return {
            id: r.id ?? r.gml_id ?? '',
            code: (r.iti_code as string) ?? undefined,
            name: (r.iti_nom as string) ?? undefined,
            li_num: (r.li_num as string) ?? (r.li_code as string) ?? undefined,
            color: (r.li_couleur_hex as string) ?? '#000000',
            segments
          }
        })

        this.itineraries = processed
      } catch (error) {
        console.error('fetchItineraries error:', error)
        this.itineraries = []
      }
    },

    async fetchData<T = NextBus | BusStops | BusTopology | NetworkData | TrafficData>(initialUrl: string, full: boolean = false): Promise<T[]> {
      const limit = 100
      let offset = 0
      let total = 6000
      const data: T[] = []

      try {
        while (offset === 0 || offset < total) {
          const url = `${initialUrl}?limit=${limit}&offset=${offset}`
          const res = await fetch(url)

          console.log(`Fetching data from: ${url}`)

          if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
          }

          const json = (await res.json()) as { total_count?: number; results?: T[] }

          const results: T[] = (json.results ?? []) as T[]
          data.push(...results)

          if (full && typeof json.total_count === "number") {
            total = json.total_count
          }

          if (results.length === 0) break
          offset += limit
        }

        return data
      } catch (error) {
        console.error("fetchData error:", error)
        throw error
      }
    },

    async fetchNextBuses(fake: boolean = false): Promise<void> {
      if (fake) {
        const mod = await import("./fake_data/fake_data_next_bus")
        this.nextBus = (mod.fakeNextBus ?? []) as NextBus[]
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/prochains-passages-des-lignes-de-bus-du-reseau-star-en-temps-reel/records'
      this.nextBus = await this.fetchData(initialUrl)
    },

    async fetchBusStops(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_bus_stop.json')
          if (!res.ok) throw new Error(`Failed to load fake bus stops: ${res.status}`)
          this.busStops = (await res.json()) as BusStops[]
        } catch (err) {
          console.error('fetchBusStops (fake) error:', err)
          this.busStops = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-bus-topologie-dessertes-td/records'
      this.busStops = await this.fetchData(initialUrl)
    },

    async fetchBusTopology(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_bus_topology.json')
          if (!res.ok) throw new Error(`Failed to load fake bus topology: ${res.status}`)
          this.busTopology = (await res.json()) as BusTopology[]
        } catch (err) {
          console.error('fetchBusTopology (fake) error:', err)
          this.busTopology = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/topologie-des-points-darret-de-bus-du-reseau-star/records'
      this.busTopology = await this.fetchData(initialUrl)
    },

    async fetchNetworkData(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_network.json')
          if (!res.ok) throw new Error(`Failed to load fake network data: ${res.status}`)
          this.networkData = (await res.json()) as NetworkData[]
        } catch (err) {
          console.error('fetchNetworkData (fake) error:', err)
          this.networkData = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/horaires-et-plans-du-reseau-star-au-format-pdf/records'
      this.networkData = await this.fetchData(initialUrl)
    },

    async fetchTrafficData(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_traffic.json')
          if (!res.ok) throw new Error(`Failed to load fake traffic data: ${res.status}`)
          this.trafficData = ((await res.json()) as TrafficData[]).sort(sortLines)
        } catch (err) {
          console.error('fetchTrafficData (fake) error:', err)
          this.trafficData = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/alertes-trafic-en-temps-reel-sur-les-lignes-du-reseau-star/records'
      this.trafficData = await this.fetchData(initialUrl)
      this.trafficData = this.trafficData.sort(sortLines);
      console.log("Fetched traffic data:", this.trafficData)
    },

    async fetchBusInfo(fake: boolean = false): Promise<void> {
      if (fake) {
        try {
          const res = await fetch('/fake_data/fake_data_bus_info.json')
          if (!res.ok) throw new Error(`Failed to load fake bus info: ${res.status}`)
          this.busInfo = (await res.json()) as BusInfo[]
        } catch (err) {
          console.error('fetchBusInfo (fake) error:', err)
          this.busInfo = []
        }
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/pictogrammes-des-lignes-de-bus-du-reseau-star/records'
      this.busInfo = await this.fetchData(initialUrl, true)
    },

    setLoading(status: boolean) {
      this.loading = status
    },

    getBusByLineId(lineId: string, size: number | undefined = undefined): BusInfo | undefined {
      if (size) {
        return this.busInfo.find(bus => bus.idligne === lineId && bus.taille === size)
      } else {
        // search for greater size if size is 0
        const bus = this.busInfo
          .filter(bus => bus.idligne === lineId)
          .sort((a, b) => b.taille - a.taille)[0]
        if (bus) {
          return bus
        }
      }

    },

    getBusStopById(stopId: string): BusTopology | undefined {
      return this.busTopology.find(stop => stop.id === stopId)
    },

    getBusStopsByIdMap(): Record<string, BusTopology> {
      const map: Record<string, BusTopology> = {}
      this.busTopology.forEach(stop => {
        map[stop.id] = stop
      })
      return map
    },

    getStopById(stopId: string): BusTopology | undefined {
      return this.busTopology.find(stop => stop.stop_id === stopId)
    },

    getAllDataAsJSON(): string {
      const data = {
        nextBus: this.nextBus,
        busStops: this.busStops,
        busTopology: this.busTopology,
        networkData: this.networkData,
        trafficData: this.trafficData,
        busInfo: this.busInfo,
        itineraries: this.itineraries,
        tosUpdated: this.tosUpdated
      }
      return JSON.stringify(data, null, 2)
    }
  }
})
