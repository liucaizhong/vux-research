<template>
  <div id="app">
    <loading v-model="isLoading" :text="$t('router_loading_text')"></loading>
    <transition :name="transitionName">
      <router-view class="main-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Loading
  },
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').filter((val) => {
        return val
      }).length
      const fromDepth = from.path.split('/').filter((val) => {
        return val
      }).length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading.isLoading
    })
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';
@import '~vux/src/styles/1px.less';

body {
  background-color: #fbf9fe;
}

.main-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  transition: all .38s cubic-bezier(.55, 0, .1, 1);
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
</style>
