import { sortLines } from "~/lib/utils"
import type { NextBus, BusStops, BusTopology, NetworkData, TrafficData, BusInfo } from "~/models/models"
import { fakeNextBus } from "./fake_data/fake_data_next_bus"
import { fakeBusStops } from "./fake_data/fake_data_bus_stop"
import { fakeBusTopology } from "./fake_data/fake_data_bus_topology"
import { fakeNetworkData } from "./fake_data/fake_data_network"
import { fakeTrafficData } from "./fake_data/fake_data_traffic"
import { fakeBusInfo } from "./fake_data/fake_data_bus_info"

interface DataState {
  loading: boolean
  nextBus: NextBus[]
  busStops: BusStops[]
  busTopology: BusTopology[]
  networkData: NetworkData[]
  trafficData: TrafficData[]
  busInfo: BusInfo[]
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
    tosUpdated: "24 octobre 2025"
  }),
  actions: {
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
        this.nextBus = fakeNextBus
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/prochains-passages-des-lignes-de-bus-du-reseau-star-en-temps-reel/records'
      this.nextBus = await this.fetchData(initialUrl)
    },

    async fetchBusStops(fake: boolean = false): Promise<void> {
      if (fake) {
        this.busStops = fakeBusStops
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-bus-topologie-dessertes-td/records'
      this.busStops = await this.fetchData(initialUrl)
    },

    async fetchBusTopology(fake: boolean = false): Promise<void> {
      if (fake) {
        this.busTopology = fakeBusTopology
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/topologie-des-points-darret-de-bus-du-reseau-star/records'
      this.busTopology = await this.fetchData(initialUrl)
    },

    async fetchNetworkData(fake: boolean = false): Promise<void> {
      if (fake) {
        this.networkData = fakeNetworkData
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/horaires-et-plans-du-reseau-star-au-format-pdf/records'
      this.networkData = await this.fetchData(initialUrl)
    },

    async fetchTrafficData(fake: boolean = false): Promise<void> {
      if (fake) {
        this.trafficData = fakeTrafficData.sort(sortLines)
        return
      }
      const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/alertes-trafic-en-temps-reel-sur-les-lignes-du-reseau-star/records'
      this.trafficData = await this.fetchData(initialUrl)
      this.trafficData = this.trafficData.sort(sortLines);
      console.log("Fetched traffic data:", this.trafficData)
    },

    async fetchBusInfo(fake: boolean = false): Promise<void> {
      if (fake) {
        this.busInfo = fakeBusInfo
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
        tosUpdated: this.tosUpdated
      }
      return JSON.stringify(data, null, 2)
    }
  }
})
