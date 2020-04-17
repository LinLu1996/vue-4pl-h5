<template>
  <div class="content_body" id="content_body">
    <van-loading v-if="loadingShow" size="24px" style="margin-top: 1rem" vertical>加载中...</van-loading>
    <ul style="margin-top: 0.3rem">
      <li v-for="(item, index) in list" :key="index" @click="goPage('/detail', item.productId)">
        <div class="img_wrap">
          <img v-lazy="getBaseUrl+item.cover">
        </div>
        <div class="content_text_wrap">
          <h5>{{item.productName}}</h5>
          <p>{{item.describe}}</p>
          <p class="content_classify">
            <span>{{item.categoryName}} &nbsp; > &nbsp; {{item.parentCategoryName}}</span>
            <!--            <span style="color: #ccc">112👍</span>-->
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
  props: {
    list: {
      type: Array
    },
    loadingShow: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  methods: {
    goPage (path, id) {
      this.$router.push({
        path: path,
        query: {
          id: id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .content_body{
      width: 100%;
      .van-loading{
        width: 100%;
      }
      ul{
        li {
          border-bottom: 1px solid #ccc;
          padding: 0.2rem 0.3rem 0.4rem;
          width: 90%;
          height: 2rem;
          margin: 0 auto 0.2rem;
          div{
            display: inline-block;
          }
          .img_wrap {
            width: 35%;
            height: 2.1rem;
            vertical-align: top;
            img {
              width: 100%;
              height: 2.1rem;
            }
          }
          .content_text_wrap{
            width: 63%;
            /*vertical-align: top;*/
            h5{
              margin: 0.1rem 0 0 0.1rem;
              font-size: 0.35rem;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            p:nth-child(2){
              min-height: 0.8rem;
              overflow:hidden;
              text-overflow:ellipsis;
              display:-webkit-box;
              -webkit-box-orient:vertical;
              -webkit-line-clamp:2;
              margin: 0.1rem;
              font-size: 0.3rem;
              color: #aaa;
            }
            p:nth-child(3){
              font-size: 0.3rem;
              margin:0 0.1rem;
              color: #aaa;
            }
          }
          .content_classify{
            height: 0.4rem;
            line-height: 0.4rem;
            span:nth-child(2){
              float: right;
            }
          }
        }
      }
    }
</style>
