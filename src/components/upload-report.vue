<template lang="html">
  <div class="upload-report">
    <group :title="$t('upload_report')">
      <x-input
        :placeholder="$t('report_title')"
        v-model="title"
      />
      <cell>
        <div slot="title">
          <i class="fa fa-file" aria-hidden="true"></i>
          <span>{{ file.name }}</span>
        </div>
      </cell>
      <popup-picker
        :data="types"
        v-model="type"
        :placeholder="$t('select_report_type')"
        :cancel-text="$t('cancel')"
        :confirm-text="$t('confirm')"
        :title="$t('report_type')"
      >
      </popup-picker>
      <x-textarea
        :placeholder="$t('report_content')"
        v-model="content"
        :max="200"
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
    this.type.push(this.$t('report_type0'))
    this.types = [REPORTTYPES.map(t => {
      return this.$t(`report_type${t}`)
    })]
    console.log('this.$route', this.$route)
    this.userId = this.$route.params.userId
    // console.log('this.$store', this.$store.state.report.file)
    this.file = this.$store.state.report.file
    // console.log('match file name', this.file.name.match(/(.*)\.pdf$/i))
    const match = this.file.name.match(/(.*)\.pdf$/i)
    this.title = match[1]
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
  methods: {
    onUpload () {
      console.log('confirm upload')
      const hasError = !this.title || !this.title.length ||
        !this.title.replace(/\s/g, '').length || !this.content ||
        !this.content.length || !this.content.replace(/\s/g, '').length

      if (hasError) {
        this.errorMsg = this.$t('upload_error')
        this.showError = true
      }

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
        console.log(error)
      })
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

  button.weui-btn, input.weui-btn {
    margin-top: 30px;
    margin-bottom: 20px;
    background-color: #2D82F6;
    width: 93%;
  }
}
</style>
