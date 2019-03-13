<template>
  <div id="app">
    <div :class="hiderClass" id="hider">
      <!-- <img class="lakat" src="/images/lakat.png" alt=""> -->
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
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const sunToken = localStorage.getItem('sunToken')
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
      rightStyle: {}
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
    }
  }
}
</script>

<style>
</style>
