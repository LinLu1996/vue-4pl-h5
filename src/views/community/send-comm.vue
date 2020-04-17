<template>
  <div>
    <div class="send_choice">
      <span class="text">发布至</span>
      <span class="choice" @click="getTopic">{{choice}}</span>
      <span class="send_btn" @click="sendUp">
        <van-button size="small" color="#fbaa49">
          <icon-svg name="发布" style="position: absolute;left: 0.12rem;top: 0.15rem"></icon-svg>
          发布
        </van-button>
      </span>
    </div>
    <div class="loading_page" v-if="sendShow" style="width: 80%;margin: 3rem auto 6rem;height: 3.5rem;padding-top: 2.5rem">
      <p style="width: 80%;height: 1rem;line-height: 1rem; margin: 0 auto; border-radius: 0.5rem;text-align: center; background-color: #efefef;font-size: 0.36rem">已提交审核，审核通过后发布</p>
      <!--<span style="display: block;text-align: center;">-->
        <!--<van-count-down :time="3500" format="ss 秒"/>-->
      <!--</span>-->
    </div>
    <div v-else>
      <van-field v-model="valueTitle" maxlength="20" placeholder="请输入标题（最多20字）" required/>
      <van-field v-model="valueKeys" maxlength="50" placeholder="请输入关键字（以逗号分割，最多支持3个）" required/>
      <van-field
        v-model="valueMessage"
        rows="20"
        autosize
        required
        type="textarea"
        maxlength="2000"
        placeholder="请输入正文内容（最多2000字）"
        show-word-limit
      />
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="plateList"
      @select="onSelect"
      cancel-text="取消"
      @cancel="onCancel"
    />
  </div>
</template>
<script>
import {Notify} from 'Vant'
export default {
  data () {
    return {
      actionShow: false,
      choice: '请选择',
      plateList: [],
      postBlockId: '',
      valueTitle: '',
      valueKeys: '',
      valueMessage: '',
      sendShow: false,
      clickFlag: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getPlate()
    },
    getPlate () {
      this.$http({
        url: this.$http.adornUrl('/communityBlock/getCommunityBlockList.action'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.status === 'success') {
          this.plateList = data.list.map(res => {
            if (res.blockName) {
              res.name = res.blockName
            }
            return res
          })
        }
      })
    },
    getTopic () {
      this.actionShow = true
    },
    onCancel () {},
    onSelect (item) {
      this.actionShow = false
      this.choice = item.name
      this.postBlockId = item.id
    },
    sendUp () {
      if (!this.clickFlag) {
        return
      }
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 3000)
      if (!this.postBlockId) {
        Notify({ type: 'danger', message: '请选择所属板块' })
        return
      } else if (!this.valueTitle) {
        Notify({ type: 'danger', message: '请输入标题' })
        return
      } else if (!this.valueKeys) {
        Notify({ type: 'danger', message: '请输入关键词' })
        return
      } else if (!this.valueMessage) {
        Notify({ type: 'danger', message: '请输入内容' })
        return
      }
      let gs = 0
      for (let i = 0; i < this.valueKeys.length; i++) {
        if (this.valueKeys[i] === ',' || this.valueKeys[i] === '，') {
          gs++
        }
      }
      if (gs > 2) {
        Notify({ type: 'danger', message: '最多输入三个关键词' })
        return
      }
      let valueKeysArr = this.valueKeys && this.valueKeys.split('，')
      valueKeysArr = valueKeysArr.map(inner => {
        return inner.split(',')
      })
      let tempKeywords = []
      valueKeysArr.forEach(item => {
        tempKeywords.push(...item)
      })
      let tooLong = false
      tempKeywords.forEach(res => {
        if (res.length > 5) {
          tooLong = true
        }
      })
      if (tooLong) {
        Notify({ type: 'danger', message: '每个关键词不得超过五个字符' })
        return
      }
      this.$http({
        url: this.$http.adornUrl('/communityPost/addPost.action'),
        method: 'post',
        data: this.$http.adornData({
          'postTitle': this.valueTitle,
          'postBlockId': this.postBlockId,
          'postKeyword': this.valueKeys,
          'postContent': this.valueMessage
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          // this.sendShow = true
          setTimeout(() => {
            this.$router.go(-1)
          }, 3000)
          // Toast({
          //   message: '已提交审核，审核通过后发布',
          //   onClose: () => {
          //     this.$router.go(-1)
          //   }
          // })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .send_choice{
    height: 1.5rem;
    line-height: 1.5rem;
    background-color: #f2f2f2;
    font-size: 0.38rem;
    .text{
      margin: 0 0.3rem;
    }
    .choice{
      display: inline-block;
      min-width: 2rem;
      padding: 0 0.2rem;
      height: 1rem;
      line-height: 1rem;
      border-radius: 0.2rem;
      text-align: center;
      vertical-align: middle;
      background-color: #ffffff;
      color: #a6a6a6;
    }
    .send_btn{
      /*display: inline-block;*/
      /*width: 1.5rem;*/
      /*height: 0.8rem;*/
      /*line-height: 0.8rem;*/
      margin: 0 0.3rem 0 0;
      /*background-color: #fbaa49;*/
      /*text-align: center;*/
      /*border-radius: 0.1rem;*/
      /*box-shadow:0 5px 5px rgba(100, 100, 100, .5);*/
      float: right;
      /*font-weight: bold;*/
      /*color: #ffffff;*/
      /*color: #644434;*/
      .van-button{
        font-size: 0.38rem;
        position: relative;
        text-align: right;
        box-shadow:0 5px 5px rgba(100, 100, 100, .5);
      }
    }
  }
  .loading_page{
    /deep/.van-count-down{
      margin-top: 0.5rem;
      font-size: 0.6rem;
      color: #808080;
    }
  }
</style>
