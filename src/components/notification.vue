<template lang="html">
  <div class="notification">
    <div class="tab-page note">
      <div class="header-panel">{{ $t('notification') }}</div>
      <ul>
        <li v-for="note in notes">
          <router-link
            :to="'/note/'+note.id"
          >
            <div class="left">
              <span class="title">{{ note.title }}</span>
              <span class="datetime">
                {{ dateFormatter(note.date) }}
              </span>
            </div>
            <!-- <div class="right">
              <span class="createdBy">{{ note.createdBy }}</span>
            </div> -->
          </router-link>
        </li>
      </ul>
    </div>
    <div class="tab-page rule">
      <div class="header-panel">{{ $t('rules') }}</div>
        <ul>
          <li v-for="rule in rules">
            <router-link
              :to="'/rule/'+rule.id"
            >
              <div class="left">
                <span class="title">{{ rule.title }}</span>
                <span class="datetime">
                  {{ dateFormatter(rule.date) }}
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
import { XButton } from 'vux'

export default {
  data () {
    return {
      showAdminBtn: false,
      showAdminMenu: false,
      menuRight: 0,
      // tabId: 0,
      rules: [],
      notes: []
    }
  },
  components: {
    XButton
  },
  mounted () {
    this.showAdminBtn = this.$store.state.loginfo.loginfo.userId === 'chenjw'

    window.onresize = () => {
      this.menuRight = (this.$refs.adminBtn.$el.clientWidth - 100) / 2
    }

    document.onclick = (e) => {
      if (this.showAdminMenu && this.$refs.adminMenu !== e.target) {
        this.showAdminMenu = false
      }
    }

    // todo: get rules&notes
    this.rules = [{
      id: '0',
      title: 'abc',
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
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
      createdBy: 'chenjw',
      date: '2017.10.30',
      content: 'adafdfdsfidf;asdf',
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
    }
  }
}
</script>

<style lang="less">
.notification {
  min-height: 100%;
  background-color: #fff;
  padding-bottom: 50px;
  box-sizing: border-box;

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
      padding: 8px 25px;
      border-top: .5px solid rgba(0, 0, 0, 0.2);
      border-left: .5px solid rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #EBEBEB;
      }

      a {
        color: #767676;
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

    .header-panel {
      background: #4079C7;
      height: 40px;
      color: #fff;
      line-height: 2.5;
      font-size: 16px;
      padding-left: 12px;
    }

    ul {
      padding-left: 12px;
      padding-right: 12px;

      li {
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
    }

    &.note {
      li {
        height: 40px;

        .title {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
