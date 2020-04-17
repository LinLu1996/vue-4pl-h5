<template>
  <div class="comments_wrap">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <ul class="content">
        <van-list
          v-model="loading"
          :offset="200"
          :finished="finished"
          :finished-text="finishedText"
          :immediate-check="false"
          @load="onLoad"
        >
          <p v-if="!receiveList.length" class="noDataSvg">
            <icon-svg name="暂无数据"></icon-svg>
            <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>
          </p>
          <li v-else v-for="(item, index) in receiveList" :key="index">
            <p class="user_info">
              <span>{{item.replyUserName}}</span>
              ：
              <i class="date_str">{{item.replyDateStr}}</i>
            </p>
            <p class="content_wrap"><span>{{item.replyContent}}</span></p>
            <p class="post_info">
              回复我的帖子：
              <span class="detail_name" @click="getCommDetail('/comm-detail', item.postId)">{{item.postTitle}}</span>
              <span style="margin: 0 0.2rem">{{` > `}}</span>
              <span>{{item.blockName}}</span>
            </p>
          </li>
        </van-list>
      </ul>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      isLoading: false,
      finished: false,
      finishedText: '没有更多评论了',
      receiveList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/communityPostReply/getPostReplyListByUserId.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.isLoading = false
          this.loading = false
          this.finished = false
          this.receiveList = this.receiveList.concat(data.list || [])
          this.afterGetData(data.list.length, this.pageSize)
        } else {
          this.receiveList = []
        }
      })
    },
    onLoad () {
      this.pageIndex++
      this.getDataList()
    },
    onRefresh () {
      this.pageIndex = 1
      this.receiveList = []
      this.getDataList()
    },
    getCommDetail (path, id) {
      this.$router.push({
        path: path,
        query: {
          id: id
        }
      })
    },
    // 当数据加载完成时
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.receiveList.length < pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.receiveList.length) {
          this.finishedText = ''
        }
      }
      this.isLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
  .comments_wrap{
    min-height: 100vh;
    .content{
      padding: 0.3rem;
      .noDataSvg {
        text-align: center;
        margin-top: 2rem;
        svg {
          font-size: 2.5rem;
        }
      }
      li{
        font-size: 0.36rem;
        /*margin-bottom: 0.3rem;*/
        padding: 0.3rem;
        border-bottom: 1px solid #ddd;
        p{
          margin: 0;
          min-height: 0.6rem;
          line-height: 0.6rem;
        }
        .user_info{
          /*color: #2d64b3;*/
          .date_str{
            float: right;
            font-style: normal;
            color: #989898;
          }
        }
        .content_wrap{
          min-height: 1rem;
          margin: 0.2rem 0;
          color: #696969;
        }
        .post_info{
          color: #989898;
          span{
            color: #333333;
          }
          .detail_name{
            color: #2d64b3;
            text-decoration: underline;
            width:1.5rem;
            display: inline-block;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
