import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: {
      auth: true,
      roles: null,
      name: null,
      token: null
    },
    survey: [
      {
        questionId: 0,
        question: 'Általában hogyan szoktál közlekedni?',
        img: 'vehicle.jpg',
        answers: [
          'Kocsival hipp-hopp bárhol ott vagyok.',
          'Bringázom vagy gyalogolok.',
          'Szeretem a tömegközlekedést, mindig van társaság.'
        ]
      },
      {
        questionId: 1,
        question: 'Milyen gyakran telik meg a szemetesed?',
        img: 'bin.jpg',
        answers: [
          'Kocsival hipp-hopp bárhol ott vagyok.',
          'Bringázom vagy gyalogolok.',
          'Szeretem a tömegközlekedést, mindig van társaság.'
        ]
      },
      {
        questionId: 2,
        question: 'Milyen gyakran szoktál húst enni?',
        img: 'steak.jpg',
        answers: [
          'Minden étkezésnél.',
          'Naponta legalább egyszer.',
          '2-3 naponta.',
          'Hetente egyszer vagy ritkábban.',
          'Soha.'
        ]
      },
      {
        questionId: 3,
        question: 'Újrahasználsz bármilyen hulladékot (papír, üveg stb.) vagy szelektíven gyűjtöd a hulladékot?',
        img: 'select.jpg',
        answers: [
          'Igen',
          'Gyakran, amit csak lehet újrahasználok.',
          'Ritkán (előfordul, hogy újra használok dolgokat.',
          'Soha.'
        ]
      },
      {
        questionId: 4,
        question: 'Hol voltál az elmúlt évben nyaralni?',
        img: 'holly.jpg',
        answers: [
          'Nem voltam nyaralni.',
          'Belföldön busszal/vonattal.',
          'Külföldön Európában busszal/vonattal.',
          'Belföldön autóval.',
          'Külföldön Európában busszal/vonattal.',
          'Külföldön, Európában repülővel.',
          'Külföldön, Európán kívül repülővel.'
        ]
      },
      {
        questionId: 5,
        question: 'Döntéseid során milyen gyakran választasz energiatakarékos berendezést?',
        img: 'solar2.jpg',
        answers: [
          'Nem figyelek rá.',
          'Ritkán.',
          'Berendezéseim fele ilyen.',
          'Berendezéseim több mint fele ilyen.',
          'Mindig energiatakarékos berendezést veszek.'
        ]
      },
      {
        questionId: 6,
        question: 'Mekkora az átlagos havi áramszámlád?',
        img: 'bill.jpg',
        answers: [
          'átlag 8000 Ft/hó alatt',
          'átlag 8000-12 000 Ft/hó között',
          'átlag 12000 Ft/hó felett'
        ]
      },
      {
        questionId: 7,
        question: 'Tervezel napelemes rendszer telepítést a jövőben?',
        img: 'buy.jpg',
        answers: [
          'Igen, 6 hónapon belül',
          'Igen, 1 éven belül',
          'Igen, később',
          'Nem'
        ]
      }
    ]
  },
  getters: {
    getUser: state => {
      return state.authenticated
    },
    getQueston: (state) => (id) => {
      return state.survey[id]
    },
    getQuestonLength: (state) => {
      return state.survey.length
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
      let response = await Axios.get('/check/' + playload)
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
