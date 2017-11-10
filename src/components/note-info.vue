<template lang="html">
  <div class="note-info">
    <div class="input-bar">
      <input
        type="text"
        :value="title"
        readonly
      />
    </div>
    <ul class="attach-files" v-if="files.length">
      <li v-for="file in files">
        <a
          :href="file.url"
          target="_self"
        >
          <span>
            <i class="fa fa-file" aria-hidden="true"></i>
          </span>
          <span>{{ file.name }}</span>
        </a>
      </li>
    </ul>
    <textarea
      type="text"
      :value="content"
      readonly
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      content: '',
      files: []
    }
  },
  created () {
    console.log('this.$route', this.$route)
    // todo:get note
    this.title = this.$t('notification')
    this.content = 'adafidf;asdf'
    this.files = [{
      name: 'dafdfsd.pdf',
      url: 'http://www.baidu.com'
    }]
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  }
}
</script>

<style lang="less">
@base-color: #2D82F6;

.note-info {
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
      // border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      // caret-color: @base-color;
      color: @base-color;
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
    }
  }
}
</style>
