<template lang="html">
  <div>
    <x-header
      :left-options="{backText: $t('nav_back_text')}"
    >
    {{ $t('workplan_main_title') }}
    </x-header>

  </div>
</template>

<script>
import { XHeader } from 'vux'

export default {
  components: {
    XHeader
  },
  data () {
    return {

    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {

    })
  }
}
</script>

<style lang="less">
</style>
