<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    console.log('App created')
    const sunToken = localStorage.getItem('sunToken')
    const userName = this.$store.state.authenticated.name
    console.log(userName)
    console.log(sunToken)
    if (sunToken && !userName) {
      console.log('dispatch indul')
      this.$store.dispatch('checkUser')
    }
  }
}
</script>


<style>
</style>
