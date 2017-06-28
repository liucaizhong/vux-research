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
    <grid :row="3">
      <grid-item :link="grid.href" :label="$t(grid.label)" v-for="(grid, i) in grids" :key="i">
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
  }
}
</script>

<style lang="less" scoped>
.swiper {
  width: 100%;
  margin: 0 auto;
}
</style>
