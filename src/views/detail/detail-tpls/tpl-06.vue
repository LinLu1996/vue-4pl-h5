<template>
  <div class="tpl-06">
    <div v-for="(item, index) in tplInfo" :key="index" :class="{hasBg: index % 2 === 1}">
      <p>{{item.contentList[1].content}}</p>
      <van-image
        height="5rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[0].content"
      />
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
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  }
}
</script>
<style lang="less" scoped>
  .tpl-06{
    div{
      margin: 0.5rem 0;
      padding-bottom: 0.2rem;
      p{
        margin: 0;
        padding: 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
      }
      .van-image{
        width: 92%;
        display: block;
        margin: 0 auto;
      }
    }
    .hasBg{
      background-color: #f5f5f5;
    }
  }
</style>
