import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import loginfo from './modules/loginfo'
import workplan from './modules/workplan'
import salestrategy from './modules/salestrategy'
import activity from './modules/activity'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'production',
  modules: {
    loading,
    loginfo,
    workplan,
    salestrategy,
    activity
  }
})
