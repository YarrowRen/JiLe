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
      rootPath: global.test1File,
      targetPage: 0,
      targetVal: 0,
      loaded: true,
      total: 0,
      currentPage: 1,
      pageSize: 25,
      contentArr: [],
      pathList: []
    }
  },
  created() {
    this.getFileList()
    // this.getImgHeight()
  },
  methods: {
    initImg() {},
    getPathList() {
      this.contentArr = []
      for (var i = 0; i < this.fileList.length; i++) {
        var fileItem = { value: i, src: this.rootPath + '\\' + this.fileList[i], height: 0, width: 0, top: 0, title: i ,trueHeight: 0}
        this.contentArr.push(fileItem)
      }
    },
    getFileList() {
      this.fileList = fs.readdirSync(this.rootPath)
      //对文件列表排序保证唯一性
      this.fileList.sort()
      this.getPathList()
    },
    getFileListPagination(page, pageSize) {
      var list = fs.readdirSync(this.rootPath)
      console.log(list)
      this.total = list.length
      var head = (page - 1) * pageSize
      var tail = page * pageSize
      this.fileList = list.slice(head, tail)
      this.getPathList()
      console.log(this.fileList.length + ':' + this.pathList.length)
    },
    async getImgHeight() {
      let sel = this
      for (let i = 0; i < this.contentArr.length; i++) {
        console.log(i)
        let img = new Image()
        img.src = this.contentArr[i].src + '?' + Date.parse(new Date())
        var promise = new Promise((reslove) => {
          img.onload = function () {
            let scale = 220 / img.width
            var height = Math.floor(scale * img.height)
            console.log('src: ' + img.src + ', height: ' + img.height + ', width: ' + img.width + ', i: ' + i)

            reslove(height)
          }
        })
        await promise
        promise
          .then(function (data) {
            sel.contentArr[i].height = data
          })
          .finally(function () {
            sel.targetVal++
            console.log(sel.targetVal)
          })
      }
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