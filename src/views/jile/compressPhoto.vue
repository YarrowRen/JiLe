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
export default {
  data() {
    return {
        filePath:'D:\\data\\OneDrive\\miho_kaneko\\st1_junshin_kaneko_m01\\st1_junshin_kaneko_m01_020.jpg',
        compressBase64:'',
        testPath:''
    }
  },
  created(){
  },
  methods: {
    compressImage(filePath) {
        //console.log(filePath)
        lrz(filePath, {quality:0.5})
        .then(rst=> {
            console.log(this.filePath)
            this.testPath=rst.base64
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