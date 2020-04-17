<template>
  <div id="main">
    <van-sticky>
      <van-nav-bar
        :title="$route.meta.title"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
      <!--<div class="close_btn">-->
        <!--<span @click.stop="closeNow()">X</span>-->
      <!--</div>-->
        <template #left>
          <span class="return_btn" @click.stop="onClickLeft()">
            <icon-svg name="返回" style="font-size: 0.42rem;position: relative;top: 3px"></icon-svg>
          </span>
          <span class="close_btn" @click.stop="closeNow()">
            <icon-svg name="关闭" style="font-size: 0.42rem;position: relative;top: 3px"></icon-svg>
          </span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <div class="app_bottom" v-if="routerNotHaveBottom.indexOf($route.name) === -1">Copyright  ©  2020  中国移动通信集团有限公司</div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      routerNotHaveBottom: ['Search', 'List', 'SpecialTopic', 'CommDetail', 'Community']
    }
  },
  methods: {
    onClickLeft () {
      if (this.$route.name === 'Home') {
        window.moaBridge.backToHome()
      } else {
        this.$router.go(-1)
      }
    },
    closeNow () {
      window.moaBridge.backToHome()
    },
    onClickRight () {}
  }
}
</script>

<style lang="less">
  .van-nav-bar{
    background-color: #33abff!important;
    height: 1rem;
    line-height: 1rem;
    z-index: 2;
    .van-nav-bar__left .van-icon{
      color: #ffffff;
    }
    .van-nav-bar__title{
      color: #ffffff;
    }
  }
  .return_btn{
    color: #ffffff;
  }
  .close_btn{
    color: #ffffff;
    margin-left: 0.3rem;
    /*font-size: 0.64rem;*/
    /*position: relative;*/
    /*top: 2px;*/
  }
  .app_bottom{
    background: #333;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.36rem;
    color: #ccc;
    text-align: center;
  }
</style>
