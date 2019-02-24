<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    console.log('App created')
    const sunToken = localStorage.getItem('sunToken')
    const userName = this.$store.state.authenticated.name
    console.log(userName)
    if (sunToken && !userName) this.$store.dispatch('checkUser')
  }
}
</script>


<style>
</style>
