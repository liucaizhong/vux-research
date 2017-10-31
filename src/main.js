// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import App from './App'
// load vuex i18n module
import vuexI18n from 'vuex-i18n'
import { AjaxPlugin } from 'vux'

FastClick.attach(document.body)
Vue.use(vuexI18n.plugin, store)
Vue.use(AjaxPlugin)
// require('es6-promise').polyfill()

Vue.config.productionTip = false

// get the language
// let lang = navigator.language || navigator.browserLanguage
let lang = 'zh-CN'
lang = lang.toLowerCase()
console.log(lang)
// add translations directly to the application
// default language translation is Chinese
Vue.i18n.add(lang, require(`./locales/${lang}`).default)
// set the start locale to use
Vue.i18n.set(lang)

// set loading status on router
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {
    isLoading: true
  })
  next()
})

// router.afterEach(function (to) {
//   store.commit('updateLoadingStatus', {
//     isLoading: false
//   })
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
