<template>
  <div class="content">
    <h1>Köszönjük, hogy támogatod a környezetet!</h1>
    <div class="brown resultPar" v-for="result in getResults" :key="result" v-html="result"></div>
    <!-- <div v-html="mycomputedprop"></div> -->
  </div>
</template>

<script>
export default {
  name: 'ResultComp',
  computed: {
    getResults: function () {
      return this.$store.getters.getResult
    }
  }
}
</script>
