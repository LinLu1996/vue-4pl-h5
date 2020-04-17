import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'
import Home from '@/views/home'
import Search from '@/views/search'
import List from '@/views/list'
import SpecialTopic from '@/views/special-topic'
import Community from '@/views/community'
import CommDetail from '@/views/community/comm-detail'
import SendComm from '@/views/community/send-comm'
import Detail from '@/views/detail'
import Blank from '@/components/blank'
import Blank1 from '@/components/blank1'
import Blank2 from '@/components/blank2'
import Personal from '@/views/personal'
import Collect from '@/views/collect'
import Invitation from '@/views/invitation'
import Footmark from '@/views/footmark'
import Focus from '@/views/focus'
import Text from '@/views/text'
import ReceiveComments from '@/views/receiveComments'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home,
          meta: { title: 'IT能力库', isTab: false, index: 1 }
        },
        {
          path: 'search',
          name: 'Search',
          component: Search,
          meta: { title: '搜索', isTab: false, index: 2 }
        },
        {
          path: 'list',
          name: 'List',
          component: List,
          meta: { title: '列表', isTab: false, index: 2 }
        },
        {
          path: 'community',
          name: 'Community',
          component: Community,
          meta: { title: '社区', isTab: false, index: 2 }
        },
        {
          path: 'comm-detail',
          name: 'CommDetail',
          component: CommDetail,
          meta: { title: '帖子详情', isTab: false, index: 6 }
        },
        {
          path: 'send-comm',
          name: 'SendComm',
          component: SendComm,
          meta: { title: '发帖', isTab: false, index: 3 }
        },
        {
          path: 'special-topic',
          name: 'SpecialTopic',
          component: SpecialTopic,
          meta: { title: '专题', isTab: false, index: 2 }
        },
        {
          path: 'detail',
          name: 'Detail',
          component: Detail,
          meta: { title: '详情', isTab: false, index: 6 }
        },
        {
          path: 'personal',
          name: 'Personal',
          component: Personal,
          meta: { title: '个人中心', isTab: false, index: 4 }
        },
        {
          path: 'collect',
          name: 'Collect',
          component: Collect,
          meta: { title: '收藏', isTab: false, index: 5 }
        },
        {
          path: 'invitation',
          name: 'Invitation',
          component: Invitation,
          meta: { title: '帖子', isTab: false, index: 5 }
        },
        {
          path: 'footmark',
          name: 'Footmark',
          component: Footmark,
          meta: { title: '我的足迹', isTab: false, index: 5 }
        },
        {
          path: 'focus',
          name: 'Focus',
          component: Focus,
          meta: { title: '关注', isTab: false, index: 5 }
        },
        {
          path: 'text',
          name: 'Text',
          component: Text,
          meta: { title: '测试', isTab: false, index: 9 }
        },
        {
          path: 'receiveComments',
          name: 'ReceiveComments',
          component: ReceiveComments,
          meta: { title: '收到评论', isTab: false, index: 5 }
        },
        {
          path: 'blank',
          name: 'Blank',
          component: Blank,
          meta: { title: '风云榜评选', isTab: false, index: 9 }
        },
        {
          path: 'blank1',
          name: 'Blank1',
          component: Blank1,
          meta: { title: '关于我们', isTab: false, index: 9 }
        },
        {
          path: 'blank2',
          name: 'Blank2',
          component: Blank2,
          meta: { title: '消息', isTab: false, index: 9 }
        }
      ]
    },
    {
      path: '*', // 页面不存在的情况下会跳到首页
      redirect: '/home',
      name: 'notFound',
      hidden: true
    }
  ]
})
