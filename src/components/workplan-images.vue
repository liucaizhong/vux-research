<template lang="html">
  <div class="workplan-images">
    <ul v-if="images.length">
      <li v-for="(image, i) in images">
        <x-img :src="image.url" alt="loading..."></x-img>
      </li>
    </ul>
  </div>
</template>

<script>
import { XImg } from 'vux'
export default {
  components: {
    XImg
  },
  data () {
    return {
      images: []
    }
  },
  created () {
    const url = process.env.NODE_ENV === 'production'
              ? './API/getPic.php'
              : 'http://localhost:3000/getpic'

    this.$http.get(url)
    .then((response) => {
      console.log('response', response)
      this.images = [...response.data.files]
      this.$forceUpdate()
      this.$store.commit('updateLoadingStatus', {
        isLoading: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style lang="less">
.workplan-images {
  padding-bottom: 10px;

  img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
  }
}
</style>
