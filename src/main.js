import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'

import VueMask from 'v-mask'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.use(VueMask)

const token = localStorage.getItem('suntoken')
if (token) {
  Vue.prototype.$http.defaults.headers.common['suntoken'] = token
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
