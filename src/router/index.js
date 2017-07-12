import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // mode: 'hash',
  routes: [
    {
      path: '/',
      // build for production
      redirect: '/salestrategy',
      component: (r) => {
        require(['@/components/logon-qrcode'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
        }
      }
    },
    {
      path: '/index',
      // build for production
      // redirect: '/workplan',
      component: (r) => {
        require(['@/components/index'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
        }
      }
    },
    {
      path: '/workplan',
      component: (r) => {
        require(['@/components/workplan'], r)
      },
      meta: {
        xHeaderConfig: {
          show: true,
          title: 'workplan_main_title',
          preventGoBack: process.env.NODE_ENV === 'production',
          manualBack: 'http://slandasset.appchizi.com/index.php'
        }
      }
    },
    {
      path: '/workplan/:userId',
      component: (r) => {
        require(['@/components/workplan-detail'], r)
      },
      meta: {
        xHeaderConfig: {
          show: true,
          title: 'workplan_detail_main_title',
          preventGoBack: false
        }
      }
    },
    {
      path: '/salestrategy',
      component: (r) => {
        require(['@/components/salestrategy'], r)
      },
      meta: {
        xHeaderConfig: {
          show: true,
          title: 'salestrategy_main_title',
          preventGoBack: false
        }
      }
    },
    {
      path: '/comlog',
      component: (r) => {
        require(['@/components/confirm-logon'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
        }
      }
    }
  ]
})
