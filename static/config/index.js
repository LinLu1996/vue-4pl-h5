/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.113:8081';
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8081/java-develop'
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8888';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.124:8082';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.166:8080'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.117:8080'
  // window.SITE_CONFIG['baseUrl'] = 'http://47.102.41.154/xtjc'
  // window.SITE_CONFIG['baseUrl'] = 'http://cloudinfo1.hq.cmcc/xtjc'
  window.SITE_CONFIG['baseUrl'] = window.location.href.split('/xtjc') && window.location.href.split('/xtjc')[0] + '/xtjc'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
