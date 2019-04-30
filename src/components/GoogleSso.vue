<template>
  <g-signin-button
    class="g-signin2"
    :params="googleSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError">
    Sign in with Google
  </g-signin-button>
</template>
 
<script>
export default {
  name: 'GoogleSso',
  data () {
    return {
      /**
       * The Auth2 parameters, as seen on
       * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
       * As the very least, a valid client_id must present.
       * @type {Object} 
       */
      googleSignInParams: {
        client_id: '67148300550-i59u3tj3g77c5gv5j85ra1um72ss6uen.apps.googleusercontent.com'
      }
    }
  },
  methods: {
    onSignInSuccess (googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users
      const profile = googleUser.getBasicProfile()
      var id_token = googleUser.getAuthResponse().id_token
      this.onSignIn(profile, id_token)
    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('OH NOES', error)
    },
    onSignIn: async function (profile, id_token) {
      try {
        let response = await this.$http.post('/google-login', { googleToken: id_token })
        if(response.data.auth) {
          localStorage.sunToken = response.data.token
          this.$store.commit('setAuthenticated', response.data)

          if (response.data.result.length === 8) {
            this.$store.commit('setResultObject', response.data.result)
            this.$store.commit('setComponent', 'result-comp')
          } else {
            this.$store.commit('setComponent', 'survey-comp')
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
}
</script> 
