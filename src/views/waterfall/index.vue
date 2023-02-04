<template>
  <el-scrollbar>
    <div>
      
      <el-button type="primary" @click="refreshIc">刷新数据库</el-button>
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <div>
      <waterfall v-if="getResult" :content-arr="contentArr" :current-page="currentPage" />
      <el-divider></el-divider>
    </div>
  </el-scrollbar>
</template>

<script>
import waterfall from './components/waterfall.vue'
import global from '../Global.vue'

import { mapState, mapActions } from 'vuex'
const fs = require('fs-extra')

export default {
  components: {
    waterfall
  },

  inject: ['refresh'],
  data() {
    return {
      ic_id: 0,
      testNum: 0,
      rootPath: global.test1File, //从全局变量获取测试数据
      contentArr: [], //图片信息表
      getResult: false,
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
      pathList: [], //路径列表

      currentPage: 1,
      pageSize: 60,
      totalSize: 0
    }
  },
  created() {
    //后边上线再调用
    // var icID = this.$route.query.ic_id; //获取合集编号
    // this.ic_id = icID
    
    this.ic_id = 1
    this.getFileList(this.ic_id, this.currentPage, this.pageSize)
  },
  methods: {
    ...mapActions('img-col', ['getImgCol','refreshIcData']),
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
    getFileList(ic_id, page, pageSize) {
      this.contentArr = []
      var data = {
        ic_id: ic_id,
        page: page,
        pageSize: pageSize
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

        //配置分页信息
        this.pageSize = response.data.ic_info.pageSize
        this.currentPage = response.data.ic_info.pageNum
        this.totalSize = response.data.ic_info.total

        this.getResult = true
      })
    },
    handleCurrentChange(val) {
      this.getFileList(this.ic_id, val, this.pageSize)
    },
    refreshIc(){
      var icID=this.ic_id
      this.refreshIcData({ icID }).then((response) => {
        //重新加载页面--使用provide和inject 普通刷新 不会使页面出现短暂的空白，体验效果比较好
        // (vue5种方式实现页面"刷新") https://www.jianshu.com/p/b9b7eae48f45
        this.refresh()
      })
    }
  }
}
</script>

<style>
</style>