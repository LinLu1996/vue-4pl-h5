<template>
  <div class="invitationContent">
    <div class="content" v-for="(item, index) in content"  :key="index" @click="goPage(item.id)">
            <ul>
              <li>
                <p class="comm_first_line">
                  <strong>{{item.postTitle}}</strong>
                </p>
                <h3 class="comm_second_line">
                  <span v-for="(item, index) in item.tempKeywords" :key="index">
                    #{{item}}
                  </span>
                </h3>
                <p class="comm_third_line">{{item.postContent}}</p>
                <p class="comm_forth_line">
                  <span class="comm_time">{{item.publishDateStr}}</span>
                  <span class="comm_num">
                    <icon-svg name="评论" style="vertical-align: middle;font-size: 0.48rem"></icon-svg>
                    {{item.replyCount}}</span>
                </p>
              </li>
            </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false,
      refreshFlag: false,
      loading: false,
      finished: true,
      finishedText: '',
      loadingShow: false
    }
  },
  methods: {
    goPage (id) {
      this.$router.push({
        path: '/comm-detail',
        query: {
          id: id
        }
      })
    }
  },
  props: ['content']
}
</script>
<style lang="less" scoped>
  .invitationContent{
    width:100%;
    .content{
      /*padding: 0.3rem 0 0.6rem;*/
      /*min-height: 60vh;*/
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
    /*.content{*/
    /*  width: 90%;*/
    /*  margin: 0 auto;*/
    /*  font-size: 0.4rem;*/
    /*  .title{*/
    /*    width: 100%;*/
    /*    margin: 0 auto;*/
    /*    overflow: hidden;*/
    /*    text-overflow: ellipsis;*/
    /*    display: -webkit-box;*/
    /*    -webkit-line-clamp:2;*/
    /*    -webkit-box-orient: vertical;*/
    /*    padding-top:0.4rem;*/
    /*  }*/
    /*  .sub-title{*/
    /*    width: 100%;*/
    /*    margin: 0 auto;*/
    /*    font-weight: 550;*/
    /*    padding-top:0.4rem;*/
    /*  }*/
    /*  .description{*/
    /*    width: 100%;*/
    /*    padding-top:0.4rem;*/
    /*    margin: 0 auto;*/
    /*    overflow: hidden;*/
    /*    text-overflow: ellipsis;*/
    /*    display: -webkit-box;*/
    /*    -webkit-line-clamp:3;*/
    /*    -webkit-box-orient: vertical;*/
    /*    color:#808080;*/
    /*  }*/
    /*  .footer{*/
    /*    width: 100%;*/
    /*    !*display: flex;*!*/
    /*    align-items: center;*/
    /*    margin-top: 0.2rem;*/
    /*    !*justify-content: space-around;*!*/
    /*    .time{*/
    /*      display: inline-block;*/
    /*      color: #808080;*/
    /*    }*/
    /*    img{*/
    /*      width:0.5rem;*/
    /*      height: 0.5rem;*/
    /*      margin-left: 50%;*/
    /*      vertical-align:middle;*/
    /*    }*/
    /*    .num{*/
    /*      font-size: 0.35rem;*/
    /*      color:#808080;*/
    /*    }*/
        /*.time{*/
        /*  float: left;*/
        /*  margin-left: 5%;*/
        /*  font-size: 0.35rem;*/
        /*  color:#808080;*/
        /*}*/
        /*.img{*/
        /*  margin-left: 60%;*/
        /*  float: left;*/
        /*  img{*/
        /*    width:0.5rem;*/
        /*    vertical-align: text-bottom;*/
        /*    margin-right: 0.2rem;*/
        /*  }*/
        /*  span{*/
        /*    font-size: 0.35rem;*/
        /*    color:#808080;*/
        /*  }*/
        /*}*/
    /*  }*/
    /*  .cut-line{*/
    /*    border-bottom:0.01rem #808080 solid;*/
    /*    padding-bottom: 0.3rem;*/
    /*  }*/
    /*}*/
  }
  </style>
