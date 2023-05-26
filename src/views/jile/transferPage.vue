<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {
    var ec_id = this.$route.query.ec_id //获取编号
    this.$router.push('/jile/ebook-page?ec_id=' + ec_id)
  }
}
</script>

<style>
</style>