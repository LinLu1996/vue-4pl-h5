<template>
  <div class="tpl-04">
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item v-for="(item, index) in tplInfo" :key="index" :title="item.contentList[0].content" :name="index">
        <van-image
          width="100%"
          height="5rem"
          fit="contain"
          :src="getBaseUrl + item.contentList[1].content"
        />
        <!--<img :src="'http://192.168.0.166:8080' + item.contentList[1].content">-->
        <p>{{item.contentList[2].content}}</p>
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
      currentIndex: 1,
      activeNames: [0],
      titles: [],
      src: '',
      content: ''
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
    },
    touchTitle (index) {
      this.currentIndex = index
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-04{
    /*padding: 0.5rem 0;*/
    p{
      margin: 0;
      padding: 0.2rem;
      line-height: 0.6rem;
      font-size: 0.36rem;
      color: #595959;
    }
  }
</style>
