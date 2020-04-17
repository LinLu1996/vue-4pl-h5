<template>
  <div class="tpl-08">
    <div class="img_p" v-for="(item, index) in tplInfo" :key="index">
      <van-image
        width="2rem"
        height="2rem"
        fit="contain"
        :src="getBaseUrl + item.contentList[0].content"
      />
      <!--<img :src="'http://192.168.0.166:8080' + item.contentList[0].content">-->
      <div>
        <strong>{{item.contentList[1].content}}</strong>
        <p class="text_hidden">{{item.contentList[2].content}}</p>
        <span v-if="item.contentList[2].content.length / 10 > 6" class="view_more" @click="showMore(item)"><span>[<i>更多...</i>]</span></span>
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
  .tpl-08{
    padding: 0 0.1rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .img_p {
      width: 46%;
      margin-top: 0.1rem;
      display: inline-block;
      margin-left: 0.15rem;
      margin-bottom: 0.5rem;
      div{
        display: block;
        position: relative;
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
        .text_hidden{
          overflow:hidden;
          height: 3.6rem;
          /*text-overflow:ellipsis;*/
          /*display:-webkit-box;*/
          /*-webkit-box-orient:vertical;*/
          /*-webkit-line-clamp:6;*/
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
            /*bottom: 0;*/
          /*}*/
          i{
            font-style: normal;
            text-decoration: underline;
          }
        }
      }
      .van-image{
        display: block;
        margin: 0 auto;
      }
    }
    .img_p:last-child{
      border: 0;
      padding: 0;
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
