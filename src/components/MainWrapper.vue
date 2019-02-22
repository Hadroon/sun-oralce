<template>
  <div class="mainWrapper">
    <div id="first">
      <img src="/images/head3.gif" alt="">
      <img class="spinner" src="/images/turbine.png" alt="">
      <img class="logo" src="/images/logo.jpg" alt="">
      <div class="headText">

        <h1>
          Te mennyire vagy <span class="brown">környezettudatos</span>?
        </h1>

        <h3>
          Válaszaiddal most <span class="brown">500.000 Ft értékű</span> vásárlási <span class="brown">utalványt nyerhetsz.</span><br>

          Töltsd ki <span class="brown">pár perc</span>es kérdőívünket és <span class="brown">hasznos tippekkel látunk el</span><br> hogy hogyan tudnád élhetőbbé tenni a környezetedet.

        </h3>
        <h1>
          Éljen a <span class="brown">Föld</span>!  - A <span class="brown">Földdel</span> együtt Te is nyerhetsz!
        </h1>

        <p>Sorsolás: 2019.04.22.</p>
      </div>
    </div>
    <div id="second">
      <div class="price">
        <img src="/images/price1.png" alt="">
      </div>
      <div class="price">
        <img src="/images/price2.png" alt="">
      </div>
      <div class="price">
        <img src="/images/price3.png" alt="">
      </div>
      <img class="separator" src="/images/grass.png" alt="">
    </div>
    <auth-component 
    v-if="!authenticated.auth"
    :user="user"
    :authenticated="authenticated" />
    <p v-if="authenticated.auth">{{user.name}}</p>
    <div id="third">
      <form class="question" action="">
        <h2>3 km-nél kisebb távolságra…</h2>
        <input type="radio" name="gender" value="male"> Autóba pattanok, gyorsabb így.<br>
        <input type="radio" name="gender" value="female"> Tömegközlekedem, úgyis jön valami.<br>
        <input type="radio" name="gender" value="other"> Gyalogolok vagy bringázom.
      </form>
      <form class="question" action="">
        <h2>3 km-nél kisebb távolságra…</h2>
        <input type="radio" name="gender" value="male"> Autóba pattanok, gyorsabb így.<br>
        <input type="radio" name="gender" value="female"> Tömegközlekedem, úgyis jön valami.<br>
        <input type="radio" name="gender" value="other"> Gyalogolok vagy bringázom.
      </form>
      <form class="question" action="">
        <h2>3 km-nél kisebb távolságra…</h2>
        <input type="radio" name="gender" value="male"> Autóba pattanok, gyorsabb így.<br>
        <input type="radio" name="gender" value="female"> Tömegközlekedem, úgyis jön valami.<br>
        <input type="radio" name="gender" value="other"> Gyalogolok vagy bringázom.
      </form>
      <form class="question" action="">
        <h2>3 km-nél kisebb távolságra…</h2>
        <input type="radio" name="gender" value="male"> Autóba pattanok, gyorsabb így.<br>
        <input type="radio" name="gender" value="female"> Tömegközlekedem, úgyis jön valami.<br>
        <input type="radio" name="gender" value="other"> Gyalogolok vagy bringázom.
      </form>
    </div>
  </div>
</template>

<script>
import AuthComponent from '@/components/Authentication.vue'

export default {
  name: 'mainWrapper',
  components: {
    AuthComponent
  },
  created () {
    const sunToken = localStorage.getItem('sunToken')
    if (sunToken) this.checkUser(sunToken)
  },
  data () {
    return {
      authenticated: {
        auth: false,
        roles: null
      },
      user: {}
    }
  },
  methods: {
    checkUser: async function() {
      try {
        if (this.authenticated.auth) return
        let response = await this.$http.post("/check", {
          token: localStorage.henkeltoken
        });
        if (response.data.error) {
          this.authenticated.auth = false;
          localStorage.removeItem('henkeltoken');
          this.spinner.loading = false;
          return;
        }
        if (response.data.auth) {
          this.authenticated.auth = response.data.auth;
          this.authenticated.name = response.data.name;
          if (response.data.roles.includes('admin')) {
            this.authenticated.isAdmin = true;
          }
          return;
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  }
}
</script>
