<template lang="html">
  <div class="workplan">
    <data-table
      v-for="(t, i) in planTypes"
      :tableId="`${t}Table`"
      :key="i"
      :tableTitle="t"
      :columns="configTableColumns(t)"
      :headerTitle="configTableHeader(t)"
      storeName="workplan"
      rowId="id"
      @save="saveData"
      :btnAuth="configBtnAuth()"
    >
      <!-- <template slot="event" scope="props">
        <textarea
          :value="props.value"
          :data-idx="props.idx"
          :readonly="props.readonly"
          @input="props.changeEvent"
          :data-fieldname="props.fieldname"
          cols="21"
          rows="6"
          wrap="hard"
          maxlength="66"
        >
        </textarea>
      </template> -->
    </data-table>

    <toast
      v-model="isSaved"
      :time="1500"
      type="success"
      position="default"
      :is-show-mask="true"
    >
      {{ $t('save_success') }}
    </toast>

    <card class="task" :header="{ title: $t('task_achievement') }">
      <div class="chart" slot="content"></div>
    </card>
  </div>
</template>

<script>
import { PLANTYPES, PLANFORMS } from '@/common/constant'
import DataTable from './data-table'
import { Card, Toast } from 'vux'

export default {
  components: {
    DataTable,
    Card,
    Toast
  },
  data () {
    return {
      planTypes: PLANTYPES,
      planForms: PLANFORMS,
      curUserId: '',
      year: '',
      quarter: '',
      isSaved: false
    }
  },
  mounted () {
    // set current year and quarter
    let that = this
    let date = new Date()
    this.year = date.getFullYear()
    this.quarter = Math.floor(date.getMonth() / 3)
    this.curUserId = this.$route.params.userId
    // get workplan
    function getUserWorkplan (vm) {
      let url = process.env.NODE_ENV === 'production'
                ? './API/getWP.php'
                : 'http://localhost:3000/getworkplan'

      vm.$http.get(url, {
        params: {
          userId: vm.curUserId,
          year: vm.year,
          quarter: vm.quarter
        }
      })
      .then((response) => {
        let dataObj = response.data
        vm.$store.commit('initworkplan', dataObj)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    // get task achievement
    function getTaskAchievement (vm) {
      // declare echarts
      let echarts = require('echarts')
      // get dom element
      let taskHistogram = document.querySelector('.task .chart')
      // calc height;ratio 4:3
      console.dir(taskHistogram)
      let width = taskHistogram.offsetWidth || taskHistogram.clientWidth || taskHistogram.scrollWidth
      taskHistogram.setAttribute('style', `height:${Math.round(width * 3 / 4)}px;`)
      // declare the histogram instance
      let histogram = echarts.init(taskHistogram)
      // axios get data
      let url = process.env.NODE_ENV === 'production'
                    ? './API/getFinished.php'
                    : 'http://localhost:3000/getfinished'

      vm.$http.get(url, {
        params: {
          comp: '',
          userId: vm.curUserId,
          year: vm.year,
          quarter: vm.quarter
        }
      })
      .then((response) => {
        let data = response.data
        // draw the histogram
        histogram.setOption({
          color: ['#5584B1'],
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}<br>{a}: {c}%'
          },
          xAxis: [{
            type: 'category',
            data: vm.planTypes.map((type) => {
              return vm.$t(type)
            }),
            axisLabel: {
              show: true,
              interval: 0
            }
          }],
          yAxis: [{
            name: '完成比(%)',
            min: 0,
            max: 100,
            type: 'value',
            splitNumber: 5
          }],
          series: [{
            name: '完成比',
            type: 'bar',
            data: vm.planTypes.map((type) => {
              return Math.round(+data[type].finish / +data[type].plan * 100)
            })
          }]
        })
      })
      .catch((error) => {
        console.log(error)
      })
    }

    // axios all
    this.$http.all([getUserWorkplan(this), getTaskAchievement(this)])
    .then(this.$http.spread(function (acct, perms) {
      that.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
      // that.$forceUpdate()
    }))
  },
  methods: {
    configTableHeader (t) {
      return this.planForms[t].map(cur => {
        return `${cur}_p_desc`
      })
    },
    configTableColumns (t) {
      return [].concat('id').concat(this.planForms[t])
    },
    saveData (d) {
      let vm = this
      vm.$store.commit('updateLoadingStatus', {
        isLoading: true
      })

      let url = process.env.NODE_ENV === 'production'
                ? './API/updateWP.php'
                : 'http://localhost:3000/updateworkplan'

      let updData = Object.assign({
        userId: vm.curUserId,
        year: vm.year,
        quarter: vm.quarter
      }, d)

      vm.$http.post(url, updData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((response) => {
        let dataObj = process.env.NODE_ENV === 'production'
                      ? Object.assign({}, response.data)
                      : JSON.parse(response.data)
        vm.$store.commit('initworkplan', dataObj)
      })
      .then(() => {
        vm.$store.commit('updateLoadingStatus', {
          isLoading: false
        })
        vm.isSaved = true
      })
      .catch((error) => {
        console.log(error)
      })
    },
    configBtnAuth () {
      return {
        edit: true,
        add: true,
        del: true,
        download: false,
        redirect: false
      }
    }
  }
}
</script>

<style lang="less">
  .workplan {
    .task {
      margin-left: 10px;
      margin-right: 10px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      .weui-panel__hd {
        color: #000;
        font-size: 16px;
      }
    }
    .table {
      .panel {
        .actions {
          right: 35px;
        }
      }

      .content table thead tr {
        th {
          color: #000;
        }

        th:first-child > div {
          display: none;
        }
      }
    }
  }
</style>
