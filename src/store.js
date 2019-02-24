import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: {
      auth: false,
      roles: null,
      name: null,
      token: null
    }
  },
  getters: {
    getUser: state => {
      return state.authenticated
    }
  },
  mutations: {
    setAuthenticated (state, playload) {
      state.authenticated = playload
    }
  },
  actions: {
    chackContext (context) {
    },
    checkUser: async function () {
    },
    validateEmilToken: async function (context, playload) {
      console.log('validate email indul')
      console.log(playload)
      let response = await Axios.get('/validateemail/' + playload.emailToken)
      // let response = await Axios.get('/validateemail/jkhkhkh')
      // console.log('eza res:', response)
      console.log(response.data)
      if (response.data.auth) {
        console.log('van user')
        localStorage.setItem('sunToken', response.data.token)
        context.commit('setAuthenticated', response.data)
      } else if (!response.data.auth) {
        console.log('nincs user')
      }
      router.push({ name: 'main' })
      console.log('vege')
    }
  }
})
