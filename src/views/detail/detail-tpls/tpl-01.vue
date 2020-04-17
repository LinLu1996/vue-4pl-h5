<template>
  <div class="tpl-01">
    <div v-for="(item, index) in dataList" :key="index">
      <div class="info_wrap">
        <p>{{item.contentList[1].content}}</p>
      </div>
      <van-swipe ref="swipe" :autoplay="autoplay" :loop="true" @change="onChange">
        <van-swipe-item v-for="(inner, idx) in item.contentList[0].content" :key="idx">
          <div class="img_p">
          <van-image
            width="100%"
            height="5rem"
            fit="contain"
            :src="getBaseUrl + inner"
          />
        </div>
        </van-swipe-item>
        <div class="custom-indicator" slot="indicator">
          {{ current + 1 }}/ {{pptLength}}
        </div>
      </van-swipe>
      <!--<img :src="'http://192.168.0.166:8080' + item.contentList[0].content">-->
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
      dataList: [],
      current: 0,
      pptLength: 0,
      autoplay: 3000
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.dataList = this.tplInfo.map(res => {
        res.contentList[0].content = JSON.stringify(res.contentList[0].content).split(',')
        res.contentList[0].content[0] = res.contentList[0].content[0].replace('"', '')
        this.pptLength = res.contentList[0].content.length
        res.contentList[0].content[this.pptLength - 1] = res.contentList[0].content[this.pptLength - 1].replace('"', '')
        return res
      })
    },
    onChange (index) {
      this.current = index
    },
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
  .tpl-01{
    div{
      .info_wrap{
        p{
          margin: 0;
          padding: 0 0.2rem;
          line-height: 0.6rem;
          font-size: 0.36rem;
          color: #595959;
        }
      }
      .van-swipe{
        width: 8rem;
        height: 5rem;
        margin: 0.5rem auto;
        .custom-indicator{
          position: absolute;
          z-index: 10;
          color: #fff;
          right: 0.2rem;
          bottom: 0.2rem;
        }
        .img_p{
          width: 8rem;
        }
      }
    }
  }
</style>
