<template>
  <div>
    <el-card>
      <div style="height: 500px">
        <waterfall v-if="targetPage == 0" :content-arr="contentArr" />
        <cardfall v-if="targetPage == 1" :content-arr="contentArr" />
      </div>
    </el-card>
    <br />
    <div>
      <el-button type="primary" @click="showWaterfall">瀑布流图片展示</el-button>
      <el-button type="primary" @click="showCardfall">卡片式图片展示</el-button>
    </div>
  </div>
</template>

<script>
import waterfall from './components/waterfall.vue'
import cardfall from './components/cardfall.vue'
import global from '../Global.vue'
const fs = require('fs-extra')

export default {
  components: {
    waterfall,
    cardfall
  },
  data() {
    return {
      rootPath: global.test1File,  //从全局变量获取测试数据
      targetPage: 0,  //页面标志值，用来确定展示页面
      contentArr: [],  //图片信息表
      pathList: []  //路径列表
    }
  },
  created() {
    this.getFileList()
  },
  methods: {
    //通过文件列表获取所有文件路径
    getPathList() {
      this.contentArr = []
      for (var i = 0; i < this.fileList.length; i++) {
        var fileItem = { value: i, src: this.rootPath + '\\' + this.fileList[i], height: 0, width: 0, top: 0, title: i ,trueHeight: 0}
        this.contentArr.push(fileItem)
      }
    },
    //获取文件列表（读取指定文件夹下的文件）
    getFileList() {
      this.fileList = fs.readdirSync(this.rootPath)
      //对文件列表排序保证唯一性
      this.fileList.sort()
      this.getPathList()
    },
    showWaterfall() {
      this.targetPage = 0
    },
    showCardfall() {
      this.targetPage = 1
    }
  }
}
</script>

<style>
</style>