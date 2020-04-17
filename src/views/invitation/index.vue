<template>
  <div class="invitation">
      <div class="nav">
        <p :class="[active==index?after:'']"  @click="get(index)"
             v-for="(item, index) in mainNav" :key="index">{{item.blockName}}({{item.counts}})</p>
      </div>
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
          <p v-if="noDataFlag && !content.length" class="noDataSvg">
            <icon-svg name="暂无数据"></icon-svg>
            <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>
          </p>
          <invitationContent :content="content" :loadingShow="loadingShow"></invitationContent>
        </van-list>
      </ul>
    </van-pull-refresh>
  </div>
</template>
<script>
import invitationContent from '@/components/invitationContent'
import {formatDate} from '../../utils'

export default {
  data () {
    return {
      active: 0,
      after: 'after',
      isLoading: false,
      refreshFlag: false,
      loading: false,
      finished: false,
      finishedText: '',
      loadingShow: false,
      noDataFlag: false,
      pageIndex: 1,
      pageSize: 10,
      navActive: 0,
      mainNav: [],
      contentIndex: 0,
      content: [],
      totalCount: ''
    }
  },
  components: {
    invitationContent
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  created () {
    this.getMainNav()
  },
  methods: {
    // 点击导航栏 获取相应内容
    get (index) {
      this.active = index
      this.pageIndex = 1
      this.content = []
      this.getList(this.active)
    },
    // 获取列表内容
    getList (index) {
      this.$http({
        url: this.$http.adornUrl('/communityPost/getPostByCreateUser.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          postBlockId: this.mainNav[index].id
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.loadingShow = false
          this.finished = false
          this.loading = false
          this.content = this.content.concat(data.list)
          this.content = this.content.map(res => {
            if (res.publishDate) {
              res.publishDateStr = formatDate(parseInt(res.publishDate))
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
          this.afterGetData(data.list.length, this.pageSize)
        }
      })
    },
    // 获取导航栏
    getMainNav () {
      this.$http({
        url: this.$http.adornUrl('/communityBlock/getCommunityBlockListAndCounts.action'),
        method: 'get',
        params: this.$http.adornParams({
        }, false)
      }).then(({data}) => {
        if (data) {
          this.totalCount = data.totalCount
          this.mainNav = data.list
          this.get(0)
        }
      })
    },
    // 列表刷新
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.content = []
      this.loadingShow = true
      this.finishedText = ''
      this.getList(this.active)
    },
    // 列表上拉加载
    onLoad () {
      this.pageIndex++
      this.getList(this.active)
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
    // 当数据加载完成时
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.content.length < pageSize) {
        console.log('进来了')
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.content.length) {
          this.noDataFlag = true
          this.finishedText = ''
        }
      }
      this.isLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
  .invitation{
    width:100%;
    min-height:110vh;
    /*.van-pull-refresh{*/
      /*overflow: auto;*/
    /*}*/
    .nav{
      width: 100%;
      display: flex;
      justify-content: space-around;
      font-size: 0.4rem;
      .after{
        color:#163b80;
        border-bottom: 0.05rem #163b80 solid;
        padding-bottom: 0.1rem;
        font-weight: 550;
      }
    }
    .noDataSvg {
      text-align: center;
      margin-top: 2rem;
      svg {
        font-size: 2.5rem;
      }
    }
  }
  </style>
