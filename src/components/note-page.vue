<template lang="html">
  <div class="note-page">
    <div class="note-header">
      <img class="logo" src="../assets/sland_logo.png" />
      <span class="title">您的个人安排</span>
      <span class="date">2017-11-08</span>
    </div>
    <div class="note-content">
      <div class="note-block">
        <div class="title">
          1、投研日历
        </div>
        <div class="content">
          <p>16:00-17:00 于浩成路演 健身房会议室 自动变速箱行业深度，个股：精锻科技，万里扬</p>
          <p>16:00-17:00 于浩成路演 健身房会议室 自动变速箱行业深度，个股：精锻科技，万里扬</p>
        </div>
      </div>
      <div class="note-block">
        <div class="title">
          2、出勤日历
        </div>
        <div class="content">
          <p>16:00-17:00 于浩成路演 健身房会议室 自动变速箱行业深度，个股：精锻科技，万里扬</p>
        </div>
      </div>
      <div class="note-block">
        <div class="title">
          3、个人日历
        </div>
        <div class="content">
          <p>16:00-17:00 于浩成路演 健身房会议室 自动变速箱行业深度，个股：精锻科技，万里扬</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  }
}
</script>

<style lang="less">
@font-color: #F16C29;

.note-page {
  background: #fff;
  min-height: 100%;

  .note-header {
    width: 100%;
    height: 60px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 10px;
    box-sizing: border-box;
    color: @font-color;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);

    .logo {
      height: 50px;
    }

    .title {
      font-size: 20px;
      line-height: 2.5;
    }

    .date {
      font-size: 12px;
      line-height: 5;
    }
  }

  .note-content {
    padding: 60px 10px 0px 10px;

    .title {
      padding: 5px 0px 8px;
      font-size: 18px;
      color: @font-color;
    }

    .content {
      > p {
        font-size: 14px;
        padding: 5px 0;
      }
    }
  }
}
</style>
