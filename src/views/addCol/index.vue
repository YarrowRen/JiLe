<template>
  <div>
    <el-card>
      <div style="height: 500px">
        <add-ic v-if="targetPage == 0" />
        <add-vc v-if="targetPage == 1" />
        <add-ec v-if="targetPage == 2" />
      </div>
    </el-card>
    <br />
    <div>
      <el-button type="primary" @click="showAddIc">创建图集</el-button>
      <el-button type="primary" @click="showAddVc">创建影视集</el-button>
      <el-button type="primary" @click="showAddEc">创建电子书集</el-button>
    </div>
  </div>
</template>

<script>
import addIc from './components/addIc.vue'
import addVc from './components/addVc.vue'
import addEc from './components/addEc.vue'
export default {
  components: {
    addIc,
    addVc,
    addEc
  },
  data() {
    return {
      targetPage: 0 //页面标志值，用来确定展示页面
    }
  },
  created() {},
  methods: {
    showAddIc() {
      this.targetPage = 0
    },
    showAddVc() {
      this.targetPage = 1
    },
    showAddEc() {
      this.targetPage = 2
    }
  }
}
</script>

<style>
</style>