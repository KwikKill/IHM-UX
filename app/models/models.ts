export type NextBus = {
    idligne: string,
    nomcourtligne: string,
    sens: number,
    destination: string,
    idarret: string,
    nomarret: string,
    coordonnees: {
        lon: number,
        lat: number
    },
    arriveetheorique: string,
    departtheorique: string,
    arrivee: string,
    depart: string,
    idcourse: string,
    idbus: string | null,
    numerobus: number | null,
    precision: string,
    visibilite: string,
    heureextraction: string
}

export type TrafficData = {
    idperturbation: string,
    titre: string,
    description: string,
    niveau: string[],
    debutvalidite: string,
    finvalidite: string,
    idligne: string,
    nomcourtligne: string,
    url: string
    publication: string
}

export type NetworkData = {
    idtype: string,
    nomtype: string,
    datedebutvalidite: string,
    datefinvalidite: string | null,
    idligne: string | null,
    nomcourtligne: string | null,
    sens: number | null,
    description: string | null,
    file: {
        thumbnail: boolean,
        filename: string,
        format: string,
        width: number,
        height: number,
        url: string,
        id: string
    },
    taillefichier: number
}

export type BusStops = {
    idparcours: string,
    libellecourtparcours: string | null,
    idligne: string,
    nomcourtligne: string,
    idarret: string,
    nomarret: string,
    ordre: number,
    estmonteeautorisee: string,
    estdescenteautorisee: string,
    stop_id: string
}

export type BusTopology = {
    id: string,
    datedebutversion: string,
    datefinversion: string | null,
    estversionactive: string,
    code: string,
    nom: string,
    codeinseecommune: string,
    nomcommune: string,
    coordonnees: {
        lon: number,
        lat: number
    },
    estaccessiblepmr: string,
    mobilier: string | null,
    visibilite: string,
    stop_id: string
}

export type BusInfo = {
    idligne: string,
    nomcourtligne: string,
    date: string,
    resolution: string,
    image: {
        thumbnail: boolean,
        filename: string,
        format: string,
        width: number,
        height: number,
        id: string,
        color_summary?: string[],
        url: string
    },
    taille: number
}

// Geometry and itinerary types
export type GeoPoint = { lon: number; lat: number }

export type MultiLineString = number[][][] // [ [ [lon, lat], ... ], ... ]

export type GeoGeometry = {
    type: 'MultiLineString' | 'LineString' | 'Point' | string
    coordinates: MultiLineString | number[] | any
}

export type GeoShape = {
    type?: string
    geometry?: GeoGeometry
    properties?: Record<string, unknown>
}

export type ItineraryRaw = {
    id?: number | string
    gml_id?: string
    iti_code?: string
    iti_nom?: string
    li_num?: string
    li_code?: string
    li_couleur_hex?: string
    geo_point_2d?: GeoPoint
    geo_shape?: GeoShape
    [key: string]: unknown
}

export type ItinerarySegmentPoint = { lat: number; lon: number }
export type ItinerarySegment = ItinerarySegmentPoint[]

export type Itinerary = {
    id: string | number
    code?: string
    name?: string
    li_num?: string
    li_code?: string
    color?: string
    segments: ItinerarySegment[]
}