<template lang="html">
  <div class="date-switch-panel">
    <div class="left-btn">
      <a href="javascript:void(0)" @click="onLeft">
        <i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
        {{ $t(leftBtnText) }}
      </a>
    </div>
    <div class="main-title">
      <span>{{ mainTitle }}</span>
    </div>
    <div class="right-btn">
      <a href="javascript:void(0)" @click="onRight">
        {{ $t(rightBtnText) }}
        <i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</template>

<script>
// type: 0:weekly，1:double weekly，2:monthly，3:quarterly
import { LEFTBTNTEXT, RIGHTTBTNTEXT, DAYMILLISECONDS } from '@/common/constant'
// import tools from '@/common/tools'
import { dateFormat } from 'vux'

export default {
  data () {
    return {
      leftBtnTexts: LEFTBTNTEXT,
      rightBtnTexts: RIGHTTBTNTEXT,
      dayMS: DAYMILLISECONDS,
      curDateRange: {},
      mainTitle: ''
    }
  },
  computed: {
    leftBtnText: function () {
      return this.leftBtnTexts[this.type]
    },
    rightBtnText: function () {
      return this.rightBtnTexts[this.type]
    }
  },
  created () {
    this.onSetCurDate(new Date())
    this.$emit('update:date', this.curDateRange)
  },
  watch: {
    curDateRange: {
      handler: function (n, o) {
        switch (this.type) {
          case 0:
          case 1:
            this.mainTitle = `${n.start} - ${n.end}`
            break
          case 2:
            this.mainTitle = `${n.year}${this.$t('year')}${n.month}${this.$t('month')}`
            break
          case 3:
            this.mainTitle = `${n.year}${this.$t('year')}${n.quarter}${this.$t('quarter')}`
            break
        }
      },
      deep: true
    }
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    date: {
      type: Object,
      required: true
    }
  },
  methods: {
    onLeft () {
      let date = this.curDateRange.date
      let preDate = null
      switch (this.type) {
        case 0:
          preDate = new Date(date.getTime() - 7 * this.dayMS)
          this.onSetCurDate(preDate)
          break
        case 1:
          preDate = new Date(date.getTime() - 14 * this.dayMS)
          this.onSetCurDate(preDate)
          break
        case 2:
          this.calPreMonth(this.curDateRange)
          break
        case 3:
          this.calPreQuarter(this.curDateRange)
          break
      }
      this.$emit('update:date', this.curDateRange)
    },
    onRight () {
      let date = this.curDateRange.date
      let nextDate = null
      switch (this.type) {
        case 0:
          nextDate = new Date(date.getTime() + 7 * this.dayMS)
          this.onSetCurDate(nextDate)
          break
        case 1:
          nextDate = new Date(date.getTime() + 14 * this.dayMS)
          this.onSetCurDate(nextDate)
          break
        case 2:
          this.calNextMonth(this.curDateRange)
          break
        case 3:
          this.calNextQuarter(this.curDateRange)
          break
      }
      this.$emit('update:date', this.curDateRange)
    },
    calPreMonth (o) {
      let y = o.year
      let m = o.month
      if (--m === 0) {
        m = 12
        y--
      }
      Object.assign(o, {
        year: y,
        month: m
      })
    },
    calPreQuarter (o) {
      let y = o.year
      let q = o.quarter
      if (--q === 0) {
        q = 4
        y--
      }
      Object.assign(o, {
        year: y,
        quarter: q
      })
    },
    calNextMonth (o) {
      let y = o.year
      let m = o.month
      if (++m === 13) {
        m = 1
        y++
      }
      Object.assign(o, {
        year: y,
        month: m
      })
    },
    calNextQuarter (o) {
      let y = o.year
      let q = o.quarter
      if (++q === 5) {
        q = 1
        y++
      }
      Object.assign(o, {
        year: y,
        quarter: q
      })
    },
    onSetCurDate (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let q = (m - 1) / 3 + 1
      // let d = date.getDate()
      let day = date.getDay()
      let startWeek = new Date(date.getTime() - (day - 1) * this.dayMS)
      let startDbWeek = new Date(date.getTime() - (day + 6) * this.dayMS)
      let endWeek = new Date(date.getTime() + (7 - day) * this.dayMS)
      switch (this.type) {
        case 0:
          this.curDateRange = Object.assign({}, {
            // start: tools.dateFormat(startWeek, '-'),
            // end: tools.dateFormat(endWeek, '-'),
            start: dateFormat(startWeek, 'YYYY-MM-DD'),
            end: dateFormat(endWeek, 'YYYY-MM-DD'),
            date: date
          })
          break
        case 1:
          this.curDateRange = Object.assign({}, {
            // start: tools.dateFormat(startDbWeek, '-'),
            // end: tools.dateFormat(endWeek, '-'),
            start: dateFormat(startDbWeek, 'YYYY-MM-DD'),
            end: dateFormat(endWeek, 'YYYY-MM-DD'),
            date: date
          })
          break
        case 2:
          this.curDateRange = Object.assign({}, {
            year: y,
            month: m
          })
          break
        case 3:
          this.curDateRange = Object.assign({}, {
            year: y,
            quarter: q
          })
          break
      }
    }
  }
}
</script>

<style lang="less">
.date-switch-panel {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 5px 10px;
  font-size: 16px;
  background-color: #fff;
  // margin: 5px 10px;
  box-sizing: border-box;
  border: .3px solid #DCD9D6;
  box-shadow: 0 1px 2px rgba(0,0,0,.3);
  width: 100%;

  .main-title {
    font-weight: 300;
    font-size: 14px;
    line-height: 2;
  }

  a {
    color: #999999;
    padding-left: 5px;
    padding-right: 5px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    font-size: 14px;
  }

  a:hover {
    color: #DCD9D6;
    cursor: pointer;
  }
}
</style>
