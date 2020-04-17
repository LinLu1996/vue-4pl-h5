<template>
  <div>
    <div class="title_wrap_comm">
      <title-search></title-search>
    </div>
    <div class="dividing_line"></div>
    <div class="nav_card">
      <van-tabs v-model="tabActive" line-width="0" :border="false" @change="clickPlate">
        <van-tab v-for="(item,index) in plateList" :key="index" :title-style="{marginLeft: '0.18rem',minWidth: '2.7rem'}" :ellipsis="false">
          <div slot="title">
            <!--<van-icon name="more-o" />选项-->
            <van-button :style="{backgroundColor: colorList[index % 4], fontSize: tabActive === index ? '0.44rem' : '0.36rem', width: tabActive === index ? '100%' : '96%'}">{{item.blockName}}</van-button>
          </div>
        </van-tab>
        <van-tab :disabled="true" title-style="max-width: 0.18rem;padding: 0"></van-tab>
      </van-tabs>
    </div>
    <div class="children_nav">
      <van-tabs v-model="tabIndex" :ellipsis="false" :border="false" title-inactive-color="#808080" color="#000" line-width="1rem" @change="touchActive">
        <van-tab title="最新"></van-tab>
        <van-tab title="全部"></van-tab>
      </van-tabs>
    </div>
    <div style="height: 60vh;padding-top: 3rem" v-if="loadingShow">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <div v-else class="content">
      <van-pull-refresh v-model="isLoading" :disabled="refreshFlag" @refresh="onRefresh">
        <ul>
          <van-list
            v-model="loading"
            :offset="200"
            :finished="finished"
            :finished-text="finishedText"
            :immediate-check="false"
            @load="onLoad"
          >
            <p v-if="noDataFlag" class="noDataSvg">
              <icon-svg name="暂无数据"></icon-svg>
              <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>
            </p>
            <ul v-else>
              <li v-for="(item, index) in dataList" :key="index" @click="goPage('/comm-detail', item.id)">
                <p class="comm_first_line">
                  <!--<img src="@/assets/comm-default.png">-->
                  <!--<span class="user_name">{{item.createUserName}}</span>-->
                  <!--<span class="comm_time">{{item.createTiming}}</span>-->
                  <strong>{{item.postTitle}}</strong>
                  <span class="to_top" v-if="tabIndex === 1 && item.postTop === '20'">置顶</span>
                </p>
                <h3 class="comm_second_line">
                  <span v-for="(item, index) in item.tempKeywords" :key="index">
                    #{{item}}
                  </span>
                </h3>
                <p class="comm_third_line">{{item.postContent}}</p>
                <p class="comm_forth_line">
                  <img src="@/assets/comm-avatar.png">
                  <span class="user_name">{{item.createUserName}}</span>
                  <span class="comm_time">{{item.createTiming}}</span>
                  <span class="comm_num">
                    <icon-svg name="评论" style="vertical-align: middle;font-size: 0.48rem"></icon-svg>
                    {{item.replyCount}}</span>
                </p>
              </li>
            </ul>
          </van-list>
        </ul>
      </van-pull-refresh>
    </div>
    <div class="write_comm" @click="goPage('/send-comm')">
      <!--<img src="@/assets/send-comm.png">-->
      <icon-svg name="发帖" style="font-size: 1rem"></icon-svg>
    </div>
  </div>
</template>
<script>
import titleSearch from '@/components/titleSearch'
import utilList from '@/components/utilList'
import { mapGetters } from 'Vuex'
export default {
  name: 'Community',
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      isLoading: false,
      loadingShow: false,
      noDataFlag: false,
      refreshFlag: false,
      finished: true,
      listIndex: 0,
      tabIndex: 0,
      tabActive: 0,
      allCount: 0,
      finishedText: '',
      navActive: 0,
      dataForm: {
        subjectId: '',
        parentId: ''
      },
      plateList: [],
      newestList: [],
      dataList: [],
      colorList: ['#a9ba96', '#917572', '#e3aa9f', '#94c0bb'],
      mainNav: []
    }
  },
  components: {
    titleSearch,
    utilList
  },
  mounted () {
    this.init()
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    console.log(11)
    window.removeEventListener('scroll', this.scrollToTop)
  },
  watch: {
    $route () {
      this.init()
    }
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
        this.getPlate()
      }
    },
    getPlate () {
      this.$http({
        url: this.$http.adornUrl('/communityBlock/getCommunityBlockList.action'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.plateList = data.list
          if (this.$route.query.id) {
            this.tabActive = this.plateList.findIndex(res => {
              return res.id === this.$route.query.id
            })
            this.tabActive = this.tabActive === -1 ? 0 : this.tabActive
          }
          if (this.$route.query.type.toString()) {
            this.tabIndex = parseInt(this.$route.query.type)
            if (this.tabIndex === 1) {
              this.getAllComm()
            } else {
              this.getNewestComm()
            }
          }
        }
      })
    },
    getNewestComm () {
      this.loadingShow = true
      this.dataList = []
      this.$http({
        url: this.$http.adornUrl('/communityPost/getNewCommunityPostList.action'),
        method: 'get',
        params: this.$http.adornParams({
          communityBlockId: this.plateList[this.tabActive].id
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.dataList = data.list
          if (!this.dataList.length) {
            this.noDataFlag = true
          } else {
            this.noDataFlag = false
          }
          this.loading = false
          this.dataList = this.dataList.map(res => {
            if (res.publishDate) {
              let nowTime = new Date().getTime() - parseInt(res.publishDate)
              if ((nowTime / 60000) < 1) {
                res.createTiming = '刚刚 '
              } else if ((nowTime / 60000) < 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 60) + '分钟前'
              } else if ((nowTime / 60000) >= 60 && (nowTime / 60000) <= 24 * 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 3600) + '小时前'
              } else if ((nowTime / 60000) > 24 * 60 && new Date(parseInt(res.publishDate)).getFullYear() === new Date().getFullYear()) {
                res.createTiming = res.publishDateStr.slice(5)
              } else {
                res.createTiming = res.publishDateStr
              }
            }
            if (res.postKeyword) {
              res.postKeywords = res.postKeyword.split('，')
              res.postKeywords = res.postKeywords.map(inner => {
                return inner.split(',')
              })
              res.tempKeywords = []
              res.postKeywords.forEach(item => {
                if (item[0]) {
                  res.tempKeywords.push(...item)
                }
              })
            }
            return res
          })
        }
        this.loadingShow = false
      })
    },
    getAllComm () {
      this.$http({
        url: this.$http.adornUrl('/communityPost/getAllCommunityPostList.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          communityBlockId: this.plateList[this.tabActive].id
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.dataList = this.dataList.concat(data.list || [])
          if (!this.dataList.length) {
            this.noDataFlag = true
          } else {
            this.noDataFlag = false
          }
          this.loadingShow = false
          this.finished = false
          this.loading = false
          this.afterGetData(data.list.length, this.pageSize)
          this.dataList = this.dataList.map(res => {
            if (res.publishDate) {
              let nowTime = new Date().getTime() - parseInt(res.publishDate)
              if ((nowTime / 60000) < 1) {
                res.createTiming = '刚刚 '
              } else if ((nowTime / 60000) < 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 60) + '分钟前'
              } else if ((nowTime / 60000) >= 60 && (nowTime / 60000) <= 24 * 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 3600) + '小时前'
              } else if ((nowTime / 60000) > 24 * 60 && new Date(parseInt(res.publishDate)).getFullYear() === new Date().getFullYear()) {
                res.createTiming = res.publishDateStr.slice(5)
              } else {
                res.createTiming = res.publishDateStr
              }
            }
            if (res.postKeyword) {
              res.postKeywords = res.postKeyword.split('，')
              res.postKeywords = res.postKeywords.map(inner => {
                return inner.split(',')
              })
              res.tempKeywords = []
              res.postKeywords.forEach(item => {
                if (item[0]) {
                  res.tempKeywords.push(...item)
                }
              })
            }
            return res
          })
        }
        this.loadingShow = false
      })
    },
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.loadingShow = true
      this.dataList = []
      if (this.tabIndex === 1) {
        this.getAllComm()
      } else {
        this.getNewestComm(this.plateList[this.tabActive].id)
      }
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
      if (this.tabIndex === 1) {
        this.pageIndex += 1
        this.getAllComm()
      }
    },
    clickPlate (index) {
      this.dataList = []
      this.$router.push({
        path: '/community',
        query: {
          id: this.plateList[this.tabActive].id,
          type: 0
        }
      })
    },
    touchActive (index) {
      this.loadingShow = true
      this.dataList = []
      this.$router.push({
        path: '/community',
        query: {
          id: this.plateList[this.tabActive].id,
          type: index
        }
      })
      // if (index === 1) {
      //   this.getAllComm()
      // } else {
      //   this.getNewestComm(this.plateList[this.tabActive].id)
      // }
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
    },
    goPage (path, id) {
      this.$router.push({
        path: path,
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .dividing_line{
    height: 0.2rem;
    background: #f5f5f5;
    margin: 0;
  }
  .title_wrap_comm{
    /*height: 3.2rem;*/
    width: 100vw;
    height: 33vw;
    background: url("~@/assets/community-banner.jpg") no-repeat;
    background-size: cover;
  }
  .nav_card{
    /*height: 2rem;*/
    padding-top: 0.3rem;
    .van-button{
      width: 96%;
      border-radius: 0.2rem;
      padding: 0 0.2rem;
      text-align: center;
      color: #ffffff;
      /*font-size: 0.38rem!important;*/
      font-weight: bold;
      /*letter-spacing: 0.12rem;*/
      /*text-indent: 0.12rem;*/
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
    width: 60%;
    height: 0.8rem;
    line-height: 0.8rem;
    margin: 0 auto 0.3rem;
    /deep/.van-tabs .van-tabs__wrap{
      height: 1rem;
      line-height: 1rem;
    }
    /deep/.van-tabs .van-tab .van-tab__text{
      font-size: 0.38rem;
      /*font-weight: bold;*/
    }
  }
  .content{
    padding: 0.3rem 0 0.6rem;
    min-height: 60vh;
    .noDataSvg{
      margin-top: 0;
      text-align: center;
      padding: 2rem 0 5rem;
      border-top: 1px solid #f5f5f5;
      svg{
        font-size: 2.5rem;
      }
    }
    /deep/.van-list{
      .van-list__finished-text{
        font-size: 0.36rem;
      }
    }
    ul li {
      padding: 0.3rem;
      border-top: 1px solid #f5f5f5;
      .comm_first_line{
        margin: 0 0 0.3rem;
        position: relative;
        strong{
          font-size: 0.4rem;
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
      .comm_second_line{
        margin: 0 0 0.3rem;
        font-size: 0.36rem;
        font-weight: normal;
      }
      .comm_third_line{
        margin: 0 0 0.3rem;
        font-size: 0.36rem;
        color: #808080;
        line-height: 0.6rem;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
        /*margin: 0.1rem;*/
      }
      .comm_forth_line{
        margin: 0;
        height: 0.5rem;
        font-size: 0.32rem;
        color: #808080;
        img{
          width: 0.5rem;
          vertical-align: middle;
        }
        .user_name{
          /*font-size: 0.32rem;*/
          margin-left: 0.2rem;
        }
        .comm_time{
          /*font-size: 0.32rem;*/
          /*position: absolute;*/
          /*right: 0.3rem;*/
          color: #808080;
          margin-left: 0.2rem;
        }
        .comm_num{
          position: absolute;
          right: 0.3rem;
          /*font-size: 0.32rem;*/
          /*margin-top: 0.3rem;*/
          color: #808080;
        }
      }
    }
  }
  .write_comm{
    position: fixed;
    right: 0.5rem;
    bottom: 1.2rem;
    background-color: #ffffff;
    border-radius: 0.1rem;
    box-shadow:0 5px 5px rgba(100, 100, 100, .5);
    /*img{*/
      /*width: 1.8rem;*/
    /*}*/
  }
</style>
