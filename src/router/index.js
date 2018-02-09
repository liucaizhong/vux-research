import Vue from 'vue'
import Router from 'vue-router'
// import { SALESTRATEGYTYPES } from '@/common/constant'

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
    //       show: false
    //       // title: 'workplan_main_title',
    //       // preventGoBack: false
    //     }
    //   }
    // },
    // {
    //   path: '/workplan/images',
    //   component: (r) => {
    //     require(['@/components/workplan-images'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //       // title: 'workplan_detail_main_title',
    //       // preventGoBack: false
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
    //       show: false
    //       // title: 'workplan_detail_main_title',
    //       // preventGoBack: false
    //     }
    //   }
    // }
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/salestrategy'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: true,
    //       title: 'salestrategy_main_title',
    //       preventGoBack: true,
    //       onBack: function (vm) {
    //         let ifSave = SALESTRATEGYTYPES.every(t => {
    //           let obj = vm.$store.state.salestrategy[t]
    //           if (obj.willInsert.length || obj.willUpdate.length || obj.willDelete.length) {
    //             return false
    //           }
    //           return true
    //         })
    //
    //         if (ifSave) {
    //           vm.$router.go(-1)
    //         } else {
    //           vm.isUnSave = true
    //         }
    //       }
    //     }
    //   }
    // }
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/activity'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //       // title: 'activity_main_title',
    //       // preventGoBack: false
    //     }
    //   }
    // },
    // {
    //   path: '/activity/image',
    //   name: 'activityImage',
    //   component: (r) => {
    //     require(['@/components/activity-image'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //       // title: 'activity_main_title',
    //       // preventGoBack: false
    //     }
    //   }
    // }
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/notification'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // },
    // {
    //   path: '/releasenote',
    //   component: (r) => {
    //     require(['@/components/release-note'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // },
    // {
    //   path: '/releaserule',
    //   component: (r) => {
    //     require(['@/components/release-rule'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // },
    // {
    //   path: '/rule/:id',
    //   component: (r) => {
    //     require(['@/components/rule-info'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // },
    // {
    //   path: '/note/:id',
    //   component: (r) => {
    //     require(['@/components/note-info'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // }
    // {
    //   path: '/pdf',
    //   component: (r) => {
    //     require(['@/components/pdf-viewer'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //     }
    //   }
    // }
    {
      path: '/',
      component: (r) => {
        require(['@/components/report'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
          // title: 'report_main_title',
          // preventGoBack: false
        }
      }
    },
    {
      // path: '/report/:userId',
      path: '/:userId',
      component: (r) => {
        require(['@/components/report-list'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
          // title: 'report_list_main_title',
          // preventGoBack: false
        }
      }
    },
    {
      // path: '/report/:userId/upload',
      path: '/:userId/upload',
      component: (r) => {
        require(['@/components/upload-report'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
          // title: 'upload_main_title',
          // preventGoBack: false
        }
      }
    },
    {
      // path: '/report/:userId/:reportId',
      path: '/:userId/:reportId',
      component: (r) => {
        require(['@/components/report-info'], r)
      },
      meta: {
        xHeaderConfig: {
          show: false
          // title: 'upload_main_title',
          // preventGoBack: false
        }
      }
    }
    // {
    //   path: '/',
    //   component: (r) => {
    //     require(['@/components/note-page'], r)
    //   },
    //   meta: {
    //     xHeaderConfig: {
    //       show: false
    //       // title: 'note-page_title',
    //       // preventGoBack: false
    //     }
    //   }
    // }
  ]
})
