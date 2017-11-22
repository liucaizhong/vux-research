<template lang="html">
  <div class="report-list">
    <search
      ref="search"
      :placeholder="$t('search_report')"
      :cancel-text="$t('cancel')"
      v-model="searchValue"
    >
    </search>
    <ul class="list">
      <li v-for="(report, i) in filterReports" :key="i">
        <div slot="header" class="card-header">
          <span>{{ report.title }}</span>
        </div>
        <div slot="content" class="card-content" @click="onClickReport(report.id)">
          <p>{{ decorate(report.content) }}</p>
        </div>
        <div slot="footer" class="card-footer">
          <span>{{ report.author }}</span>
          -
          <span>{{ $t(`report_type${report.type}`) }}</span>
          -
          <span>{{ dateFormatter(report.date) }}</span>
          -
          <a
            :href="report.url"
            target="_self"
          >
            <span>{{ $t('view_report') }}</span>
          </a>
        </div>
      </li>
    </ul>
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
    <toast
      v-model="showError"
      :time="2000"
      type="warn"
    >{{ errorMsg }}</toast>
  </div>
</template>

<script>
import { Search, Card, Toast } from 'vux'

export default {
  components: {
    Search,
    Card,
    Toast
  },
  data () {
    return {
      userId: '',
      searchValue: '',
      reports: [],
      showToolbar: false,
      showError: false,
      errorMsg: ''
    }
  },
  computed: {
    filterReports: function () {
      return this.reports && this.reports.filter((cur) => {
        return cur.title.includes(this.searchValue) ||
          cur.content.includes(this.searchValue) ||
          cur.author.includes(this.searchValue) ||
          this.$t(`report_type${cur.type}`).includes(this.searchValue) ||
          this.dateFormatter(cur.date).includes(this.searchValue)
      })
    }
  },
  mounted () {
    this.userId = this.$route.params.userId
    this.showToolbar = this.$store.state.loginfo.loginfo.userId === this.userId

    const url = process.env.NODE_ENV === 'production'
              ? './API/getReports.php'
              : 'http://localhost:3000/getreports'

    this.$http.get(url, {
      params: {
        userId: this.userId
      }
    })
    .then((response) => {
      console.log('response', response)
      const report = response.data.report
      this.reports = report
      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  },
  methods: {
    onClickReport (id) {
      console.log('click report', id)
      this.$router.push({
        path: `/${this.userId}/${id}`
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
        this.errorMsg = this.$t('upload_file_extension_error')
        this.showError = true
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
  }

  .list {
    padding-top: 44px;
    padding-bottom: 50px;

    li {
      background: #fff;
      padding: 8px 10px;
      margin-bottom: 5px;
      border-top: 0.3px solid rgba(0, 0, 0, 0.2);
      border-bottom: 0.3px solid rgba(0, 0, 0, 0.2);

      .card-header {
        font-size: 16px;
        font-weight: bold;
      }

      .card-content {
        font-size: 14px;
        padding: 8px 0;
      }

      .card-footer {
        font-size: 12px;
        color: #888;

        a {
          color: #888;
        }
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
