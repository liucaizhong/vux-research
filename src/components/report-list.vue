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
      <li v-for="report in filterReports">
        <div slot="header" class="card-header">
          <span>{{ report.title }}</span>
        </div>
        <div slot="content" class="card-content">
          <p>{{ decorate(report.desc) }}</p>
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
      searchValue: '',
      reports: [],
      showToolbar: false,
      showError: false,
      errorMsg: ''
    }
  },
  computed: {
    filterReports: function () {
      return this.reports.filter((cur) => {
        return cur.title.includes(this.searchValue) ||
          cur.desc.includes(this.searchValue) ||
          cur.author.includes(this.searchValue) ||
          this.dateFormatter(cur.date).includes(this.searchValue)
      })
    }
  },
  mounted () {
    this.reports = [{
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 0
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长最牛报告',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 1
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 2
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 3
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 4
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 5
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 0
    }, {
      id: '0',
      title: '季报业绩符合预期，继续看好未来成长',
      desc: '公司发布2017年3季报，前3季度实现营收61.25亿元，归属于上市公司股东的净利润为6.96亿元，同比只能涨600%。',
      author: '赵辰',
      date: '2017.9.14',
      url: 'https://www.baidu.com',
      type: 2
    }]

    // decide whether has authority for uploading
    // set true for testing
    this.showToolbar = this.$store.state.loginfo.loginfo.userId ===
      this.$route.params.userId || true

    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  methods: {
    dateFormatter (date) {
      const dateArr = date.split('.')
      return `${this.$t('upload_at')}  ${dateArr[0]}${this.$t('year')}` +
        `${dateArr[1]}${this.$t('month')}${dateArr[2]}${this.$t('day')}`
    },
    onClickUploadBtn (e) {
      // console.log('onClickUploadBtn', e.target.files[0])
      const file = e.target.files[0]
      const match = file.name.match(/(.*)\.pdf$/i)
      if (match) {
        this.$store.commit('uploadFile', file)
        this.$router.push({
          path: `/report/${this.$route.params.userId}/upload`
        })
        this.$router.forward()
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
