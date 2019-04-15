import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import GSignInButton from 'vue-google-signin-button'

import VueMask from 'v-mask'

Vue.config.productionTip = false
// Vue.config.productionTip = true
Vue.prototype.$http = Axios

Vue.use(GSignInButton)
Vue.use(VueMask)
// Vue.config.devtools = true

const token = localStorage.getItem('sunToken')
if (token) {
  Vue.prototype.$http.defaults.headers.common['sunToken'] = token
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
