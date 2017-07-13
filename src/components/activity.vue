<template lang="html">
  <div class="activity">
    <group :title="$t('select_date_range')">
      <calendar
      v-model="start"
      :highlight-weekend="true"
      :title="$t('start_date')"
      :weeks-list="weekList"
      >
      </calendar>
      <calendar
      v-model="end"
      :highlight-weekend="true"
      :title="$t('end_date')"
      :weeks-list="weekList"
      >
      </calendar>
    </group>
  </div>
</template>

<script>
import { Group, Calendar } from 'vux'

export default {
  components: {
    Calendar,
    Group
  },
  data () {
    return {
      start: 'TODAY',
      end: 'TODAY'
    }
  },
  computed: {
    weekList: function () {
      return [this.$t('Su'), this.$t('Mo'), this.$t('Tu'), this.$t('We'),
        this.$t('Th'), this.$t('Fr'), this.$t('Sa')]
    }
  },
  mounted () {
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  }
}
</script>

<style lang="less">
</style>
