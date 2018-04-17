<template lang="html">
  <div class="report-list">
    <search
      :placeholder="$t('search_report')"
      :cancel-text="$t('cancel')"
      v-model="searchValue"
      @on-cancel="onCancelSearch"
    >
    </search>
    <div class="list vux-1px-t">
      <swipeout
        v-if="reports && reports.length"
        v-for="(reports, i) in filterReports"
        :key="i"
      >
        <div class="swipe-title">{{ $t(`report_type${i}`) }}</div>
        <swipeout-item
          class="vux-1px-tb"
          v-for="(report, k) in reports"
          :key="k"
          :disabled="!showToolbar"
        >
          <!-- <div slot="right-menu">
            <swipeout-button
              @click.native="onDeleteReport(report.id)"
              type="warn"
            >{{ $t('delete') }}</swipeout-button>
          </div> -->
          <div slot="content" class="swipe-item">
            <a
            :href="report.url"
            target="_self"
            >
              <card>
                <div slot="header" class="card-header">
                  <span>{{ report.title }}</span>
                </div>
                <div slot="content" class="card-content">
                  <p>{{ decorate(report.content) }}</p>
                </div>
                <div slot="footer" class="card-footer">
                  <span>{{ report.author }}</span>
                  -
                  <span>{{ $t(`report_type${report.type}`) }}</span>
                  -
                  <span>{{ dateFormatter(report.date) }}</span>
                </div>
              </card>
            </a>
            <div class="card-toolbar" v-if="showToolbar">
              <i
                class="fa fa-times"
                @click="onDeleteReport(report.id)"
              ></i>
            </div>
          </div>
        </swipeout-item>
      </swipeout>
      <!-- <ul
        v-if="reports && reports.length"
        v-for="(reports, i) in filterReports"
        :key="i"
      >
        <div class="ul-title">{{ $t(`report_type${i}`) }}</div>
        <li v-for="(report, k) in reports" :key="k">
          <a
            :href="report.url"
            target="_self"
          >
            <div slot="header" class="card-header">
              <span>{{ report.title }}</span>
            </div>
            <div slot="content" class="card-content">
              <p>{{ decorate(report.content) }}</p>
            </div>
            <div slot="footer" class="card-footer">
              <span>{{ report.author }}</span>
              -
              <span>{{ $t(`report_type${report.type}`) }}</span>
              -
              <span>{{ dateFormatter(report.date) }}</span>
            </div>
          </a>
          <div
            v-if="showToolbar"
            class="right"
            @click.stop.prevent="onEditReport(report.id)"
          >
            <i
              class="fa fa-pencil-square-o fa-2x"
              aria-hidden="true"
              :style="{
                'line-height': 1,
                'color': '#888'
              }"
            >
            </i>
          </div>
        </li>
      </ul> -->
    </div>
    <div class="toolbar" v-if="showToolbar">
      <a class="floatUploadBtn" href="javascript:void;" role="button">
        <input
          type="file"
          name="reportFile"
          id="reportFile"
          @change="onClickUploadBtn"
        />
        <span>{{ $t('upload_report') }}</span>
      </a>
    </div>
    <confirm
      v-model="showConfirm"
      :title="$t('delete')"
      :cancel-text="$t('cancel')"
      :confirm-text="$t('confirm')"
      @on-confirm="onConfirmDel"
    >
      <p style="text-align:center;">{{ $t('confirm_delete_report') }}</p>
    </confirm>
    <toast
      v-model="showToast"
      :time="2000"
      :type="toastType"
    >{{ toastMsg }}</toast>
  </div>
</template>

<script>
import { Search, Card, Toast, Swipeout, SwipeoutItem, SwipeoutButton, Confirm } from 'vux'

export default {
  components: {
    Search,
    Card,
    Toast,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Confirm
  },
  data () {
    return {
      userId: '',
      searchValue: '',
      reports: [],
      showToolbar: false,
      showToast: false,
      toastType: 'warn',
      toastMsg: '',
      toDelReportId: '',
      showConfirm: false
    }
  },
  computed: {
    filterReports: function () {
      const res = []
      this.reports.forEach((rp, i) => {
        res[i] = rp && rp.filter((cur) => {
          return cur.title.includes(this.searchValue) ||
            cur.content.includes(this.searchValue) ||
            cur.author.includes(this.searchValue) ||
            this.$t(`report_type${cur.type}`).includes(this.searchValue) ||
            this.dateFormatter(cur.date).includes(this.searchValue)
        })
      })
      return res
    }
  },
  created () {
    this.userId = this.$route.params.userId
    this.showToolbar = this.$store.state.loginfo.loginfo.userId === this.userId ||
      this.$store.state.loginfo.loginfo.userId === 'chenjw' ||
      this.$store.state.loginfo.loginfo.userId === 'fengx'
    const url = process.env.NODE_ENV === 'production'
              ? './API/getReports.php'
              : 'http://localhost:3000/getreports'

    this.$http.get(url, {
      params: {
        userId: this.userId
      }
    })
    .then((response) => {
      // console.log('response', response)
      this.reports = response.data
      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  },
  methods: {
    onCancelSearch () {
      this.searchValue = ''
    },
    onEditReport (id) {
      console.log('edit report', id)
      this.$router.push({
        path: `/${this.userId}/${id}`
      })
    },
    onDeleteReport (id) {
      this.showConfirm = true
      this.toDelReportId = id
    },
    onConfirmDel () {
      this.$store.commit('updateLoadingStatus', {
        isLoading: true
      })
      const url = process.env.NODE_ENV === 'production'
                ? './API/delete.php'
                : 'http://localhost:3000/deletereport'
      this.$http.post(url, {
        id: this.toDelReportId,
        userId: this.userId
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        // console.log('response', response)
        let data
        if (process.env.NODE_ENV === 'production') {
          data = response.data
        } else {
          data = JSON.parse(response.data)
        }
        // console.log('data', data)
        this.reports = data.data
        this.$store.commit('updateLoadingStatus', {
          isLoading: false
        })
        this.toastMsg = this.$t('delete_image_success')
        this.toastType = 'success'
        this.showToast = true
      })
      .catch((error) => {
        console.log(error)
      })
    },
    dateFormatter (date) {
      // const dateArr = date.split('.')
      // return `${this.$t('upload_at')}  ${dateArr[0]}${this.$t('year')}` +
      //   `${dateArr[1]}${this.$t('month')}${dateArr[2]}${this.$t('day')}`
      return `${this.$t('upload_at')}  ${date}`
    },
    onClickUploadBtn (e) {
      // console.log('onClickUploadBtn', e.target.files[0])
      const file = e.target.files[0]
      const match = file.name.match(/(.*)\.pdf$/i)
      if (match) {
        this.$store.commit('uploadFile', file)
        this.$router.push({
          // path: `/report/${this.userId}/upload`
          path: `/${this.userId}/upload`
        })
        // this.$router.forward()
      } else {
        this.toastMsg = this.$t('upload_file_extension_error')
        this.toastType = 'warn'
        this.showToast = true
      }
    },
    _getStrLength (str) {
      let realLength = 0
      let charCode = -1
      const len = str.length

      for (let i = 0; i < len; i++) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) {
          realLength += 1
        } else {
          realLength += 2
        }
      }
      return realLength
    },
    decorate (str) {
      const strLen = this._getStrLength(str)
      const len = 140
      let strLength = 0
      let strCut = ''

      if (len >= strLen) {
        return str
      }

      for (let i = 0; i < strLen; i++) {
        let a = str.charAt(i)
        strLength++
        if (escape(a).length > 4) {
          strLength++
        }
        strCut = strCut.concat(a)

        if (strLength >= len) {
          return `${strCut}...`
        }
      }
    }
  }
}
</script>

<style lang="less">
.report-list {
  height: 100%;

  .vux-search-box {
    position: fixed !important;
    z-index: 100;
  }

  .list {
    padding-top: 44px;
    padding-bottom: 50px;

    .swipe-title {
      padding: 3px 10px;
      font-size: 14px;
      font-style: italic;
      font-weight: 800;
    }

    .swipe-item {
      background: #fff;
      padding: 8px 10px;
      margin-bottom: 5px;
      // border-top: 0.3px solid rgba(0, 0, 0, 0.2);
      border-bottom: 0.3px solid rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;

      a {
        width: 100%;
      }

      .card-toolbar {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        i {
          font-size: 20px;
          color: rgba(0, 0, 0, 0.3);
          &:hover {
            cursor: pointer;
          }
        }
      }

      .weui-panel {
        &::before {
          content: none;
        }

        &::after {
          content: none;
        }
      }

      .card-header {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }

      .card-content {
        font-size: 14px;
        padding: 8px 0;
        color: #000;
      }

      .card-footer {
        font-size: 12px;
        color: #888;
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

    .floatUploadBtn {
      line-height: 4;
      // position: absolute;
      // top: 0;
      cursor: pointer;
      // right: 0;
      color: #767676;
      font-size: 12px;
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
}
</style>
