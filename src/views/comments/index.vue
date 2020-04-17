<template>
  <div class="comment">
    <div class="dividing_line" ref="commDivider" style="margin-top: 1rem"></div>
    <van-divider :style="{padding: '0 2rem', borderColor: '#ccc', margin: '0.7rem 0 1rem',fontSize: '0.5rem'}">评论专区</van-divider>
    <div class="comment_list">
      <p v-if="discussList && !discussList.length" class="noDataSvg">
        <icon-svg name="暂无数据"></icon-svg>
        <span style="display: block;text-align: center;color: #cccccc;font-size: 0.35rem">暂无评论！</span>
      </p>
      <ul v-else>
        <van-list
          v-model="loading"
          :offset="200"
          :finished="finished"
          :finished-text="finishedText"
          :immediate-check="false"
          @load="onLoad"
        >
        <li v-for="(item, index) in discussList" :key="index">
          <div>
            <!--<span style="display: inline-block;-->
            <!--width: 1rem;-->
            <!--height: 1rem;-->
            <!--background-color: rgb(219, 219, 219);-->
            <!--border-radius: 50%;-->
            <!--text-align: center;-->
            <!--color: #ffffff;font-size: 0.8rem;-->
            <!--overflow: hidden">{{item.createUserName}}</span>-->
            <img src="@/assets/default_avatar.png">
          </div>
          <div>
            <span>{{item.createUserName}}</span>
            <p style="word-wrap:break-word">{{item.content}}</p>
          </div>
          <div>
            <span>{{item.createTiming}}</span>
          </div>
        </li>
        </van-list>
      </ul>
    </div>
    <div class="write_comment">
      <p v-if="!toWriteComm">
        <input type="text" placeholder="写评论" maxlength="120" @focus="getFocus()" value=""/>
        <span class="like" @click="toCommTop()">
          <i v-if="discussCount !== '0'" style="left: 0.55rem;top: 0.24rem">{{discussCount || 0}}</i>
          <icon-svg name="消息" style="font-size: 0.66rem;vertical-align: middle;position: relative;top: 0.03rem;"></icon-svg>
        </span>
        <!--<van-icon v-if="discussCount !== '0'" name="chat-o" :info="discussCount" size="0.66rem" style="vertical-align: middle;margin-left: 0.4rem;" @click="toCommTop()"/>-->
        <!--<van-icon v-else name="chat-o" size="0.66rem" style="vertical-align: middle;margin-left: 0.4rem;" @click="toCommTop()"/>-->
        <span v-if="!isCollected" @click="addCollection()"><icon-svg name="收藏" style="font-size: 0.66rem;vertical-align: middle"></icon-svg></span>
        <span v-else @click="cancelCollection()"><icon-svg name="已收藏" style="font-size: 0.66rem;vertical-align: middle;"></icon-svg></span>
        <span class="like" v-if="!isLike" @click="addLike()">
          <i v-if="productMainInfo.likesCount && productMainInfo.likesCount !== '0'">{{productMainInfo.likesCount || 0}}</i>
          <icon-svg name="点赞" style="font-size: 0.66rem;vertical-align: middle"></icon-svg>
        </span>
        <span class="like" v-else @click="cancelLike()">
          <i v-if="productMainInfo.likesCount && productMainInfo.likesCount !== '0'">{{productMainInfo.likesCount || 0}}</i>
          <icon-svg name="已点赞" style="font-size: 0.66rem;vertical-align: middle"></icon-svg>
        </span>
        <span @click="cutPage()"><icon-svg name="分享" style="font-size: 0.66rem;vertical-align: middle"></icon-svg></span>
      </p>
      <p class="send_comm" v-else>
        <input ref="comm" type="text" placeholder="写评论" maxlength="120" v-model="commValue"/>
        <span v-if="commValue.length" @click="addComm()"><icon-svg name="发送" style="font-size: 0.6rem;vertical-align: middle"></icon-svg></span>
        <span v-else style="font-size: 0.36rem;color: #595959;" @click="resetInput()">取消</span>
      </p>
    </div>
  </div>
</template>
<script>
import {Toast, Notify} from 'Vant'
export default {
  props: {
    productMainInfo: {
      type: Object
    }
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      clickFlag: true,
      isLike: false,
      isCollected: false,
      toWriteComm: false,
      commValue: '',
      finished: true,
      finishedText: '',
      discussList: [],
      discussCount: '0'
    }
  },
  mounted () {
  },
  watch: {
    'productMainInfo' () {
      this.init()
    }
  },
  methods: {
    init () {
      this.pageIndex = 1
      this.discussList = []
      this.getCommList()
    },
    onLoad () {
      this.pageIndex += 1
      this.getCommList()
    },
    getCommList () {
      this.$http({
        url: this.$http.adornUrl('/product/getContentInfo.action'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.productMainInfo.productId,
          page: this.pageIndex,
          pageSize: this.pageSize
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.discussList = this.discussList.concat(data.discussList)
          this.discussCount = data.discussCount
          // this.loadingShow = false
          this.finished = false
          this.loading = false
          this.afterGetData(data.discussList.length, this.pageSize)
          this.discussList = this.discussList.map(res => {
            if (res.createTime) {
              let nowTime = new Date().getTime() - parseInt(res.createTime)
              if ((nowTime / 60000) < 1) {
                res.createTiming = '刚刚 '
              } else if ((nowTime / 60000) < 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 60) + '分钟前'
              } else if ((nowTime / 60000) >= 60 && (nowTime / 60000) <= 24 * 60) {
                res.createTiming = parseInt(parseInt(nowTime / 1000) / 3600) + '小时前'
              } else if ((nowTime / 60000) > 24 * 60 && new Date(parseInt(res.createTime)).getFullYear() === new Date().getFullYear()) {
                res.createTiming = res.createTimeStr.slice(5)
              } else {
                res.createTiming = res.createTimeStr
              }
            }
            return res
          })
          if (this.productMainInfo.collected && this.productMainInfo.collected.toString() !== '0') {
            this.isCollected = true
          }
          if (this.productMainInfo.liked && this.productMainInfo.liked.toString() !== '0') {
            this.isLike = true
          }
        }
      })
    },
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.discussList.length < pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.discussList.length) {
          this.noDataFlag = true
          this.finishedText = ''
        }
      }
      this.isLoading = false
    },
    cutPage () {
      this.$emit('cutPage')
    },
    toCommTop () {
      this.$refs.commDivider.scrollIntoView()
    },
    addCollection () {
      this.$http({
        url: this.$http.adornUrl('/interaction/addCollection.action'),
        method: 'get',
        params: this.$http.adornParams({
          productId: this.productMainInfo.productId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.isCollected = true
          Toast.success('已收藏')
          this.$emit('refreshData')
        }
      })
    },
    cancelCollection () {
      this.$http({
        url: this.$http.adornUrl('/interaction/cancelCollection.action'),
        method: 'get',
        params: this.$http.adornParams({
          productId: this.productMainInfo.productId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.isCollected = false
          Toast.success('已取消收藏')
          this.$emit('refreshData')
        }
      })
    },
    addLike () {
      this.$http({
        url: this.$http.adornUrl('/interaction/addLikes.action'),
        method: 'get',
        params: this.$http.adornParams({
          productId: this.productMainInfo.productId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.isLike = true
          Toast.success('已点赞')
          this.$emit('refreshData')
        }
      })
    },
    cancelLike () {
      this.$http({
        url: this.$http.adornUrl('/interaction/cancelLikes.action'),
        method: 'get',
        params: this.$http.adornParams({
          productId: this.productMainInfo.productId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.isLike = false
          Toast.success('已取消点赞')
          this.$emit('refreshData')
        }
      })
    },
    resetInput () {
      this.toWriteComm = false
    },
    getFocus () {
      this.toWriteComm = true
      this.commValue = ''
      this.$nextTick(() => {
        this.$refs.comm.focus()
      })
    },
    addComm () {
      if (!this.clickFlag) {
        return
      }
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 3000)
      this.$http({
        url: this.$http.adornUrl('/interaction/addDiscuss.action'),
        method: 'post',
        data: this.$http.adornData({
          productId: this.productMainInfo.productId,
          content: this.commValue
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          Toast.success('评论成功')
          this.toWriteComm = false
          this.getCommList()
          this.$emit('refreshData')
        } else {
          Notify({ type: 'danger', message: '最多输入三个关键词' })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .comment{
    .dividing_line{
      height: 0.2rem;
      background: #f5f5f5;
      margin-top: 0.5rem;
    }
    .comment_list{
      margin-bottom: 1rem;
      .noDataSvg {
        text-align: center;
        svg {
          font-size: 2rem;
        }
      }
      ul li {
        padding: 0 0.6rem;
        margin-top: 0.5rem;
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
          margin-right: 0.2rem;
        }
        div:nth-child(2) {
          width: 70%;
          span{
            display: block;
            font-size: 0.42rem;
            height: 1rem;
            line-height: 1rem;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          p{
            margin: 0;
            color: #595959;
            font-size: 0.36rem;
          }
        }
        div:nth-child(3) {
          position: absolute;
          right: 0.3rem;
          top: 0.12rem;
        }
      }
    }
    .write_comment {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 1.5rem;
      line-height: 1.5rem;
      background-color: #ffffff;
      p{
        border-top: 1px solid #cccccc;
        width: 90%;
        margin: 0 auto;
        input{
          width: 3.6rem;
          height: 0.8rem;
          line-height: 0.8rem;
          border-radius: 0.3rem;
          border: 0;
          background-color: #f5f5f5;
          padding-left: 0.3rem;
          margin-left: 0.3rem;
          vertical-align: middle;
        }
        span{
          margin-left: 0.36rem;
          display: inline-block;
        }
        .like{
          position: relative;
          i{
            display: inline-block;
            height: 0.35rem;
            line-height: 0.35rem;
            text-align: center;
            border-radius: 0.35rem;
            padding: 0 0.1rem;
            font-size: 0.28rem;
            background-color: #ee0a24;
            color: #ffffff;
            font-style: normal;
            /*font-weight: bold;*/
            position: absolute;
            top: 0.24rem;
            left: 0.4rem;
          }
        }
      }
      .send_comm {
        input{
          width: 75%;
        }
        /*span{*/
          /*background-color: #ee0a24;*/
          /*height: 0.7rem;*/
          /*line-height: 0.7rem;*/
          /*vertical-align: middle;*/
          /*color: #ffffff;*/
          /*font-size: 0.4rem;*/
          /*padding: 0 0.2rem;*/
          /*border-radius: 0.1rem;*/
        /*}*/
      }
    }
  }
</style>
