import type { NextBus, BusStops, BusTopology, NetworkData, TrafficData } from "~/models/models"

interface DataState {
    loading: boolean
    nextBus: NextBus[]
    busStops: BusStops[]
    busTopology: BusTopology[]
    networkData: NetworkData[]
    trafficData: TrafficData[]
}

export const useDataStore = defineStore('dataStore', {
    state: (): DataState => ({
        loading: false,
        nextBus: [],
        busStops: [],
        busTopology: [],
        networkData: [],
        trafficData: []
    }),
    actions: {
        async fetchData<T = NextBus | BusStops | BusTopology | NetworkData | TrafficData>(initialUrl: string): Promise<T[]> {
            const limit = 100
            let offset = 0
            const total = 500
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

                    /*if (typeof json.total_count === "number") {
                        total = json.total_count
                    }*/

                    if (results.length === 0) break
                    offset += limit
                }

                return data
            } catch (error) {
                console.error("fetchData error:", error)
                throw error
            }
        },

        async fetchNextBuses(): Promise<void> {
            const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/prochains-passages-des-lignes-de-bus-du-reseau-star-en-temps-reel/records'
            this.nextBus = await this.fetchData(initialUrl)
        },

        async fetchBusStops(): Promise<void> {
            const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-bus-topologie-dessertes-td/records'
            this.busStops = await this.fetchData(initialUrl)
        },

        async fetchBusTopology(): Promise<void> {
            const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/topologie-des-points-darret-de-bus-du-reseau-star/records'
            this.busTopology = await this.fetchData(initialUrl)
        },

        async fetchNetworkData(): Promise<void> {
            const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/horaires-et-plans-du-reseau-star-au-format-pdf/records'
            this.networkData = await this.fetchData(initialUrl)
        },

        async fetchTrafficData(): Promise<void> {
            const initialUrl = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/alertes-trafic-en-temps-reel-sur-les-lignes-du-reseau-star/records'
            this.busStops = await this.fetchData(initialUrl)
        },

        setLoading(status: boolean) {
            this.loading = status
        }
    }
})
