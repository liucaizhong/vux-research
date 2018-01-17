<!-- interface -->
<!--
:tableId="`${t}Table`"
:tableTitle="t"
:columns="configTableColumns(t)"
:headerTitle="configTableHeader(t)"
storeName="workplan"
rowId="id"
@save="saveData"
@download="downloadData"
:btnAuth="btnAuth"
@redirect="redirect"
-->
<template lang="html">
  <div class="table" :id="tableId">
    <div class="panel">
      <div class="title">
        <span>{{ $t(tableTitle) }}</span>
        <span v-show="!tableData.length">{{ '（' + $t('to_add_later') + '）'}}</span>
      </div>
      <div class="actions">
        <div v-show="isEditing">
          <a v-if="btnAuth.add" href="javascript:void(0);" @click="onAdd">
            <i class="fa fa-plus-square-o" aria-hidden="true"></i>
          </a>
          <a v-if="btnAuth.del" href="javascript:void(0);" @click="onDel">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
          </a>
          <a v-if="btnAuth.undo" href="javascript:void(0);" @click="onUndo">
            <i class="fa fa-undo" aria-hidden="true"></i>
          </a>
          <a v-if="btnAuth.save" href="javascript:void(0);" @click="onSave">
            <i class="fa fa-floppy-o" aria-hidden="true"></i>
          </a>
        </div>
        <div v-show="!isEditing">
          <a v-if="btnAuth.edit" href="javascript:void(0);" @click="onEdit">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </a>
          <a v-if="btnAuth.download" href="javascript:void(0);" @click="onDownload">
            <i class="fa fa-cloud-download" aria-hidden="true"></i>
          </a>
          <a v-if="btnAuth.redirect" href="javascript:void(0);" @click="onRedirect">
            <i class="fa fa-share" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th v-show="isEditing">
              <check-icon :value.sync="selectAll"></check-icon>
            </th>
            <th v-for="(t, i) in headerTitle" :key="i">
              {{ $t(t) }}
            </th>
          </tr>
        </thead>
        <transition-group name="fade" tag="tbody" mode="out-in">
          <tr v-for="(obj, i) in tableData" :key="i">
            <td v-show="isEditing">
              <check-icon :value.sync="selected[i]"></check-icon>
            </td>
            <td v-for="(val, k) in obj" v-show="fieldIfVisible(k)" :key="k">
              <slot
                :name="k"
                :value="val"
                :idx="i"
                :readonly="!isEditing"
                :changeEvent="onChange"
                :fieldname="k"
              >
                <input
                  type="text"
                  :data-fieldname="k"
                  :value="val"
                  :data-idx="i"
                  :readonly="!isEditing"
                  @input="onChange"
                >
                <!-- <a href="javascript:void(0)" v-show="isEditing" @click="onEmpty">
                  <i class="fa fa-times-circle" aria-hidden="true"></i>
                </a> -->
              </slot>
            </td>
          </tr>
        </transition-group>
        <!-- <tbody v-if="!tableData.length">
          <tr>
            <td>{{ $t('to_add_later') }}</td>
          </tr>
        </tbody> -->
      </table>
    </div>
  </div>
</template>

<script>
import { CheckIcon, debounce, XButton } from 'vux'
import { MAXNUMROWS } from '@/common/constant'

export default {
  data () {
    return {
      isEditing: false,
      selectAll: false,
      selected: new Array(MAXNUMROWS).fill(false),
      contentH: 100
    }
  },
  components: {
    CheckIcon,
    XButton
  },
  props: {
    tableId: {
      type: String,
      required: true
    },
    tableTitle: {
      type: String
    },
    headerTitle: {
      type: Array,
      required: true
    },
    storeName: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    rowId: {
      type: String,
      required: true
    },
    btnAuth: {
      type: Object,
      default: function () {
        return {
          edit: true,
          add: true,
          del: true,
          download: true,
          redirect: true
        }
      }
    },
    customAdd: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableData: function () {
      let len = this.$store.state[this.storeName][this.tableTitle].cur.length
      if (len > MAXNUMROWS) {
        return this.$store.state[this.storeName][this.tableTitle].cur.slice(0, MAXNUMROWS)
      } else {
        return this.$store.state[this.storeName][this.tableTitle].cur
      }
    }
    // originalTableLength: function () {
    //   let len = this.$store.state[this.storeName][this.tableTitle].cur.length
    //   if (len > MAXNUMROWS) {
    //     return MAXNUMROWS
    //   } else {
    //     return len
    //   }
    // },
  },
  watch: {
    selected: {
      handler: function (n, o) {
        this.selectAll = n.slice(0, this.tableData.length).reduce((t, f) => {
          return t && f
        }, true)
      },
      deep: true
    },
    selectAll: function (n, o) {
      let all = this.selected.slice(0, this.tableData.length).reduce((t, f) => {
        return t && f
      }, true)
      if (n) {
        this.selected.fill(n, 0, this.tableData.length)
      } else {
        if (all) {
          this.selected.fill(n, 0, this.tableData.length)
        }
      }
    }
  },
  // mounted () {
    // register click event on <a>
    // document.querySelector(`#${this.tableId} a.btnEdit`).addEventListener('click', this.onEdit, {
    //   capture: false,
    //   passive: false
    // })
  // },
  methods: {
    onAdd () {
      let vm = this
      if (vm.customAdd) {
        vm.$emit('add', vm.tableTitle)
      } else {
        vm.$store.commit(`insert${vm.storeName}`, {
          data: vm.columns.reduce((t, c) => {
            if (c.name) {
              return Object.assign(t, {
                [c.name]: c.value(vm)
              })
            } else {
              return Object.assign(t, {
                [c]: ''
              })
            }
          }, {}),
          type: vm.tableTitle
        })
      }
    },
    onDel () {
      let idxArr = []
      if (this.selectAll) {
        this.tableData.forEach((cur, idx) => {
          idxArr.push(idx)
        })
        this.selectAll = false
        this.selected.fill(false)
      } else {
        this.selected.slice(0, this.tableData.length).forEach((cur, i) => {
          if (cur) {
            idxArr.push(i)
          }
        })
        this.selected.fill(false)
        // this.$forceUpdate()
      }

      this.$store.commit(`delete${this.storeName}`, {
        idx: idxArr,
        key: this.rowId,
        type: this.tableTitle
      })
    },
    onEdit () {
      this.isEditing = !this.isEditing
    },
    onUndo () {
      this.isEditing = !this.isEditing
      this.selectAll = false
      this.selected.fill(false)
      this.$store.commit(`cancel${this.storeName}`)
    },
    fieldIfVisible (k) {
      return this.headerTitle.find(cur => {
        return cur.includes(k)
      }) || false
    },
    // onEmpty (e) {
    //   e.target.parentElement.previousElementSibling.value = ''
    // },
    onDownload (e) {
      this.$emit('download', this.tableData)
    },
    onRedirect (e) {
      this.$emit('redirect', this.tableData)
    },
    onSave (e) {
      this.isEditing = !this.isEditing
      this.selectAll = false
      this.selected.fill(false)
      let willSaveObj = this.$store.state[this.storeName][this.tableTitle]
      this.$emit('save', {
        [this.tableTitle]: [].concat(willSaveObj.willInsert, willSaveObj.willUpdate, willSaveObj.willDelete)
      })
    },
    onChange: debounce(function (e) {
      let target = e.target
      // console.dir(target)
      let oldVal = target._value || ''
      let newVal = target.value
      // console.log('old val is %s, new val is %s', oldVal, newVal)
      if (oldVal.localeCompare(newVal)) {
        this.$store.commit(`update${this.storeName}`, {
          idx: target.dataset.idx,
          data: {
            [target.dataset.fieldname]: newVal
          },
          type: this.tableTitle
        })
      }
    }, 500)
    // selectRow (e, i) {
    //   let tdElem = e.currentTarget
    //   let activeIElem = tdElem.querySelector("i[class~='active']")
    //   let inactiveIElem = tdElem.querySelector("i[class~='inactive']")
    //   activeIElem.setAttribute('class', activeIElem.attributes.class.value.replace('active', '') + 'inactive')
    //   inactiveIElem.setAttribute('class', inactiveIElem.attributes.class.value.replace('inactive', '') + 'active')
    //   if (!this.selected) {
    //     this.selected = new Array(this.tableLength).fill(false)
    //   }
    //   this.selected[i] = !this.selected[i]
    //   this.selectAll = this.selected.reduce((t, f) => {
    //     return t && f
    //   }, true)
    // }
  }
}
</script>

<style lang="less">
.table {
  // overflow: auto;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.3);
  margin: 10px;
  position: relative;
  border-radius: 2px;
  font-size: 14px;

  .panel {
    width: 100%;
    height: 44px;
    position: relative;
    border-radius: 2px 2px 0 0;
    font-size: 16px;
    font-weight: 400;
    box-sizing: border-box;
    padding: 10px 15px;
    // height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: .5px solid rgba(200, 199, 204, .3);
    // border-bottom: 1px solid #E5E5E5;
    // .actions {
    //   position: fixed;
    //   right: 20px;
    // }
  }

  a {
    color: #999999;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 18px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    // background: none;
    // line-height: 1;
  }

  a:hover {
    color: #DCD9D6;
    cursor: pointer;
  }

  .content {
    overflow: auto;

    table {
      width: 100%;
      border: none;
      padding: 0;
      margin: 0;
      border-collapse: collapse;
      text-align: left;

      thead th {
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 16px;
        color: #8e8e93;
        font-size: 12px;
      }

      th, td {
        padding: 0;
        position: relative;
        padding-left: 10px;
        padding-right: 10px;
        height: 44px;
      }

      tr {
        // border-top: .08px solid rgba(200, 199, 204, .3);
        border-bottom: .08px solid rgba(200, 199, 204, .3);

        th:first-child {
          width: 12px;
          padding-left: 3px;
          padding-right: 0;
        }

        td:first-child {
          width: 12px;
          padding-left: 3px;
          padding-right: 0;
        }
      }

      tbody {
        input {
          padding-top: 10px;
          padding-bottom: 10px;
          border: none;
          width: 100%;
          position: relative;
          padding-left: 5px;
        }

        input:focus {
          outline: none;
        }

        // a {
        //   position: absolute;
        //   right: 12px;
        //   top: 8px;
        // }
      }

      .fade-enter-active, .fade-leave-active {
        transition: all .5s ease-in-out;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  }
}
</style>
