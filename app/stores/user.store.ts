export const useUserStore = defineStore('userStore', {
  state: () => ({
    logedIn: false,
    username: '',
    stopFavorites: ["6-2243"] as string[],
    lineFavorites: ["0006"] as string[],
  }),
  actions: {
    setLogedIn(status: boolean) {
        this.logedIn = status
    },
    setUsername(name: string) {
        this.username = name
    },
    addStopFavorite(stopId: string) {
        if (!this.stopFavorites.includes(stopId)) {
            this.stopFavorites.push(stopId)
        }
    },
    removeStopFavorite(stopId: string) {
        this.stopFavorites = this.stopFavorites.filter(id => id !== stopId)
    },
    addLineFavorite(lineId: string) {
        if (!this.lineFavorites.includes(lineId)) {
            this.lineFavorites.push(lineId)
        }
    },
    removeLineFavorite(lineId: string) {
        this.lineFavorites = this.lineFavorites.filter(id => id !== lineId)
    },
  },
  persist: true,
})
