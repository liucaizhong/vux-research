<template lang="html">
  <div class="report-info">
    <group :title="$t('report_info')">
      <x-input
        class="report-type"
        v-if="!isEditing"
        :title="$t('report_type')"
        readonly
        :value="types[0][type[0]]"
        text-align="right"
      >
      </x-input>
      <popup-picker
        v-else
        :data="types"
        v-model="type"
        :placeholder="$t('select_report_type')"
        :cancel-text="$t('cancel')"
        :confirm-text="$t('confirm')"
        :title="$t('report_type')"
      >
      </popup-picker>
      <!-- <cell value-align="left">
        <input
          class="input-title"
          type="text"
          v-model="title"
          :readonly="!isEditing"
        />
      </cell> -->
      <x-input
        :placeholder="$t('report_title_placeholder')"
        v-model="title"
        :title="$t('report_title')"
        text-align="right"
        :readonly="!isEditing"
      />
      <cell v-if="file">
        <div slot="title">{{ $t('report_file') }}</div>
        <div class="file">
          <div class="filename">
            <!-- <i class="fa fa-file" aria-hidden="true"></i> -->
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
          </div>
        </div>
      </cell>
      <x-textarea
        :placeholder="$t('report_content')"
        v-model="content"
        :max="200"
        :title="$t('report_remark')"
        :readonly="!isEditing"
      />
      <x-button
        v-show="isEditing"
        type="warn"
        @click.native="onDel"
      >{{ $t('delete') }}</x-button>
    </group>
    <toast
      v-model="showToast"
      :time="2000"
      :type="showToastType"
    >{{ showToastText }}</toast>
  </div>
</template>

<script>
import { PopupPicker, XTextarea, XButton, Toast, Group, XInput, Cell } from 'vux'
import { REPORTTYPES } from '../common/constant.js'
export default {
  components: {
    PopupPicker,
    XTextarea,
    XButton,
    Toast,
    Group,
    XInput,
    Cell
  },
  data () {
    return {
      userId: '',
      reportId: '',
      title: '',
      content: '',
      file: null,
      type: [],
      types: [],
      isEditing: false,
      showToast: false,
      showToastType: '',
      showToastText: ''
    }
  },
  methods: {
    onDel () {
      console.log('delete')
    }
  },
  created () {
    this.types = [REPORTTYPES.map(t => {
      return this.$t(`report_type${t}`)
    })]

    this.userId = this.$route.params.userId
    this.reportId = this.$route.params.reportId

    const url = process.env.NODE_ENV === 'production'
              ? './API/getReports.php'
              : 'http://localhost:3000/getreports'

    this.$http.get(url, {
      params: {
        id: this.reportId
      }
    })
    .then((response) => {
      console.log('response', response)
      const dataObj = response.data
      this.content = dataObj.content
      this.title = dataObj.title
      this.file = dataObj.file[0]
      this.type = [dataObj.type]

      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style lang="less">
.report-info {
  height: 100%;

  .input-title {
    outline: none;
    border: 0;
    font-size: 17px;
    line-height: 1.41176471;
  }

  .file {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;

    .filename {
      padding-right: 5px;
    }

    .iconbar {
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
      }
    }
  }

  .vux-popup-picker-value, .weui-input {
    color: #999999;
  }

  .weui-cell.vux-x-textarea {
    height: 300px;
    margin-bottom: 30px;

    .weui-cell__bd {
      height: 100%;

      textarea {
        height: 100%;
      }
    }
  }

  button.weui-btn, input.weui-btn {
    margin-bottom: 20px;
    width: 93%;
  }
}
</style>
