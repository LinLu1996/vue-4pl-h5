// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
import 'lib-flexible/flexible.js'
import '@/vant-ui'
import '@/icons'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import VueCookie from 'vue-cookie'
import { isAuth } from '@/utils'
import animated from 'animate.css'

// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// export default vConsole

Vue.use(animated)
Vue.use(VueCookie)
Vue.config.productionTip = false
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.$axios = httpRequest.axios // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法

store.dispatch('initialMenuList')
store.dispatch('initialBaseUrl')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
