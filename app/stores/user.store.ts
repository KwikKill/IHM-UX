export const useUserStore = defineStore('userStore', {
  state: () => ({
    loggedIn: false,
    username: '',
    stopFavorites: ["6-1047"] as string[],
    lineFavorites: ["0006"] as string[],
  }),
  actions: {
    setLogedIn(status: boolean) {
        this.loggedIn = status
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
    toggleStopFavorite(stopId: string) {
      if (this.stopFavorites.includes(stopId)) {
        this.removeStopFavorite(stopId)
      } else {
        this.addStopFavorite(stopId)
      }
    }
  },
  persist: true,
})
