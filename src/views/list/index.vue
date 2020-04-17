<template>
  <div>
    <div class="title_wrap">
      <title-search></title-search>
    </div>
    <div class="main_nav">
      <strong v-for="(item, index) in mainNav" :key="index" :class="{main_nav_active: currentIndex === index}" @click="touchActive(item, index)">
        {{item.name}}
        <span v-if="currentIndex === index" class="text_line"></span>
      </strong>
      <!--<img  src="@/assets/concern.png">-->
      <span class="is_focus" v-if="currentIndex > 2">
        <img v-if="childrenNavFocus === '0'" style="width: 0.82rem" @click="navFocus('no')" src="@/assets/concern.png" />
        <!--<icon-svg v-if="childrenNavFocus === '0'" name="关注-yes" @click.native="navFocus('no')"></icon-svg>-->
        <icon-svg v-else name="关注-not" @click.native="navFocus('yes')"></icon-svg>
      </span>
    </div>
    <div class="children_nav" v-if="currentIndex > 2">
      <van-tabs v-model="navActive" :ellipsis="false" color="#0d152d" line-width="2rem" @change="secondTab">
        <van-tab
          v-for="(item, index) in childrenNav"
          :key="index"
          :title="`${item.name + '(' + item.categoryCount + ')'}`"
          title-style="margin-right: 0.2rem"></van-tab>
      </van-tabs>
    </div>
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
import {Toast} from 'Vant'
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      isLoading: false,
      loadingShow: false,
      noDataFlag: false,
      clickFlag: true,
      finished: true,
      finishedText: '',
      navActive: 0,
      currentIndex: 2,
      fromType: '',
      mainNav: [],
      childrenNav: [],
      childrenNavFocus: '',
      childrenNavInfo: [],
      list: [],
      listIndex: 0,
      isTrueListIndex: 0,
      timer: undefined,
      source: null,
      isTabFlag: false,
      refreshFlag: false
    }
  },
  components: {
    titleSearch,
    utilList
  },
  created () {
    this.init()
  },
  mounted () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  watch: {
    '$route' (to, from) {
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
        this.resetStatus()
        this.getNavList()
      }
    },
    // 获取一级导航菜单
    getNavList () {
      this.mainNav = [{id: '', name: '关注'}, {id: '', name: '最新'}, {id: '', name: '热门'}]
      let temp = JSON.parse(JSON.stringify(this.getMenu()))
      this.mainNav = this.mainNav.concat(temp)
      // 如果从导航进入，锁定一级菜单tab位置
      if (this.$route.query.parentName) {
        this.currentIndex = this.mainNav.findIndex(res => {
          return res.name === this.$route.query.parentName
        })
      }
      if (this.$route.query.type) {
        this.fromType = this.$route.query.type
        this.currentIndex = this.mainNav.findIndex(res => {
          return res.name === this.fromType
        })
      }
      this.getChildrenNav(this.mainNav[this.currentIndex].id)
    },
    // 点击一级菜单列表行为
    touchActive (item, index) {
      if (this.currentIndex === index) { return }
      if (!this.clickFlag) {
        return
      }
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 500)
      this.isTabFlag = true
      this.$router.push({
        path: '/list',
        query: {
          name: this.childrenNav[0] ? this.childrenNav[0].name : '',
          parentName: item.name
        }
      })
      this.currentIndex = index
      this.childrenNav = []
      this.resetStatus()
      this.cancel()
      // this.getChildrenNav(item.id)
    },
    // 获取二级菜单
    getChildrenNav (id) {
      this.childrenNav = this.mainNav.filter(res => res.id === id)[0].categoryPOList || []
      // 如果从导航进入，锁定二级菜单当前tab位置
      if (this.$route.query.name && this.childrenNav.length) {
        this.navActive = this.childrenNav.findIndex(res => {
          return res.name === this.$route.query.name
        })
        this.listIndex = this.navActive === -1 ? 0 : this.navActive
      }
      this.currentIndex > 2 && this.getChildrenNavNum(this.mainNav[this.currentIndex].id)
      clearTimeout(this.timer)
      // this.cancel()
      this.timer = setTimeout(() => {
        this.getMainList(this.listIndex)
      }, 500)
      // this.getDataList(this.listIndex)
    },
    // 获取二级菜单数据数量
    getChildrenNavNum (id) {
      this.$http({
        url: this.$http.adornUrl('/h5product/productList.action'),
        method: 'get',
        params: this.$http.adornParams({
          parentId: id
        })
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.childrenNavInfo = data.categoryPOList
          this.childrenNavInfo.forEach(res => {
            this.childrenNav.forEach(inner => {
              if (res.id === inner.id) {
                inner.categoryCount = res.categoryCount
              }
            })
          })
          this.childrenNavFocus = this.childrenNavInfo[this.listIndex] ? this.childrenNavInfo[this.listIndex].focus : false
        }
      })
    },
    // 二级tab按钮调用列表接口
    secondTab (index) {
      this.isTabFlag = true
      this.navActive = index
      this.childrenNavFocus = this.childrenNavInfo[index].focus
      this.$router.push({
        path: '/list',
        query: {
          name: this.childrenNav[index].name,
          parentName: this.mainNav[this.currentIndex].name
        }
      })
    },
    getDataList () {
      this.resetStatus()
      clearTimeout(this.timer)
      this.cancel()
      this.timer = setTimeout(() => {
        this.getMainList(this.navActive)
      }, 500)
    },
    // 获取除 关心、最新、热门以外的列表接口
    getMainList (index) {
      if (this.isTabFlag) this.list = []
      this.source = this.$axios.CancelToken.source()
      this.listIndex = index
      if (this.currentIndex < 3) {
        this.getLocalDataList()
        return
      }
      this.$http({
        cancelToken: this.source.token,
        url: this.$http.adornUrl('/h5product/publishList.action'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize,
          parentCategoryId: this.mainNav[this.currentIndex].id,
          categoryId: this.childrenNav.length && this.childrenNav[index].id,
          status: 20
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.list = this.list.concat(data.list || [])
          this.loadingShow = false
          this.finished = false
          this.loading = false
          this.afterGetData(data.list.length, this.pageSize)
        } else {
          this.list = []
        }
      })
    },
    // 用于获取关注、最新、热门列表数据
    getLocalDataList () {
      this.source = this.$axios.CancelToken.source()
      let touchUrl = ''
      switch (this.currentIndex) {
        case 0:
          touchUrl = '/userAttention/attentionProductList.action'
          break
        case 1:
          touchUrl = '/h5product/newProductList.action'
          break
        case 2:
          touchUrl = '/h5product/hotProductList.action'
      }
      this.$http({
        cancelToken: this.source.token,
        url: this.$http.adornUrl(touchUrl),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          pageSize: this.pageSize
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.list = this.list.concat(data.list || [])
          this.loadingShow = false
          if (this.currentIndex === 1) {
            this.finished = true
            this.finishedText = '没有更多了'
          } else {
            this.finished = false
          }
          this.loading = false
          this.afterGetData(data.list.length, this.pageSize)
        } else {
          this.list = []
        }
      })
    },
    // 列表刷新
    onRefresh () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.loadingShow = true
      this.finishedText = ''
      this.getMainList(this.listIndex)
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
    // 列表上拉加载
    onLoad () {
      this.isTabFlag = false
      this.pageIndex += 1
      this.getMainList(this.listIndex)
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
    // 列表关注操作
    navFocus (type) {
      let focusUrl = ''
      let toastText = ''
      if (type === 'yes') {
        this.childrenNavFocus = '0'
        toastText = '已关注'
        focusUrl = '/userAttention/saveUserAttention.action'
      } else {
        this.childrenNavFocus = '1'
        toastText = '已取消关注'
        focusUrl = '/userAttention/deleteUserAttention.action'
      }
      this.$http({
        url: this.$http.adornUrl(focusUrl),
        method: 'get',
        params: this.$http.adornParams({
          categoryId: this.childrenNavInfo[this.listIndex].id
        })
      }).then(({data}) => {
        if (data && data.status === 'success') {
          Toast.success(toastText)
        } else {
          this.list = []
        }
      })
    },
    cancel () {
      this.source.cancel()
    },
    resetStatus () {
      this.noDataFlag = false
      this.pageIndex = 1
      this.list = []
      this.loadingShow = true
      this.listIndex = 0
      this.navActive = 0
      this.finishedText = ''
    }
  }
}
</script>
<style lang="less" scoped>
  .title_wrap{
    background: url("~@/assets/mobile-top-bg.png") no-repeat;
    background-size: cover;
  }
  .main_nav{
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #ccc;
    position: relative;
    clear: both;
    strong{
      font-size: 0.4rem;
      margin-left: 0.3rem;
      display: inline-block;
      position: relative;
      float: left;
      .text_line{
        display: inline-block;
        width: 0.5rem;
        height: 0.09rem;
        background-color: #163b80;
        position: absolute;
        top: 0.9rem;
        left: 50%;
        margin-left: -0.25rem;
        border-radius: 0.05rem;
      }
    }
    .main_nav_active{
      /*font-size: 0.5rem;*/
      color: #163b80;
    }
    .is_focus{
      display: inline-block;
      width: 1.5rem;
      position: absolute;
      right: 0.15rem;
      top: 0.1rem;
      font-size: 0.8rem;
      text-align: center;
    }
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
    padding: 0.4rem;
    .noDataSvg {
      text-align: center;
      margin-top: 2rem;
      svg {
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
