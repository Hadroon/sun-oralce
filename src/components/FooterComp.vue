<template>
 <div>
    <h1><span>WANGARU</span> <span class="inter">interactive</span>  <span class="sup"> ®</span></h1>
    <p>Cím:</p>
    <p>név: {{user.name}}</p>
    <p>Adatvédelmi:</p>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    user: function () {
      return this.$store.getters.getUser
    }
  }
}
</script>
