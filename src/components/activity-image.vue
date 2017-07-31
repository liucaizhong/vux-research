<template lang="html">
  <div class="activity-image">
    <div class="image-content">
      <header class="content-header">
        <p class="header-title">{{ $t('activity_main_title')}}</p>
        <p class="range-title">{{ rangeTitle }}</p>
      </header>
      <div class="content-body">
        <ul>
          <li
            v-for="(value, key) in imageData"
            class="outer-li"
          >
            <header>
                <div class="date">
                    <span>{{getDayString(key)}}</span>
                    <br>
                    <span>{{getDateString(key)}}</span>
                </div>
            </header>
            <ul>
                <li v-for="item in value" class="inner-li" v-if="item">
                    <div class="infos">
                        <h2 class="title" v-if="item.title">{{ item.title }}</h2>
                        <div class="row-0">
                          <span class="time" v-if="item.time">
                            <label>{{ $t('time_a_desc') }}：</label>{{ item.time }}
                          </span>
                          <span class="place" v-if="item.place">
                            <label>{{ $t('place_a_desc') }}：</label>{{ item.place }}
                          </span>
                          <span class="dial" v-if="item.dial">
                            <label>{{ $t('dial_a_desc') }}：</label>{{ item.dial }}
                          </span>
                        </div>
                        <div class="row-1">
                          <span class="guest" v-if="item.guests">
                            <label>{{ $t('guests_a_desc') }}：</label>{{ item.guests }}
                          </span>
                        </div>
                        <div class="row-2">
                          <span class="contacts" v-if="item.contacts">
                            <label>{{ $t('contacts_a_desc') }}：</label>{{ item.contacts }}
                          </span>
                        </div>
                    </div>
                </li>
            </ul>
          </li>
        </ul>
      </div>
      <footer class="content-footer">
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rangeTitle: '',
      imageData: null
    }
  },
  mounted () {
    let start = this.$route.params.start.split('-')
    let end = this.$route.params.end.split('-')
    this.imageData = Object.assign({}, this.$route.params.data)
    this.rangeTitle = `${+start[1]}${this.$t('month')}${+start[2]}${this.$t('day')}-${+end[1]}${this.$t('month')}${+end[2]}${this.$t('day')}`
    this.$store.commit('updateLoadingStatus', {
      isLoading: false
    })
  },
  methods: {
    getDayString (str) {
      let date = new Date(str.substr(0, 4), +str.substr(4, 2) - 1, str.substr(6, 2))
      return this.$t('week1') + (function (day, that) {
        switch (day) {
          case 0:
            return that.$t('Su')
          case 1:
            return that.$t('Mo')
          case 2:
            return that.$t('Tu')
          case 3:
            return that.$t('We')
          case 4:
            return that.$t('Th')
          case 5:
            return that.$t('Fr')
          case 6:
            return that.$t('Sa')
        }
      })(date.getDay(), this)
    },
    getDateString (str) {
      return +str.substr(4, 2) + this.$t('month') + (+str.substr(6, 2)) + this.$t('day')
    }
  }
}
</script>

<style lang="less">

  .activity-image {
    display: flex;
    justify-content: space-around;

    /* screen responsive implementation for image */
    .image-content {
      margin-top: 20px;
      margin-bottom: 20px;
      background-color: #FFF;
      width: 360px;

      ul {
        padding-left: 0px;
      }

      li {
        list-style: none;
      }

      .content-header {
        background-image: url(../assets/activity-header.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 360px;
        height: 160px;
        position: relative;
        font-size: 12px;

        .header-title {
          position: absolute;
          color: #bd0927;
          font-size: 2.5em;
          letter-spacing: 6px;
          font-weight: bold;
          top: 5px;
          left: 165px;
        }

        .range-title {
          position: absolute;
          color: #bd0927;
          font-size: 1.4em;
          top: 45px;
          left: 165px;
        }
      }

      .content-body {
        padding-left: 0px;
        margin-top: 30px;

        & > ul {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 5px;
            background: #f8afaf;
            left: 72px;
            margin-left: -10px;
          }
        }

        .outer-li {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          margin-top: 12px;
          margin-bottom: 12px;
          position: relative;

          &::before {
            content: ' ';
            width: 12px;
            height: 12px;
            font-family: 'ecoico';
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            font-size: 1.4em;
            line-height: 24px;
            -webkit-font-smoothing: antialiased;
            position: absolute;
            color: #fff;
            background: #bd0927;
            border-radius: 50%;
            box-shadow: 0 0 0 4px #f8afaf;
            text-align: center;
            left: 76px;
            top: -4px;
            margin: 8px 0 0 -18px;
          }

          &::after {
            left: 75px;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
            border-right-color: #bd0927;
            border-width: 8px;
            top: 3px;
          }

          header {
            flex: 0 0 50px;
            margin-right: 1px;
          }

          ul {
            flex: 0 0 250px;
            padding-left: 55px;
          }
        }

        .date {
          font-size: 12px;
          padding: 0px 0px;
          text-align: center;
          color: #bd0927;
        }

        .inner-li {
          margin-bottom: 10px;

          h2 {
            color: #bd0927;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #bd0927;
            font-size: 1.3em;
          }

          .infos {
            // color: #1075af;
            color: #000;
            font-size: 12px;
            // font-weight: 300;
            line-height: 1.4;

            .row-0 {
              display: flex;
              justify-content: flex-start;
              margin-top: 12px;
              margin-bottom: 12px;

              .time {
                flex: 0 0 80px;
                margin-right: 0px;
              }
            }

            .row-1,.row-2 {
              margin-top: 12px;
              margin-bottom: 12px;
            }
          }
        }

        .title {
          margin-top: 0;
          margin-bottom: 0;
        }
      }

      .content-footer {
        background-image: url(../assets/activity-footer.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 96px;
        height: 39px;
        margin: 0 auto;
      }
    }

    @media (min-width: 768px) {
      .image-content {
        width: 768px;

        .content-header {
          width: 768px;
          height: 342px;
          font-size: 15px;

          .header-title {
            top: 20px;
            left: 485px;
          }

          .range-title {
            top: 70px;
            left: 485px;
          }
        }

        .content-body {

          & > ul {
            padding-left: 25px;

            &::before {
              left: 135px;
              width: 8px;
            }
          }

          .outer-li {

            &::before {
              left: 114px;
              width: 15px;
              height: 15px;
              box-shadow: 0 0 0 6px #f8afaf;
              top: -2px;
            }

            &::after {
              left: 120px;
              border-width: 12px;
              top: 3px;
            }

            header {
              flex: 0 0 100px;
            }

            ul {
              flex: 0 0 520px;
              padding-left: 65px;
            }
          }

          .date {
            font-size: 17px;
            padding: 0px 18px;
          }

          .inner-li {

            h2 {
              font-size: 1.5em;
            }

            .infos {
              font-size: 15px;

              .row-0 {
                .time {
                  flex: 0 0 100px;
                  margin-right: 60px;
                }
              }
            }
          }
        }

        .content-footer {
          width: 205px;
          height: 84px;
        }
      }
    }

    @media (min-width: 992px) {
      .image-content {
        width: 886px;

        .content-header {
          width: 886px;
          height: 394px;
          font-size: 18px;

          .header-title {
            top: 20px;
            left: 560px;
          }

          .range-title {
            top: 80px;
            left: 560px;
          }
        }

        .content-body {

          & > ul {
            padding-left: 25px;

            &::before {
              left: 165px;
              width: 10px;
            }
          }

          .outer-li {

            &::before {
              left: 143px;
              width: 18px;
              height: 18px;
              top: 0px;
              box-shadow: 0 0 0 8px #f8afaf;
            }

            &::after {
              left: 150px;
              border-width: 16px;
            }

            header {
              flex: 0 0 140px;
            }

            ul {
              flex: 0 0 600px;
              padding-left: 65px;
            }
          }

          .date {
            font-size: 23px;
            padding: 0px 18px;
          }

          .inner-li {

            h2 {
              font-size: 1.5em;
            }

            .infos {
              font-size: 18px;

              .row-0 {
                .time {
                  flex: 0 0 100px;
                  margin-right: 60px;
                }
              }
            }
          }
        }

        .content-footer {
          width: 236px;
          height: 97px;
        }
      }
    }
  }
</style>
