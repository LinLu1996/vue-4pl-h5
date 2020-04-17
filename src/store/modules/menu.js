import httpRequest from '@/utils/httpRequest'
export default {
  namespaced: false,
  state: {
    menuList: []
  },
  getters: {
    getMenu: state => type => {
      return handleMenuList(state, type)
    }
  },
  mutations: {
    setMenuList (state, list) {
      state.menuList = list
    }
  },
  actions: {
    initialMenuList ({commit}) {
      httpRequest({
        url: httpRequest.adornUrl('/category/getCategoryList.action'),
        method: 'get',
        params: httpRequest.adornParams({
        }, false)
      }).then(({data}) => {
        if (data && data.status === 'success') {
          console.log('菜单加载完成')
          commit('setMenuList', data.list)
        } else {
          console.log('加载本地菜单')
          if (localStorage.getItem('menuList') && JSON.parse(localStorage.getItem('menuList')).length) {
            commit('setMenuList', JSON.parse(localStorage.getItem('menuList')))
          }
        }
      })
    }
  }
}

function handleMenuList (state, type) {
  localStorage.setItem('menuList', JSON.stringify(state.menuList))
  return state.menuList
}
