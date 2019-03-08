<template>
  <div id="app">
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
  }
}
</script>


<style>
</style>
