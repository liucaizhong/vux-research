<template lang="html">
  <div class="sales-strategy">
    <div class="top-tab">
      <!-- <sticky scroll-box="vux_view_box_body" :offset="46" :check-sticky-support="false"> -->
        <tab>
          <tab-item selected @on-item-click="onTableClick">{{ $t('s1') }}</tab-item>
          <tab-item @on-item-click="onTableClick">{{ $t('s2') }}</tab-item>
        </tab>
      <!-- </sticky> -->
    </div>

    <div v-show="tableNo == 0">
      <date-switch-panel :date.sync="dbWeekRange" :type="1"></date-switch-panel>
      <data-table
        :tableId="`${sTypes[0]}Table`"
        :tableTitle="sTypes[0]"
        :columns="configTableColumns(sTypes[0])"
        :headerTitle="configTableHeader(sTypes[0])"
        storeName="salestrategy"
        rowId="id"
        @save="saveData"
        :btnAuth="configBtnAuth()"
        @add="addData"
        :customAdd="true"
      >
        <template slot="salesPerson" scope="props">
          <input
            type="text"
            :value="props.value"
            :data-idx="props.idx"
            readonly="true"
            :data-fieldname="props.fieldname"
          >
        </template>
        <template slot="riskPrefer" scope="props">
          <select
            :value="props.value"
            :data-idx="props.idx"
            :disabled="props.readonly"
            @change="props.changeEvent"
            :data-fieldname="props.fieldname"
          >
            <option disabled value="">请选择</option>
            <option v-for="(val, i) in level" :value="i">{{ $t(`${val}_s_desc`) }}</option>
          </select>
        </template>
        <template slot="trading1" scope="props">
          <div>
            <select
              :value="props.value"
              :data-idx="props.idx"
              :disabled="props.readonly"
              @change="props.changeEvent"
              :data-fieldname="props.fieldname"
            >
              <option disabled value="">请选择</option>
              <option v-for="(val, i) in range" :value="i">{{ val }}</option>
            </select>&nbsp;-
          </div>
        </template>
        <template slot="trading2" scope="props">
            <select
              :value="props.value"
              :data-idx="props.idx"
              :disabled="props.readonly"
              @change="props.changeEvent"
              :data-fieldname="props.fieldname"
            >
              <option disabled value="">请选择</option>
              <option v-for="(val, i) in range" :value="i">{{ val }}</option>
            </select>
        </template>
        <template slot="prefered" scope="props">
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
        </template>
        <template slot="notPrefered" scope="props">
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
        </template>
        <template slot="recognition" scope="props">
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
        </template>
      </data-table>
    </div>

    <div v-show="tableNo == 1">
      <date-switch-panel :date.sync="quarterRange" :type="3"></date-switch-panel>
      <data-table
        :tableId="`${sTypes[1]}Table`"
        :tableTitle="sTypes[1]"
        :columns="configTableColumns(sTypes[1])"
        :headerTitle="configTableHeader(sTypes[1])"
        storeName="salestrategy"
        rowId="id"
        @save="saveData"
        :btnAuth="configBtnAuth()"
        @add="addData"
        :customAdd="true"
      >
        <template slot="salesPerson" scope="props">
          <input
            type="text"
            :value="props.value"
            :data-idx="props.idx"
            readonly="true"
            :data-fieldname="props.fieldname"
          >
        </template>
        <template slot="industry" scope="props">
          <select
            :value="props.value"
            :data-idx="props.idx"
            :disabled="props.readonly"
            @change="props.changeEvent"
            :data-fieldname="props.fieldname"
          >
            <option disabled value="">请选择</option>
            <option v-for="(val, i) in industry" :value="i">{{ $t(val) }}</option>
          </select>
        </template>
        <template slot="oppotunity" scope="props">
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
        </template>
        <template slot="subindusInterest" scope="props">
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
        </template>
        <template slot="reason2" scope="props">
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
        </template>
        <template slot="stockInterest" scope="props">
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
        </template>
        <template slot="requirement" scope="props">
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
        </template>
      </data-table>
    </div>

    <toast
      v-model="isSaved"
      :time="1500"
      type="success"
      position="default"
      :is-show-mask="true"
    >
      {{ $t('save_success') }}
    </toast>

    <div v-transfer-dom>
      <popup class="add-popup" v-model="showAddCSPopup" position="bottom" height="100%">
        <group :title="$t('add_feedback_strategy')">
          <x-input
            v-model="addCS.salesPerson"
            :title="$t('salesPerson_s_desc')"
            :disabled="true"
            text-align="right"
          >
          </x-input>
          <popup-picker
            v-model="addCS.riskPrefer"
            :title="$t('riskPrefer_s_desc')"
            :data="levelList"
            :cancel-text="$t('nav_cancel_text')"
            :confirm-text="$t('nav_confirm_text')"
            show-name
          >
          </popup-picker>
          <popup-picker
            v-model="addCS.trading"
            :title="$t('trading1_s_desc')"
            :data="tradingList"
            :cancel-text="$t('nav_cancel_text')"
            :confirm-text="$t('nav_confirm_text')"
            :display-format="tradingRangeFormatter"
            show-name
          >
          </popup-picker>
          <x-textarea
            :placeholder="$t('prefered_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCS.prefered"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('notPrefered_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCS.notPrefered"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('recognition_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCS.recognition"
            autosize
          >
          </x-textarea>
          <x-button type="primary" @click.native="comfirmAdd(sTypes[0])">{{ $t('nav_confirm_text') }}</x-button>
          <x-button type="warn" @click.native="cancelAdd(sTypes[0])">{{ $t('nav_cancel_text') }}</x-button>
        </group>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup class="add-popup" v-model="showAddCRPopup" position="bottom" height="100%">
        <group :title="$t('add_feedback_research')">
          <x-input
            v-model="addCR.salesPerson"
            :title="$t('salesPerson_s_desc')"
            :disabled="true"
            text-align="right"
          >
          </x-input>
          <popup-picker
            v-model="addCR.industry"
            :title="$t('industry_s_desc')"
            :data="industryList"
            :cancel-text="$t('nav_cancel_text')"
            :confirm-text="$t('nav_confirm_text')"
            show-name
          >
          </popup-picker>
          <x-textarea
            :placeholder="$t('oppotunity_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCR.oppotunity"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('subindusInterest_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCR.subindusInterest"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('reason2_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCR.reason2"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('stockInterest_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCR.stockInterest"
            autosize
          >
          </x-textarea>
          <x-textarea
            :placeholder="$t('requirement_s_desc')"
            :rows="3"
            :max="66"
            v-model="addCR.requirement"
            autosize
          >
          </x-textarea>
          <x-button type="primary" @click.native="comfirmAdd(sTypes[1])">{{ $t('nav_confirm_text') }}</x-button>
          <x-button type="warn" @click.native="cancelAdd(sTypes[1])">{{ $t('nav_cancel_text') }}</x-button>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { SALESTRATEGYTYPES, SALESTRATEGYFORMS,
  TRADINGRANGE, RISKLEVEL, INDUSTRY } from '@/common/constant'
import DataTable from './data-table'
import DateSwitchPanel from './date-switch-panel'
import { Toast, Tab, TabItem, Swiper, SwiperItem, TransferDomDirective as TransferDom, Popup, Group, XInput, PopupPicker, XButton, XTextarea } from 'vux'
import tools from '@/common/tools'

export default {
  data () {
    return {
      sTypes: SALESTRATEGYTYPES,
      sForms: SALESTRATEGYFORMS,
      range: TRADINGRANGE,
      level: RISKLEVEL,
      industry: INDUSTRY,
      isSaved: false,
      tableNo: 0,
      dbWeekRange: {},
      quarterRange: {},
      showAddCSPopup: false,
      showAddCRPopup: false,
      addCS: {
        id: '',
        salesPerson: '',
        riskPrefer: [],
        trading: [],
        prefered: '',
        notPrefered: '',
        recognition: ''
      },
      defaultAddCS: {
        id: '',
        salesPerson: '',
        riskPrefer: [],
        trading: [],
        prefered: '',
        notPrefered: '',
        recognition: ''
      },
      addCR: {
        id: '',
        salesPerson: '',
        industry: [],
        oppotunity: '',
        subindusInterest: '',
        reason2: '',
        stockInterest: '',
        requirement: ''
      },
      defaultAddCR: {
        id: '',
        salesPerson: '',
        industry: [],
        oppotunity: '',
        subindusInterest: '',
        reason2: '',
        stockInterest: '',
        requirement: ''
      }
    }
  },
  directives: {
    TransferDom
  },
  computed: {
    userInfo: function () {
      return this.$store.state.loginfo.loginfo
    },
    levelList: function () {
      let list = []
      let vm = this
      list.push(vm.level.map((cur, i) => {
        return {
          name: vm.$t(`${cur}_s_desc`),
          value: i
        }
      }))
      return list
    },
    industryList: function () {
      let list = []
      let vm = this
      list.push(vm.industry.map((cur, i) => {
        return {
          name: vm.$t(cur),
          value: i
        }
      }))
      return list
    },
    tradingList: function () {
      let list = []
      let temp = this.range.map((cur, i) => {
        return {
          name: cur,
          value: i
        }
      })
      list.push(temp)
      list.push(temp)
      return list
    }
  },
  components: {
    DataTable,
    Toast,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    // Sticky,
    DateSwitchPanel,
    Popup,
    Group,
    XInput,
    PopupPicker,
    XButton,
    XTextarea
  },
  // watch: {
  //   dbWeekRange: {
  //     handler: function (n, o) {
  //       console.dir(n)
  //     },
  //     deep: true
  //   },
  //   quarterRange: {
  //     handler: function (n, o) {
  //       console.dir(n)
  //     },
  //     deep: true
  //   }
  // },
  mounted () {
    // set table height
    let contentH = window.innerHeight
    Array.prototype.forEach.call(document.querySelectorAll('.table .content'), cur => {
      cur.style.maxHeight = contentH - 200 + 'px'
    })
    // get feedback of strategy
    function getCS (vm) {
      let url = process.env.NODE_ENV === 'production'
                ? './API/getCS.php'
                : 'http://localhost:3000/getcs'

      vm.$http.get(url, {
        params: {
          start: vm.dbWeekRange.start,
          end: vm.dbWeekRange.end,
          userId: vm.userInfo.userId
        }
      })
      .then((response) => {
        let dataObj = Object.assign({}, response.data)

        if (!tools.isEmptyObject(dataObj) || !dataObj) {
          vm.$store.commit('initsalestrategy', dataObj)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
    // get feedback of research
    function getCR (vm) {
      let url = process.env.NODE_ENV === 'production'
                ? './API/getCR.php'
                : 'http://localhost:3000/getcr'

      vm.$http.get(url, {
        params: {
          year: vm.quarterRange.year,
          quarter: vm.quarterRange.quarter,
          userId: vm.userInfo.userId
        }
      })
      .then((response) => {
        // console.dir(response)
        let dataObj = Object.assign({}, response.data)
        if (!tools.isEmptyObject(dataObj) || !dataObj) {
          vm.$store.commit('initsalestrategy', dataObj)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
    // axios all
    let that = this
    this.$http.all([getCS(this), getCR(this)])
    .then(this.$http.spread(function (acct, perms) {
      that.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
      that.$forceUpdate()
    }))
    // set userName
    this.addCS.salesPerson = this.userInfo.userName
    this.defaultAddCS.salesPerson = this.userInfo.userName
    this.addCR.salesPerson = this.userInfo.userName
    this.defaultAddCR.salesPerson = this.userInfo.userName
  },
  methods: {
    comfirmAdd (t) {
      let vm = this
      if (!t.localeCompare('s1')) {
        let data = {
          id: '',
          salesPerson: vm.addCS.salesPerson,
          riskPrefer: vm.addCS.riskPrefer[0],
          trading1: vm.addCS.trading[0].value || vm.addCS.trading[0],
          trading2: vm.addCS.trading[1].value || vm.addCS.trading[1],
          prefered: vm.addCS.prefered,
          notPrefered: vm.addCS.notPrefered,
          recognition: vm.addCS.recognition
        }
        vm.$store.commit(`insertsalestrategy`, {
          data: data,
          type: t
        })
        vm.showAddCSPopup = false
        Object.assign(vm.addCS, vm.defaultAddCS)
      } else {
        let data = {
          id: '',
          salesPerson: vm.addCR.salesPerson,
          industry: vm.addCR.industry[0],
          oppotunity: vm.addCR.oppotunity,
          subindusInterest: vm.addCR.subindusInterest,
          reason2: vm.addCR.reason2,
          stockInterest: vm.addCR.stockInterest,
          requirement: vm.addCR.requirement
        }
        vm.$store.commit(`insertsalestrategy`, {
          data: data,
          type: t
        })
        vm.showAddCRPopup = false
        Object.assign(vm.addCR, vm.defaultAddCR)
      }
    },
    cancelAdd (t) {
      if (!t.localeCompare('s1')) {
        this.showAddCSPopup = false
        Object.assign(this.addCS, this.defaultAddCS)
      } else {
        this.showAddCRPopup = false
        Object.assign(this.addCR, this.defaultAddCR)
      }
    },
    tradingRangeFormatter (v) {
      return v.map(cur => {
        return cur.name || this.range[cur]
      }).join('-')
    },
    onTableClick (i) {
      this.tableNo = i
    },
    addData (t) {
      if (!t.localeCompare('s1')) {
        this.showAddCSPopup = true
      } else {
        this.showAddCRPopup = true
      }
    },
    saveData (d) {
      this.$store.commit('updateLoadingStatus', {
        isLoading: true
      })

      if (d.hasOwnProperty('s1')) {
        let updObj = {
          start: this.dbWeekRange.start,
          end: this.dbWeekRange.end,
          userId: this.userInfo.userId,
          data: d['s1']
        }
        console.dir(updObj)
        let url = process.env.NODE_ENV === 'production'
                  ? './API/updateCS.php'
                  : 'http://localhost:3000/updatecs'
        this.$http.post(url, updObj, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((response) => {
          console.dir(response)
          let dataObj = process.env.NODE_ENV === 'production'
                        ? Object.assign({}, response.data)
                        : JSON.parse(response.data)
          if (!tools.isEmptyObject(dataObj) || !dataObj) {
            this.$store.commit('initsalestrategy', dataObj)
          }
        })
        .then(() => {
          this.$store.commit('updateLoadingStatus', {
            isLoading: false
          })
          this.isSaved = true
          this.$forceUpdate()
        })
        .catch((error) => {
          console.log(error)
        })
      } else {
        let updObj = {
          year: this.quarterRange.year,
          quarter: this.quarterRange.quarter,
          userId: this.userInfo.userId,
          data: d['s2']
        }
        console.dir(updObj)
        let url = process.env.NODE_ENV === 'production'
                  ? './API/updateCR.php'
                  : 'http://localhost:3000/updatecr'
        this.$http.post(url, updObj, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((response) => {
          console.dir(response)
          let dataObj = process.env.NODE_ENV === 'production'
                        ? Object.assign({}, response.data)
                        : JSON.parse(response.data)
          if (!tools.isEmptyObject(dataObj) || !dataObj) {
            this.$store.commit('initsalestrategy', dataObj)
          }
        })
        .then(() => {
          this.$store.commit('updateLoadingStatus', {
            isLoading: false
          })
          this.isSaved = true
          this.$forceUpdate()
        })
        .catch((error) => {
          console.log(error)
        })
      }
    },
    configTableHeader (t) {
      return this.sForms[t].map(cur => {
        if (cur.name) {
          return `${cur.name}_s_desc`
        } else {
          return `${cur}_s_desc`
        }
      })
    },
    configTableColumns (t) {
      return [].concat('id').concat(this.sForms[t])
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
.add-popup.vux-popup-dialog {
  overflow-y: auto;
}
.sales-strategy {
  .top-tab {
    height:44px;
    width: 100%;
    position: fixed;
    z-index: 500;
    top: 46px;
  }

  .date-switch-panel {
    position: fixed;
    top: 90px;
    left: 0;
    z-index: 500;
  }

  .table {
    transition: all .8s cubic-bezier(.55, 0, .1, 1);
    margin-top: 95px;

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
  }

  #s1Table {
    // .panel {
    //   min-width: 1010px !important;
    // }
    tr {
      th:nth-child(2) {
        min-width: 60px;
      }

      th:nth-child(3) {
        min-width: 60px;
      }

      th:nth-child(4) {
        min-width: 80px;
      }

      th:nth-child(5) {
        padding-left: 0;
        min-width: 80px;
      }

      th:nth-child(6) {
        min-width: 150px;
      }

      th:nth-child(7) {
        min-width: 150px;
      }

      th:nth-child(8) {
        min-width: 300px;
      }
    }
  }

  #s2Table {
    // .panel {
    //   min-width: 1230px !important;
    // }
    tr {
      th:nth-child(2) {
        min-width: 60px;
      }

      th:nth-child(3) {
        min-width: 50px;
      }

      th:nth-child(4) {
        min-width: 150px;
      }

      th:nth-child(5) {
        min-width: 150px;
      }

      th:nth-child(6) {
        min-width: 300px;
      }

      th:nth-child(7) {
        min-width: 150px;
      }

      th:nth-child(8) {
        min-width: 150px;
      }
    }
  }
}
</style>
