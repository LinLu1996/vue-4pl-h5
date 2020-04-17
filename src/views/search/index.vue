<template>
  <div>
    <div class="banner">
      <title-search></title-search>
      <div class="input_wrap">
        <van-search
          v-model="dataForm.productName"
          placeholder="请输入搜索关键词"
          show-action
          shape="round"
          @focus="dataForm.productName = ''"
        >
          <div slot="action" @click="bntSearch">搜索</div>
        </van-search>
      </div>
      <div class="search_demo">
        <p>
          <span>热门搜索：</span>
          <span v-for="(item, index) in keyWordList " :key=index @click="onSearch(item.name)">
            {{item.name}}
            <span>{{keyWordList && index === keyWordList.length-1 ? '' : '|'}}</span>
          </span>
        </p>
      </div>
    </div>
    <div class="content">
      <div class="tab_nav">
        <van-tabs v-model="tabIndex" :ellipsis="false" color="#0d152d" line-width="1.5rem" @change="touchActive">
          <van-tab v-for="(item, index) in mainNav" :key="index" :title="item.name+'('+ (item.categoryCount || 0)+ ')'"></van-tab>
        </van-tabs>
      </div>
      <div class="info_list">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
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
      tabIndex: 0,
      mainNav: [],
      list: [],
      loading: false,
      isLoading: false,
      finished: false,
      noDataFlag: false,
      finishedText: '',
      listIndex: 0,
      loadingShow: false,
      dataForm: {
        productName: '',
        parentCategoryId: ''
      },
      keyWordList: [],
      allCount: 0
    }
  },
  components: {
    titleSearch,
    utilList
  },
  created () {
    this.init()
  },
  // activated () {
  //   this.init()
  // },
  watch: {
    $route () {
      this.init()
    }
  },
  computed: {
    ...mapGetters([
      'getMenu'
    ])
  },
  methods: {
    init () {
      if (!this.getMenu().length) {
        this.$router.push({path: '/home'}).catch(res => {})
      } else {
        this.loadingShow = true
        this.noDataFlag = false
        this.finishedText = ''
        this.dataForm.parentCategoryId = this.$route.query.id
        this.dataForm.productName = this.$route.query.name
        this.mainNav = [{id: '', name: '全部', categoryCount: this.allCount}]
        this.mainNav = this.mainNav.concat(this.getMenu())
        this.tabIndex = this.mainNav.findIndex(res => res.id.toString() === this.$route.query.id.toString())
        this.tabIndex = this.tabIndex === -1 ? 0 : this.tabIndex
        // this.onSearch()
        setTimeout(() => { this.onSearch() }, 0)
      }
    },
    bntSearch () {
      if (!this.dataForm.productName) this.dataForm.productName = '请输入搜索关键词'
      this.$router.push({
        path: '/search',
        query: {
          id: this.mainNav[this.tabIndex] ? this.mainNav[this.tabIndex].id : '',
          name: this.dataForm.productName
        }
      })
    },
    onSearch (val) {
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
          this.keyWordList = data.keyWordList
          data.list.forEach(res => {
            this.mainNav.forEach(inner => {
              if (res.id === inner.id) {
                inner.categoryCount = res.categoryCount
              }
            })
          })
          this.allCount = data.allCount
          this.mainNav[0].categoryCount = this.allCount
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
    onLoad () {
      this.pageIndex += 1
      this.getDataList()
    },
    // 点击一级菜单列表行为
    touchActive (index) {
      if (!this.dataForm.productName) this.dataForm.productName = '请输入搜索关键词'
      this.$router.push({
        path: '/search',
        query: {
          id: this.mainNav[this.tabIndex] ? this.mainNav[this.tabIndex].id : '',
          name: this.dataForm.productName
        }
      })
      this.cancel()
      this.noDataFlag = false
      this.pageIndex = 1
      this.listIndex = index
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      // this.getDataList(index)
    },
    getDataList (index) {
      // this.dataForm.parentCategoryId = this.mainNav[this.listIndex] ? this.mainNav[this.listIndex].id : ''
      this.source = this.$axios.CancelToken.source()
      this.$http({
        cancelToken: this.source.token,
        url: this.$http.adornUrl('/h5product/searchListByPage.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          productName: this.dataForm.productName,
          parentCategoryId: this.dataForm.parentCategoryId
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
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
      if (listLength) this.noDataFlag = false
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
  .banner{
    height: 5rem;
    /*padding-top: 0.6rem;*/
    background: url("~@/assets/mobile-banner.png") no-repeat;
    background-size: cover;
    .input_wrap{
      text-align: center;
      margin-top: 0.8rem;
      .van-search{
        width: 80%;
        padding: 0;
        margin: 0 auto;
        background: none!important;
        border: 2px solid #ffffff;
        position: relative;
        .van-search__content{
          background: none;
          /deep/.van-field__control{
            color: #ffffff!important;
          }
          /deep/.van-icon-search:before{
            color: #ffffff;
          }
        }
        .van-search__action{
          width: 1.4rem;
          height: 0.91rem;
          background: #ffffff;
          font-size: 0.4rem;
          position: absolute;
          right: 0;
          bottom: 0;
          div{
            color: #0d152d;
          }
        }
      }
    }
    .search_demo{
      color: #eeeeee;
      p {
        /*width: 3rem;*/
        display: inline-block;
        margin-left: 1rem;
      }
    }
  }
  .content{
    padding: 0 0.6rem;
  }
  .tab_nav{
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
  .info_list{
    margin-top: 0.6rem;
    min-height: 7rem;
    li {
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.3rem;
      /*width: 90%;*/
      margin: 0 auto 0.3rem;
      h5{
        margin: 0;
        font-size: 0.4rem;
        color: #5b9bd5;
      }
      p{
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        margin: 0.1rem 0;
        color: #888;
        font-size: 0.3rem;
      }
    }
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
