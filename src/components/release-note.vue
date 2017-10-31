<template lang="html">
  <div class="release-note">
    <div class="input-bar">
      <input
        type="text"
        :placeholder="$t('note_title')"
        v-focus
        v-model="title"
      >
      <a class="floatUploadBtn" href="javascript:void;" role="button">
        <input type="file" name="noteFile" id="noteFile" @change="onUploadFile">
        <i class="fa fa-cloud-upload fa-lg" aria-hidden="true"></i>
      </a>
    </div>
    <ul class="attach-files" v-if="files.length">
      <li v-for="(file, key) in files">
        <span>
          <i class="fa fa-file" aria-hidden="true"></i>
        </span>
        <span>{{ file.name }}</span>
        <a
          href="javascript:void;"
          role="button"
          @click.prevent.stop="onDeleteFile"
          :data-key="key"
        >
          <i class="fa fa-times" aria-hidden="true"></i>
        </a>
      </li>
    </ul>
    <textarea
      type="text"
      :placeholder="$t('note_content')"
      v-model="content"
    />
    <x-button
      type="primary"
      @click.native="onRelease"
    >{{ $t('release') }}</x-button>
    <toast
      v-model="showError"
      :time="2000"
      type="warn"
    >{{ $t('release_error') }}</toast>
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
      showError: false
    }
  },
  mounted () {
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
      console.log('this.title', this.title)
      console.log('this.content', this.content)
      console.log('this.files', this.files)
      const hasError = !this.title || !this.title.length ||
        !this.title.replace(/\s/g, '').length || !this.content ||
        !this.content.length || !this.content.replace(/\s/g, '').length

      if (hasError) {
        this.showError = true
      }

      // todo: submit
    },
    onUploadFile (e) {
      this.files.push(e.target.files[0])
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

    input[type=text] {
      width: 100%;
      height: 30px;
      font-size: 30px;
      border: none;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      caret-color: @base-color;
      outline: none;
      padding-bottom: 5px;

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
    min-height: 500px;
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
    color: #888;
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

      a {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        text-align: right;

        i {
          padding-right: 5px;
        }
      }
    }
  }
}
</style>
