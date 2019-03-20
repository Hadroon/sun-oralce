<template>
  <div id="app">
    <div :class="hiderClass" id="hider">
      <form @submit="letMeSee" id="solarInput" action="">
        <label for="">Kérelek add meg a jelszót: </label>
        <input v-model="pass" type="password">
      </form>
      <div class="hiderLeft" :style="leftStyle">
        <img src="/images/solar1.jpg" alt="">
      </div>
      <div class="hiderRight" :style="rightStyle">
        <img src="/images/solar2.jpg" alt="">
      </div>
    </div>
    <div v-if="sunCookie" id="cookie-box">
      <p>
        Az oldal “cookie”-t (sütiket) használ. Az oldal böngészésével elfogadja cégünk cookie-szabályzatát. 
        Részletesebb tájékoztatásért lásd: <a style="color: #ffffff;" href="#">Adatvédelmi szabályzatunkat</a>
      </p>
      <button @click="cookieOk" class="cookie-button">Rendben</button>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const sunToken = localStorage.getItem('sunToken')
    const sunCookie = localStorage.getItem('sunCookie')
    if (sunCookie) {
      this.sunCookie = false
    }
    const userName = this.$store.getters.getUser.name
    if (sunToken && !userName) {
      this.$store.dispatch('checkUser', sunToken)
    }
  },
  data () {
    return {
      hiderClass: 'hider',
      pass: null,
      leftStyle: {},
      rightStyle: {},
      sunCookie: true
    }
  },
  methods: {
    letMeSee: function (e) {
      e.preventDefault()
      // console.log(window)
      document.getElementById('mainWrapper').classList.remove("hidden")
      document.getElementById('solarInput').classList.add("hidden")

      let width = window.innerWidth
      if (this.pass === 'solar') {
        // alert('hello')
        this.leftStyle = {
          left: 0 - width / 2 + 'px'
        }
        this.rightStyle = {
          left: width + 'px'
        }
        setTimeout(function(){ 
          document.getElementById('hider').classList.add("hidden")
         }, 2001);
      }
    },
    cookieOk: function (e) {
      e.preventDefault()
      localStorage.setItem('sunCookie', true)
      this.sunCookie = false
    }
  }
}
</script>

<style>
</style>
