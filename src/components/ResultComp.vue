<template>
  <div class="content">
    {{ getResults }}
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
