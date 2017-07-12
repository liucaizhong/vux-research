<template lang="html">
  <div class="logon-qrcode">
    <div class="logo">
      <!-- reserved for future -->
    </div>
    <div class="logon-box">
      <div class="qrcode">
        <qrcode
          :value="logonUri"
          type="img"
          :size="220"
          :class="{'qr-code-expires': needRefresh}"
        >
        </qrcode>
        <div v-show="needRefresh">
          <div class="refresh-code-mask">
            <i
              class="fa fa-refresh fa-fw fa-4x"
              :class="{'fa-spin': spinActive}"
              aria-hidden="true"
              @click="refreshQrCode"
            >
          </i>
          </div>
          <p class="refresh-tips">{{ $t('logon_refresh_tips') }}</p>
        </div>
      </div>
      <div v-show="!needRefresh">
        <p class="sub-title">{{ $t('logon_qrcode_subtitle') }}</p>
        <p class="sub-desc">{{ $t('logon_qrcode_subdesc') }}</p>
      </div>
    </div>
    <div class="copyright">
      <p class="desc">© 1998 - 2017 Orient Securities. All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import { Qrcode } from 'vux'

export default {
  components: {
    Qrcode
  },
  data () {
    return {
      needRefresh: false,
      spinActive: false,
      intervalMS: 5 * 60 * 1000,
      intervalFunc: null,
      ifInterval: false,
      logonUri: ''
    }
  },
  methods: {
    refreshQrCode () {
      let vm = this
      vm.spinActive = true
      // update qr code
      vm.setQrCode()
      vm.spinActive = false
      vm.needRefresh = false
      // set the qr expires handler
      vm.intervalFunc = false && setInterval(function () {
        vm.needRefresh = true
        clearInterval(vm.intervalFunc)
      }, vm.intervalMS)
    },
    setQrCode () {
      // get uuid from server
      // to do later
      let uri = encodeURIComponent('http://slandasset.appchizi.com')
      // let id = '2'
      // let wxUri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfec7719a18cec63a&redirect_uri=${uri}&response_type=code&scope=snsapi_base&agentid=${id}&state=ok#wechat_redirect`
      let wxUri = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=wxfec7719a18cec63a&redirect_uri=${uri}&state=web_login&usertype=admin`
      this.logonUri = wxUri
    }
  },
  mounted () {
    let vm = this
    vm.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
    // set qr code
    vm.setQrCode()
    // set the qr expires handler
    vm.intervalFunc = false && setInterval(function () {
      vm.needRefresh = true
      clearInterval(vm.intervalFunc)
    }, vm.intervalMS)
  }
}
</script>

<style lang="less">
  .logon-qrcode {
    background: url(../assets/logon_background.jpg) no-repeat 50%;
    background-size: cover;
    width: 100%;
    height: 100%;

    .logo {
      position: absolute;
      left: 60px;
      top: 60px;
    }

    .qr-code-expires {
      opacity: .1;
    }

    .logon-box {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -188px;
      margin-top: -270px;
      border-radius: 4px;
      background-color: #fff;
      width: 375px;
      height: 540px;
      box-shadow: 0 2px 10px #999;

      .qrcode {
        position: relative;
        text-align: center;
        margin: 60px auto 12px;
      }

      .sub-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 20px;
      }

      .sub-desc {
        text-align: center;
        color: #888;
        font-size: 18px;
      }

      .refresh-tips {
        color: #353535;
        text-align: center;
        font-size: 16px;
        margin-top: 20px;
      }

      .refresh-code-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 226px;

        i {
          position: absolute;
          top: 70px;
          left: 145px;
          background-color: #fff;
          border-radius: 100%;
          width: 90px;
          height: 90px;
          line-height: 1.8;
          color: #6A6A66;
          font-size: 50px;
          box-shadow: 0 2px 10px #999;
          cursor: pointer;
        }
      }
    }

    .copyright {
      position: absolute;
      bottom: 60px;
      right: 60px;
      color: #d3d3d3;
      font-size: 12px;
    }
  }
</style>
