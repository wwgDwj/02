import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/css/global.css'
//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//拦截器
axios.interceptors.request.use(config=> {
  // 在发送请求之前做些什么，例如加入token
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http=axios
// 手动配置 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
Vue.use(ElementUI)
//

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
