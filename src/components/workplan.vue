<template lang="html">
  <div class="workplan">
    <div v-if="imageSrc" id="image">
      <img :src="imageSrc" alt="loading..." />
    </div>
    <div v-for="(value, key) in members" :key="key">
      <group-title>{{ key }}</group-title>
      <grid :rows="2">
        <grid-item
          v-for="(item, i) in value"
          :link="'workplan/' + item.userId"
          :label="item.userName"
          :key="i"
        >
        </grid-item>
      </grid>
    </div>
    <div class="toolbar">
      <x-button
        ref="adminBtn"
        type="default"
        @click.native.stop="onClickAdminBtn"
      >
        {{ $t('workplan_main_title') }}
      </x-button>
    </div>
    <div
      class="admin-menu"
      ref="adminMenu"
      v-show="showAdminMenu"
      :style="{ right: menuRight + 'px'}"
    >
      <div v-if="showToolbar">
        <a class="floatUploadBtn" href="javascript:void;" role="button">
          <input
            type="file"
            name="imageFile"
            id="imageFile"
            @change="onClickUploadBtn"
          />
          <span>{{ $t('upload_image') }}</span>
        </a>
      </div>
      <div>
        <router-link to="/workplan/images">{{ $t('check_images') }}</router-link>
      </div>
    </div>
    <toast
      v-model="showError"
      :time="2000"
      type="warn"
    >{{ errorMsg }}</toast>
  </div>
</template>

<script>
import { GroupTitle, Grid, GridItem, Toast, XButton, XImg } from 'vux'
import { DEPS } from '@/common/constant'

export default {
  components: {
    GroupTitle,
    Grid,
    GridItem,
    Toast,
    XButton,
    XImg
  },
  data () {
    return {
      comp: '1', // 南土资产
      deps: DEPS,
      // year: '',
      // quarter: '',
      members: {},
      showAdminMenu: false,
      menuRight: 0,
      imageSrc: '',
      showToolbar: false,
      errorMsg: '',
      showError: false
    }
  },
  created () {
    this.showToolbar = this.$store.state.loginfo.loginfo.userId === 'fengx'
    // set current year and quarter
    // let date = new Date()
    // this.year = date.getFullYear()
    // this.quarter = Math.floor(date.getMonth() / 3)
    // axios to get members
    // params: array[dep1, dep2, ...]

    function getUsers (vm, fn) {
      const url = process.env.NODE_ENV === 'production'
                ? './API/getUsers.php'
                : 'http://localhost:3000/getemployees'

      vm.$http.get(url, {
        params: {
          comp: vm.comp,
          // deps: vm.deps.map((cur) => {
          //   return vm.$t(cur)
          // }).join(',')
          // year: vm.year,
          // quarter: vm.quarter
          deps: vm.$t(vm.deps[0])
        }
      })
      .then((response) => {
        const dataObj = response.data
        Object.assign(vm.members, dataObj)
        vm.$forceUpdate()
        fn()
      })
      .catch((error) => {
        console.log(error)
      })
    }

    // getUsers(this)

    function getImage (vm) {
      const url = process.env.NODE_ENV === 'production'
                ? './API/getPic.php'
                : 'http://localhost:3000/getpic'

      vm.$http.get(url)
      .then((response) => {
        console.log('response', response)
        vm.imageSrc = response.data.files[0].url
        vm.$forceUpdate()
        vm.$store.commit('updateLoadingStatus', {
          isLoading: false
        })
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const loadPromise = new Promise((resolve, reject) => {
      getUsers(this, resolve)
    })

    loadPromise.then(() => {
      getImage(this)
    }).catch((err) => {
      console.log('err', err)
    })
  },
  methods: {
    onClickAdminBtn () {
      // console.log('click admin btn')
      this.menuRight = (this.$refs.adminBtn.$el.clientWidth - 100) / 2
      this.showAdminMenu = !this.showAdminMenu
    },
    onClickUploadBtn (e) {
      this.showAdminMenu = !this.showAdminMenu
      const file = e.target.files[0]
      console.dir(file)
      if (/image\/\w+/.test(file.type)) {
        this.$store.commit('updateLoadingStatus', {
          isLoading: true
        })

        const formData = new FormData()

        formData.append('file', file, file.name)

        const url = process.env.NODE_ENV === 'production'
                  ? './API/upload.php'
                  : 'http://slandasset.appchizi.com/workplan/API/upload.php'

        this.$http.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          console.log('response', response)
          this.imageSrc = response.data
          // document.getElementById('image').innerHTML =
          //   `<img src="${this.imageSrct}" alt="loading..." />`

          this.$forceUpdate()
          this.$store.commit('updateLoadingStatus', {
            isLoading: false
          })
        })
        .catch((error) => {
          console.log(error)
        })
      } else {
        this.errorMsg = this.$t('upload_image_extension_error')
        this.showError = true
      }
    }
  }
}
</script>

<style lang="less">
.workplan {
  height: 100%;
  padding-bottom: 70px;
  box-sizing: border-box;

  img {
    width: 100%;
    height: auto;
  }

  .admin-menu {
    background: #fff;
    // border: .5px solid rgba(0, 0, 0, 0.2);
    // box-shadow: 1px 1px 2px #888888;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    position: fixed;
    width: 100px;
    bottom: 53px;
    text-align: center;
    font-size: 14px;
    border-right: .5px solid rgba(0, 0, 0, 0.2);
    border-bottom: .5px solid rgba(0, 0, 0, 0.2);

    div {
      // padding: 8px 25px;
      position: relative;
      height: 35.5px;
      border-top: .5px solid rgba(0, 0, 0, 0.2);
      border-left: .5px solid rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #EBEBEB;
      }

      a {
        color: #767676;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        line-height: 2.5;
      }
    }

    .floatUploadBtn {
      // line-height: 4;
      // position: absolute;
      // top: 0;
      cursor: pointer;
      // right: 0;
      color: #767676;
      font-size: 14px;
      overflow: hidden;
      display: inline-block;
      width: 100%;
      height: 100%;
      text-align: center;

      &:hover {
        background-color: #EBEBEB;
      }

      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
      }
    }
  }

  .toolbar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    height: 50px;
    background-color: #F8F8F8;
    border-top: 0.5px solid rgba(0, 0, 0, 0.2);

    .weui-btn + .weui-btn {
      margin-top: 0;
    }

    button {
      font-size: 14px;
      color: #767676;
      padding: 10px 0;
      border-radius: 0;

      &.weui-btn {
        &::after {
          border-radius: 0;
          border: 0.5px solid rgba(0, 0, 0, 0.2);
          border-left-width: .3px;
          // border-right-width: .3px;
        }

        &:hover {
          background-color: #EBEBEB;
        }
      }
    }
  }
}
</style>
