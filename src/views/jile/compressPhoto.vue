<template>
  <el-scrollbar>
    <el-container>
      <el-header>
        <el-button type="primary" @click="compressImage(filePath)">压缩图片</el-button>
      </el-header>
      <el-main>
        <el-col :span="8">
          <el-image :src="filePath"></el-image>
        </el-col>
        <el-col :span="8">
          <el-image ref="testImage" :src="testPath"></el-image>
        </el-col>
      </el-main>
    </el-container>
  </el-scrollbar>
</template>

<script>
import global from '../Global.vue'
export default {
  data() {
    return {
      filePath: global.test2File,
      compressBase64: '',
      testPath: ''
    }
  },
  created() {},
  methods: {
    compressImage(filePath) {
      //console.log(filePath)
      lrz(filePath, { quality: 0.5 })
        .then((rst) => {
          console.log(this.filePath)
          this.testPath = rst.base64
        })
        .catch(function (error) {
          console.log(error)
          //失败时执行
        })
        .always(function () {
          //不管成功或失败，都会执行
        })
    }
  }
}
</script>

<style>
</style>