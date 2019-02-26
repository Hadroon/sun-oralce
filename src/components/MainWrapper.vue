<template>
  <div class="mainWrapper">
    <div id="first">
      <img src="/images/head3.gif" alt="">
      <img class="spinner" src="/images/turbine.png" alt="">
      <!-- <img class="logo" src="/images/logo.jpg" alt=""> -->
      <div class="headText">

        <h1>
          Te mennyire vagy <span class="brown">környezettudatos</span>? {{user.name}}
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
    v-if="!user.auth"
    :resettoken="resettoken" />
    <div id="third">
      <survey-comp
      v-if="user.auth" />
    </div>
  </div>
</template>

<script>
import AuthComponent from '@/components/Authentication.vue'
import SurveyComp from '@/components/SurveyComp.vue'

export default {
  name: 'mainWrapper',
  components: {
    AuthComponent,
    SurveyComp
  },
  created () {
    if (this.$route.name === 'reset' && this.$route.params.resettoken) {
      this.resettoken = this.$route.params.resettoken
    }
  },
  data () {
    return {
      resettoken: null
    }
  },
  methods: {
  },
  computed: {
    user: function () {
      return this.$store.getters.getUser
    }
  }
}
</script>
