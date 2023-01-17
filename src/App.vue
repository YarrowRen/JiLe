<template>
  <router-view v-if="isRresh"></router-view>
</template>

<script>
export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  data: ()=>({
    isRresh: true
  }),
  methods: {
    //使用provide和inject 普通刷新 不会使页面出现短暂的空白，体验效果比较好
    //vue5种方式实现页面"刷新": https://www.jianshu.com/p/b9b7eae48f45
    refresh() {
      this.isRresh = false;
      this.$nextTick(() => {
        this.isRresh = true;
      })
    }
  }

}
</script>

<style>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>