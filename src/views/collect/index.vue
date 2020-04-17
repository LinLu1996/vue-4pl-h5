<template>
  <div class="collect">
    <div class="nav">
      <div :class="[active==index?after:'']"  @click="touchActive(index)"
           v-for="(item, index) in mainNav" :key="index" class="main-title">{{item.name}}</div>
    </div>
    <div class="cut-line"></div>
    <div class="children_nav">
      <van-tabs v-model="subActive" @change="secondTab" :ellipsis="false" line-width="2rem">
        <van-tab v-for="(todo, index) in secondNav" :key="index" :title="`${todo.name + '(' + todo.counts + ')'}`" title-style="margin-left: 0.02rem"></van-tab>
      </van-tabs>
    </div>
    <!--    以下是列表内容区域-->
    <div class="content">
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
            <p v-if="noDataFlag && !list.length" class="noDataSvg">
              <icon-svg name="暂无数据"></icon-svg>
              <span style="display: block;text-align: center;color: #cccccc;font-size: 0.4rem">暂无数据！</span>
            </p>
            <collectContent :list="list" :loadingShow="loadingShow"></collectContent>
          </van-list>
        </ul>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import collectContent from '@/components/collectContent'

export default {
  data () {
    return {
      currentIndex: 1,
      itemIDArr: '',
      secondNav: [],
      itemID: '',
      subActive: 0,
      mainNavActive: 0,
      active: 0,
      after: 'after',
      mainNav: [],
      list: [],
      isLoading: false,
      refreshFlag: false,
      loading: false,
      finished: true,
      finishedText: '',
      loadingShow: false,
      noDataFlag: false,
      pageIndex: 1,
      pageSize: 10,
      listIndex: 0,
      isUpload: false,
      source: null,
      timer: ''
    }
  },
  components: {
    collectContent
  },
  created  () {
    this.getMainNav()
    this.touchActive(0)
  },
  methods: {
    // 获取一级菜单
    getMainNav () {
      this.$http({
        url: this.$http.adornUrl('/h5Collection/getParent.action'),
        method: 'get',
        params: this.$http.adornParams({
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.mainNav = data.list
          this.getSecondNav(0)
        }
      })
    },
    // 点击一级菜单
    touchActive (index) {
      this.active = index
      this.loadingShow = true
      this.noDataFlag = false
      this.finishedText = ''
      this.list = []
      this.pageIndex = 1
      this.cancel()
      this.getSecondNav(this.active)
    },
    // 获取二级菜单
    getSecondNav (index) {
      if (!this.mainNav[index]) {
        return
      }
      this.$http({
        url: this.$http.adornUrl('/h5Collection/getCollectionProCounts.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          parentId: this.mainNav[index].id
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.secondNav = data.list
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.getList(0)
          }, 50)
        }
      })
    },
    // 点击二级Tab
    secondTab (index) {
      this.subActive = index
      this.pageIndex = 1
      this.loadingShow = true
      this.noDataFlag = false
      this.finishedText = ''
      clearTimeout(this.timer)
      this.cancel()
      this.timer = setTimeout(() => {
        this.list = []
        this.getList(this.subActive)
      }, 50)
    },
    // 获取列表内容
    getList (index) {
      this.source = this.$axios.CancelToken.source()
      this.$http({
        cancelToken: this.source.token,
        url: this.$http.adornUrl('/h5Collection/collectionList.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          categoryId: this.secondNav[index].categoryId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.loadingShow = false
          this.finished = false
          this.loading = false
          // if (this.isUpload) {
          this.list = this.list.concat(data.list)
          // } else {
          //   this.list = data.list
          // }
          this.afterGetData(data.list.length, this.pageSize)
        }
      })
    },
    // 列表刷新
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.loadingShow = false
      this.finishedText = ''
      this.getList(this.subActive)
    },
    // 列表上拉加载
    onLoad () {
      // this.isTabFlag = false
      this.pageIndex += 1
      this.isUpload = true
      this.getList(this.subActive)
    },
    // 当数据加载完成时
    afterGetData (listLength, pageSize) {
      if (listLength < pageSize || this.list.length < pageSize) {
        this.finished = true
        this.finishedText = '没有更多了'
        if (!this.list.length) {
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
  .collect {
    width: 100%;
    min-height: 110vh;
    .nav{
      width: 100%;
      /*overflow: hidden;*/
      display: flex;
      flex-wrap: wrap;
      font-size: 0.4rem;
      padding-top: 0.2rem;
      .main-title{
        /*float: left;*/
        margin: 0.2rem 0.3rem;
        display: flex;
        flex-wrap: nowrap;
        /*padding-right: 0.3rem;*/
      }
      .after{
        /*float: left;*/
        color:#163b80;
        border-bottom: 0.05rem #163b80 solid;
        padding-bottom: 0.2rem;
        font-weight: 550;
        /*padding-right: 0.3rem;*/
      }
    }
    /deep/ .van-tabs .van-tabs__wrap .van-tab--active {
      color: #999A9A;
    }

    /deep/ .van-tabs__line {
      background-color: #163b80;
      height: 0.05rem;
    }
    .cut-line{
      width:98%;
      margin: 0 auto;
      border-bottom: 0.025rem #696A6B solid;
    }
    .children_nav{
      width: 90%;
      margin: 0 auto;
      height: 0.8rem;
      line-height: 0.8rem;
      /deep/.van-tabs .van-tabs__wrap{
        height: 1rem;
        line-height: 1rem;
      }
      /deep/.van-tabs .van-tab .van-tab__text{
        font-size: 0.32rem;
      }
      /*color: #888;*/
      /*display: flex;*/
      /*justify-content: space-around;*/
    }
    .content{
      .noDataSvg {
        text-align: center;
        margin-top: 2rem;
        svg {
          font-size: 2.5rem;
        }
      }
    }
  }
</style>
