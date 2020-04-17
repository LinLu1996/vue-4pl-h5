<template>
  <div id="app">
    <transition :name="animate">
      <router-view class="view" :key="$route.name"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      animate: '',
      scrollTop: 0
    }
  },
  activated () {
  },
  watch: {
    $route (to, from) {
      this.init()
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.animate = 'slide-left'
      } else {
        this.animate = 'slide-right'
      }
    }
  },
  methods: {
    init () {
      // document.body.addEventListener('touchmove', function (e) {
      //   e.preventDefault()
      // }, {
      //   passive: false
      // })
      this.backTop()
    },
    backTop () {
      const that = this
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5)
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
        if (that.scrollTop === 0) {
          clearInterval(timer)
        }
      }, 16)
    }
  }
}
</script>

<style lang="less">
  body{margin: 0;font-family: '微软雅黑'}
  ul {margin: 0; padding: 0}
  li {list-style: none}
  .view {
    /*padding: 50px 300px;*/
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    transition: all 0.2s linear;
  }
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    transform: translate(100%, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    transform: translate(-100%, 0);
  }
</style>
