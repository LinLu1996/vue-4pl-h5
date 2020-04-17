<template>
  <div class="tpl-09">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <van-image
        width="2rem"
        height="2rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[0].content"
      />
      <!--<img :src="'http://192.168.0.166:8080' + item.contentList[0].content">-->
      <div class="p_wrap">
        <strong>{{item.contentList[1].content}}</strong>
        <p>{{item.contentList[2].content}}</p>
      </div>
    </div>
    <div class="img_p"></div>
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
  .tpl-09{
    .img_p{
      margin-bottom: 0.5rem;
    }
    .van-image{
      display: block;
      margin: 0 auto;
    }
    .p_wrap{
      strong{
        display: block;
        text-align: center;
        overflow:hidden;//隐藏文字
        text-overflow:ellipsis;//显示 ...
        white-space:nowrap;//不换行
        font-size: 0.38rem;
        margin: 0.2rem 0;
      }
      p{
        margin: 0;
        padding: 0 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
        text-align: center;
      }
    }
  }
</style>
