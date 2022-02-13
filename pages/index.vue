<template>
  <div class="index-page">

  </div>
</template>

<script>

export default {
  name: 'IndexPage',
  components: {
  },
  computed: {
  },
  mounted() {
    this.$router.push({
      path: `/add`
    })
  }
}
</script>

<style lang="scss">

</style>