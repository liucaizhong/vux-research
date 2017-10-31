const state = {
  file: {}
}

const mutations = {
  uploadFile (state, payload) {
    state.file = payload
  }
}

export default {
  state,
  mutations
}
