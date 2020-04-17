export default {
  namespaced: false,
  state: {
    baseUrl: ''
  },
  getters: {
    getBaseUrl: state => {
      return state.baseUrl
    }
  },
  mutations: {
    setBaseUrl (state, url) {
      state.baseUrl = url
    }
  },
  actions: {
    initialBaseUrl ({commit}) {
      console.log('location.search', window.location)
      commit('setBaseUrl', window.location.origin)
    }
  }
}
