import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import './utils/ant.js'
import './utils/http-common-handler.js'
import './utils/common.less'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
