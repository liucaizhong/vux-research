<template lang="html">
  <div class="summary-info">
    <div class="input-bar">
      <input
        type="text"
        v-model="title"
        :readonly="!isEditing"
      />
      <div class="toolbar">
        <a
          v-show="isEditing"
          class="floatUploadBtn"
          href="javascript:void(0);"
          role="button"
        >
          <input
            type="file"
            name="noteFile"
            id="noteFile"
            @change="onUploadFile"
          >
          <i class="fa fa-cloud-upload fa-lg" aria-hidden="true"></i>
        </a>
        <a
          v-show="isEditing"
          href="javascript:void(0);"
          role="button"
          @click="onCancel"
        >
          <img src="../assets/cross.png" />
        </a>
        <a
          v-show="isEditing"
          href="javascript:void(0);"
          role="button"
          @click="onSave"
        >
          <img src="../assets/right.png" />
        </a>
        <a
          v-if="showAdminBtn"
          v-show="!isEditing"
          href="javascript:void(0);"
          role="button"
          @click="onEdit"
        >
          <img src="../assets/edit.png" />
        </a>
      </div>
    </div>
    <ul class="attach-files" v-if="files.length">
      <li v-for="(file, key) in files">
        <!-- <div class="file" @click="onClickFile(file.url)"> -->
        <div class="file">
          <span>
            <i class="fa fa-file" aria-hidden="true"></i>
          </span>
          <span>{{ file.name }}</span>
        </div>
        <div class="iconbar">
          <a
            v-if="file.url"
            :href="file.url"
            target="_self"
            v-show="!isEditing"
          >
            <img src="../assets/jump.png" />
          </a>
          <a
            v-show="isEditing"
            class="delFileBtn"
            href="javascript:void(0);"
            role="button"
            @click.prevent.stop="onDeleteFile"
            :data-key="key"
          >
            <i class="fa fa-times" aria-hidden="true" :data-key="key"></i>
          </a>
        </div>
      </li>
    </ul>
    <!-- <div v-if="!isEditing && canvasFile">
      <canvas id="canvasFile"></canvas>
      <pdf-viewer :url="canvasFile"></pdf-viewer>
    </div> -->
    <textarea
      type="text"
      v-model="content"
      :readonly="!isEditing"
    />
    <x-button
      v-show="isEditing"
      type="warn"
      @click.native="onDel"
    >{{ $t('delete') }}</x-button>
    <toast
      v-model="showToast"
      :time="2000"
      :type="showToastType"
    >{{ showToastText }}</toast>
    <confirm
      v-model="showConfirm"
      :title="$t('delete')"
      :cancel-text="$t('cancel')"
      :confirm-text="$t('confirm')"
      @on-confirm="onConfirmDel"
    >
      <p style="text-align:center;">{{ $t('confirm_delete_summary') }}</p>
    </confirm>
  </div>
</template>

<script>
import { XButton, Toast, Confirm } from 'vux'
// import PdfViewer from './pdf-viewer'
export default {
  components: {
    XButton,
    Toast,
    Confirm
    // PdfViewer
  },
  data () {
    return {
      id: '',
      title: '',
      content: '',
      files: [],
      titleBak: '',
      contentBak: '',
      filesBak: [],
      showToast: false,
      showToastText: '',
      showToastType: '',
      isEditing: true,
      showConfirm: false,
      showAdminBtn: false
      // canvasFile: ''
    }
  },
  created () {
    this.showAdminBtn = this.$store.state.loginfo.loginfo.userId === 'lijh'
    // console.log('this.$route', this.$route)
    this.id = this.$route.params.id

    const url = process.env.NODE_ENV === 'production'
              ? './API/getRules.php'
              : 'http://localhost:3000/getrules'

    this.$http.get(url, {
      params: {
        id: this.id
      }
    })
    .then((response) => {
      console.log('response', response)
      const dataObj = response.data

      this.title = dataObj.title
      this.content = dataObj.content
      this.files = [...dataObj.files]
      // this.canvasFile = this.files[0] && this.files[0].url

      this.titleBak = dataObj.title
      this.contentBak = dataObj.content
      this.filesBak = [...dataObj.files]

      // this.loadPdf(this.canvasFile)

      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  },
  methods: {
    // onClickFile (url) {
    //   console.log('click file name', url)
    //   if (this.canvasFile !== url) {
    //     this.$store.commit('updateLoadingStatus', {
    //       isLoading: true
    //     })
    //     this.canvasFile = url
    //     // this.loadPdf(this.canvasFile)
    //   }
    // },
    // loadPdf (url) {
    //   if (url) {
    //     const that = this
    //     const pdfjsLib = require('pdfjs-dist')
    //     console.log('pdfjsLib', pdfjsLib)
    //
    //     const pdfPath = url
    //
    //     // Setting worker path to worker bundle.
    //     // pdfjsLib.PDFJS.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.js'
    //
    //     // It is also possible to disable workers via `PDFJS.disableWorker = true`,
    //     // however that might degrade the UI performance in web browsers.
    //
    //     // Loading a document.
    //     const loadingTask = pdfjsLib.getDocument(pdfPath)
    //     loadingTask.promise.then((pdfDocument) => {
    //       return pdfDocument.getPage(1).then((pdfPage) => {
    //         // Display page on the existing canvas with 100% scale.
    //         const viewport = pdfPage.getViewport(1.0)
    //         const canvas = document.getElementById('canvasFile')
    //         canvas.width = viewport.width
    //         canvas.height = viewport.height
    //         const ctx = canvas.getContext('2d')
    //         const renderTask = pdfPage.render({
    //           canvasContext: ctx,
    //           viewport: viewport
    //         })
    //         that.$store.commit('updateLoadingStatus', {
    //           isLoading: false
    //         })
    //         return renderTask.promise
    //       })
    //     }).catch((reason) => {
    //       console.error('Error: ' + reason)
    //     })
    //   }
    // },
    onEdit () {
      this.isEditing = !this.isEditing
    },
    onDel () {
      this.showConfirm = true
    },
    onConfirmDel () {
      this.$store.commit('updateLoadingStatus', {
        isLoading: true
      })
      const url = process.env.NODE_ENV === 'production'
                ? './API/delete.php'
                : 'http://localhost:3000/deletenote'
      this.$http.post(url, {
        id: this.id
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        this.$router.go(-1)
      })
      .catch((error) => {
        console.log(error)
      })
    },
    onCancel () {
      // this.title = this.titleBak
      // this.content = this.contentBak
      // this.files = [...this.filesBak]
      // this.isEditing = !this.isEditing
      this.$router.go(-1)
    },
    onSave () {
      const hasError = !this.title || !this.title.length ||
        !this.title.replace(/\s/g, '').length || !this.content ||
        !this.content.length || !this.content.replace(/\s/g, '').length

      if (hasError) {
        this.showToastText = this.$t('release_error')
        this.showToastType = 'warn'
        this.showToast = true
      } else {
        this.$store.commit('updateLoadingStatus', {
          isLoading: true
        })

        // get new files
        const newFiles = this.files.filter(f => {
          return !f.id
        })
        const preFiles = this.files.filter(f => {
          return f.id
        })
        // get deleted files
        const delFiles = this.filesBak.filter(f => {
          return !preFiles.find(fi => {
            return fi.id === f.id
          })
        })

        // console.log('this.files', this.files)
        // console.log('newFiles', newFiles)
        // console.log('delFiles', delFiles)

        // submit
        const formData = new FormData()

        formData.append('id', this.id)
        formData.append('title', this.title)
        formData.append('content', this.content)
        formData.append('type', '2')

        newFiles.forEach((cur, i) => {
          formData.append('file[]', cur, cur.name)
        })
        // delFiles.forEach((cur, i) => {
        //   formData.append('dfile[]', cur, cur.name)
        // })
        formData.append('dfile', JSON.stringify(delFiles))

        const url = process.env.NODE_ENV === 'production'
                  ? './API/update.php'
                  : 'http://slandasset.appchizi.com/summarys/API/update.php'

        this.$http.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          console.log('response', response)
          const dataObj = response.data

          this.$store.commit('updateLoadingStatus', {
            isLoading: false
          })
          // deassign the value
          this.title = dataObj.title
          this.content = dataObj.content
          this.files = [...dataObj.files]

          this.titleBak = dataObj.title
          this.contentBak = dataObj.content
          this.filesBak = [...dataObj.files]

          this.isEditing = !this.isEditing
          this.showToastText = this.$t('save_success')
          this.showToastType = 'success'
          this.showToast = true
        })
        .catch((error) => {
          console.log(error)
        })
      }
    },
    onUploadFile (e) {
      // this.files = this.files.concat(Array.prototype.map.call(e.target.files,
      //   (file) => {
      //     return file
      //   })
      // )
      this.files[0] = e.target.files[0]
      this.$forceUpdate()
      // console.log('files', this.files)
    },
    onDeleteFile (e) {
      const key = e.target.dataset.key
      this.files.splice(key, 1)
      // console.log('files', this.files)
    }
  }
}
</script>

<style lang="less">
@base-color: #2D82F6;

.summary-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 100%;

  button.weui-btn, input.weui-btn {
    width: 90%;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .input-bar {
    width: 90%;
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 40px;

    .toolbar {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;

      a {
        width: 35px;
        height: 35px;
        display: block;
        text-align: center;
        line-height: 3;

        &.floatUploadBtn {
          padding: 5px;
          height: 20px;
          line-height: 20px;
          position: relative;
          top: 0;
          cursor: pointer;
          right: 0;
          color: #bfbfbf;
          overflow: hidden;
          display: inline-block;

          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
          }
        }

        img {
          width: 80%;
          height: 80%;
        }
      }
    }

    input[type=text] {
      width: 100%;
      height: 100%;
      border: none;
      // border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      // caret-color: @base-color;
      color: @base-color;
      outline: none;
      font-size: 28px;
      padding-bottom: 3px;
      box-sizing: border-box;
      border-radius: 0;

      &:focus {
        border-bottom: 2px solid @base-color;
      }
    }
  }

  textarea {
    width: 90%;
    font-size: 18px;
    outline: none;
    border: none;
    min-height: 400px;
    margin-top: 10px;
  }

  .attach-files {
    list-style: none;
    width: 90%;
    padding: 5px 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);

    * {
      color: #888;
    }

    li {
      position: relative;
      width: 100%;
      padding: 1px 0;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;

      .iconbar {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;

        a {
          display: block;
          width: 25px;
          height: 25px;

          &:first-child {
            line-height: 2;
            text-align: left;

            img {
              width: 70%;
              height: 70%;
            }
          }

          &.delFileBtn {
            text-align: right;

            i {
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
