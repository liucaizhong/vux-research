<template lang="html">
  <div class="schedule">
    <div class="header-bar">
      <div class="left-content">
      </div>
      <div class="center-content">
        <span class="main-title">{{ formatMonth(startDate.month()) }}</span>
      </div>
      <div class="right-content">
        <div class="btn">
          <a class="add-btn" role="button" href="javascript:void;">
            <x-icon type="plus" size="25"></x-icon>
          </a>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="left">
        <div class="b1">
        </div>
        <div class="b3">
        </div>
        <div class="b5">
        </div>
      </div>
      <div class="right">
        <div class="b2">
          <div class="b2-part" :style="{
              color: isToday(daysData[0]) ? '#209CE2' : 'inherit'
            }"
          >
            {{ formatDayTitle(daysData[0]) }}
          </div>
          <div class="b2-part">
            {{ formatDayTitle(daysData[1]) }}
          </div>
          <div class="b2-part">
            {{ formatDayTitle(daysData[2]) }}
          </div>
        </div>
        <div class="b4">
        </div>
        <div class="b6">
          <div class="b6-back">
          </div>
          <div class="b6-front">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { MONTH, DAY } from '../common/constant.js'

export default {
  data () {
    return {
      today: null,
      startDate: null,
      daysData: []
    }
  },
  created () {
    this.today = moment()
    this.startDate = moment()
    // todo:get data
    this.daysData = [{
      date: '20171103'
    }, {
      date: '20171104'
    }, {
      date: '20171105'
    }]
  },
  mounted () {
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  methods: {
    isToday (data) {
      console.log('this.today')
      return this.today.isSame(moment(data.date, 'YYYYMMDD'))
    },
    formatMonth (m) {
      return this.$t(MONTH[m])
    },
    formatDayTitle (data) {
      let datetime = moment(data.date, 'YYYYMMDD')
      let date = datetime.date()
      let day = datetime.day()
      return date + ' ' + this.$t('week2') + this.$t(DAY[day])
    }
  }
}
</script>

<style lang="less">
.schedule {
  background-color: #fff;

  * {
    box-sizing: border-box;
  }

  .header-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 5px;
    text-align: center;
    width: 100%;
    height: 40px;

    .left-content {
      height: 100%;
      width: 33%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .center-content {
      height: 100%;
      width: 34%;

      span {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #209CE2;
        font-weight: 600;
      }
    }

    .right-content {
      height: 100%;
      width: 33%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .btn {
      position: relative;
      height: 100%;
      width: 30px;

      a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 2.5px;

        .vux-x-icon {
          fill: #C4C4C4;
        }
      }
    }
  }

  .main {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .left {
      width: 60px;

      > div {
        width: 100%;
      }

      .b1 {
        height: 25px;
        border-bottom: .5px solid rgba(0, 0, 0, 0.2);
      }
    }

    .right {
      flex-grow: 1;

      .b2 {
        height: 25px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        font-size: 12px;
        color: #868686;

        .b2-part {
          flex-grow: 1;
          text-align: center;
          border-bottom: .5px solid rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}
</style>
