<template lang="html">
  <div class="release-note">
    <div class="input-bar">
      <input
        type="text"
        :placeholder="$t('note_title')"
        readonly
        v-model="title"
      >
      <a class="floatUploadBtn" href="javascript:void(0);" role="button">
        <input
          type="file"
          name="noteFile"
          id="noteFile"
          @change="onUploadFile"
          multiple
        >
        <i class="fa fa-cloud-upload fa-lg" aria-hidden="true"></i>
      </a>
    </div>
    <ul class="attach-files" v-if="files.length">
      <li v-for="(file, key) in files">
        <div class="file">
          <span>
            <i class="fa fa-file" aria-hidden="true"></i>
          </span>
          <span>{{ file.name }}</span>
        </div>
        <div class="iconbar">
          <a
            href="javascript:void;"
            role="button"
            @click.prevent.stop="onDeleteFile"
            :data-key="key"
          >
            <i class="fa fa-times" aria-hidden="true" :data-key="key"></i>
          </a>
        </div>
      </li>
    </ul>
    <textarea
      type="text"
      :placeholder="$t('note_content')"
      v-model="content"
      v-focus
    />
    <x-button
      type="primary"
      @click.native="onRelease"
    >{{ $t('release') }}</x-button>
    <toast
      v-model="showError"
      :time="2000"
      type="warn"
    >{{ showErrorText }}</toast>
  </div>
</template>

<script>
import { XButton, Toast } from 'vux'

export default {
  components: {
    XButton,
    Toast
  },
  data () {
    return {
      title: '',
      content: '',
      files: [],
      showError: false,
      showErrorText: ''
    }
  },
  created () {
    this.title = this.$t('notification')
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    onRelease () {
      // console.log('this.title', this.title)
      // console.log('this.content', this.content)
      // console.log('this.files', this.files)
      const hasError = !this.title || !this.title.length ||
        !this.title.replace(/\s/g, '').length || !this.content ||
        !this.content.length || !this.content.replace(/\s/g, '').length

      if (hasError) {
        this.showErrorText = this.$t('release_error')
        this.showError = true
      } else {
        this.$store.commit('updateLoadingStatus', {
          isLoading: true
        })

        // submit
        const formData = new FormData()

        formData.append('title', this.title)
        formData.append('content', this.content)
        formData.append('type', '0')
        this.files.forEach((cur, i) => {
          formData.append('file[]', cur, cur.name)
        })

        const url = process.env.NODE_ENV === 'production'
                  ? './API/upload.php'
                  : 'http://slandasset.appchizi.com/rules/API/upload.php'

        this.$http.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          console.dir(response)
          this.$router.go(-1)
        })
        .catch((error) => {
          console.log(error)
        })
      }
    },
    onUploadFile (e) {
      // this.files.push(e.target.files[0])
      // console.log('files', e.target.files)
      this.files = this.files.concat(Array.prototype.map.call(e.target.files,
        (file) => {
          return file
        })
      )
      // console.log('files', this.files)
    },
    onDeleteFile (e) {
      const key = e.target.dataset.key
      // console.log('delete file', key)
      this.files.splice(key, 1)
      // console.log('this.files', this.files)
    }
  }
}
</script>

<style lang="less">
@base-color: #2D82F6;

.release-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 100%;

  .input-bar {
    width: 90%;
    margin-top: 20px;
    position: relative;
    height: 40px;

    input[type=text] {
      width: 100%;
      height: 100%;
      border: none;
      // border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      // caret-color: @base-color;
      color: @base-color;
      outline: none;
      font-size: 28px;
      padding-bottom: 3px;
      box-sizing: border-box;
      border-radius: 0;

      &:focus {
        border-bottom: 2px solid @base-color;
      }
    }
  }

  textarea {
    width: 90%;
    font-size: 18px;
    outline: none;
    border: none;
    min-height: 450px;
    margin-top: 10px;
  }

  button.weui-btn, input.weui-btn {
    width: 90%;
    margin-top: 10px;
    background-color: @base-color;
    margin-bottom: 20px;
  }

  .floatUploadBtn {
    padding: 5px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    top: 0;
    cursor: pointer;
    right: 0;
    // color: @base-color;
    color: #bfbfbf;
    // background: #fafafa;
    // border: 1px solid #ddd;
    /* border-radius: 4px; */
    overflow: hidden;
    display: inline-block;

    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
    }
  }

  .attach-files {
    list-style: none;
    width: 90%;
    padding: 5px 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);

    * {
      color: #888;
    }

    li {
      position: relative;
      width: 100%;
      padding: 1px 0;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;

      a {
        text-align: right;

        i {
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
