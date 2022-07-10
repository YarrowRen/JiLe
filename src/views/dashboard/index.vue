<template>
  <div class="dashboard-container">
    <el-button type="primary" @click="testFrontLink">测试后端连接</el-button>
    <div class="dashboard-text">name: {{ username }}</div>
    <div>update element-plus to 1.2.+, add svg icon, icon-font is abandoned</div>
    <i class="el-icon-add-location">abandoned</i>
    <div>
      <el-icon>
        <Svg.Edit></Svg.Edit>
      </el-icon>
    </div>
    <div class="mt-2">ywrby</div>
    <div>{{ showObj }},{{ showObjString }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";


export default {
  name: 'dashoboard',
  data() {
    return {
      frontendState: "",
    }
  },
  methods: {
    ...mapActions("user", ["testFrontend"]),

    testFrontLink(){
      this.testFrontend().then((response) => {
        this.frontendState = response;
        console.log(this.frontendState)
      });
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    //margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
