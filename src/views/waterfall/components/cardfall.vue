<template>
  <div>
    <p>{{ contentArr }}</p>

  </div>
</template>

<script>
// import { Waterfall, WaterfallSlot } from 'vue-waterfall'
export default {
  props: {
    contentArr: {
      type: Object,
      required: true
    }
  },

  data() {},
  created() {
  },
  methods: {
    
  }
}
</script>

<style>

</style>