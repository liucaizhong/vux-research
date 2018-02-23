<template lang="html">
  <div class="upload-report">
    <group :title="$t('upload_report')">
      <popup-picker
        :data="types"
        v-model="type"
        :placeholder="$t('select_report_type')"
        :cancel-text="$t('cancel')"
        :confirm-text="$t('confirm')"
        :title="$t('report_type')"
        show-name
      >
      </popup-picker>
      <cell>
        <div slot="title">{{ $t('report_file') }}</div>
        <div class="file">
          <!-- <i class="fa fa-file" aria-hidden="true"></i> -->
          <!-- <span>{{ file.name }}</span> -->
          <a class="uploadBtn" href="javascript:void(0);" role="button">
            <input
              type="file"
              name="reportFile"
              id="reportFile"
              @change="onUploadFile"
            />
            {{ file.name || $t('click_add_file') }}
          </a>
        </div>
      </cell>
      <x-input
        :placeholder="$t('report_title_placeholder')"
        v-model="title"
        :title="$t('report_title')"
        text-align="right"
      />
      <x-textarea
        :placeholder="$t('report_content')"
        v-model="content"
        :max="200"
        :title="$t('report_remark')"
      />
      <x-button
        type="primary"
        @click.native="onUpload"
      >{{ $t('confirm_upload') }}</x-button>
    </group>
    <toast
      v-model="showError"
      :time="2000"
      type="warn"
    >{{ errorMsg }}</toast>
  </div>
</template>

<script>
import { PopupPicker, XTextarea, XButton, Toast, Group, XInput, Cell } from 'vux'
import moment from 'moment'
import { REPORTTYPES } from '../common/constant.js'

export default {
  data () {
    return {
      userId: '',
      title: '',
      content: '',
      file: null,
      type: [],
      types: [],
      showError: false,
      errorMsg: ''
    }
  },
  components: {
    PopupPicker,
    XTextarea,
    XButton,
    Toast,
    Group,
    XInput,
    Cell
  },
  created () {
    // console.log('REPORTTYPES', REPORTTYPES)
    this.type = ['0']
    this.types = [REPORTTYPES.map((t) => {
      return {
        name: this.$t(`report_type${t}`),
        value: t
      }
    })]
    console.log('this.types', this.types)
    this.userId = this.$route.params.userId
    // console.log('this.$store', this.$store.state.report.file)
    this.file = this.$store.state.report.file
    // console.log('match file name', this.file.name.match(/(.*)\.pdf$/i))
    // const match = this.file.name.match(/(.*)\.pdf$/i)
    // this.title = match[1]
    // if (match) {
    //   this.title = match[1]
    // } else {
    //   this.title = this.file.name
    //   this.errorMsg = this.$t('upload_file_extension_error')
    //   this.showError = true
    // }

    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  watch: {
    type: function (val) {
      console.log('watch type change')
      console.log('val', val)
      this.title = this.composeTitle(val[0])
    }
  },
  methods: {
    composeTitle (type) {
      switch (type) {
        case '0':
          return `XXX行业深度报告-${moment().format('YYYYMMDD')}`
        case '1':
          return `XXX公司深度报告-${moment().format('YYYYMMDD')}`
        case '2':
          return `XXX公司调研纪要-${moment().format('YYYYMMDD')}`
        case '3':
          return `XXX行业月报-${moment().year()}年${moment().month()}月`
        case '4':
          return `XXX行业周报-${moment().format('YYYYMMDD')}`
        case '5':
          return `XXX公司${moment().year()}QX季报/${moment().year()}年报点评`
        case '6':
          return `XXX报告-${moment().format('YYYYMMDD')}`
        default:
          return `XXX行业深度报告-${moment().format('YYYYMMDD')}`
      }
    },
    onUploadFile (e) {
      const file = e.target.files[0]
      const match = file.name.match(/(.*)\.pdf$/i)
      if (match) {
        this.file = file
      } else {
        this.errorMsg = this.$t('upload_file_extension_error')
        this.showError = true
      }
    },
    onUpload () {
      // console.log('confirm upload')
      const hasError = !this.title || !this.title.length ||
        !this.title.replace(/\s/g, '').length || !this.content ||
        !this.content.length || !this.content.replace(/\s/g, '').length

      if (hasError) {
        this.errorMsg = this.$t('upload_error')
        this.showError = true
      } else {
        // submit
        const formData = new FormData()

        formData.append('userId', this.userId)
        formData.append('title', this.title)
        formData.append('content', this.content)
        formData.append('type', this.type[0])
        formData.append('file', this.file, this.file.name)

        const url = process.env.NODE_ENV === 'production'
                  ? './API/upload.php'
                  : 'http://slandasset.appchizi.com/reports/API/upload.php'

        this.$http.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          console.dir(response)
          this.$router.go(-1)
        })
        .catch((error) => {
          // alert(error)
          console.log(error)
        })
      }
    }
  }
}
</script>

<style lang="less">
.upload-report {
  height: 100%;

  .vux-popup-picker-value {
    color: #999999;
  }

  .weui-cell.vux-x-textarea {
    height: 300px;

    .weui-cell__bd {
      height: 100%;

      textarea {
        height: 100%;
      }
    }
  }

  .weui-btn_primary:not(.weui-btn_disabled):active {
    background-color: #6DA7F7;
  }

  button.weui-btn, input.weui-btn {
    margin-top: 30px;
    margin-bottom: 20px;
    background-color: #2D82F6;
    width: 93%;
  }

  .uploadBtn {
    padding: 5px;
    padding-right: 15px;
    height: 100%;
    line-height: 2;
    position: absolute;
    top: 0;
    cursor: pointer;
    right: 0;
    color: #999999;
    overflow: hidden;
    display: inline-block;
    box-sizing: border-box;
    min-width: 150px;

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
</style>
