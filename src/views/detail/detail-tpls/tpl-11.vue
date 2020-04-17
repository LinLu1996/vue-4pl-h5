<template>
  <div class="tpl-11">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <van-image
        width="2rem"
        height="2rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[0].content"
      />
      <p class="text_hidden">{{item.contentList[1].content}}</p>
      <span v-if="item.contentList[1].content.length / 10 > 6" class="view_more" @click="showMore(item)"><span>[<i>更多...</i>]</span></span>
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
        <p>{{textP}}</p>
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
      this.textP = item.contentList[1].content
    }
  }
}
</script>
<style lang="less" scoped>
  .tpl-11{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .img_p{
      width: 46%;
      display: inline-block;
      margin-bottom: 0.5rem;
      position: relative;
      .van-image{
        display: block;
        margin: 0 auto;
      }
      p{
        margin: 0;
        padding: 0 0.2rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #595959;
        text-align: center;
      }
      .view_more{
        position: absolute;
        right: 0.2rem;
        width: 100%;
        height: 0.65rem;
        bottom: 0;
        text-align: right;
        /*display: inline-block;*/
        /*width: 2.16rem;*/
        /*height: 0.6rem;*/
        /*!*line-height: 0.6rem;*!*/
        /*vertical-align: baseline;*/
        /*!*text-align: center;*!*/
        /*!*text-decoration:underline;*!*/
        font-size: 0.3rem;
        background-color: #ffffff;
        color: skyblue;
        /*span{*/
          /*position: absolute;*/
          /*bottom: 0.06rem;*/
        /*}*/
        i{
          font-style: normal;
          text-decoration: underline;
          /*color: #595959;*/
        }
      }
      .text_hidden{
        overflow:hidden;
        height: 3.6rem;
        /*overflow:hidden;*/
        /*text-overflow:ellipsis;*/
        /*display:-webkit-box;*/
        /*-webkit-box-orient:vertical;*/
        /*-webkit-line-clamp:6;*/
      }
    }
    .pop_content{
      margin-top: 1rem;
      .van-image{
        display: block;
        margin: 0 auto;
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
