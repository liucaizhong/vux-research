<template>
  <div>
    <swiper
      loop
      auto
      :show-dots="false"
      class="swiper"
      :aspect-ratio="1/2"
      :list="banners"
    >
    </swiper>
    <grid :rows="3">
      <grid-item
        v-for="(grid, i) in grids"
        :link="grid.href"
        :label="$t(grid.label)"
        :key="i"
      >
        <img slot="icon" :src="grid.icon">
      </grid-item>
    </grid>
  </div>
</template>

<script>
import { Swiper, Grid, GridItem } from 'vux'
import { GRIDS, BANNERS } from '@/common/constant'

export default {
  components: {
    Swiper,
    Grid,
    GridItem
  },
  data () {
    return {
      grids: GRIDS,
      banners: BANNERS
    }
  },
  mounted () {
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  }
}
</script>

<style lang="less" scoped>
.swiper {
  width: 100%;
  margin: 0 auto;
}
</style>
