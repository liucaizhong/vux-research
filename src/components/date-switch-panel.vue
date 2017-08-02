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
import { LEFTBTNTEXT, RIGHTTBTNTEXT, DAYMILLISECONDS, WEEKMILLISECONDS } from '@/common/constant'
import { dateFormat } from 'vux'

export default {
  data () {
    return {
      leftBtnTexts: LEFTBTNTEXT,
      rightBtnTexts: RIGHTTBTNTEXT,
      dayMS: DAYMILLISECONDS,
      weekMS: WEEKMILLISECONDS,
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
    this.setCurDate(new Date())
    this.$emit('update:date', this.curDateRange)
  },
  watch: {
    curDateRange: {
      handler: function (n, o) {
        switch (this.type) {
          case 0:
          case 1:
            this.mainTitle = `${dateFormat(n.start, 'YYYY-MM-DD')} - ${dateFormat(n.end, 'YYYY-MM-DD')}`
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
      switch (this.type) {
        case 0:
        case 1:
          this.calPreWeek(this.curDateRange)
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
      switch (this.type) {
        case 0:
        case 1:
          this.calNextWeek(this.curDateRange)
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
    calPreWeek (o) {
      if (this.type === 0) {
        Object.assign(o, {
          start: new Date(o.start.getTime() - this.weekMS),
          end: new Date(o.end.getTime() - this.weekMS)
        })
      } else {
        Object.assign(o, {
          start: new Date(o.start.getTime() - 2 * this.weekMS),
          end: new Date(o.end.getTime() - 2 * this.weekMS)
        })
      }
    },
    calNextWeek (o) {
      if (this.type === 0) {
        Object.assign(o, {
          start: new Date(o.start.getTime() + this.weekMS),
          end: new Date(o.end.getTime() + this.weekMS)
        })
      } else {
        Object.assign(o, {
          start: new Date(o.start.getTime() + 2 * this.weekMS),
          end: new Date(o.end.getTime() + 2 * this.weekMS)
        })
      }
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
    setCurDate (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let q = (m - 1) / 3 + 1
      let day = date.getDay() || 7
      let startWeek = new Date(date.getTime() - (day - 1) * this.dayMS)
      let endWeek = new Date(date.getTime() + (7 - day) * this.dayMS)
      let { startDbWeek, endDbWeek } = this.calDbWeek(date)
      switch (this.type) {
        case 0:
          this.curDateRange = Object.assign({}, {
            start: startWeek,
            end: endWeek
          })
          break
        case 1:
          this.curDateRange = Object.assign({}, {
            start: startDbWeek,
            end: endDbWeek
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
    },
    calDbWeek (d) {
      let year = d.getFullYear()
      let month = d.getMonth()
      let date = d.getDate()
      let day = d.getDay() || 7
      let fisrtDateOfYear = new Date(year, 0, 1)
      let dayOfFirstDate = fisrtDateOfYear.getDay() || 7
      let realFirstDate = new Date(fisrtDateOfYear.getTime() - dayOfFirstDate * this.dayMS)
      let dateGap = (new Date(year, month, date)) - realFirstDate
      let oddOrEvenWeek = dateGap / (2 * this.weekMS)
      oddOrEvenWeek = (oddOrEvenWeek - Math.floor(oddOrEvenWeek)) * 2 > 1
      if (oddOrEvenWeek) {
        return {
          startDbWeek: new Date(d.getTime() - (day - 1) * this.dayMS),
          endDbWeek: new Date(d.getTime() + (14 - day) * this.dayMS)
        }
      } else {
        return {
          startDbWeek: new Date(d.getTime() - (7 + day - 1) * this.dayMS),
          endDbWeek: new Date(d.getTime() + (7 - day) * this.dayMS)
        }
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
