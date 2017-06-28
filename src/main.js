// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import App from './App'
import tools from './common/tools'
// load vuex i18n module
import vuexI18n from 'vuex-i18n'

FastClick.attach(document.body)
Vue.use(vuexI18n.plugin, store)

Vue.config.productionTip = false

// register global functions
Vue.prototype.$tools = tools.default

// get the language
let lang = navigator.language || navigator.browserLanguage
console.log(lang)
// add translations directly to the application
// default language translation is Chinese
Vue.i18n.add(lang, require(`./locales/${lang}`).default || require('./locales/zh-CN').default)
// set the start locale to use
Vue.i18n.set(lang)

// set loading status on router
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {
    isLoading: true
  })
  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {
    isLoading: false
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
