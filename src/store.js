import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: {
      auth: false,
      roles: null,
      name: null
    }
  },
  getters: {
    getUser: state => {
      return state.authenticated
    }
  },
  mutations: {
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
      } else if (!response.data.auth) {
        console.log('nincs user')
      }
      console.log('vege')
    }
  }
})
