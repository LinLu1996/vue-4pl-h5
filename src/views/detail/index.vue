<template>
  <div>
    <!--<div class="title_wrap">-->
    <!--</div>-->
    <div style="height: 80vh;" v-if="loadingDetail">
      <van-loading style="margin-top: 3rem"  size="24px" vertical>加载中...</van-loading>
    </div>
    <div id="content" v-else>
      <div class="banner">
        <title-search></title-search>
        <!--<div style="color: #ffffff;text-align: center">{{productMainInfo.productName}}</div>-->
        <p style="margin-top: 0.3rem;line-height: 0.8rem;">{{productMainInfo.productName}}</p>
        <!--<p class="animated pulse">-->
        <p>
          <span>系统负责人：{{productMainInfo.systemPerson}}</span>
          <br/>
          <span>联系方式：{{productMainInfo.contactPhone}}</span>
        </p>
      </div>
      <div class="classification">
        <!--<p class="detail_nav animated fadeIn">-->
        <p class="detail_nav">
          <span>
            {{productMainInfo.parentCategoryName}} > {{productMainInfo.categoryName}}
          </span>
        </p>
        <!--<p class="animated bounceInRight">产品 > 大型收割机</p>-->
      </div>
      <div class="product" v-for="(item,index) in contentInfo" :key="index">
        <div class="dividing_line" style="margin-top: 1rem" v-if="index !== 0"></div>
        <h2>
          <van-divider :style="{padding: '0 2rem', borderColor: '#ccc',fontSize: '0.5rem'}">{{item.contentAreaName}}</van-divider>
          <!--<icon-svg name="竖线" style="vertical-align: text-top"></icon-svg>-->
        </h2>
        <div class="product_info">
          <tpl01 v-if="contentInfo.find(res => res.templateId === 'template01' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template01' && res.contentArea === item.contentArea).groupList : []" ref="tpl01"></tpl01>
          <tpl02 v-if="contentInfo.find(res => res.templateId === 'template02' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template02' && res.contentArea === item.contentArea).groupList : []" ref="tpl02"></tpl02>
          <tpl03 v-if="contentInfo.find(res => res.templateId === 'template03' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template03' && res.contentArea === item.contentArea).groupList : []" ref="tpl03"></tpl03>
          <tpl04 v-if="contentInfo.find(res => res.templateId === 'template04' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template04' && res.contentArea === item.contentArea).groupList : []" ref="tpl04"></tpl04>
          <tpl05 v-if="contentInfo.find(res => res.templateId === 'template05' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template05' && res.contentArea === item.contentArea).groupList : []"></tpl05>
          <tpl06 v-if="contentInfo.find(res => res.templateId === 'template06' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template06' && res.contentArea === item.contentArea).groupList : []"></tpl06>
          <tpl07 v-if="contentInfo.find(res => res.templateId === 'template07' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template07' && res.contentArea === item.contentArea).groupList : []"></tpl07>
          <tpl08 v-if="contentInfo.find(res => res.templateId === 'template08' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template08' && res.contentArea === item.contentArea).groupList : []"></tpl08>
          <tpl09 v-if="contentInfo.find(res => res.templateId === 'template09' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template09' && res.contentArea === item.contentArea).groupList : []"></tpl09>
          <tpl10 v-if="contentInfo.find(res => res.templateId === 'template10' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template10' && res.contentArea === item.contentArea).groupList : []" ref="tpl10"></tpl10>
          <tpl11 v-if="contentInfo.find(res => res.templateId === 'template11' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template11' && res.contentArea === item.contentArea).groupList : []"></tpl11>
          <tpl12 v-if="contentInfo.find(res => res.templateId === 'template12' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template12' && res.contentArea === item.contentArea).groupList : []" ref="tpl12"></tpl12>
          <tpl13 v-if="contentInfo.find(res => res.templateId === 'template13' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template13' && res.contentArea === item.contentArea).groupList : []" ref="tpl13"></tpl13>
          <tpl14 v-if="contentInfo.find(res => res.templateId === 'template14' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template14' && res.contentArea === item.contentArea).groupList : []"></tpl14>
          <tpl15 v-if="contentInfo.find(res => res.templateId === 'template15' && res.contentArea === item.contentArea)" :tplInfo="contentInfo.length ? contentInfo.find(res => res.templateId === 'template15' && res.contentArea === item.contentArea).groupList : []"></tpl15>
        </div>
      </div>
    </div>
    <comments @cutPage="cutPage" @refreshData="getDataInfo()" :productMainInfo="productMainInfo"></comments>
    <van-popup v-model="showPopup" :close-on-click-overlay="false" :overlay-style="{backgroundColor: '#fff',opacity: 0.9}"><van-loading type="spinner" color="#1989fa" vertical>资源准备中...</van-loading></van-popup>
    <!--<img :src="imgUrl" style="width: 100%" crossOrigin="anonymous"> 3.0.0-->
  </div>
</template>
<script>
import titleSearch from '@/components/titleSearch'
import comments from '../comments/'
import html2canvas from 'html2canvas'
import tpl01 from './detail-tpls/tpl-01'
import tpl02 from './detail-tpls/tpl-02'
import tpl03 from './detail-tpls/tpl-03'
import tpl04 from './detail-tpls/tpl-04'
import tpl05 from './detail-tpls/tpl-05'
import tpl06 from './detail-tpls/tpl-06'
import tpl07 from './detail-tpls/tpl-07'
import tpl08 from './detail-tpls/tpl-08'
import tpl09 from './detail-tpls/tpl-09'
import tpl10 from './detail-tpls/tpl-10'
import tpl11 from './detail-tpls/tpl-11'
import tpl12 from './detail-tpls/tpl-12'
import tpl13 from './detail-tpls/tpl-13'
import tpl14 from './detail-tpls/tpl-14'
import tpl15 from './detail-tpls/tpl-15'
export default {
  data () {
    return {
      infoId: '',
      imgUrl: '',
      loadingDetail: false,
      productMainInfo: {
        productName: '',
        parentCategoryName: '',
        categoryName: '',
        systemPerson: '',
        contactPhone: ''
      },
      contentInfo: [],
      showPopup: false
    }
  },
  components: {
    titleSearch,
    comments,
    tpl01,
    tpl02,
    tpl03,
    tpl04,
    tpl05,
    tpl06,
    tpl07,
    tpl08,
    tpl09,
    tpl10,
    tpl11,
    tpl12,
    tpl13,
    tpl14,
    tpl15
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      this.infoId = this.$route.query.id
      this.loadingDetail = true
      this.getDataInfo()
      this.getHistory()
    },
    getHistory () {
      this.$http({
        url: this.$http.adornUrl('/readMark/addReadMark.action'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.$route.query.id,
          sourceType: 1
        }, false)
      }).then(({data}) => {
      })
    },
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl('/product/info.action'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.infoId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.loadingDetail = false
          this.productMainInfo = data.productPO
          this.productMainInfo.discussCount = data.discussCount
          this.productMainInfo.likesCount = data.likesCount
          this.productMainInfo.collected = data.collected
          this.productMainInfo.liked = data.liked
          // this.productMainInfo.discussList = data.discussList
          this.contentInfo = data.contentInfo
        }
      })
    },
    cutPage () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.showPopup = true
      this.$refs['tpl01'] && this.$refs['tpl01'].forEach(res => {
        res.initSwipe()
      })
      this.$refs['tpl02'] && this.$refs['tpl02'].forEach(res => {
        res.initSwipe()
      })
      this.$refs['tpl03'] && this.$refs['tpl03'].forEach(res => {
        res.initSwipe()
      })
      // this.$refs['tpl04'] && this.$refs['tpl04'].forEach(res => {
      //   res.init()
      // })
      // this.$refs['tpl10'] && this.$refs['tpl10'].forEach(res => {
      //   res.init()
      // })
      // this.$refs['tpl12'] && this.$refs['tpl12'].forEach(res => {
      //   res.init()
      // })
      this.$refs['tpl13'] && this.$refs['tpl13'].forEach(res => {
        res.initSwipe()
      })
      setTimeout(() => {
        html2canvas(document.querySelector('#content'), {useCORS: true, logging: true, scale: 1.5}).then(canvas => {
          this.imgUrl = canvas.toDataURL('image/png')
          // let url = canvas.toDataURL('image/png')
          // let arr = url.split(',')
          // let mime = arr[0].match(/:(.*?);/)[1]
          // let bstr = atob(arr[1])
          // let n = bstr.length
          // let u8arr = new Uint8Array(n)
          // while (n--) {
          //   u8arr[n] = bstr.charCodeAt(n)
          // }
          // let blob = new Blob([u8arr], {type: mime})
          // this.imgUrl = window.URL.createObjectURL(blob)
          let size = (this.imgUrl.length / 1024).toFixed(2)
          console.log('大小', size + 'k')
          // window.moaBridge.shareToWeChat({
          //   pattern: window.moaBridge.co.wx.TextMessage,
          //   scene: window.moaBridge.co.wx.SceneSession,
          //   description: {
          //     text: 'Hello, MOA'
          //   }
          // })
          window.moaBridge.shareToWeChat({
            pattern: window.moaBridge.co.wx.ImageMessage,
            scene: window.moaBridge.co.wx.SceneSession,
            description: {
              imageURL: this.imgUrl
            }
          })
          // let a = document.createElement('a')
          // a.setAttribute('style', 'display:none')
          // a.setAttribute('href', saveUrl)
          // a.setAttribute('download', '表情.jpg')
          // // 此写法兼容可火狐浏览器
          // document.body.appendChild(a)
          // a.click()
          //   weChat.share({
          //     message: {
          //       title: 'Hi, there',
          //       description: 'This is description',
          //       thumb: saveUrl,
          //       mediaTagName: 'TEST-TAG-001',
          //       messageExt: '这是第三方带的测试字段',
          //       media: {
          //         type: weChat.Type.IMAGE,
          //         image: saveUrl
          //       }
          //     },
          //     scene: weChat.Scene.SESSION
          //   }, function () {
          //     alert('success')
          //   }, function (reason) {
          //     alert('Failed: ' + reason)
          //   })
        }).then(() => {
          // this.$refs['tpl04'] && this.$refs['tpl04'].forEach(res => {
          //   res.initHide()
          // })
          // this.$refs['tpl10'] && this.$refs['tpl10'].forEach(res => {
          //   res.initHide()
          // })
          // this.$refs['tpl12'] && this.$refs['tpl12'].forEach(res => {
          //   res.initHide()
          // })
          this.$refs['tpl01'] && this.$refs['tpl01'].forEach(res => {
            res.resetSwipe()
          })
          this.$refs['tpl02'] && this.$refs['tpl02'].forEach(res => {
            res.resetSwipe()
          })
          this.$refs['tpl03'] && this.$refs['tpl03'].forEach(res => {
            res.resetSwipe()
          })
          this.$refs['tpl13'] && this.$refs['tpl13'].forEach(res => {
            res.resetSwipe()
          })
          this.$http({
            url: this.$http.adornUrl('/interaction/addShare.action'),
            method: 'get',
            params: this.$http.adornParams({
              productId: this.productMainInfo.productId
            }, false)
          }).then(({data}) => {
            if (data && data.status === 'success') {
              console.log('分享成功')
            }
          })
        }).then(() => {
          this.showPopup = false
        })
      }, 500)
      // setTimeout(() => {
      // }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
  .title_wrap{
    /*background: url("~@/assets/mobile-top-bg.png") no-repeat;*/
    /*background-size: cover;*/
  }
  .dividing_line{
    height: 0.2rem;
    background: #f5f5f5;
    margin-top: 0.5rem;
  }
  .classification{
    padding-left: 0.2rem;
    color: #666;
    font-size: 0.35rem;
    .detail_nav{
      /*color: #2e4cac;*/
      font-size: 0.38rem;
      span{
        padding: 0.1rem;
        background-image: url("~@/assets/detail-nav-bg.png");
        background-size: cover;
      }
    }
  }
  .banner {
    height: 4.8rem;
    background: url("~@/assets/detail-banner.png") no-repeat;
    background-size: cover;
    /*padding-top: 1rem;*/
    p{
      color: #ffffff;
      margin-top: 0;
      text-align: center;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.6rem;
    }
    p:nth-child(3) {
      height: 0.8rem;
      font-size: 0.4rem;
      line-height: 0.6rem;
    }
  }
  .product{
    margin-top: 0.6rem;
    h2{
      font-size: 0.45rem;
      color: #666;
      /*padding-left: 0.3rem;*/
      margin: 0.7rem 0 1rem;
      text-align: center;
      font-weight: normal;
    }
    .product_info{
      /*background-color: red;*/
      width: 92%;
      padding: 0.2rem;
      margin: 0 auto;
      /*box-shadow:0 0 5px rgba(100, 100, 100, .5);*/
      /*img{*/
        /*display: block;*/
        /*width: 70%;*/
        /*margin: 0 auto;*/
      /*}*/
      /*p{*/
        /*padding: 0 0.6rem;*/
        /*text-indent: 0.6rem;*/
      /*}*/
    }
    .product_function{
      div{
        width: 94%;
        margin: 0 auto;
        border-bottom: 4px solid #ccc;
        img{
          display: block;
          width: 100%;
        }
      }
    }
    .product_advantage{
      text-align: center;
      color: #cccccc;
      font-size: 0.4rem;
      margin-bottom: 0.6rem;
    }
  }
  .comment{
    .comment_list{
      margin-bottom: 1rem;
      ul li {
        padding: 0 0.6rem;
        margin-top: 0.2rem;
        position: relative;
        div {
          display: inline-block;
          img{
            width: 1rem;
          }
        }
        div:nth-child(1) {
          width: 10%;
          vertical-align: top;
        }
        div:nth-child(2) {
          width: 70%;
          span{
            display: block;
            font-size: 0.4rem;
            height: 1rem;
            line-height: 0.9rem;
          }
          p{
            margin: 0;
          }
        }
        div:nth-child(3) {
          position: absolute;
          right: 0.25rem;
          bottom: 0.25rem;
        }
      }
    }
    .write_comment {
      height: 1.5rem;
      line-height: 1.5rem;
      p{
        border-top: 1px solid #cccccc;
        width: 90%;
        margin: 0 auto;
        input{
          width: 3.6rem;
          height: 0.8rem;
          border-radius: 0.3rem;
          border: 0;
          background-color: #f5f5f5;
          padding-left: 0.3rem;
          margin-left: 0.3rem;
        }
        span{
          margin-left: 0.4rem;
          display: inline-block;
        }
      }
    }
  }
</style>
