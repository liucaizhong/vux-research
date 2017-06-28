import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: process.env.NODE_ENV === 'development' ? 'history' : 'hash',
  routes: [
    {
      path: '/',
      component: (r) => {
        require(['@/components/index'], r)
      }
    },
    {
      path: '/workplan',
      component: (r) => {
        require(['@/components/workplan'], r)
      }
    }
  ]
})
