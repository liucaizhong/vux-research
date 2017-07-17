import Vue from 'vue'
import Router from 'vue-router'
import { SALESTRATEGYTYPES } from '@/common/constant'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // mode: 'hash',
  routes: [
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/logon-qrcode'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // }
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/index'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // },
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/workplan'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: true,
    //       title: 'workplan_main_title',
    //       preventGoBack: false
    //       // manualBack: 'http://slandasset.appchizi.com/index.php'
    //     }
    //   }
    // },
    // {
    //   path: '/workplan/:userId',
    //   component: (r) => {
    //     require(['@/components/workplan-detail'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: true,
    //       title: 'workplan_detail_main_title',
    //       preventGoBack: false
    //     }
    //   }
    // }
    {
      path: '/',
      component: (r) => {
        require(['@/components/salestrategy'], r)
      },
      meta: {
        xHeaderConfig: {
          show: true,
          title: 'salestrategy_main_title',
          preventGoBack: true,
          onBack: function (vm) {
            let ifSave = SALESTRATEGYTYPES.every(t => {
              let obj = vm.$store.state.salestrategy[t]
              if (obj.willInsert.length || obj.willUpdate.length || obj.willDelete.length) {
                return false
              }
              return true
            })

            if (ifSave) {
              vm.$router.go(-1)
            } else {
              vm.isUnSave = true
            }
          }
        }
      }
    }
    // {
    //   path: '/activity',
    //   component: (r) => {
    //     require(['@/components/activity'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: true,
    //       title: 'activity_main_title',
    //       preventGoBack: false
    //     }
    //   }
    // }
  ]
})
