export const useUserStore = defineStore('userStore', {
  state: () => ({
    logedIn: false,
    username: '',
  }),
  actions: {
    setLogedIn(status: boolean) {
        this.logedIn = status
    },
    setUsername(name: string) {
        this.username = name
    },
  },
  persist: true,
})
