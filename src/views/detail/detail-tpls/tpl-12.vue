<template>
  <div class="tpl-12">
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item v-for="(item, index) in tplInfo" :key="index" :title="item.contentList[1].content" :name="index">
        <div class="p_wrap">
          <strong>{{item.contentList[2].content}}</strong>
          <p>{{item.contentList[3].content}}</p>
        </div>
        <van-image
          width="100%"
          height="5rem"
          fit="cover"
          :src="getBaseUrl + item.contentList[0].content"
        />
        <!--<img :src="'http://192.168.0.166:8080' + item.contentList[0].content">-->
      </van-collapse-item>
    </van-collapse>
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
      activeNames: [0]
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  mounted () {
    // this.init()
    // setTimeout(() => {
    //   this.initHide()
    // }, 500)
  },
  methods: {
    init () {
      for (let i = 0; i <= 20; i++) {
        this.activeNames.push(i)
      }
    },
    initHide () {
      this.activeNames = [0]
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-12{
    .p_wrap{
      strong{
        font-size: 0.38rem;
        padding-left: 0.2rem;
        margin: 0.2rem 0;
        display: block;
        color: #333333;
      }
      p{
        margin: 0;
        padding: 0 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
      }
    }
    .van-image{
      margin-top: 0.5rem;
    }
  }
</style>
