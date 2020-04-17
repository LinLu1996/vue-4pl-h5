<template>
  <div class="personal">
    <div class="title"></div>
    <div class="card">
      <div class="user_name">{{userName}}</div>
      <div class="edit_person" style="position: relative; top: 0.1rem">{{greetWord}}</div>
      <div class="edit">{{sentence}}</div>
      <div class="card-footer">
        <div class="record" @click="footmark()">
          <div class="travel_num" style="position: relative; top: 0.02rem">{{num}}</div>
          <div class="travel_record">浏览记录</div>
        </div>
        <div class="comment">
          <div class="comment_num" style="position: relative; top: 0.02rem">{{counts}}</div>
          <div class="comment_record" @click="goReceiveComments()">收到评论</div>
        </div>
      </div>
  </div>
    <div class="content">
      <div class="content-up">
        <div class="up-left" @click="goCollect()">
        <div class="collect-img"><img src="@/assets/shoucang.png"></div>
        <div class="collect-description">收藏</div>
        </div>
        <div class="up-right" @click="goFocus()">
          <div class="focus-img"><img src="@/assets/guanzhu.png"></div>
          <div class="focus-description">关注</div>
        </div>
      </div>
      <div class="content-down">
          <div class="down-left" @click="goInvitation()">
            <div class="invitation-img"><img src="@/assets/tiezi.png"></div>
            <div class="invitation-description">帖子</div>
          </div>
          <div class="down-right" @click="goPage('/blank2', 'INFO')">
            <div class="message-img"><img src="@/assets/xiaoxi.png"></div>
            <div class="message-description">消息</div>
          </div>
      </div>
</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      num: '',
      counts: '',
      sentence: '',
      greetWord: '',
      userName: ''
    }
  },
  created () {
    this.getTravelNum()
    this.getCommentNum()
    this.getSentence()
  },
  methods: {
    // 获取旅行记录的数量
    getTravelNum () {
      this.$http({
        url: this.$http.adornUrl('/readMark/getReadMarkCounts.action'),
        method: 'get',
        params: this.$http.adornParams({
        }, false)
      }).then(({data}) => {
        if (data) {
          // console.log(data)
          this.num = data.data
        }
      })
    },
    // 获取收到评论的数量
    getCommentNum () {
      this.$http({
        url: this.$http.adornUrl('/communityPostReply/getPostReplyCounts.action'),
        method: 'get',
        params: this.$http.adornParams({
        }, false)
      }).then(({data}) => {
        if (data) {
          // console.log(data)
          this.counts = data.counts
        }
      })
    },
    // 获取正能量语句
    getSentence () {
      this.$http({
        url: this.$http.adornUrl('/energyAction/getEnergyByCurTime.action'),
        method: 'get',
        params: this.$http.adornParams({}, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.sentence = data.info.content
          this.greetWord = data.info.greetWord
          this.userName = data.info.userName
        }
      })
    },
    // 点击收藏
    goCollect () {
      this.$router.push('/collect')
    },
    // 点击帖子
    goInvitation () {
      this.$router.push('/invitation')
    },
    // 点击足迹
    footmark () {
      this.$router.push('/footmark')
    },
    // 点击关注
    goFocus () {
      this.$router.push('/focus')
    },
    // 点击测试
    text () {
      this.$router.push('/text')
    },
    goReceiveComments () {
      this.$router.push('/receiveComments')
    },
    goPage (path, type) {
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .personal{
    width:100%;
    height:110vh;
    .title{
      width: 100%;
      height:5rem;
      background:url("~@/assets/personal-bg.png") no-repeat;
      background-size: 100% 4rem;
      color:white;
      text-align: center;
      padding-top: 0.4rem;
      font-size: 0.45rem;
    }
    .card{
      width:88%;
      border-radius: 3%;
      /*height: 4rem;*/
      text-align: center;
      margin: 0 auto;
      background:url("~@/assets/card-bg.png") no-repeat;
      background-size: cover;
      position: relative;
      margin-top: -39%;
      box-shadow:5px 5px 5px rgba(0,0,0,0.2);
      .user_photo{
        display: inline-block;
        width:1.8rem;
        height:1.8rem;
        margin:0.1rem auto;
        border-radius: 50%;
      }
      .user_name{
        width: 100%;
        text-align: center;
        font-size: 0.5rem;
        font-weight: 600;
        padding-top: 0.55rem;
      }
      .edit_person{
        width:100%;
        text-align: center;
        font-size:0.35rem;
        color:#6A6A6A;
        padding-top: 0.2rem;
      }
      .edit{
        width:100%;
        text-align: center;
        font-size:0.35rem;
        color:#6A6A6A;
        /*padding-top: 0.2rem;*/
      }
     .card-footer{
       width:100%;
       display: flex;
       justify-content: space-around;
       padding-top: 0.4rem;
       padding-bottom: 0.45rem;
       .record{
         width:20%;
         display: inline-block;
         .travel_num{
           width:1.4rem;
           font-size: 0.4rem;
           font-weight: 600;
           text-align: center;
           padding:0.2rem 0.2rem 0rem 0.2rem;
           color: #686868;
           line-height: 0.8;
         }
         .travel_record{
           font-size:0.35rem;
           color:#6A6A6A;
         }
       }
       .comment{
         width:20%;
         display:inline-block;
         .comment_num{
           width:1.4rem;
           font-size: 0.4rem;
           font-weight: 600;
           text-align: center;
           padding:0.2rem 0.2rem 0rem 0.2rem;
           color: #686868;
           line-height: 0.8;
         }
         .comment_record{
           font-size:0.35rem;
           color:#6A6A6A;
         }
       }
     }
    }
    .content{
      width: 80%;
      margin-left: 10%;
      .content-up,.content-down{
        width:100%;
        display: flex;
        justify-content: space-around;
      }
      .down-left,.down-right{
        margin-bottom: 1.5rem;
      }
      .up-left,.down-left,.up-right,.down-right{
        width: 25%;
        /*margin: 0.2rem auto;*/
        margin-top:1rem;
        .collect-img,.invitation-img,.focus-img,.message-img{
          width: 100%;
          text-align: center;
          img{
            width: 45%;
          }
        }
        .collect-description,.message-description,.invitation-description,.focus-description{
          width: 100%;
          font-size:0.5rem;
          text-align: center;
          font-weight: 550;
          color: #8a8a8a;
          margin-top: 0.2rem;
        }
      }
    }
  }
  </style>
