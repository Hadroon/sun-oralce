import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: {
      auth: null,
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
    checkUser: async function (context, playload) {
      console.log('chck')
      console.log(playload)
      let response = await Axios.get('/check/' + playload)
      console.log(response)
      if (response.data.auth) {
        context.commit('setAuthenticated', response.data)
      }
    },
    validateEmilToken: async function (context, playload) {
      let response = await Axios.get('/validateemail/' + playload.emailToken)
      if (response.data.auth) {
        localStorage.setItem('sunToken', response.data.token)
        context.commit('setAuthenticated', response.data)
      } else if (!response.data.auth) {
        // TODO: handle if auth false
      }
      router.push({ name: 'main' })
    }
  }
})
