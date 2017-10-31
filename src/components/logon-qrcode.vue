<template lang="html">
  <div class="logon-qrcode">
    <div class="logo">
      <img :src="compinfo.logo" alt="" :style="compinfo.style">
    </div>
    <div class="logon-box">
      <div id="wxQRCode" class="qrcode">
        <!-- <qrcode
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
        </div> -->
      </div>
      <!-- <div v-show="!needRefresh">
        <p class="sub-title">{{ $t('logon_qrcode_subtitle') }}</p>
        <p class="sub-desc">{{ $t('logon_qrcode_subdesc') }}</p>
      </div> -->
    </div>
    <div class="copyright">
      <p class="desc">© 1998 - 2017 Orient Securities. All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import { Qrcode } from 'vux'
import { COMPINFOS } from '@/common/constant'

export default {
  components: {
    Qrcode
  },
  data () {
    return {
      // needRefresh: false,
      // spinActive: false,
      // intervalMS: 5 * 60 * 1000,
      // intervalFunc: null,
      // ifInterval: false,
      // logonUri: '', //vux qrcode
      // 0:东方证券研究所, 1:南土资产
      comp: '0',
      compinfos: COMPINFOS
    }
  },
  computed: {
    compinfo: function () {
      return this.compinfos[this.comp]
    }
  },
  methods: {
    // refreshQrCode () {
    //   let vm = this
    //   vm.spinActive = true
    //   // update qr code
    //   vm.setQrCode()
    //   vm.spinActive = false
    //   vm.needRefresh = false
    //   // set the qr expires handler
    //   vm.intervalFunc = false && setInterval(function () {
    //     vm.needRefresh = true
    //     clearInterval(vm.intervalFunc)
    //   }, vm.intervalMS)
    // },
    setQrCode () {
      let wxConfig = this.compinfo.wxConfig
      window.WwLogin({
        'id': 'wxQRCode',
        'appid': wxConfig.appid,
        'agentid': wxConfig.agentid,
        'redirect_uri': wxConfig.redirectUri,
        'state': wxConfig.state
        // 'href': ''
      })
    }
  },
  mounted () {
    let vm = this
    vm.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
    // set qr code
    vm.setQrCode(this.comp)
    // // set the qr expires handler
    // vm.intervalFunc = false && setInterval(function () {
    //   vm.needRefresh = true
    //   clearInterval(vm.intervalFunc)
    // }, vm.intervalMS)
  }
}
</script>

<style lang="less">
  .logon-qrcode {
    background: url(../assets/logon_background.jpg) no-repeat 50%;
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .logo {
      margin-left: 30px;
      margin-top: 10px;
    }

    .qr-code-expires {
      opacity: .1;
    }

    .logon-box {
      border-radius: 4px;
      background-color: #fff;
      width: 375px;
      height: 540px;
      box-shadow: 0 2px 10px #999;
      align-self: center;

      .qrcode {
        position: relative;
        text-align: center;
        margin: 60px auto 12px;
        width: 100%;
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
      color: #d3d3d3;
      font-size: 12px;
      align-self: flex-end;
      margin-right: 30px;
    }
  }
</style>
