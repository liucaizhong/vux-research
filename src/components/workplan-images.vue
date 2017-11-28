<template lang="html">
  <div class="workplan-images">
    <div class="image-title">
      <span>{{ $t('workplan_images_title') }}</span>
      <span>{{ images.length ? '' : '（暂无）'  }}</span>
    </div>
    <ul v-if="images.length">
      <li
        v-for="(image, i) in images"
        :key="i"
      >
        <check-icon v-if="deleting" :value.sync="image.checked" type="plain"></check-icon>
        <div>
          <img :src="image.url" alt="loading..."></img>
        </div>
      </li>
    </ul>
    <div v-if="editing" class="toolbar">
      <a
        v-show="!deleting"
        class="floatUploadBtn"
        href="javascript:void;"
        role="button"
      >
        <input
          type="file"
          name="imageFile"
          id="imageFile"
          @change="onClickUploadBtn"
        />
        <span>{{ $t('upload_image') }}</span>
      </a>
      <x-button
        type="default"
        @click.native.stop="onDeleteImage"
        v-show="!deleting"
      >
        {{ $t('delete_image') }}
      </x-button>
      <x-button
        type="default"
        @click.native.stop="onCancelDelete"
        v-show="deleting"
      >
        {{ $t('cancel') }}
      </x-button>
      <x-button
        type="default"
        @click.native.stop="onConfirmDelete"
        v-show="deleting"
      >
        {{ $t('confirm') }}
      </x-button>
    </div>
    <toast
      v-model="showError"
      :time="2000"
      :type="toastType"
    >{{ errorMsg }}</toast>
  </div>
</template>

<script>
import { XButton, CheckIcon, Toast } from 'vux'
export default {
  components: {
    XButton,
    CheckIcon,
    Toast
  },
  data () {
    return {
      images: [],
      editing: false,
      deleting: false,
      // checked: [],
      errorMsg: '',
      showError: false,
      toastType: ''
    }
  },
  created () {
    this.editing = this.$route.query.edit

    const url = process.env.NODE_ENV === 'production'
              ? './API/getPic.php'
              : 'http://localhost:3000/getpic'

    this.$http.get(url)
    .then((response) => {
      console.log('response', response)
      // this.images = [...response.data.files]
      const data = response.data
      const files = data.files || []
      this.images = files.map((v) => {
        return {
          ...v,
          checked: false
        }
      })
      this.$forceUpdate()
      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  },
  methods: {
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
        this.toastType = 'warn'
        this.errorMsg = this.$t('upload_image_extension_error')
        this.showError = true
      }
    },
    onDeleteImage () {
      this.deleting = !this.deleting
    },
    onCancelDelete () {
      this.images = this.images.map((v) => {
        v.checked = false
        return v
      })
      this.deleting = !this.deleting
    },
    onConfirmDelete () {
      this.$store.commit('updateLoadingStatus', {
        isLoading: true
      })

      const url = process.env.NODE_ENV === 'production'
                ? './API/delete.php'
                : 'http://localhost:3000/deleteworkplanimage'
      this.$http.post(url, {
        id: this.images.filter((v) => {
          return v.checked
        }).map((v) => {
          return v.id
        })
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        console.log('reponse', response)
        const data = JSON.parse(response.data)
        const files = data.files || []
        this.images = files.map((v) => {
          return {
            ...v,
            checked: false
          }
        })
        this.deleting = !this.deleting
        this.$forceUpdate()
        this.$store.commit('updateLoadingStatus', {
          isLoading: false
        })
        this.toastType = 'success'
        this.errorMsg = this.$t('delete_image_success')
        this.showError = true
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less">
.workplan-images {
  height: 100%;
  padding-bottom: 50px;
  box-sizing: border-box;

  .image-title {
    margin-top: 0.77em;
    margin-bottom: 0.3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #999999;
    font-size: 14px;
  }

  li {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;

    > div {
      flex: 1 1 auto;

      img {
        width: 100%;
        height: auto;
        margin-bottom: 10px;
      }
    }

    > div:first-child {
      flex: 1 0 30px;
    }

    // &.edit {
    //   padding-top: 10px;
    //   padding-right: 10px;
    // }

    i {
      color: #F50D09;
    }

    .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before {
      color: #F50D09;
    }
  }

  .toolbar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    height: 50px;
    background-color: #F8F8F8;
    // border-top: 0.5px solid rgba(0, 0, 0, 0.2);

    .floatUploadBtn {
      line-height: 3.5;
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
      border-top: 1px solid rgba(0, 0, 0, 0.2);

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
          border-right: none;
          border-bottom: none;
          // border: 0.5px solid rgba(0, 0, 0, 0.2);
          // border-left-width: .3px;
          // border-right-width: .3px;
        }
      }
    }
  }
}
</style>
