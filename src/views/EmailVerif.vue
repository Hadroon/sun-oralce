<template>
  <div style="height: 100vh; background: #ffffff;">
    <img src="/images/plant.gif" alt="" style="margin: 0px auto 0px auto; padding-top: 10vh;">
  </div>
</template>

<script>
export default {
  name: 'emailVerif',
  created () {
    // this.validateEmilToken(this.$route.params.emailtoken)
    console.log('verif created')
    console.log('token: ', this.$route.params.emailtoken)
    this.$store.dispatch('validateEmilToken', { emailToken: this.$route.params.emailtoken })
  },
  methods: {
  }
}
</script>

<style scoped>
  body {
    background-color: #ffffff;
  }
</style>
