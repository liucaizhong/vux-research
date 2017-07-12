const state = {
  loginfo: {}
}

const mutations = {
  initUser (state, payload) {
    state.loginfo = {...payload}
  }
}

export default {
  state,
  mutations
}
