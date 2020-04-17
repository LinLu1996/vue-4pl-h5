import Vue from 'vue'
import router from '@/router'
// import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  if (JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1) this.$isAuthNum++
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  // store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 将驼峰风格的列名转为下划线风格
 * @param string
 * @returns {*}
 */
export function toUnderScore (string) {
  return string.replace(/([A-Z])/g, function (all, letter) {
    return '_' + letter.toLowerCase()
  })
}

/**
 * 把排序方式改为缩写形式
 * @param string
 * @returns {*}
 */
export function abbreviate (order) {
  switch (order) {
    case 'ascending':
      return 'ASC'
    case 'descending':
      return 'DESC'
    default:
      return null
  }
}

/**
 * 初始今天、本周、本月时间
 * @param date 时间标识
 * @returns {Date[]}
 */
export function getSelectDate (date) {
  let oneDayLong = 24 * 60 * 60 * 1000
  let now = new Date()
  switch (date) {
    case 'theDay':
      let startDay = new Date(now.getTime()).setHours(0, 0, 0, 0)
      let endDay = new Date(now.getTime()).setHours(0, 0, 0, 0)
      let morning = new Date(startDay)
      let night = new Date(endDay)
      let today = [morning, night]
      return today
    case 'theWeek':
      let mondayTime = now.getTime() - (now.getDay() - 1) * oneDayLong
      let sundayTime = now.getTime() + (7 - now.getDay()) * oneDayLong
      let monday = new Date(mondayTime).setHours(0, 0, 0, 0)
      let sunday = new Date(sundayTime).setHours(0, 0, 0, 0)
      let weekRange = [monday, sunday]
      return weekRange
    case 'theMonth':
      let year = now.getFullYear()
      let monthStartDate = new Date(year, now.getMonth(), 1)// 当前月1号
      let nextMonthStartDate = new Date(year, now.getMonth() + 1, 0)// 下个月1号
      let days = (nextMonthStartDate.getTime() + oneDayLong - monthStartDate.getTime()) / oneDayLong// 计算当前月份的天数
      let monthEndDate = new Date(year, now.getMonth(), days).setHours(0, 0, 0, 0)
      let monthRange = [monthStartDate, monthEndDate]
      return monthRange
    default:
      break
  }
}

export function resetData (data) {
  for (let key in data) {
    data[key] = ''
  }
}

export function formatDate (date, endType) {
  if (date.length === 6) {
    const tempYear = date.substring(0, 4)
    const tempMon = date.substring(4)
    date = `${tempYear}-${tempMon}`
  }
  let year = new Date(date).getFullYear()
  let month = new Date(date).getMonth() + 1
  month = parseInt(month) < 10 ? `0${month}` : month
  let day = new Date(date).getDate()
  day = parseInt(day) < 10 ? `0${day}` : day
  if (endType === 'Month') {
    return year + '-' + month
  } else {
    return year + '-' + month + '-' + day
  }
}

Vue.prototype.$formatDate = function (date, endType) {
  if (date) {
    if (date.length === 6) {
      const tempYear = date.substring(0, 4)
      const tempMon = date.substring(4)
      date = `${tempYear}-${tempMon}`
    }
    let year = new Date(date).getFullYear()
    let month = new Date(date).getMonth() + 1
    month = parseInt(month) < 10 ? `0${month}` : month
    let day = new Date(date).getDate()
    let hour = new Date(date).getHours()
    let min = new Date(date).getMinutes()
    let sec = new Date(date).getSeconds()
    day = parseInt(day) < 10 ? `0${day}` : day
    if (endType === 'Month') {
      return year + '年' + month + '月'
    } else if (endType === 'Second') {
      return year + '年' + month + '月' + day + '日' + ' ' + hour + '时' + min + '分' + sec + '秒'
    } else {
      return year + '年' + month + '月' + day + '日'
    }
  } else {
    return ''
  }
}
