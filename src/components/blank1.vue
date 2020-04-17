<template>
  <div class="blank_wrap">
    <div class="svg_wrap" v-if="$route.query.type === 'FYB'">
      <p>
        <icon-svg name="敬请期待" style="font-size: 3rem;"></icon-svg>
      </p>
      <!--<span style="font-size: 0.8rem">敬请期待!</span>-->
    </div>
    <div v-else>
      <p style="text-align: center;color: #cccccc;font-size: 1rem;margin-top: 4rem">中国移动 IT能力库</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {}
}
</script>
<style lang="less" scoped>
  .blank_wrap{
    height: 100vh;
    .svg_wrap{
      text-align: center;
      color: #cccccc;
      p{
        margin-top: 30vh;
      }
    }
  }
</style>
