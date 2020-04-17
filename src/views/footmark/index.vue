<template>
  <div class="footmark">
    <div class="content">
      <van-pull-refresh v-model="isLoading" :disabled="refreshFlag" @refresh="onRefresh">
        <div class="ul">
          <van-list
            v-model="loading"
            :offset="200"
            :finished="finished"
            :finished-text="finishedText"
            :immediate-check="false"
            @load="onLoad"
          >
            <van-loading v-if="loadingShow" size="24px" vertical>加载中...</van-loading>
            <div v-if="list.length" v-for="(item,index) in list" :key="index"  class="box" :style="{padding: index && item.date !== list[index - 1].date ? '.3rem' : '0 .3rem'}">
              <div class="time" v-if="index === 0 || item.date !== list[index - 1].date"> {{item.date}}</div>
              <div v-for="(todo, index) in item.list" :key="index" class="comment" @click="handleToDetail(todo)">
                <template v-if="todo.sourceType == 2">
                  <div class="comm_first_title">
                    {{todo.objectTitle}}
                  </div>
                  <div class="comm_first_btn" style="color: #ccc">{{todo.parentCategoryName}}&nbsp; > &nbsp;{{todo.categoryName}}</div>
                </template>
                <template v-else>
                  <div class="invitation">
                    <div class="img_wrap" v-if="todo.cover">
                      <img v-lazy="getBaseUrl+todo.cover">
                    </div>
                    <div class="content_text_wrap">
                      <div class="comm_first_title">{{todo.objectTitle}} </div>
                      <div class="comm_first_btn" style="color: #ccc">
                        <span>{{todo.parentCategoryName}}&nbsp; > &nbsp; {{todo.categoryName}}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <p v-if="noDataFlag && !list.length" class="noDataSvg">
              <icon-svg name="暂无数据"></icon-svg>
              <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>
            </p>
          </van-list>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
  data () {
    return {
      invitation: [],
      isLoading: false,
      refreshFlag: false,
      loading: false,
      finished: false,
      finishedText: '',
      loadingShow: false,
      noDataFlag: false,
      pageIndex: 1,
      pageSize: 10,
      list: [],
      content: []
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
    this.getSentence()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    scrollToTop () {
      const that = this
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      that.scrollTop = scrollTop
      if (that.scrollTop < 100) {
        that.refreshFlag = false
      } else {
        that.refreshFlag = true
      }
    },
    // 获取足迹列表
    getSentence () {
      this.$http({
        url: this.$http.adornUrl('/readMark/getReadMarkList.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.loadingShow = false
          this.finished = false
          this.loading = false
          this.list = this.list.concat(data.list)
          this.list = this.list.map(res => {
            if (res.date) {
              let time1 = new Date().getFullYear()
              let time2 = new Date().getMonth() + 1
              let time3 = new Date().getDate()
              time2 = this.handleDate(time2)
              time3 = this.handleDate(time3)
              let time = time1 + '-' + time2 + '-' + time3
              if (res.date === time) {
                res.date = '今天'
              }
            }
            return res
          })
          let sum = 0
          this.list.map(item => {
            item.list.map(it => {
              sum++
            })
          })
          this.afterGetData(data.totalCount, sum)
          // this.list.forEach(item => {
          //   if (this.list[])
          // })
        }
      })
    },
    handleDate (date) {
      let dd = parseInt(date) < 10 ? `0${date}` : date
      return dd
    },
    // 列表刷新
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      this.getSentence()
    },
    // 列表上拉加载
    onLoad () {
      this.pageIndex += 1
      this.getSentence()
    },
    // 当数据加载完成时
    afterGetData (count, sum) {
      if ((this.pageIndex - 1) * this.pageSize >= parseInt(count) || sum < this.pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.list.length) {
          this.noDataFlag = true
          // this.noDataFlag = true
          this.finishedText = ''
        }
      }
      this.isLoading = false
    },
    handleToDetail (item) {
      if (item.sourceType === '1') {
        // 产品详情
        this.$router.push({
          path: '/detail',
          query: {
            id: item.sourceId
          }
        })
      } else {
        // 帖子详情
        this.$router.push({
          path: '/comm-detail',
          query: {
            id: item.sourceId
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .footmark {
    width: 100%;
    min-height: 110vh;

    .content {
      /*padding: 0.3rem 0 0.6rem;*/
      /*min-height: 60vh;*/
      .ul{
        width: 100%;
        /*padding: 0.3rem;*/
        .noDataSvg {
          margin-top: 0;
          text-align: center;
          padding: 2rem 0 5rem;
          border-top: 1px solid #f5f5f5;

          svg {
            font-size: 2.5rem;
          }
        }

        /deep/ .van-list {
          .van-list__finished-text {
            font-size: 0.36rem;
          }
        }
        .box{
          padding:0.3rem;
          .time{
            font-size: 0.5rem;
            color: #808080;
            padding-bottom: 0.1rem;
          }
          .comment{
            width:100%;
            height: 2rem;
            padding: 0.2rem 0;
            border-bottom: 1px solid #ccc;
            font-size: .4rem;
            color: #000;
            .comm_first_line {
              margin: 0 0 0.3rem;
              position: relative;
              strong {
                font-size: 0.4rem;
                font-weight: normal;
                color: #000000;
                width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                margin-bottom: 0.8rem;
              }
              .comm_forth_line {
                margin: 0;
                height: 0.5rem;
                font-size: 0.32rem;
                color: #C9C9C9;
                .comm_time {
                  /*font-size: 0.32rem;*/
                  /*position: absolute;*/
                  /*right: 0.3rem;*/
                  color: #808080;
                  margin-left: 0.2rem;
                }
              }
            }
            .comm_first_title{
              width: 100%;
              height: 1.5rem;
              overflow: hidden;
              white-space: nowrap;
              -ms-text-overflow: ellipsis;
              text-overflow: ellipsis;
            }
            .comm_first_btn{
              width: 100%;
              height: 0.5rem;
              overflow: hidden;
              white-space: nowrap;
              -ms-text-overflow: ellipsis;
              text-overflow: ellipsis;
            }
          }
          .invitation{
            .img_wrap, .content_text_wrap {
              display: inline-block;
            }
            .img_wrap {
              width: 35%;
              height: 2.1rem;
              vertical-align: top;
              margin-right: .1rem;
              img {
                width: 100%;
                height: 2.1rem;
              }
            }
            .content_text_wrap {
              width: 60%;
              /*vertical-align: top;*/

              h5 {
                margin: 0.1rem 0 0 0.1rem;
                font-size: 0.4rem;
                font-weight: normal;
                color: #000000;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-bottom: 0.9rem
              }
              .content_classify {
                height: 0.4rem;
                line-height: 0.4rem;
                span:nth-child(2) {
                  float: right;
                  color: #C9C9C9;
                }
              }
              p:nth-child(3) {
                font-size: 0.32rem;
                /*margin:0 0.1rem;*/
                color: #808080;
                margin-top: 0.2rem;
              }
            }
          }
        }
      }

    }
  }
</style>
