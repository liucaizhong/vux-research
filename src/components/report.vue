<template lang="html">
  <div>
    <div v-for="(value, key) in members" :key="key">
      <group-title>{{ key }}</group-title>
      <grid :rows="2">
        <grid-item
          v-for="(item, i) in value"
          :link="'report/' + item.userId"
          :label="item.userName"
          :key="i"
        >
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
import { GroupTitle, Grid, GridItem } from 'vux'
import { DEPS } from '@/common/constant'

export default {
  components: {
    GroupTitle,
    Grid,
    GridItem
  },
  data () {
    return {
      comp: '1', // 南土资产
      deps: DEPS,
      members: {}
    }
  },
  created () {
    // axios to get members
    // params: array[dep1, dep2, ...]
    let url = process.env.NODE_ENV === 'production'
              ? './API/getUsers.php'
              : 'http://localhost:3000/getemployees'

    this.$http.get(url, {
      params: {
        comp: this.comp,
        // deps: this.deps.map((cur) => {
        //   return this.$t(cur)
        // }).join(',')
        deps: this.$t(this.deps[0])
      }
    })
    .then((response) => {
      let dataObj = response.data
      Object.assign(this.members, dataObj)
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
</style>
