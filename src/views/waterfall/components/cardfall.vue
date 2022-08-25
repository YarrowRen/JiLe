<template>
  <div>
    <p>{{contentArr}}</p>
  </div>
</template>

<script>
export default {

  props: {
    contentArr: {
      type: Object,
      required: true
    }
  },
}
</script>

<style>

</style>