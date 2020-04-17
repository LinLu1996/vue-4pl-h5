<template>
  <div class="tpl-07">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <van-image
        width="1.5rem"
        height="1.5rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[0].content"
      />
      <!--<img :src="'http://192.168.0.166:8080' + item.contentList[0].content">-->
      <div class="p_wrap">
        <strong>{{item.contentList[1].content}}</strong>
        <p>{{item.contentList[2].content}}</p>
      </div>
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
  .tpl-07{
    padding: 0.2rem;
    .img_p{
      margin-bottom: 0.5rem;
      .van-image{
        vertical-align: top;
      }
      .p_wrap{
        display: inline-block;
        width: 80%;
        strong{
          font-size: 0.38rem;
          padding-left: 0.2rem;
          margin: 0.2rem 0;
          display: block;
        }
        p{
          margin: 0;
          padding: 0 0.2rem;
          line-height: 0.6rem;
          font-size: 0.36rem;
          color: #595959;
        }
      }
    }
  }
</style>
