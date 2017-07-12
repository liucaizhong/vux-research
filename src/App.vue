<template>
  <div id="app">
    <div v-transfer-dom>
      <loading v-model="isLoading" :text="$t('router_loading_text')"></loading>
    </div>
    <!-- <view-box
      ref="viewBox"
      :body-padding-top="xHeaderConfig.show ? '46px' : '0px'"
    > -->
      <x-header
        v-if="xHeaderConfig.show"
        slot="header"
        class="header"
        :left-options="{ backText: $t(xHeaderConfig.backText), preventGoBack: xHeaderConfig.preventGoBack}"
        :title="$t(xHeaderConfig.title)"
        :transition="'title-' + transitionName"
        @on-click-back="onBack(xHeaderConfig.manualBack)"
      >
      </x-header>
      <transition :name="transitionName">
        <router-view
          class="main-view"
          :style="{ 'top': xHeaderConfig.show ? '46px' : '0px' }"
        >
        </router-view>
      </transition>
    <!-- </view-box> -->
  </div>
</template>

<script>
import { Loading, XHeader, TransferDomDirective as TransferDom } from 'vux'
import { mapState } from 'vuex'
import tools from './common/tools'

export default {
  name: 'app',
  components: {
    Loading,
    XHeader
    // ViewBox
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      transitionName: 'slide-left',
      comp: '1', // 南土资产
      xHeaderConfig: {
        show: true,
        backText: 'nav_back_text',
        title: 'index_main_title',
        preventGoBack: false
      }
    }
  },
  methods: {
    onBack (url) {
      window.location.href = url
      // window.open(url, '_self')
    }
  },
  watch: {
    '$route' (to, from) {
      // set transition
      if (!to.path.localeCompare('/index')) {
        this.transitionName = 'slide-right'
      } else {
        const toDepth = to.path.split('/').filter((val) => {
          return val
        }).length
        const fromDepth = from.path.split('/').filter((val) => {
          return val
        }).length

        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
      // set info of XHeader
      Object.assign(this.xHeaderConfig, to.meta.xHeaderConfig)
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading.isLoading
    })
  },
  created () {
    // get loginfo
    // let curUri = process.env.NODE_ENV === 'production'
    //         ? window.location.href
    //         : 'http://slandasset.applinzi.com/workplan/index.html?code=chenjw'
    //
    // let patt = /code=(.*)/g
    // let userId = patt.exec(curUri)[1]
    //
    // if (userId) {
    //   // get userInfo
    //   let url = process.env.NODE_ENV === 'production'
    //                 ? './API/getUser.php'
    //                 : 'http://localhost:3000/getuser'
    //
    //   this.$http.get(url, {
    //     params: {
    //       comp: this.comp,
    //       userId: userId
    //     }
    //   })
    //   .then((response) => {
    //     let dataObj = response.data[0]
    //     this.$store.commit('initUser', {...dataObj})
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    // } else {
    let userId = tools.getCookie('userId') || 'yangxiaorong'
    let userName = tools.getCookie('userName') || '杨筱蓉'
    this.$store.commit('initUser', {
      userId: userId,
      userName: userName
    })
    // }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';
@import '~vux/src/styles/1px.less';

@trans-duration: .38s;
@trans-timing-function: cubic-bezier(.55, 0, .1, 1);

html, body {
  // height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}

#app {
  // height:100%;

  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .main-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    // height: 100%;
    overflow-x: hidden;
    transition: all @trans-duration @trans-timing-function;
  }
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

.title-slide-left-enter-active {
  -webkit-animation: slide-left-in @trans-duration @trans-timing-function;
  animation: slide-left-in @trans-duration @trans-timing-function;
}
.title-slide-left-leave-active {
  -webkit-animation: slide-left-out @trans-duration @trans-timing-function;
  animation: slide-left-out @trans-duration @trans-timing-function;
}

.title-slide-right-enter-active {
  -webkit-animation: slide-right-in @trans-duration @trans-timing-function;
  animation: slide-right-in @trans-duration @trans-timing-function;
}

.title-slide-right-leave-active {
  -webkit-animation: slide-right-out @trans-duration @trans-timing-function;
  animation: slide-right-out @trans-duration @trans-timing-function;
}

@keyframes slide-left-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-left-out {
  from {
    opacity: 1;
    transform: translateX(100%);
  }
  to {
    opacity: 0;
  }
}

@-webkit-keyframes slide-left-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes slide-left-out {
  from {
    opacity: 1;
    transform: translateX(100%);
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-right-in {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-right-out {
  from {
    opacity: 1;
    transform: translateX(-100%);
  }
  to {
    opacity: 0;
  }
}

@-webkit-keyframes slide-right-in {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes slide-right-out {
  from {
    opacity: 1;
    transform: translateX(-100%);
  }
  to {
    opacity: 0;
  }
}

</style>
