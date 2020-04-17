<template>
  <div class="tpl-13">
    <div class="ppt_wrap">
      <van-swipe ref="swipe" :autoplay="autoplay" :width="200">
        <van-swipe-item v-for="(item, index) in tplInfo" :key="index">
          <div class="img_p">
            <img :src="getBaseUrl + item.contentList[0].content">
            <div>
              <strong>{{item.contentList[1].content}}</strong>
              <p>{{item.contentList[2].content}}</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
  props: {
    tplInfo: {
      type: Array
    }
  },
  data () {
    return {
      autoplay: 3000
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  methods: {
    initSwipe () {
      this.$refs.swipe[0].swipeTo(0)
      this.autoplay = 30000
    },
    resetSwipe () {
      this.autoplay = 3000
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-13{
    padding: 0 0.1rem;
    .ppt_wrap{
      /*width: 94%;*/
      height: 3.5rem;
      margin: 0 auto;
    }
    .img_p {
      width: 100%;
      height: 3.5rem;
      display: inline-block;
      position: relative;
      div{
        width: 100%;
        height: 100%;
        background-color: #333;
        opacity: 0.8;
        display: inline-block;
        color: #fff;
        text-align: center;
        strong{
          display: block;
          text-align: center;
          overflow:hidden;//隐藏文字
          text-overflow:ellipsis;//显示 ...
          white-space:nowrap;//不换行
          padding: 0 0.6rem;
          margin: 0.2rem 0;
          font-size: 0.38rem;
        }
        p{
          margin: 0;
          padding: 0 0.2rem;
          line-height: 0.6rem;
          font-size: 0.36rem;
          color: #ffffff;
          height: 1.9rem;
          overflow:hidden;
          /*text-overflow:ellipsis;*/
          /*display:-webkit-box;*/
          /*-webkit-box-orient:vertical;*/
          /*-webkit-line-clamp:4;*/
        }
      }
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }
  }
</style>
