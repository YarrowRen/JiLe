<template>
  <el-scrollbar>
    <el-card>
      <el-button type="primary" @click="showWaterfall">瀑布流图片展示</el-button>
      <el-button type="primary" @click="showCardfall">卡片式图片展示</el-button>
    </el-card>
    <div>
      <waterfall v-if="targetPage == 0 && getResult" :content-arr="contentArr" />
      <cardfall v-if="targetPage == 1 && getResult" :content-arr="contentArr" />
      <el-divider></el-divider>
    </div>
  </el-scrollbar>
</template>

<script>
import waterfall from './components/waterfall.vue'
import cardfall from './components/cardfall.vue'
import global from '../Global.vue'

import { mapState, mapActions } from 'vuex'
const fs = require('fs-extra')

export default {
  components: {
    waterfall,
    cardfall
  },
  data() {
    return {
      ic_id: 0,
      rootPath: global.test1File, //从全局变量获取测试数据
      targetPage: 0, //页面标志值，用来确定展示页面
      contentArr: [], //图片信息表
      getResult:false,
      imgCol: {
        ic_id: 0,
        ic_name: '',
        ic_path: '',
        ic_desc: '',
        list: [
          {
            imageID: 0,
            imageName: '',
            imagePath: '',
            thumbnail: '',
            imageScore: 0,
            remark: '',
            followed: 0,
            createDate: '',
            url: '',
            tags: null
          }
        ]
      },
      pathList: [] //路径列表
    }
  },
  created() {
    this.ic_id = 1
    this.getFileList(this.ic_id)
  },
  methods: {
    ...mapActions('img-col', ['getImgCol']),
    // //通过文件列表获取所有文件路径
    // getPathList() {
    //   this.contentArr = []
    //   for (var i = 0; i < this.fileList.length; i++) {
    //     var fileItem = {
    //       value: i,
    //       src: this.rootPath + '\\' + this.fileList[i],
    //       height: 0,
    //       width: 0,
    //       top: 0,
    //       title: i,
    //       trueHeight: 0
    //     }
    //     this.contentArr.push(fileItem)
    //   }
    // },


    
    //获取文件列表（读取指定文件夹下的文件）
    getFileList(ic_id) {
      
      this.contentArr = []
      var data = {
        ic_id: ic_id,
        page: 1,
        pageSize: 60
      }
      this.getImgCol(data).then((response) => {
        this.imgCol = response.data
        var imageList = response.data.ic_info.list
        for (var i = 0; i < imageList.length; i++) {
          var file = imageList[i]
          var fileItem = {
            imagePath: this.imgCol.ic_path + '\\' + file.imageName,
            imageName: file.imageName,
            imageID: file.imageID,
            thumbnail: file.thumbnail,
            imageScore: file.imageScore,
            remark: file.remark,
            followed: file.followed,
            createDate: file.createDate,
            url: file.url,
            tags: file.tags,
            height: 0,
            width: 0,
            top: 0,
            trueHeight: 0
          }

          this.contentArr.push(fileItem)
        }
        this.getResult=true
      })


    },
    showWaterfall() {
      this.targetPage = 0
    },
    showCardfall() {
      this.targetPage = 1
    },
  }
}
</script>

<style>
</style>