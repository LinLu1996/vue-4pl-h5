<template>
  <div class="tpl-14">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <h3>{{item.contentList[0].content}}</h3>
      <div class="p_wrap">
        <span v-if="item.contentList[1].content">{{item.contentList[1].content}}</span>
        <p class="p_text">{{item.contentList[2].content}}</p>
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
  .tpl-14{
    padding: 0.2rem;
    .img_p{
      margin-bottom: 0.5rem;
      h3{
        font-size: 0.38rem;
        margin: 0.2rem 0;
      }
      .p_wrap{
        span{
          padding-left: 0.2rem;
          font-size: 0.37rem;
          margin-bottom: 0.2rem;
          display: block;
        }
        span:before{
          content: "•  ";
        }
        p{
          margin: 0;
          padding: 0 0.2rem;
          line-height: 0.6rem;
          font-size: 0.36rem;
          color: #595959;
        }
        .p_text:before{
          content: "•  ";
        }
      }
    }
  }
</style>
