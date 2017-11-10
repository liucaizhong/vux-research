<template lang="html">
  <div class="notification">
    <div ref="notePage" class="tab-page note">
      <div class="header-panel">{{ $t('notification') }}</div>
      <swiper
        auto
        loop
        :show-dots="true"
        class="swiper"
        :height="swiperHeight + 'px'"
        :interval="3000"
      >
        <swiper-item
          class="list-item"
          v-for="(note, index) in notes"
          :key="index"
        >
          <router-link
            :to="'/note/'+note.id"
          >
            <div class="left">
              <span class="title">{{ decorate(note.content) }}</span>
              <span class="datetime">
                {{ note.createdBy + ' ' + dateFormatter(note.date) }}
              </span>
            </div>
          </router-link>
        </swiper-item>
      </swiper>
      <!-- <ul>
        <li class="list-item" v-for="note in notes">
          <router-link
            :to="'/note/'+note.id"
          >
            <div class="left">
              <span class="title">{{ note.title }}</span>
              <span class="datetime">
                {{ dateFormatter(note.date) }}
              </span>
            </div>
            <div class="right">
              <span class="createdBy">{{ note.createdBy }}</span>
            </div>
          </router-link>
        </li>
      </ul> -->
    </div>
    <div ref="rulePage" class="tab-page rule">
      <div class="header-panel">{{ $t('rules') }}</div>
        <ul :style="{ height: ruleUlHeight + 'px'}">
          <li class="list-item" v-for="(rule, index) in rules" :key="index">
            <router-link
              :to="'/rule/'+rule.id"
            >
              <div class="left">
                <span class="title">{{ rule.title }}</span>
                <span class="datetime">
                  {{ rule.createdBy + ' ' + dateFormatter(rule.date) }}
                </span>
              </div>
              <!-- <div class="right">
                <span class="createdBy">{{ rule.createdBy }}</span>
              </div> -->
            </router-link>
          </li>
        </ul>
    </div>
    <div class="toolbar" v-if="showAdminBtn">
      <!-- <x-button
        type="default"
        @click.native="onClickRuleBtn"
      >{{ $t('rules') }}</x-button>
      <x-button
        type="default"
        @click.native="onClickNoteBtn"
      >{{ $t('notification') }}</x-button> -->
      <x-button
        ref="adminBtn"
        type="default"
        @click.native.stop="onClickAdminBtn"
      >
        <i class="fa fa-bars" aria-hidden="true"></i>
        &nbsp; {{ $t('admin') }}
      </x-button>
    </div>
    <div
      class="admin-menu"
      ref="adminMenu"
      v-show="showAdminMenu"
      :style="{ right: menuRight + 'px'}"
    >
      <div>
        <router-link to="/releasenote">{{ $t('release_note') }}</router-link>
      </div>
      <div>
        <router-link to="/releaserule">{{ $t('upload_rule') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Swiper, SwiperItem } from 'vux'

export default {
  data () {
    return {
      showAdminBtn: false,
      showAdminMenu: false,
      menuRight: 0,
      ruleUlHeight: 0,
      // tabId: 0,
      rules: [],
      notes: [],
      swiperHeight: 0
    }
  },
  components: {
    XButton,
    Swiper,
    SwiperItem
  },
  mounted () {
    this.showAdminBtn = this.$store.state.loginfo.loginfo.userId === 'chenjw'
    // console.log('this.$refs.notePage.$el', this.$refs.notePage.clientHeight)
    this.swiperHeight = this.$refs.notePage.clientHeight - 40
    this.ruleUlHeight = this.$refs.rulePage.clientHeight - 40

    window.onresize = () => {
      this.menuRight = (this.$refs.adminBtn.$el.clientWidth - 100) / 2
      this.swiperHeight = this.$refs.notePage.clientHeight - 40
      this.ruleUlHeight = this.$refs.rulePage.clientHeight - 40
    }

    document.onclick = (e) => {
      // console.log('this.$refs.adminMenu', this.$refs.adminMenu)
      // console.log('e.target', e.target)
      if (this.showAdminMenu && this.$refs.adminMenu !== e.target) {
        this.showAdminMenu = false
      }
    }

    // todo: get rules&notes
    this.rules = [{
      id: '0',
      title: 'abc',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adafidf;asdf',
      files: [{
        name: 'dafdfsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '1',
      title: 'abc1',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adadfsdffidf;asdf',
      files: [{
        name: 'dfdf.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '2',
      title: 'abc2',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adafdfdsfidf;asdf',
      files: [{
        name: 'dafdferewrsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '0',
      title: 'abc',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adafidf;asdf',
      files: [{
        name: 'dafdfsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '1',
      title: 'abc1',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adadfsdffidf;asdf',
      files: [{
        name: 'dfdf.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '2',
      title: 'abc2',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adafdfdsfidf;asdf',
      files: [{
        name: 'dafdferewrsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '1',
      title: 'abc1',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adadfsdffidf;asdf',
      files: [{
        name: 'dfdf.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '2',
      title: 'abc2',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: 'adafdfdsfidf;asdf',
      files: [{
        name: 'dafdferewrsd.pdf',
        url: 'www.baidu.com'
      }]
    }]
    this.notes = [{
      id: '0',
      title: 'abc',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dafdfsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '1',
      title: 'abc1',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dfdf.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '2',
      title: 'abc2',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dafdferewrsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '0',
      title: 'abc',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dafdfsd.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '1',
      title: 'abc1',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dfdf.pdf',
        url: 'www.baidu.com'
      }]
    },
    {
      id: '2',
      title: 'abc2',
      createdBy: '陈婧玮',
      date: '2017.10.30',
      content: '通知：为大家购买11.11团建活动的礼物-IphX,请大家把自己喜欢的颜色（银色、深空灰色）速报到李敬华处，否则统一默认为深空灰色！另外本次团建欲带家属的，请于今日下班前告知，以便安排住宿！',
      files: [{
        name: 'dafdferewrsd.pdf',
        url: 'www.baidu.com'
      }]
    }]

    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  methods: {
    onClickAdminBtn () {
      // console.log('click admin btn')
      this.menuRight = (this.$refs.adminBtn.$el.clientWidth - 100) / 2
      this.showAdminMenu = !this.showAdminMenu
    },
    onClickRuleBtn () {
      // console.log('click rule btn')
      this.tabId = 0
    },
    onClickNoteBtn () {
      // console.log('click note btn')
      this.tabId = 1
    },
    // onClickRuleLi (rule) {
    //   this.$store.commit('setCurRuleInfo', rule)
    // },
    dateFormatter (date) {
      const dateArr = date.split('.')
      return `${this.$t('release_at')}  ${dateArr[0]}${this.$t('year')}` +
        `${dateArr[1]}${this.$t('month')}${dateArr[2]}${this.$t('day')}`
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
      const len = 210
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
.notification {
  height: 100%;
  background-color: #fff;
  // padding-bottom: 50px;
  box-sizing: border-box;
  // overflow-y: hidden;

  .toolbar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    height: 50px;

    .weui-btn + .weui-btn {
      margin-top: 0;
    }

    button {
      font-size: 12px;
      color: #767676;
      padding: 10px 0;
      border-radius: 0;

      &.weui-btn {
        &::after {
          border-radius: 0;
          border: 0.5px solid rgba(0, 0, 0, 0.2);
          border-left-width: .3px;
          // border-right-width: .3px;
        }

        &:hover {
          background-color: #EBEBEB;
        }
      }
    }
  }

  .admin-menu {
    background: #fff;
    // border: .5px solid rgba(0, 0, 0, 0.2);
    // box-shadow: 1px 1px 2px #888888;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    position: fixed;
    width: 100px;
    bottom: 53px;
    text-align: center;
    font-size: 12px;
    border-right: .5px solid rgba(0, 0, 0, 0.2);
    border-bottom: .5px solid rgba(0, 0, 0, 0.2);

    div {
      // padding: 8px 25px;
      position: relative;
      height: 35.5px;
      border-top: .5px solid rgba(0, 0, 0, 0.2);
      border-left: .5px solid rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #EBEBEB;
      }

      a {
        color: #767676;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        line-height: 3;
      }
    }
  }

  .tab-page {
    width: 100%;
    // padding-left: 12px;
    // padding-right: 12px;
    // margin-top: 5px;
    // margin-bottom: 50px;
    box-sizing: border-box;

    .swiper {
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 0 12px;

      .vux-indicator.vux-indicator-right {
        i.vux-icon-dot.active {
          background-color: #4079C7 !important;
        }
      }
    }

    .header-panel {
      background: #4079C7;
      height: 40px;
      color: #fff;
      line-height: 2.5;
      font-size: 16px;
      padding-left: 12px;
    }

    .list-item {
      position: relative;
      height: 50px;
      padding-top: 5px;
      padding-bottom: 2px;
      border-bottom: .5px solid rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #EBEBEB;
      }

      a {
        color: #767676;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        top: 0;
        justify-content: space-between;

        div {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .title {
          font-size: 20px;
          // line-height: 2;
        }

        .datetime {
          font-size: 12px;
          // line-height: 4;
        }

        .createdBy {
          font-size: 14px;
          line-height: 4;
        }
      }
    }

    ul {
      padding-left: 12px;
      padding-right: 12px;
    }

    &.note {
      height: 35%;

      * {
        box-sizing: border-box;
      }

      .list-item {
        height: 100%;
        border-bottom: none;

        a {
          padding: 10px 0;


          .left {
            height: 100%;
            justify-content: space-between;

            .title {
              font-size: 16px;
            }
          }
        }
      }
    }

    &.rule {
      // margin-bottom: 5px;
      height: 65%;

      ul {
        box-sizing: border-box;
        overflow-y: scroll;
        padding-bottom: 55px;
      }
    }
  }
}
</style>
