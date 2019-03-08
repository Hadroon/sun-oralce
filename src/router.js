import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import emailVerif from './views/EmailVerif.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/verif/:emailtoken',
      name: 'emailVerif',
      component: emailVerif
    },
    {
      path: '/reset/:resettoken',
      name: 'reset',
      component: Main
    }
  ]
})
