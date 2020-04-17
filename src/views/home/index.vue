<template>
  <div>
    <div class="banner" v-lazy:background-image="backImg">
      <title-search></title-search>
      <div class="text_wrap">
        <h1>中国移动 IT能力库</h1>
        <p>创无限通信世界，做信息社会栋梁</p>
      </div>
    </div>
    <div class="main_nav_wrap">
      <div class="nav nav1" @click="goPage('/list', '产品')">
        <!--<span>图标<br />设计</span>-->
        <img v-lazy="nav1Img">
        <strong>产品</strong>
      </div>
      <div class="nav nav2" @click="goPage('/list', '解决方案')">
        <!--<span>图标<br />设计</span>-->
        <img v-lazy="nav2Img">
        <strong>解决方案</strong>
      </div>
      <div class="nav nav3" @click="goPage('/list', '服务')">
        <!--<span>图标<br />设计</span>-->
        <img v-lazy="nav3Img">
        <strong>服务</strong>
      </div>
      <div class="nav nav4" @click="goPage('/community', '服务')">
        <!--<span>图标<br />设计</span>-->
        <img v-lazy="nav4Img">
        <strong>社区</strong>
      </div>
    </div>
    <div class="content_wrap">
      <div class="dividing_line" style="margin-top: 0.1rem"></div>
      <div class="hot_content content">
        <div class="content_title">
          <p>
            <!--<icon-svg name="热门" style="vertical-align: text-top"></icon-svg>-->
            <span>热门推荐</span>
          </p>
          <p>
            <span @click="goPage('/list', '热门')">更多<icon-svg name="更多" style="vertical-align: baseline;font-size: 0.26rem"></icon-svg></span>
          </p>
        </div>
        <div class="content_main_wrap" v-lazy:background-image="hotBg">
          <p class="hot_content_title"><icon-svg name="hot" style="vertical-align: sub;font-size: 0.6rem"></icon-svg> 火热发布，选您所需</p>
          <div class="content_main">
            <div class="img_wrap" v-for="(item, index) in hotList" :key="index" @click="goDetail('/detail', item.productId)">
              <van-image
                height="3.3rem"
                fit="contain"
                :src="tempImg[index]"
              />
              <!--:src="getBaseUrl + item.cover"-->
              <p>{{item.productName}}</p>
            </div>
            <!--<div class="img_wrap">-->
              <!--<van-image-->
                <!--height="3.3rem"-->
                <!--fit="contain"-->
                <!--src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580884888767&di=61d50ae835d7c6ed513be178cd58040b&imgtype=0&src=http%3A%2F%2Fpic174.nipic.com%2Ffile%2F20180726%2F21511972_152024711000_2.jpg"-->
              <!--/>-->
              <!--<p>服务于产品一线</p>-->
            <!--</div>-->
            <!--<div class="img_wrap">-->
              <!--<van-image-->
                <!--height="3.3rem"-->
                <!--fit="contain"-->
                <!--src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580884328229&di=c2507edd1ee13233136291833d7826fc&imgtype=0&src=http%3A%2F%2Fpic.912pic.com%2F19%2F93%2F1993d0a45b10d4165a8bbc40ba30c48e.jpg"-->
              <!--/>-->
              <!--<p>服务于产品一线</p>-->
            <!--</div>-->
          </div>
        </div>
        <!--<util-list :list="hotList" :loadingShow="loadingShow"></util-list>-->
      </div>
      <div class="dividing_line"></div>
      <div class="new_content content">
        <div class="content_title">
          <p>
            <!--<icon-svg name="最新" style="vertical-align: text-top"></icon-svg>-->
            <span>最新发布</span>
          </p>
          <p>
            <span @click="goPage('/list', '最新')">更多<icon-svg name="更多" style="vertical-align: baseline;font-size: 0.26rem"></icon-svg></span>
          </p>
        </div>
        <util-list :list="newList" :noBorder="true" :loadingShow="loadingShow"></util-list>
      </div>
    <div class="dividing_line"></div>
    <div class="content_banner">
      <!--<div class="content">-->
        <!--<div class="content_title">-->
          <!--<p>-->
            <!--<span>|</span>-->
            <!--<span>年度评选</span>-->
          <!--</p>-->
          <!--&lt;!&ndash;<p>&ndash;&gt;-->
            <!--&lt;!&ndash;<span @click="goPage('/list', '热门')">更多></span>&ndash;&gt;-->
          <!--&lt;!&ndash;</p>&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
      <div class="img_wrap" style="margin-top: 0.5rem;" @click="goPage('/blank', 'FYB')">
        <img v-lazy="contentBanner1">
      </div>
      <div class="dividing_line"></div>
      <div class="content">
        <div class="content_title">
          <p>
            <!--<icon-svg name="专题" style="vertical-align: text-top"></icon-svg>-->
            <span>专题板块</span>
          </p>
          <!--<p>-->
            <!--<span @click="goPage('/list', '热门')">更多></span>-->
          <!--</p>-->
        </div>
      </div>
      <div v-for="(item, index) in specialTopicList" :key="index" class="img_wrap" @click="goDetail('/special-topic', item.id, item.cover)">
        <img style="height: 3rem" v-lazy="item.cover">
        <!--<img v-lazy="contentBanner[index]">-->
      </div>
      <!--<div class="dividing_line"></div>-->
    </div>
    <div class="dividing_line"></div>
    <div class="content video_content">
      <div class="content_title">
        <p>
          <!--<icon-svg name="视频" style="vertical-align: text-top"></icon-svg> -->
          <span>视频专区</span>
        </p>
        <!--<p>-->
        <!--<span @click="goPage('/list', '热门')">更多></span>-->
        <!--</p>-->
      </div>
      <video-player></video-player>
    </div>
  </div>
    <div class="bottom_wrap">
      <div>
        <p>中国移动 ｜ IT能力库</p>
        <p><span @click="goPage('/blank1', 'ABOUT')">关于我们</span></p>
      </div>
      <div>
        <p>热门产品</p>
        <p class="temp_pro">
          <span @click="goDetail('/detail', '2b946c7f36cd4074b7284a5ff6578aa2')">AI智能稽核全网支撑</span>
          <span @click="goDetail('/detail', 'a25d248a29904237834e8cee1c8dca74')">智慧办公平台</span>
          <span @click="goDetail('/detail', 'e9702deccdd44bfc90430a0c454042ff')">CA数字证书</span>
        </p>
      </div>
      <div>
        <p>热门解决方案</p>
        <p class="temp_pro">
          <span @click="goDetail('/detail', '7482424599e746bb8850143cef4b2f72')">萤火魔方自助营销平台</span>
          <span @click="goDetail('/detail', '85371f2343214991870b51910780ce28')">飞书必达统一消息推送平台</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import titleSearch from '@/components/titleSearch'
import utilList from '@/components/utilList'
import videoPlayer from '@/components/videoPlayer'
import { mapGetters } from 'Vuex'
export default {
  data () {
    return {
      backImg: require('@/assets/mobile-banner.png'),
      nav1Img: require('@/assets/main-nav1.png'),
      nav2Img: require('@/assets/main-nav2.png'),
      nav3Img: require('@/assets/main-nav3.png'),
      nav4Img: require('@/assets/main-nav4.png'),
      tempImg: {
        0: require('@/assets/temp1.jpg'),
        1: require('@/assets/temp2.jpg'),
        2: require('@/assets/temp3.jpg')
      },
      contentBanner1: require('@/assets/content_banner1.png'),
      contentBanner: {
        0: require('@/assets/content_banner2.png'),
        1: require('@/assets/content_banner3.png')
      },
      hotBg: require('@/assets/hot_bg.png'),
      newList: [],
      hotList: [],
      specialTopicList: [],
      loadingShow: false
    }
  },
  components: {
    titleSearch,
    utilList,
    videoPlayer
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  created () {
    this.getDataList()
    this.getSpecialTopicList()
  },
  methods: {
    goPage (path, type) {
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      })
    },
    goDetail (path, id, cover) {
      this.$router.push({
        path: path,
        query: {
          id: id,
          name: '全部',
          cover: cover
        }
      })
    },
    getDataList () {
      this.loadingShow = true
      this.$http({
        url: this.$http.adornUrl('/product/getHome.action'),
        method: 'get',
        params: this.$http.adornParams({
          'name': this.menu
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.hotList = data.map.popular
          this.newList = data.map.latest
        } else {
          this.hotList = []
          this.newList = []
        }
        this.loadingShow = false
      })
    },
    getSpecialTopicList (index) {
      this.$http({
        url: this.$http.adornUrl('/specialSubject/getList.action'),
        method: 'get',
        params: this.$http.adornParams({
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.specialTopicList = data.list
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
    margin-top: 0.5rem;
  }
  .banner{
    height: 5rem;
    /*padding-top: 0.6rem;*/
    /*background: url("~@/assets/mobile-banner.png") no-repeat;*/
    background-size: cover;
    .text_wrap{
      color: #fff;
      margin-left: 0.6rem;
      h1{
        font-size: 0.6rem;
        font-weight: normal;
      }
      p{
        font-size: 0.4rem;
      }
    }
  }
  .main_nav_wrap{
    display: flex;
    justify-content: space-around;
    /*margin-top: 0.2rem;*/
    .nav{
      width: 1.5rem;
      height: 1.5rem;
      position: relative;
      text-align: center;
      img{
        display: block;
        margin: 0.5rem auto 0.15rem;
        width: 0.9rem;
        height: 0.9rem;
      }
      /*span{*/
        /*position: absolute;*/
        /*top: 22%;*/
        /*left: 25%;*/
        /*display: inline-block;*/
        /*width: 0.8rem;*/
        /*color: #fff;*/
        /*font-size: 0.26rem;*/
      /*}*/
      strong{
        font-size: 0.35rem;
        color: #333333;
      }
    }
  }
  .content_wrap{
    margin-top: 0.6rem;
    padding: 0.2rem;
    .content{
      padding: 0;
      .content_title{
        height: 1.3rem;
        padding-right: 0.3rem;
        padding-left: 0.2rem;
        p{
          display: inline-block;
        }
        p:nth-child(1) {
          color: #333333;
          font-size: 0.45rem;
          font-weight: bold;
        }
        p:nth-child(2) {
          float: right;
          color: #aaa;
          font-size: 0.35rem;
          margin-top: 0.5rem;
        }
      }
    }
    .video_content{
      padding-bottom: 0.4rem;
    }
    .hot_content{
      .content_main_wrap{
        height: 6rem;
        background-size: cover;
        .hot_content_title{
          color: #666666;
          font-size: 0.4rem;
          padding: 0.2rem 0.2rem 0 0.2rem;
          margin-top: 0;
          font-weight: bold;
        }
        .content_main{
          display: flex;
          justify-content: space-around;
          .img_wrap{
            width: 30%;
            p{
              text-align: center;
              font-size: 0.35rem;
              color: #0d1a26;
              margin-top: 0.2rem;
            }
          }
        }
      }
    }
  }
  .content_banner{
    /*margin-top: 0.5rem;*/
    .img_wrap{
      width: 100%;
      img{
        width: 100%;
      }
    }
  }
  .bottom_wrap{
    background: #333;
    color: #ccc;
    border-bottom: 1px solid #ccc;
    padding-bottom: 0.6rem;
    padding-top: 0.5rem;
    div{
      margin-left: 0.6rem;
    }
    p:nth-child(1){
      display: inline-block;
      margin: 0;
      font-weight: bold;
      padding: 0 0 0.1rem;
      border-bottom: 1px solid #ccc;
    }
    p:nth-child(2){
      margin: 0.1rem 0;
      padding: 0 0 0.2rem;
    }
    .temp_pro{
      span{
        margin-right: 0.3rem;
      }
    }
  }
</style>
