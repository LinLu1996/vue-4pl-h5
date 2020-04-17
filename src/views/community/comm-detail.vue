<template>
  <div>
    <div class="content">
      <van-pull-refresh v-model="isLoading" :disabled="refreshFlag" @refresh="onRefresh">
        <div class="comm_detail">
          <p class="comm_first_line">
            <strong>{{detailInfo.postTitle}}</strong>
            <span class="to_top" v-if="detailInfo.postTop === '20'">置顶</span>
          </p>
          <p class="comm_under_first_line">
            <img src="@/assets/comm-avatar.png">
            <!--<span class="user_wrap">-->
            <span class="user_name">{{detailInfo.createUserName}}</span>
            <span class="comm_time">{{detailInfo.createTiming}}</span>
            <!--</span>-->
          </p>
          <h3 class="comm_second_line">
            <span v-for="(item, index) in tempKeywords" :key="index" v-if="item">
              {{item}}
            </span>
          </h3>
          <p class="comm_third_line">{{detailInfo.postContent}}</p>
          <!--<van-image-->
            <!--width="100%"-->
            <!--height="5rem"-->
            <!--fit="contain"-->
            <!--src=""-->
          <!--/>-->
        </div>
        <div class="dividing_line"></div>
        <p v-if="noDataFlag" class="noDataSvg">
          <icon-svg name="暂无数据"></icon-svg>
          <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无回复，速抢沙发！</span>
        </p>
        <van-list
          v-else
          v-model="loading"
          :offset="200"
          :finished="finished"
          :finished-text="finishedText"
          :immediate-check="false"
          @load="onLoad"
        >
          <!--<p v-if="noDataFlag" class="noDataSvg">-->
            <!--<icon-svg name="暂无数据"></icon-svg>-->
            <!--<span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>-->
          <!--</p>-->
          <ul>
            <li v-for="(item, index) in dataList" :key="index">
              <p class="comm_first_line">
                <span class="user_wrap">
                  <img src="@/assets/comm-avatar.png">
                  <span class="user_name">{{item.replyUserName}}</span>
                  <span class="to_top" v-if="item.replyTop === '20'">置顶</span>
                  <span class="comm_time">{{item.createTiming}}</span>
                </span>
                <span class="floor_name">{{index + 1}}楼</span>
              </p>
              <p class="comm_third_line">{{item.replyContent}}</p>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="write_response">
      <van-field v-model="responseContent" maxlength="20" placeholder="回复（最多20字）" />
      <span :style="{color: responseContent ? '#000' : '#808080'}" @click="sendResponse">发送</span>
    </div>
  </div>
</template>
<script>
import titleSearch from '@/components/titleSearch'
import utilList from '@/components/utilList'
import { mapGetters } from 'Vuex'
import {Toast, Notify} from 'Vant'
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      isLoading: false,
      loadingShow: false,
      noDataFlag: false,
      finished: true,
      clickFlag: true,
      refreshFlag: false,
      listIndex: 0,
      tabIndex: 0,
      tabActive: 0,
      allCount: 0,
      finishedText: '',
      responseContent: '',
      navActive: '',
      dataForm: {
        postId: '',
        parentId: ''
      },
      detailInfo: {},
      postKeywords: [],
      tempKeywords: [],
      dataList: [],
      mainNav: []
    }
  },
  components: {
    titleSearch,
    utilList
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
    this.init()
  },
  watch: {
    $route () {
      this.init()
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  computed: {
    ...mapGetters([
      'getMenu'
    ])
  },
  methods: {
    init () {
      if (!this.getMenu().length) {
        this.$router.push({path: '/home'}).catch(res => {})
      } else {
        this.loadingShow = true
        this.dataForm.postId = this.$route.query.id
        this.getCommDetail()
        this.getHistory()
      }
    },
    getCommDetail () {
      this.$http({
        url: this.$http.adornUrl('/communityPost/getPostById.action'),
        method: 'get',
        params: this.$http.adornParams({
          postId: this.dataForm.postId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.detailInfo = data.communityPostPO
          this.postKeywords = this.detailInfo.postKeyword && this.detailInfo.postKeyword.split('，')
          this.postKeywords = this.postKeywords && this.postKeywords.map(inner => {
            return inner.split(',')
          })
          this.tempKeywords = []
          this.postKeywords && this.postKeywords.forEach(item => {
            this.tempKeywords.push(...item)
          })
          if (this.detailInfo.publishDate) {
            let nowTime = new Date().getTime() - parseInt(this.detailInfo.publishDate)
            if ((nowTime / 60000) < 1) {
              this.detailInfo.createTiming = '刚刚 '
            } else if ((nowTime / 60000) < 60) {
              this.detailInfo.createTiming = parseInt(parseInt(nowTime / 1000) / 60) + '分钟前'
            } else if ((nowTime / 60000) >= 60 && (nowTime / 60000) <= 24 * 60) {
              this.detailInfo.createTiming = parseInt(parseInt(nowTime / 1000) / 3600) + '小时前'
            } else if ((nowTime / 60000) > 24 * 60 && new Date(parseInt(this.detailInfo.publishDate)).getFullYear() === new Date().getFullYear()) {
              this.detailInfo.createTiming = this.detailInfo.publishDateStr.slice(5)
            } else {
              this.detailInfo.createTiming = this.detailInfo.publishDateStr
            }
          }
          this.getCommResponse()
        }
      })
    },
    getHistory () {
      this.$http({
        url: this.$http.adornUrl('/readMark/addReadMark.action'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.$route.query.id,
          sourceType: 2
        }, false)
      }).then(({data}) => {
      })
    },
    getCommResponse () {
      this.$http({
        url: this.$http.adornUrl('/communityPostReply/getPostReplyList.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          postId: this.dataForm.postId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.dataList = this.dataList.concat(data.communityPostReplyPOList)
          this.loadingShow = false
          this.finished = false
          this.loading = false
          this.afterGetData(data.communityPostReplyPOList.length, this.pageSize)
          this.dataList = this.dataList.map(res => {
            if (res.replyDate) {
              let nowTime = new Date().getTime() - parseInt(res.replyDate)
              if ((nowTime / 60000) < 1) {
                res.createTiming = '刚刚 '
              } else if ((nowTime / 60000) < 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 60) + '分钟前'
              } else if ((nowTime / 60000) >= 60 && (nowTime / 60000) <= 24 * 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 3600) + '小时前'
              } else if ((nowTime / 60000) > 24 * 60 && new Date(parseInt(res.replyDate)).getFullYear() === new Date().getFullYear()) {
                res.createTiming = res.replyDateStr.slice(5)
              } else {
                res.createTiming = res.replyDateStr
              }
            }
            return res
          })
        }
      })
    },
    sendResponse () {
      if (!this.clickFlag) {
        return
      }
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 3000)
      if (!this.responseContent) {
        Notify({ type: 'danger', message: '内容不能为空' })
        return
      }
      this.$http({
        url: this.$http.adornUrl('/communityPostReply/addPostReply.action'),
        method: 'post',
        data: this.$http.adornData({
          'postId': this.dataForm.postId,
          'replyContent': this.responseContent
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.responseContent = ''
          this.dataList = []
          this.noDataFlag = false
          this.pageIndex = 1
          this.getCommDetail()
          // this.getCommResponse()
          Toast('回复成功')
        }
      })
    },
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.dataList = []
      this.getCommDetail()
    },
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
    onLoad () {
      this.pageIndex += 1
      this.getCommResponse()
    },
    touchActive (index) {
      this.$router.push({
        path: '/special-topic',
        query: {
          id: this.dataForm.subjectId,
          name: this.mainNav[index].name
        }
      })
      // this.cancel()
      this.noDataFlag = false
      this.pageIndex = 1
      this.listIndex = index
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      // this.getDataList(index)
    },
    // 当数据加载完成时
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.dataList.length < pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.dataList.length) {
          this.noDataFlag = true
          this.finishedText = ''
        }
      }
      this.isLoading = false
    },
    cancel () {
      this.source.cancel()
    }
  }
}
</script>
<style lang="less" scoped>
  .dividing_line{
    height: 0.2rem;
    background: #f5f5f5;
    margin: 0.5rem 0;
  }
  .title_wrap{
    height: 3.2rem;
    background: url("~@/assets/community-banner.png") no-repeat;
    background-size: cover;
  }
  .nav_card{
    height: 2rem;
    padding-top: 0.5rem;
    .van-button{
      width: 100%;
    }
    /*/deep/.van-tabs {*/
    /*margin-top: 0.5rem;*/
    /*}*/
  }
  .main_nav{
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #ccc;
    position: relative;
    strong{
      font-size: 0.4rem;
      margin-left: 0.3rem;
    }
    img{
      display: inline-block;
      width: 1.5rem;
      position: absolute;
      right: 0.15rem;
      top: 0.1rem;
    }
  }
  .children_nav{
    height: 0.8rem;
    line-height: 0.8rem;
    /deep/.van-tabs .van-tabs__wrap{
      height: 1rem;
      line-height: 1rem;
    }
    /deep/.van-tabs .van-tab .van-tab__text{
      font-size: 0.32rem;
    }
  }
  .content{
    min-height: 85vh;
    .noDataSvg{
      text-align: center;
      margin-top: 2rem;
      svg{
        font-size: 2.5rem;
      }
    }
    /deep/.van-list{
      .van-list__finished-text{
        font-size: 0.36rem;
      }
    }
    .comm_detail{
      padding: 0.3rem;
      .comm_first_line{
        margin: 0 0 0.3rem;
        position: relative;
        strong{
          font-size: 0.48rem;
          font-weight: normal;
          color: #000000;
          width: 80%;
          line-height: 0.6rem;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
        }
        .comm_time{
          font-size: 0.32rem;
          display: block;
          margin-top: 0.3rem;
          color: #808080;
        }
        .to_top{
          position: absolute;
          right: 0;
          top: 0;
          background-color: #f8a944;
          padding: 0 0.05rem;
          font-size: 0.3rem;
          border-radius: 0.05rem;
          color: #ffffff;
        }
      }
      .comm_under_first_line{
        color: #808080;
        img{
          width: 0.8rem;
          vertical-align: middle;
        }
        .user_name{
          font-size: 0.36rem;
          margin-left: 0.3rem;
        }
        .comm_time{
          margin-left: 0.3rem;
          font-size: 0.36rem;
        }
      }
      .comm_second_line{
        margin: 0 0 0.3rem;
        font-size: 0.36rem;
        span{
          display: inline-block;
          background-color: #f4fbfe;
          color: #808080;
          padding: 0 0.3rem;
          margin-right: 0.2rem;
          font-weight: normal;
          border-radius: 0.3rem;
          height: 0.6rem;
          line-height: 0.6rem;
        }
      }
      .comm_third_line{
        margin: 0 0 0.3rem;
        font-size: 0.36rem;
        color: #808080;
        line-height: 0.6rem;
      }
      /*.comm_forth_line{*/
        /*margin: 0;*/
        /*font-size: 0.32rem;*/
      /*}*/
    }
    ul li {
      padding: 0.3rem;
      border-bottom: 1px solid #f5f5f5;
      .comm_first_line{
        margin: 0 0 0.3rem;
        img{
          width: 0.8rem;
          vertical-align: middle;
        }
        .user_wrap{
          display: inline-block;
          /*vertical-align: middle;*/
        }
        .user_name{
          font-size: 0.36rem;
          margin-left: 0.3rem;
        }
        .comm_time{
          font-size: 0.34rem;
          display: block;
          /*margin-top: 0.3rem;*/
          margin-left: 1.15rem;
          color: #808080;
        }
        .to_top{
          /*position: absolute;*/
          /*left: 50%;*/
          /*vertical-align: top;*/
          background-color: #f8a944;
          padding: 0 0.05rem;
          margin-left: 0.2rem;
          font-size: 0.3rem;
          border-radius: 0.05rem;
          color: #ffffff;
        }
        .floor_name{
          position: absolute;
          right: 0.3rem;
          color: #808080;
          font-size: 0.34rem;
        }
      }
      .comm_second_line{
        margin: 0 0 0.3rem;
        font-size: 0.38rem;
      }
      .comm_third_line{
        margin: 0;
        font-size: 0.36rem;
        line-height: 0.6rem;
        padding-left: 1.15rem;
      }
      /*.comm_forth_line{*/
        /*margin: 0;*/
        /*font-size: 0.32rem;*/
      /*}*/
    }
  }
  .write_response{
    margin-top: 1rem;
    border-top: 1px solid #cccccc;
    position: fixed;
    bottom: 0;
    width: 100%;
    /*height: 1.5rem;*/
    /*line-height: 1.5rem;*/
    background-color: #ffffff;
    .van-cell{
      padding: 0 .4rem;
    }
    .van-cell:not(:last-child)::after{
      border-bottom: none;
    }
    .van-field{
      width: 80%;
      display: inline-block;
      vertical-align: middle;
    }
    span{
      width: 18%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      display: inline-block;
      /*background-color: red;*/
      vertical-align: middle;
      border-left: 1px solid #cccccc;
      font-size: 0.38rem;
    }
  }
</style>
