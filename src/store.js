import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)
Vue.config.devtools = false

export default new Vuex.Store({
  state: {
    authenticated: {
      auth: true,
      roles: null,
      name: null,
      token: null
    },
    currentComponent: 'auth-component',
    resultObject: [],
    survey: [
      {
        questionId: 0,
        question: 'Általában hogyan szoktál közlekedni?',
        img: 'vehicle.jpg',
        answers: [
          { msg: 'Kocsival hipp-hopp bárhol ott vagyok.',
          point: 1,
          extra: 'Néha próbáld ki a buszozást, így akár menetközben is tudod olvasni a kedvenc könyvedet, vagy jtszhatsz egyet a telefonodon.' },
          { msg: 'Bringázom vagy gyalogolok.',
          point: 3,
          extra: '' },
          { msg: 'Szeretem a tömegközlekedést, mindig van társaság.',
          point: 2,
          extra: 'Ha a célod közel van, sétálj egyet, ezzel nemcsak a környezetedért teszel, hanem a saját egészságedért is.' },
        ]
      },
      {
        questionId: 1,
        question: 'Milyen gyakran telik meg a szemetesed?',
        img: 'bin.jpg',
        answers: [
          { msg: 'Hetente vagy ritkábban.',
          point: 3,
          extra: '' },
          { msg: 'Egy héten 2-szer.',
          point: 2,
          extra: 'Vásárláshoz vigyél magaddal mindig szatyrot. A különböző pékárukat az üzletben egy zacskóba is bele rakhatod, ezzel is csökkentve az otthon halmozodó műanyagzacskókat. Próbáld ki, hogy néha egy pár napra előre megtervezed, hogy mikor mit fogsz enni és annak megfelelően vásárolsz. Így csökkentheted a megmaradó ételek mennyiségét.' },
          { msg: '2 naponta.',
          point: 1,
          extra: 'Vásárláshoz vigyél magaddal mindig szatyrot. A különböző pékárukat az üzletben egy zacskóba is bele rakhatod, ezzel is csökkentve az otthon halmozodó műanyagzacskókat. Próbáld ki, hogy néha egy pár napra előre megtervezed, hogy mikor mit fogsz enni és annak megfelelően vásárolsz. Így csökkentheted a megmaradó ételek mennyiségét.' },
        ]
      },
      {
        questionId: 2,
        question: 'Milyen gyakran szoktál húst enni?',
        img: 'steak.jpg',
        answers: [
          { msg: 'Minden étkezésnél.',
          point: 1,
          extra: 'Próbáld ki, hogy néha hús helyett sajtot, vagy tojást eszel. Nagyon finom fasírtot lehet készíteni zöldségekből, nekünk ez a kedvencünk: <a style="color: #008b00; font-weight: bold; text-decoration: none;" href="https://kardamomfood.wordpress.com/2015/11/06/voroslencses-zabos-buci/" target="_blank">LINK</a>. Jó étvágyat kívánunk!' },
          { msg: 'Naponta legalább egyszer.',
          point: 2,
          extra: 'Próbáld ki, hogy néha hús helyett sajtot, vagy tojást eszel. Nagyon finom fasírtot lehet készíteni zöldségekből, nekünk ez a kedvencünk: <a style="color: #008b00; font-weight: bold; text-decoration: none;" href="https://kardamomfood.wordpress.com/2015/11/06/voroslencses-zabos-buci/" target="_blank">LINK</a>. Jó étvágyat kívánunk!' },
          { msg: '2-3 naponta.',
          point: 3,
          extra: '' },
          { msg: 'Hetente egyszer vagy ritkábban.',
          point: 4,
          extra: '' },
          { msg: 'Soha.',
          point: 4,
          extra: '' },
        ]
      },
      {
        questionId: 3,
        question: 'Újrahasználsz bármilyen hulladékot (papír, üveg stb.) vagy szelektíven gyűjtöd a hulladékot?',
        img: 'select.jpg',
        answers: [
          { msg: 'Igen',
          point: 3,
          extra: '' },
          { msg: 'Gyakran, amit csak lehet újrahasználok.',
          point: 3,
          extra: '' },
          { msg: 'Ritkán (előfordul, hogy újra használok dolgokat.',
          point: 2,
          extra: '' },
          { msg: 'Soha.',
          point: 1,
          extra: '' },
        ]
      },
      {
        questionId: 4,
        question: 'Hol voltál az elmúlt évben nyaralni?',
        img: 'holly.jpg',
        answers: [
          { msg: 'Nem voltam nyaralni.',
          point: 4,
          extra: '' },
          { msg: 'Belföldön busszal/vonattal.',
          point: 3,
          extra: '' },
          { msg: 'Európában busszal/vonattal.',
          point: 3,
          extra: '' },
          { msg: 'Belföldön autóval.',
          point: 2,
          extra: '' },
          { msg: 'Európában autóval.',
          point: 2,
          extra: '' },
          { msg: 'Európában repülővel.',
          point: 1,
          extra: '' },
          { msg: 'Európán kívül repülővel.',
          point: 1,
          extra: '' },
        ]
      },
      {
        questionId: 5,
        question: 'Döntéseid során milyen gyakran választasz energiatakarékos berendezést?',
        img: 'solar2.jpg',
        answers: [
          { msg: 'Nem figyelek rá.',
          point: 1,
          extra: '' },
          { msg: 'Ritkán.',
          point: 1,
          extra: '' },
          { msg: 'Berendezéseim fele ilyen.',
          point: 2,
          extra: '' },
          { msg: 'Berendezéseim több mint fele ilyen.',
          point: 2,
          extra: '' },
          { msg: 'Mindig energiatakarékos berendezést veszek.',
          point: 3,
          extra: '' },
        ]
      },
      {
        questionId: 6,
        question: 'Mekkora az átlagos havi áramszámlád?',
        img: 'bill.jpg',
        answers: [
          { msg: 'átlag 8000 Ft/hó alatt',
          point: 0,
          extra: '' },
          { msg: 'átlag 8000-12 000 Ft/hó között',
          point: 0,
          extra: '' },
          { msg: 'átlag 12000 Ft/hó felett',
          point: 0,
          extra: '' },
        ]
      },
      {
        questionId: 7,
        question: 'Tervezel napelemes rendszer telepítést a jövőben?',
        img: 'buy.jpg',
        answers: [
          { msg: 'Igen, 6 hónapon belül',
          point: 0,
          extra: '' },
          { msg: 'Igen, 1 éven belül',
          point: 0,
          extra: '' },
          { msg: 'Igen, később',
          point: 0,
          extra: '' },
          { msg: 'Nem',
          point: 0,
          extra: '' },
        ]
      }
    ],
    resultAnswers: [
      {
        point: 16,
        answer: 'Gratulálunk, Te vagy a Föld nagykövete! Mindent megteszel a környezetedért, csak így tovább! Amennyiben Te leszel a nyertes, emailben értesíteni fogunk.'
      },
      {
        point: 10,
        answer: 'Válaszaid alapján több dologban is odafigyelsz, és sokat teszel a környezetedért a mindennapjaidban. Nagyon jó úton haladsz, de néhány dologban még tudsz fejlődni, ehhez adunk most tippeket:'
      },
      {
        point: 9,
        answer: 'Meg kell még írni'
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
    },
    getResult: state => {
      let finalResult = []
      let totalPoints = 0;
      state.resultObject.forEach(answerObject => totalPoints += answerObject.answer.point )
      if (totalPoints >= 16) {
        finalResult.push(state.resultAnswers[0].answer)
      } else if (totalPoints >= 10) {
        finalResult.push(state.resultAnswers[1].answer)
      } else {
        finalResult.push(state.resultAnswers[2].answer)
      }
      state.resultObject.forEach(answerObject => finalResult.push(answerObject.answer.extra))
      finalResult.push('Amennyiben Te leszel a nyertes, emailben értesíteni fogunk. Sok sikert kívánunk!')
      return finalResult
    },
    getCurrentComponent: state => state.currentComponent
  },
  mutations: {
    setAuthenticated (state, playload) {
      state.authenticated = playload
    },
    registerAnswer (state, playload) {
      state.resultObject.push(playload)
    },
    setComponent (state, playload) {
      state.currentComponent = playload
    },
    setResultObject (state, playload) {
      state.resultObject = playload
    }
  },
  actions: {
    checkUser: async function (context, playload) {
      let response = await Axios.get('/check/' + playload)
      if (response.data.auth) {
        context.commit('setAuthenticated', response.data)
        if (response.data.result.length === 8) {
          context.commit('setResultObject', response.data.result)
          context.commit('setComponent', 'result-comp')
        } else {
          context.commit('setComponent', 'survey-comp')
        }
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
    },
    finishSurvey: async function (context) {
      const token = localStorage.getItem('sunToken')
      const playload = {
        token,
        result: context.state.resultObject
      }
      await Axios.post('/result', playload)
    }
  }
})
