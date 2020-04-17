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
<!--            <p v-if="noDataFlag" class="noDataSvg">-->
<!--              <icon-svg name="暂无数据"></icon-svg>-->
<!--              <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>-->
<!--            </p>-->
            <div v-for="(item,index) in list" :key="index"  class="box">
              <div class="time"> {{item.date}}</div>
              <div v-for="(todo, index) in item.list" :key="index" class="comment">
                <template v-if="todo.sourceType == 2">
                <p class="comm_first_line">
                  <strong>{{todo.objectTitle}}</strong>
                </p>
                  <p class="comm_forth_line">{{todo.parentCategoryName}} &nbsp; > &nbsp; {{todo.categoryName}}</p>
                </template>
                <template v-else>
                  <div class="invitation">
                    <div class="img_wrap"><img src="@/assets/kn.jpg"></div>
                  <div class="content_text_wrap">
                    <h5>{{todo.objectTitle}} </h5>
<!--                    <p>{{item.content}}</p>-->
                    <p class="content_classify">
                      <span>{{todo.parentCategoryName}} &nbsp; > &nbsp; {{todo.categoryName}}</span>
                    </p>
                  </div>
                  </div>
                </template>
              </div>
            </div>
          </van-list>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      invitation: [],
      isLoading: false,
      refreshFlag: false,
      loading: false,
      finished: true,
      finishedText: '',
      loadingShow: false,
      noDataFlag: false,
      pageIndex: 1,
      pageSize: 10,
      list: [],
      content: []
    }
  },
  created () {
    this.getSentence()
  },
  methods: {
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
          this.afterGetData(data.list.length, this.pageSize)
          this.content = data.list.list
          this.list = data.list.map(res => {
            if (res.dateTimeString) {
              let time1 = new Date().getFullYear()
              let time2 = new Date().getMonth()
              let time3 = new Date().getDay()
              let time = time1 + '-' + time2 + '-' + time3
              if (res.date === time) {
                res.date = '今天'
              }
            }
            return res
          })
        }
      })
    },
    // 列表刷新
    onRefresh () {
      // this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      this.getSentence()
    },
    // 列表上拉加载
    onLoad () {
      // this.isTabFlag = false
      this.pageIndex += 1
      this.getSentence()
    },
    // 当数据加载完成时
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.list.length < pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.list.length) {
          // this.noDataFlag = true
          this.finishedText = ''
        }
      }
      this.isLoading = false
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
           padding-bottom: 0.3rem;
         }
         .comment{
           width:100%;
           height: 2rem;
           margin-bottom: 0.2rem;
           /*border-bottom: 0.02rem #808080 solid;*/
           margin-top: 0.5rem;
           .comm_first_line {
             margin: 0 0 0.3rem;
             position: relative;
             strong {
               font-size: 0.4rem;
               font-weight: normal;
               color: #000000;
               width: 80%;
               line-height: 0.6rem;
               overflow: hidden;
               text-overflow: ellipsis;
               display: -webkit-box;
               -webkit-box-orient: vertical;
               -webkit-line-clamp: 2;
               margin-bottom: 0.8rem;
               margin-top: 0.2rem;
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
         }
         .invitation{
           margin-top: 0.5rem;
           margin-bottom: 0.2rem;
           border-bottom: 0.02rem #808080 solid;
           padding-bottom: 0.2rem;
           .img_wrap, .content_text_wrap {
             display: inline-block;
           }
           .img_wrap {
             width: 35%;
             height: 2.1rem;
             vertical-align: top;

             img {
               width: 100%;
               height: 2.1rem;
             }
           }
           .content_text_wrap {
             width: 63%;
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
