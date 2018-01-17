import { PLANTYPES } from '../../common/constant'
import tools from '../../common/tools'

let types = PLANTYPES
let preState = {}
types.forEach((cur) => {
  preState[cur] = {
    cur: [],
    bak: [],
    willInsert: [],
    willUpdate: [],
    willDelete: []
  }
})
const state = {...preState}

const mutations = {
  initworkplan (state, payload) {
    for (let k in payload) {
      payload[k] = payload[k] || []
      state[k].cur = payload[k].map(cur => {
        return Object.assign({}, cur)
      })
      state[k].bak = payload[k].map(cur => {
        return Object.assign({}, cur)
      })
      state[k].willInsert = []
      state[k].willUpdate = []
      state[k].willDelete = []
    }
  },
  cancelworkplan (state) {
    for (let k in state) {
      // state[k].cur = [].concat(state[k].bak)
      state[k].cur = state[k].bak.map(cur => {
        return Object.assign({}, cur)
      })
      state[k].willInsert = []
      state[k].willUpdate = []
      state[k].willDelete = []
    }
  },
  insertworkplan (state, payload) {
    let obj = payload.data
    let type = payload.type
    state[type].willInsert.push(Object.assign({}, obj))
    state[type].cur.push(Object.assign({
      '_idx': state[type].willInsert.length - 1,
      '_setName': 'willInsert'
    }, obj))
  },
  deleteworkplan  (state, payload) {
    let idx = payload.idx
    let type = payload.type
    idx.forEach(i => {
      let obj = state[type].cur[i]
      if (obj.hasOwnProperty('_idx')) {
        let _idx = obj._idx
        let _setName = obj._setName
        state[type][_setName].splice(_idx, 1, undefined)
      } else {
        let key = payload.key
        let rowId = obj[key]
        state[type].willDelete.push({
          [key]: rowId
        })
      }
      state[type].cur.splice(i, 1, undefined)
    })
    state[type].cur = state[type].cur.filter(c => {
      return !tools.isEmptyObject(c)
    })
  },
  updateworkplan (state, payload) {
    let idx = payload.idx
    let data = payload.data
    let type = payload.type
    let obj = state[type].cur[idx]
    if (obj.hasOwnProperty('_idx')) {
      let _idx = obj._idx
      let _setName = obj._setName
      Object.assign(obj, data)
      state[type][_setName][_idx] = {...obj}
      delete state[type][_setName][_idx]._idx
      delete state[type][_setName][_idx]._setName
    } else {
      Object.assign(obj, data)
      state[type].willUpdate.push(Object.assign({}, obj))
      Object.assign(obj, {
        '_idx': state[type].willUpdate.length - 1,
        '_setName': 'willUpdate'
      })
    }
  }
}

export default {
  state,
  mutations
}
