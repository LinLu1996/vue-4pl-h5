<template>
  <div>
    <div class="title_wrap">
      <!--<img v-lazy:src="$route.query.cover">-->
      <img v-lazy="getBaseUrl + tempCover">
      <title-search></title-search>
    </div>
    <div class="children_nav">
      <van-tabs v-model="tabIndex" :ellipsis="false" color="#0d152d" line-width="1.5rem" @change="touchActive">
        <van-tab v-for="(item, index) in mainNav" :key="index" :title="item.name+'('+ (item.categoryCount || 0)+ ')'"></van-tab>
      </van-tabs>
    </div>
    <div class="content">
      <van-pull-refresh v-model="isLoading" :disable="refreshFlag" @refresh="onRefresh">
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
            <util-list :list="list" :loadingShow="loadingShow"></util-list>
          </van-list>
        </ul>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import titleSearch from '@/components/titleSearch'
import utilList from '@/components/utilList'
import { mapGetters } from 'Vuex'
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false,
      isLoading: false,
      loadingShow: false,
      noDataFlag: false,
      isTabFlag: false,
      finished: true,
      listIndex: 0,
      tabIndex: 0,
      allCount: 0,
      finishedText: '',
      navActive: '',
      dataForm: {
        subjectId: '',
        parentId: ''
      },
      list: [],
      mainNav: [],
      refreshFlag: false,
      tempCover: ''
    }
  },
  components: {
    titleSearch,
    utilList
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
    this.init()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  watch: {
    $route () {
      this.init()
    }
  },
  computed: {
    ...mapGetters([
      'getMenu',
      'getBaseUrl'
    ])
  },
  methods: {
    init () {
      if (this.$route.query.cover) {
        this.tempCover = this.$route.query.cover
      }
      if (!this.getMenu().length) {
        this.$router.push({path: '/home'}).catch(res => {})
      } else {
        this.loadingShow = true
        this.dataForm.subjectId = this.$route.query.id
        this.getDataList()
      }
    },
    getNavList (val) {
      this.pageIndex = 1
      this.list = []
      this.finishedText = ''
      if (typeof val === 'string') {
        this.dataForm.productName = val
      }
      this.$http({
        url: this.$http.adornUrl('/h5product/searchProductPublishListByPage.action'),
        method: 'get',
        params: this.$http.adornParams({
          productName: this.dataForm.productName
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          data.list.forEach(res => {
            this.mainNav.forEach(inner => {
              if (res.id === inner.id) {
                inner.categoryCount = res.categoryCount
              }
            })
          })
          this.allCount = data.allCount
          this.getDataList()
        }
      })
    },
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.getDataList(this.listIndex)
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
      this.isTabFlag = false
      this.pageIndex += 1
      this.getDataList()
    },
    touchActive (index) {
      this.isTabFlag = true
      this.$router.push({
        path: '/special-topic',
        query: {
          id: this.dataForm.subjectId,
          name: this.mainNav[index].name
        }
      })
      // this.cancel()
      this.noDataFlag = false
      this.pageIndex = 1
      this.listIndex = index
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      // this.getDataList(index)
    },
    getDataList (index) {
      if (this.isTabFlag) this.list = []
      this.mainNav = [{id: '', name: '全部', categoryCount: this.allCount}]
      this.mainNav = this.mainNav.concat(this.getMenu())
      this.tabIndex = this.mainNav.findIndex(res => {
        return res.name === this.$route.query.name
      })
      this.dataForm.parentId = this.mainNav[this.tabIndex] ? this.mainNav[this.tabIndex].id : ''
      this.source = this.$axios.CancelToken.source()
      this.$http({
        cancelToken: this.source.token,
        url: this.$http.adornUrl('/specialSubject/getProductBySpecialSubjectId.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          subjectId: this.dataForm.subjectId,
          parentId: this.dataForm.parentId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.allCount = 0
          this.mainNav.forEach(inner => {
            inner.categoryCount = data[inner.id]
            this.allCount += parseInt(data[inner.id]) || 0
          })
          this.mainNav[0].categoryCount = this.allCount
          this.loadingShow = false
          this.list = this.list.concat(data.list || [])
          this.finished = false
          this.loading = false
          this.resetStatus(data.list.length, this.pageSize)
          this.totalPage = data.pageCount
        } else {
          this.list = []
          this.totalPage = 0
        }
      })
    },
    // 当数据加载完成时
    resetStatus (listLength, pageSize) {
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
  .title_wrap{
    width: 100vw;
    height: 33vw;
    /*background: url("~@/assets/special-topic-banner.png") no-repeat;*/
    background-size: cover;
    img{
      width: 100vw;
      height: 33vw;
      position: absolute;
      z-index: -1;
    }
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
    height: 0.8rem;
    line-height: 0.8rem;
    /deep/.van-tabs .van-tabs__wrap{
      height: 1rem;
      line-height: 1rem;
    }
    /deep/.van-tabs .van-tab .van-tab__text{
      font-size: 0.32rem;
    }
  }
  .content{
    padding-top: 0.4rem;
    .noDataSvg{
      text-align: center;
      margin-top: 2rem;
      svg{
        font-size: 2.5rem;
      }
    }
    /deep/.van-list{
      .van-list__finished-text{
        font-size: 0.3rem;
      }
    }
  }
</style>
