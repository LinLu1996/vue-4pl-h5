<template>
  <div class="tpl-05">
    <div v-for="(item, index) in tplInfo" :key="index">
      <h2>{{item.contentList[0].content}}</h2>
      <p>{{item.contentList[2].content}}</p>
      <van-image
        width="100%"
        height="5rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[1].content" />
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
      currentIndex: 1,
      titles: [],
      src: require('@/assets/product-detail.png'),
      content: '区块链具有上链后不可篡改、不可抵赖的特点，但无法保障上链数据本身的真实性，物联网设备可信上链方案利用物联网终端设备安全可信执行环境，解决源头数据造假的问题，保证真实数据上链。'
    }
  },
  mounted () {
    // setTimeout(() => {
    this.init()
    // }, 1000)
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  methods: {
    init () {
      this.titles = this.tplInfo.map(res => {
        return {
          text: res.contentList[0].content
        }
      })
    },
    touchTitle (index) {
      this.currentIndex = index
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-05{
    div{
      h2{
        padding-left: 0.2rem;
        margin: 0.12rem 0;
        font-size: 0.38rem;
      }
      p{
        margin: 0;
        padding: 0 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
      }
      .van-image{
        margin: 0.5rem 0;
      }
    }
  }
</style>
