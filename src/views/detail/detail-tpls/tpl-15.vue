<template>
  <div class="tpl-15">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <img :src="getBaseUrl + item.contentList[0].content">
      <div>
        <strong>{{item.contentList[1].content}}</strong>
        <p class="text_hidden">{{item.contentList[2].content}}</p>
        <span v-if="item.contentList[2].content.length / 10 > 6" class="view_more" @click="showMore(item)"><i>更多</i></span>
      </div>
    </div>
    <div class="img_p"></div>
    <van-popup
      v-model="showPop"
      closeable
      position="bottom"
      close="onClose"
      :style="{ width: '100%', height: '80%'}">
      <div class="pop_content">
        <van-image
          width="4rem"
          height="4rem"
          fit="contain"
          :src="getBaseUrl + imgUrl"
        />
        <div>
          <strong>{{textStrong}}</strong>
          <p>{{textP}}</p>
        </div>
      </div>
    </van-popup>
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
      showPop: false,
      imgUrl: '',
      textStrong: '',
      textP: ''
    }
  },
  computed: {
    ...mapGetters([
      'getBaseUrl'
    ])
  },
  methods: {
    showMore (item) {
      this.showPop = true
      this.imgUrl = item.contentList[0].content
      this.textStrong = item.contentList[1].content
      this.textP = item.contentList[2].content
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-15{
    padding: 0.2rem 0.1rem 0;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .img_p {
      width: 47%;
      /*min-height: 3rem;*/
      display: inline-block;
      margin: 0.1rem 0 0.15rem 0.15rem;
      position: relative;
      div{
        width: 100%;
        height: 100%;
        background-color: #333;
        opacity: 0.8;
        display: inline-block;
        color: #fff;
        strong{
          display: block;
          text-align: center;
          margin: 0.2rem 0;
          font-size: 0.38rem;
        }
        p{
          margin: 0 0.2rem 0.6rem;
          /*padding: 0 0.2rem 0.2rem;*/
          line-height: 0.6rem;
          font-size: 0.36rem;
          color: #ffffff;
          text-align: center;
        }
        .text_hidden{
          overflow:hidden;
          height: 3.5rem;
          /*overflow:hidden;*/
          /*text-overflow:ellipsis;*/
          /*display:-webkit-box;*/
          /*-webkit-box-orient:vertical;*/
          /*-webkit-line-clamp:6;*/
        }
        .view_more{
          position: absolute;
          right: 0.1rem;
          bottom: 0;
          display: inline-block;
          width: 1rem;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          /*text-decoration:underline;*/
          font-size: 0.33rem;
          background-color: #ffffff;
          i{
            font-style: normal;
            text-decoration: underline;
            color: #595959;
          }
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
    .pop_content{
      margin-top: 1rem;
      .van-image{
        display: block;
        margin: 0 auto;
      }
      strong{
        display: block;
        text-align: center;
        font-size: 0.38rem;
        margin-bottom: 0.2rem;
      }
      p{
        width: 80%;
        margin: 0 auto;
        padding: 0 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
        text-align: center;
      }
    }
  }
</style>
