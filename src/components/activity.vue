<template lang="html">
  <div class="activity">
    <group :title="$t('select_activity_date_range')">
      <calendar
      v-model="start"
      :highlight-weekend="true"
      :title="$t('start_date')"
      :weeks-list="weekList"
      >
      </calendar>
      <calendar
      v-model="end"
      :highlight-weekend="true"
      :title="$t('end_date')"
      :weeks-list="weekList"
      >
      </calendar>
      <x-button
        type="primary"
        @click.native="onGenTable"
        :show-loading="tableLoading"
      >
        {{ $t('generate_activity_table') }}
      </x-button>
    </group>

    <data-table
      v-if="showTable"
      tableId="activityTable"
      tableTitle="activityTable"
      :columns="tableCols"
      :headerTitle="tableHeaders"
      storeName="activity"
      rowId="id"
      @save="onSave"
      @redirect="onRedirect"
      @download="onDownload"
      :btnAuth="configBtnAuth()"
    >
      <template slot="title" slot-scope="props">
        <textarea
          :value="props.value"
          :data-idx="props.idx"
          :readonly="props.readonly"
          @input="props.changeEvent"
          :data-fieldname="props.fieldname"
          cols="21"
          rows="3"
          wrap="hard"
          maxlength="100"
        >
        </textarea>
      </template>
      <template slot="place" slot-scope="props">
        <textarea
          :value="props.value"
          :data-idx="props.idx"
          :readonly="props.readonly"
          @input="props.changeEvent"
          :data-fieldname="props.fieldname"
          cols="21"
          rows="3"
          wrap="hard"
          maxlength="100"
        >
        </textarea>
      </template>
      <template slot="guests" slot-scope="props">
        <textarea
          :value="props.value"
          :data-idx="props.idx"
          :readonly="props.readonly"
          @input="props.changeEvent"
          :data-fieldname="props.fieldname"
          cols="21"
          rows="3"
          wrap="hard"
          maxlength="100"
        >
        </textarea>
      </template>
      <template slot="contacts" slot-scope="props">
        <textarea
          :value="props.value"
          :data-idx="props.idx"
          :readonly="props.readonly"
          @input="props.changeEvent"
          :data-fieldname="props.fieldname"
          cols="21"
          rows="3"
          wrap="hard"
          maxlength="100"
        >
        </textarea>
      </template>
    </data-table>
  <toast
    v-model="ifSearched"
    :time="1500"
    type="text"
    position="default"
    :is-show-mask="true"
  >
    {{ $t('search_activity_fail') }}
  </toast>
  </div>
</template>

<script>
import { Group, Calendar, XButton, Toast } from 'vux'
import DataTable from './data-table'
import { ACTIVITYCOLS } from '@/common/constant'
import tools from '@/common/tools'
import xlsx from 'xlsx'

export default {
  components: {
    Calendar,
    Group,
    XButton,
    DataTable,
    Toast
  },
  data () {
    return {
      start: 'TODAY',
      end: 'TODAY',
      tableLoading: false,
      showTable: false,
      ifSearched: false
    }
  },
  computed: {
    weekList: function () {
      return [this.$t('Su'), this.$t('Mo'), this.$t('Tu'), this.$t('We'),
        this.$t('Th'), this.$t('Fr'), this.$t('Sa')]
    },
    tableCols: function () {
      return [].concat('id').concat(ACTIVITYCOLS)
    },
    tableHeaders: function () {
      return ACTIVITYCOLS.map(cur => {
        return `${cur}_a_desc`
      })
    }
  },
  mounted () {
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  methods: {
    onGenTable () {
      this.tableLoading = true
      let url = process.env.NODE_ENV === 'production'
                ? './convert.php'
                : 'http://localhost:3000/getconference'

      this.$http.get(url, {
        params: {
          comp: '0', // 东方证券
          begin: this.start.split('-').join(''),
          end: this.end.split('-').join('')
        }
      })
      .then((response) => {
        let dataObj = response.data
        this.tableLoading = false
        if (dataObj && !tools.isEmptyObject(dataObj)) {
          let tableData = this.objToTable(dataObj)
          this.$store.commit('initactivity', {
            activityTable: tableData
          })
          this.showTable = true
        } else {
          this.ifSearched = true
          this.showTable = false
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    objToTable (obj) {
      let data = []
      for (let key in obj) {
        obj[key].forEach((cur, idx) => {
          if (cur) {
            data.push({
              id: idx,
              date: key,
              title: cur.title,
              time: cur.time,
              place: cur.place,
              dial: cur.dial,
              guests: cur.guests,
              contacts: cur.contacts.map(cur => {
                return cur.person + cur.phone
              }).join('/')
            })
          }
        })
      }
      return data
    },
    tableToObj (data) {
      let obj = {}
      data.forEach(cur => {
        if (obj.hasOwnProperty(cur.date)) {
          obj[cur.date].push(cur)
        } else {
          obj[cur.date] = [cur]
        }
      })
      return obj
    },
    configBtnAuth () {
      return {
        edit: true,
        add: false,
        del: true,
        undo: true,
        save: true,
        download: true,
        redirect: true
      }
    },
    onSave () {
      let tableData = this.$store.state.activity.activityTable.cur
      this.$store.commit('initactivity', {
        activityTable: tableData
      })
    },
    onRedirect (d) {
      let obj = this.tableToObj(d)
      this.$router.push({
        name: 'activityImage',
        params: {
          start: this.start,
          end: this.end,
          data: obj
        }
      })
    },
    onDownload (d) {
      // get data
      let tableData = [].concat(d)
      // set xlsx's header, footer and column name
      let header = [`东方活动预告（${this.start.split('-')[1]}月${this.start.split('-')[2]}日-${this.end.split('-')[1]}月${this.end.split('-')[2]}日）`]
      let footer = ['请与各对口销售联系报名']
      let columnName = ['时间', '会议主题', '参会方式', '会议关键词']
      // new workbook
      let wb = xlsx.utils.book_new()
      // make worksheet data
      let wsData = [header, columnName]
      // insert table row
      tableData.forEach((cur) => {
        let dateStr = `${+cur.date.substr(4, 2)}月${+cur.date.substr(6, 2)}日`
        let titleStr = cur.title || ''
        let contactStr = cur.contacts
        let infos = `时间：${cur.time || ''}\n地点：${cur.place || ''}\n联系人：${contactStr || ''}`
        let guestStr = '嘉宾:' + (cur.guests || '')
        wsData.push([dateStr, titleStr, infos, guestStr])
      })
      wsData.push(footer)
      // new worksheet
      let ws = xlsx.utils.aoa_to_sheet(wsData)
      xlsx.utils.book_append_sheet(wb, ws, '活动预告')

      // write xlsx and download it
      let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }

      let wbout = xlsx.write(wb, wopts)

      let FileSaver = require('file-saver')
      let s2ab = function (s) {
        let buf = new ArrayBuffer(s.length)
        let view = new Uint8Array(buf)
        for (let i = 0; i !== s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xFF
        }
        return buf
      }
      // the saveAs call downloads a file on the local machine
      let fileName = header + '.xlsx'
      FileSaver.saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), fileName)
    }
  }
}
</script>

<style lang="less">
  #activityTable {
    table {
      min-width: 800px !important;
      tbody {
        td {
          height: 80px !important;
          padding-top: 5px !important;
          textarea {
            height: 100%;
            width: 100%;
            outline: none;
            border: none;
            padding: 5px;
          }

          select {
            height: 30px;
          }
        }
      }
    }

    tr {
      th:nth-child(2) {
        width: 60px;
      }

      // th:nth-child(3) {
      //   min-width: 60px;
      // }

      th:nth-child(4) {
        width: 60px;
      }

    }
  }
</style>
