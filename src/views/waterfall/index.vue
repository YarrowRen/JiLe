<template>
  <el-scrollbar style="padding: 10px">
    <div style="text-align: center">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <div class="waterfall-page">
      <waterfall v-if="getResult" :content-arr="contentArr" :current-page="currentPage" />
    </div>

    <div id="updateDialog">
      <el-dialog
        v-model="updateDialogVisible"
        title="图片上传"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>读取图片数据并添加至图库中...</span>
        <el-progress :percentage="updatePercentage" />
        <template #footer v-if="updatePercentage == 100">
          <span class="dialog-footer">
            <el-button @click="refreshIc" type="success">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script>
import waterfall from './components/waterfall.vue'
import global from '../Global.vue'

import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { mapState, mapActions } from 'vuex'
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote

export default {
  components: {
    waterfall
  },

  inject: ['refresh'],
  data() {
    return {
      updateDialogVisible: false,
      updatePercentage: 0,
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
    var icID = this.$route.query.ic_id //获取合集编号
    this.ic_id = icID

    // this.ic_id = 1
    this.getFileList(this.ic_id, this.currentPage, this.pageSize)
  },

  mounted() {
    this.dropFileList()
  },
  methods: {
    ...mapActions('img-col', ['getImgCol', 'refreshIcData']),
    //上传图片
    addImage() {
      dialog
        .showOpenDialog({
          title: '请选择图片',
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: 'Image', extensions: ['JPG', 'PNG', 'GIF', 'BMP'] }]
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          //不为空情况下进行复制上传
          //获得拖拽的文件集合
          var files = result.filePaths
          if (files.length > 0) {
            console.log('可以加入')
            this.updateDialogVisible = true
            var destParentPath = this.imgCol.ic_path
            //由于fs.copyFile是异步方法，所以无法通过循环计数i来判断进度
            //所以这里添加变量j作为复制计数
            var j = 0
            for (var i = 0; i < files.length; i++) {
              var filePath = files[i]
              console.log(filePath.substr(filePath.lastIndexOf('\\') + 1))
              var src = filePath
              var dest = destParentPath + '\\' + filePath.substr(filePath.lastIndexOf('\\') + 1)
              fs.copyFile(src, dest, (err) => {
                if (err) throw err
                j += 1
                this.updatePercentage = parseInt((j / files.length) * 100)
              })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**上传图片到对应图集 */
    dropFileList() {
      let sel = this
      var div = document.querySelector('.waterfall-page')
      //绑定拖拽事件
      div.addEventListener('drop', function (e) {
        //必须要阻止拖拽的默认事件
        e.preventDefault()
        e.stopPropagation()

        //获得拖拽的文件集合
        var files = e.dataTransfer.files
        if (files.length > 0) {
          //可接收的文件类型
          var fileTypes = ['JPG', 'PNG', 'GIF', 'BMP']
          var result = true
          for (var i = 0; i < files.length; i++) {
            var file = files[i]
            //获取文件后缀并转换为大写
            var suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLocaleUpperCase()
            //判断文件类型是否可以加入
            if (fileTypes.indexOf(suffix) == -1) {
              result = false
            }
          }
          if (result) {
            sel.updateDialogVisible = true
            var destParentPath = sel.imgCol.ic_path
            //由于fs.copyFile是异步方法，所以无法通过循环计数i来判断进度
            //所以这里添加变量j作为复制计数
            var j = 0
            for (var i = 0; i < files.length; i++) {
              var file = files[i]

              var src = file.path
              var dest = destParentPath + '\\' + file.name

              fs.copyFile(src, dest, (err) => {
                if (err) throw err
                j += 1
                sel.updatePercentage = parseInt((j / files.length) * 100)
              })
            }
          } else {
            ElMessageBox.alert('图片合计仅支持添加图片类型文件（JPG，PNG，GIF，BMP）', '提示', {
              // if you want to disable its autofocus
              autofocus: false,
              confirmButtonText: '确定'
            })
          }
        }
      })

      //绑定拖拽结束事件
      div.addEventListener('dragover', (e) => {
        //必须要阻止拖拽的默认事件
        e.preventDefault()
        e.stopPropagation()
      })
    },
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
    refreshIc() {
      var icID = this.ic_id
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