<template lang="html">
  <div class="workplan-detail">
    <group-title>{{ mainTitle }}</group-title>
    <!-- <toast
      v-model="isSaved"
      :time="1500"
      type="success"
      position="default"
      :is-show-mask="true"
    >
      {{ $t('save_success') }}
    </toast> -->

    <!-- <card class="task" :header="{ title: $t('task_plan_achievement') }">
      <div class="plan-chart" slot="content"></div>
    </card> -->

    <card class="task" :header="{ title: $t('task_real_achievement') }">
      <div class="real-chart" slot="content"></div>
    </card>

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
  </div>
</template>

<script>
import { PLANTYPES, PLANFORMS } from '@/common/constant'
import DataTable from './data-table'
import { Card, Toast, GroupTitle } from 'vux'

export default {
  components: {
    DataTable,
    Card,
    Toast,
    GroupTitle
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
  computed: {
    mainTitle: function () {
      return `${this.year}${this.$t('year')}${this.quarter}${this.$t('quarter')}`
    }
  },
  created () {
    let date = new Date()
    this.year = date.getFullYear()
    this.quarter = Math.floor(date.getMonth() / 3 + 1)
    this.curUserId = this.$route.params.userId
  },
  mounted () {
    // set current year and quarter
    let that = this
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
        console.log('response', response)
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
      // let taskHistogram1 = document.querySelector('.task .plan-chart')
      let taskHistogram = document.querySelector('.task .real-chart')
      // calc height;ratio 4:3
      // console.dir(taskHistogram)
      let width = taskHistogram.offsetWidth || taskHistogram.clientWidth || taskHistogram.scrollWidth
      width = Math.round(width * 3 / 4)
      taskHistogram.setAttribute('style', `height:${width}px;`)
      // taskHistogram2.setAttribute('style', `height:${width}px;`)
      // declare the histogram instance
      let histogram = echarts.init(taskHistogram)
      // let histogram2 = echarts.init(taskHistogram2)
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
        // console.log('response', response)
        let data = response.data
        let yAxisMax = 10
        let chartData = vm.planTypes.map((type) => {
          yAxisMax = Math.max(yAxisMax, +data[type].finish)
          return data[type].finish
        })
        // console.dir(data)
        // draw the histogram
        // histogram1.setOption({
        //   color: ['#5584B1'],
        //   title: {
        //     show: false
        //   },
        //   tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //       type: 'shadow'
        //     }
        //     // formatter: '{b}<br>{a}: {c}%'
        //   },
        //   xAxis: [{
        //     type: 'category',
        //     data: vm.planTypes.map((type) => {
        //       return vm.$t(type)
        //     }),
        //     axisLabel: {
        //       show: true,
        //       interval: 0
        //     }
        //   }],
        //   yAxis: [{
        //     name: '次数',
        //     type: 'value'
        //   }],
        //   series: [{
        //     name: '次数',
        //     type: 'bar',
        //     data: vm.planTypes.map((type) => {
        //       return data[type].plan
        //     })
        //   }]
        // })

        histogram.setOption({
          color: ['#5584B1'],
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
            // formatter: '{b}<br>{a}: {c}%'
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
            name: '次数',
            type: 'value',
            minInterval: 1,
            max: yAxisMax
          }],
          series: [{
            name: '次数',
            type: 'bar',
            data: chartData
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
      // const loginUserId = this.$store.state.loginfo.loginfo.userId
      // const editAuth = !this.curUserId.localeCompare(loginUserId) || !loginUserId.localeCompare('chenjw')
      const editAuth = false
      return {
        edit: editAuth,
        add: true,
        del: true,
        undo: false,
        save: true,
        download: false,
        redirect: false
      }
    }
  }
}
</script>

<style lang="less">
  .workplan-detail {
    .task {
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      .weui-panel__hd {
        color: #000;
        font-size: 16px;
      }
    }
    .table {
      .panel {
        // justify-content: flex-start;

        .actions {
          right: 35px;
          div {
            margin-left: 15px;
            // a:nth-child(3) {
            //   position: absolute;
            //   right: 15px;
            //   top: 10px;
            // }
          }
        }
      }

      .content table thead tr {
        th {
          color: #000;
          font-size: 15px;
        }

        th:first-child > div {
          display: none;
        }
      }
    }
  }
</style>
