import { sortLines } from "~/lib/utils"
import type { NextBus, BusStops, BusTopology, NetworkData, TrafficData, BusInfo } from "~/models/models"

interface DataState {
    loading: boolean
    nextBus: NextBus[]
    busStops: BusStops[]
    busTopology: BusTopology[]
    networkData: NetworkData[]
    trafficData: TrafficData[]
    busInfo: BusInfo[]
}

// -------------------------
// Fake Data Definitions
// -------------------------

export const fakeNextBus: NextBus[] = [
  {
    idligne: "C1",
    nomcourtligne: "C1",
    sens: 1,
    destination: "Chantepie",
    idarret: "ARRET_001",
    nomarret: "République",
    coordonnees: { lon: -1.677792, lat: 48.113475 },
    arriveetheorique: "2025-11-12T21:10:00Z",
    departtheorique: "2025-11-12T21:12:00Z",
    arrivee: "2025-11-12T21:09:45Z",
    depart: "2025-11-12T21:11:50Z",
    idcourse: "COURSE_045",
    idbus: "BUS_1234",
    numerobus: 1204,
    precision: "Bonne",
    visibilite: "Publique",
    heureextraction: "2025-11-12T21:05:00Z"
  },
  {
    idligne: "C1",
    nomcourtligne: "C1",
    sens: 2,
    destination: "Beaulieu",
    idarret: "ARRET_002",
    nomarret: "Beaulieu Chimie",
    coordonnees: { lon: -1.642112, lat: 48.117301 },
    arriveetheorique: "2025-11-12T21:25:00Z",
    departtheorique: "2025-11-12T21:27:00Z",
    arrivee: "2025-11-12T21:24:30Z",
    depart: "2025-11-12T21:26:45Z",
    idcourse: "COURSE_046",
    idbus: "BUS_1235",
    numerobus: 1210,
    precision: "Excellente",
    visibilite: "Publique",
    heureextraction: "2025-11-12T21:10:00Z"
  }
];

export const fakeTrafficData: TrafficData[] = [
  {
    idperturbation: "PERT_001",
    titre: "Travaux à République",
    description: "En raison de travaux sur la voie, les bus C1 et C5 sont déviés.",
    niveau: ["important"],
    debutvalidite: "2025-11-10T06:00:00Z",
    finvalidite: "2025-11-15T22:00:00Z",
    idligne: "C1",
    nomcourtligne: "C1",
    url: "https://www.star.fr/travaux/republique",
    publication: "2025-11-09T12:00:00Z"
  },
  {
    idperturbation: "PERT_002",
    titre: "Manifestation en centre-ville",
    description: "Des retards sont à prévoir sur les lignes C1, 11 et 12.",
    niveau: ["moyen"],
    debutvalidite: "2025-11-12T08:00:00Z",
    finvalidite: "2025-11-12T20:00:00Z",
    idligne: "C1",
    nomcourtligne: "C1",
    url: "https://www.star.fr/info/manifestation",
    publication: "2025-11-11T18:00:00Z"
  }
];

export const fakeNetworkData: NetworkData[] = [
  {
    idtype: "NET_001",
    nomtype: "Plan du réseau principal",
    datedebutvalidite: "2025-09-01T00:00:00Z",
    datefinvalidite: null,
    idligne: null,
    nomcourtligne: null,
    sens: null,
    description: "Carte du réseau STAR 2025",
    file: {
      thumbnail: true,
      filename: "plan_star_2025.png",
      format: "png",
      width: 1920,
      height: 1080,
      url: "https://www.star.fr/files/plan_star_2025.png",
      id: "FILE_001"
    },
    taillefichier: 2048000
  },
  {
    idtype: "NET_002",
    nomtype: "Horaires ligne C1",
    datedebutvalidite: "2025-09-01T00:00:00Z",
    datefinvalidite: null,
    idligne: "C1",
    nomcourtligne: "C1",
    sens: 1,
    description: "Fiche horaire de la ligne C1 (direction Chantepie)",
    file: {
      thumbnail: false,
      filename: "horaires_c1.pdf",
      format: "pdf",
      width: 0,
      height: 0,
      url: "https://www.star.fr/files/horaires_c1.pdf",
      id: "FILE_002"
    },
    taillefichier: 512000
  }
];

export const fakeBusStops: BusStops[] = [
  {
    idparcours: "PARC_001",
    libellecourtparcours: "C1 - Beaulieu > Chantepie",
    idligne: "C1",
    nomcourtligne: "C1",
    idarret: "ARRET_001",
    nomarret: "République",
    ordre: 5,
    estmonteeautorisee: true,
    estdescenteautorisee: true,
    stop_id: "STOP_001"
  },
  {
    idparcours: "PARC_001",
    libellecourtparcours: "C1 - Beaulieu > Chantepie",
    idligne: "C1",
    nomcourtligne: "C1",
    idarret: "ARRET_002",
    nomarret: "Chantepie Mairie",
    ordre: 12,
    estmonteeautorisee: true,
    estdescenteautorisee: true,
    stop_id: "STOP_002"
  }
];

export const fakeBusTopology: BusTopology[] = [
  {
    id: "STOP_001",
    datedebutversion: "2025-01-01T00:00:00Z",
    datefinversion: null,
    estversionactive: true,
    code: "REPU",
    nom: "République",
    codeinseecommune: "35238",
    nomcommune: "Rennes",
    coordonnees: { lon: -1.677792, lat: 48.113475 },
    estaccessiblepmr: true,
    mobilier: "Abribus vitré",
    visibilite: "Publique",
    stop_id: "STOP_001"
  },
  {
    id: "STOP_002",
    datedebutversion: "2025-01-01T00:00:00Z",
    datefinversion: null,
    estversionactive: true,
    code: "CHANTEPIE_M",
    nom: "Chantepie Mairie",
    codeinseecommune: "35058",
    nomcommune: "Chantepie",
    coordonnees: { lon: -1.631234, lat: 48.080112 },
    estaccessiblepmr: true,
    mobilier: "Abribus simple",
    visibilite: "Publique",
    stop_id: "STOP_002"
  }
];

export const fakeBusInfo: BusInfo[] = [
  {
    idligne: "C1",
    nomcourtligne: "C1",
    date: "2025-09-01T00:00:00Z",
    resolution: "1920x1080",
    image: {
      thumbnail: true,
      filename: "bus_c1.jpg",
      format: "jpg",
      width: 1920,
      height: 1080,
      id: "IMG_001",
      color_summary: ["#005BBB", "#FFD500"],
      url: "https://www.star.fr/images/bus_c1.jpg"
    },
    taille: 300000
  },
  {
    idligne: "C5",
    nomcourtligne: "C5",
    date: "2025-09-01T00:00:00Z",
    resolution: "1920x1080",
    image: {
      thumbnail: false,
      filename: "bus_c5.jpg",
      format: "jpg",
      width: 1920,
      height: 1080,
      id: "IMG_002",
      color_summary: ["#FF6600", "#000000"],
      url: "https://www.star.fr/images/bus_c5.jpg"
    },
    taille: 280000
  }
];
// -------------------------

export const useDataStore = defineStore('dataStore', {
    state: (): DataState => ({
        loading: false,
        nextBus: [],
        busStops: [],
        busTopology: [],
        networkData: [],
        trafficData: [],
        busInfo: [],
    }),
    actions: {
        async fetchData<T = NextBus | BusStops | BusTopology | NetworkData | TrafficData>(initialUrl: string, full:boolean = false): Promise<T[]> {
            const limit = 100
            let offset = 0
            let total = 100
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

        getStopById(stopId: string): BusStops | undefined {
            console.log(this.busStops)
            return this.busStops.find(stop => stop.stop_id === stopId)
        }
    }
})
