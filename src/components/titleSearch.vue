<template>
  <div class="title_wrap">
    <div class="title_wrap_child title_wrap_child1">
      <img src="@/assets/mobile-logo.png" @click="goPage('/')">
    </div>
    <div class="title_wrap_child title_wrap_child2">
<!--      <span class="icon_wrap icon-user" v-if="$route.name === 'Home'">-->
      <span class="icon_wrap icon-user" @click="goPersonal()">
        <!--<img src="@/assets/mobile-user.png">-->
        <icon-svg name="用户" style="font-size: 0.8rem;vertical-align: sub"></icon-svg>
      </span>
      <span class="icon_wrap icon-search" @click="goSearch('/search', '', '请输入关键词搜索')">
          <!--<img src="@/assets/mobile-search.png">-->
          <icon-svg name="搜索" style="font-size: 0.65rem;vertical-align: baseline"></icon-svg>
      </span>
      <span class="icon_wrap icon-menu" @click="showMenu()">
          <!--<img src="@/assets/mobile-menu.png">-->
          <icon-svg name="菜单" style="font-size: 0.65rem;vertical-align: baseline"></icon-svg>
        </span>
    </div>
    <van-popup
      v-model="showOverlay"
      position="right"
      closeable
      :style="{ width: '70%', height: '100%'}"
    >
      <div class="menu_title">
        <img style="width: 0.55rem;margin-left: 0.2rem;vertical-align: middle" src="@/assets/mobile-icon.png">
        <span class="divider"></span>
        <span style="display:inline-block;color: #cccccc;font-size: 0.38rem;vertical-align: middle">中国移动 IT能力库</span>
      </div>
      <van-collapse v-model="activeNames" accordion @change="getCollapseName">
        <van-cell title="首页" @click="goPage('/home')"></van-cell>
        <!--<van-collapse-item >-->
        <!--</van-collapse-item>-->
        <van-collapse-item v-for="(item, index) in menuList" :key="index" :title="item.name" :name="index" :class="{colorItem: currentIndex === index}">
          <van-cell :border="false" v-for="(inner, idx) in menuList[index].categoryPOList" :key="idx" :title="inner.name" @click="goPage('list', inner.name, item.name)"/>
          <!--<p v-for="(inner, idx) in menuList[index].categoryPOList" :key="idx" @click="goPage('list', inner.name, item.name)">{{inner.name}}</p>-->
        </van-collapse-item>
        <van-cell :border="false" title="社区" @click="goCommunity('community', '服务')"/>
      </van-collapse>
    </van-popup>
  </div>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
  data () {
    return {
      menu: '',
      showOverlay: false,
      activeNames: [],
      menuList: [],
      currentIndex: ''
    }
  },
  activated () {
    this.showOverlay = false
  },
  methods: {
    goPage (path, name, parentName) {
      this.showOverlay = false
      this.$router.push({
        path: path,
        query: {
          name: name,
          parentName: parentName
        }
      })
    },
    goSearch (path, id, name) {
      this.$router.push({
        path: path,
        query: {
          id: id,
          name: name
        }
      })
    },
    goPersonal () {
      this.$router.push('/personal')
    },
    goCommunity (path, type) {
      this.showOverlay = false
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      })
    },
    showMenu () {
      this.showOverlay = true
      this.menuList = this.getMenu()
    },
    hideMenu () {
      this.showOverlay = false
    },
    getMenuList () {
      this.$http({
        url: this.$http.adornUrl('/category/getCategoryList.action'),
        method: 'get',
        params: this.$http.adornParams({
          'name': this.menu
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.menuList = data.list
        } else {
          this.menuList = this.getMenu()
        }
      })
    },
    getCollapseName (index) {
      this.currentIndex = index
    }
  },
  computed: {
    ...mapGetters([
      'getMenu'
    ])
  }
}
</script>
<style lang="less" scoped>
  .title_wrap {
    height: 1.2rem;
    line-height: 1.2rem;
    /*background: url("~@/assets/mobile-top-bg.png") no-repeat;*/
    background-size: cover;
    .title_wrap_child1{
      float: left;
      img{
        height: 0.6rem;
        vertical-align: middle;
        margin-left: 0.2rem;
      }
    }
    .title_wrap_child2{
      float: right;
      .icon_wrap{
        display: inline-block;
        margin-top: 0.2rem;
        margin-right: 0.2rem;
        img{
          width: 0.5rem;
          height: 0.6rem;
        }
      }
      .icon-menu{
        img{
          width: 0.5rem;
          height: 0.5rem;
          vertical-align: super;
        }
      }
    }
    .van-popup{
      .menu_title{
        .divider{
          display: inline-block;
          height: 0.5rem;
          background: #cccccc;
          width: 1px;
          vertical-align: middle;
          margin: 0 0.1rem;
        }
        img{
          display: inline-block;
        }
      }
      /deep/ .van-collapse-item{
        .van-cell__title{
          font-size: 0.4rem;
        }
      }
      /deep/.colorItem{
        .van-collapse-item__title{
          .van-cell__title{
            color: #0066ec;
          }
        }
      }
      /deep/.van-collapse-item__content{
        .van-cell{
          padding: 5px 16px;
          color: #666666;
        }
      }
    }
  }
</style>
