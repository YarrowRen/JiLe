<template>
  <el-scrollbar style="height: 100%">
    <div>
      <div>
      <el-button @click="showCheckedList">查看checkedList</el-button>
      <el-button @click="getCover">获取封面</el-button>
      <el-button @click="refreshVc">刷新数据库</el-button>
      </div>
      <el-row :gutter="5">
        <el-col v-for="(item, id) in videoInfo" :key="id" :span="4">
          <el-card :body-style="{ padding: '0px' }" shadow="always" style="margin-top: 10px">
            <div
              style="
                text-align: center;
                font-size: 13px;
                margin-top: 8px;
                margin-bottom: 1px;
                margin-left: 8px;
                margin-right: 8px;
              "
            >
              <el-tooltip class="item" effect="dark" :content="videoInfo[id].video_name" placement="top">
                <div id="title">
                  <div>{{ videoInfo[id].video_name }}</div>
                </div>
              </el-tooltip>
              <el-rate disabled v-model="videoInfo[id].video_score"></el-rate>
            </div>

            <!-- 两个块级元素的style目的在于确定方形图片格式 #F5F5F5-->
            <div
              class="pointer"
              style="position: relative; width: 100%; height: 0; padding-top: 100%"
              @contextmenu="rtClickOpenMenu(id)"
              @click="openFile(item.video_path)"
            >
              <el-image
                style="cursor: pointer; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                :src="videoInfo[id].video_cover"
                class="image"
                :fit="fit"
              ></el-image>
            </div>

            <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
              <el-link @click="openDialogForm(id)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-edit"></use>
                </svg>
              </el-link>
              <el-link @click="openFolder(item.video_path)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-folder-close"></use>
                </svg>
              </el-link>
              <el-link @click="deleteFile(item.video_path)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-ashbin"></use>
                </svg>
              </el-link>
              <el-link>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-attachment"></use>
                </svg>
              </el-link>

              <div style="float: right">
                <el-checkbox v-model="checkedList[id]"></el-checkbox>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="修改资源名称">
        <el-form :model="reNameForm">
          <el-form-item label="原名称" :label-width="formLabelWidth">
            <div>{{ reNameForm.oldName }}</div>
          </el-form-item>
          <el-form-item label="新名称" :label-width="formLabelWidth">
            <el-input v-model="reNameForm.newName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFileName">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script>
import global from '../Global.vue'
import Item from '@/layout/components/Sidebar/Item'
const { shell, clipboard, Tray, nativeImage, NativeImage } = require('electron')
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      dialogFormVisible: false,
      fit: 'cover',
      defaultCover: 'src/icons/my-icon/video-o.svg',
      videoCol: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        id: ''
      },
      videoInfo:[{
        video_id: 0,
        video_name: '',
        video_path: '',
        video_cover: '',
        video_tag: [],
        video_score: 0
      }],
      checkedList: [],
      reNameForm: {
        fileId: 0,
        filePath: '',
        oldName: '',
        newName: ''
      },
      coverSavePath: 'I:\\JiLeFile\\video\\cover',
      formLabelWidth: '80px',
      contextMenuTemplate: [],
      filtersList: {
        imageFilters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
      }
    }
  },
  created() {
    this.getFileList()
  },
  methods: {
    ...mapActions('video-col', ['addVc', 'getVc', 'getVideoCover', 'getFirstVC','refreshVcData']),
    getFileList() {
      this.getFirstVC().then((response) => {
        // console.log(response.data)
        this.videoCol = response.data
        // console.log(this.videoCol)

        //注意这里使用Sync同步方法才能获取到返回的文件值
        //使用异步方法（readdir）由于不能确定结果返回时间，所以无法在外部得到文件列表，只能进行内部处理
        // this.fileList = fs.readdirSync(this.videoCol.vc_path)

        // for (var i = 0; i < this.fileList.length; i++) {
        //   // console.log(this.videoInfo[i])
        //   this.videoInfo[i]={
        //     video_name: this.fileList[i],
        //     video_path: this.videoCol.vc_path + '\\' + this.fileList[i],
        //     video_cover: this.defaultCover
        //   }
        // }

        var fileList=response.data.video_list
        //获取详细影视文件信息列表
        for(var i=0;i<fileList.length;i++){
          // console.log(fileList)
          var videoCover=""
          if(fileList[i].videoCover==null || fileList[i].videoCover==""){
            videoCover=this.defaultCover
          }else{
            videoCover=fileList[i].videoCover
          }
          this.videoInfo[i]={
            video_id: fileList[i].videoID,
            video_name: fileList[i].videoName,
            video_path:fileList[i].videoPath,
            video_cover: videoCover,
            video_score: fileList[i].videoScore,
            video_tag: fileList[i].videoTag 
          }
        }
        
      })
    },
    getCover(){
          // console.log(this.videoCol)
          // console.log(this.coverSavePath)
        this.getVideoCover(this.videoCol).then((response)=>{
          let resList=response.data
          for(var i=0;i<this.videoInfo.length;i++){
            for(var j=0;j<resList.length;j++){
              if(resList[j].videoName==this.videoInfo[i].video_name){
                this.videoInfo[i].video_cover=resList[j].coverPath
              }
            }
          }
        })
    },
    selectCover(item) {
      var id = item.id
      console.log(id)
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择视频封面',
          properties: ['openFile'],
          filters: this.filtersList.imageFilters
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件，直接return结束函数
          console.log(result.filePaths[0])
          this.videoInfo[id].video_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteCover(item) {
      var id = item.id
      console.log(id)
      this.videoInfo[id].video_cover = this.defaultCover
    },
    initMenuTemplate(id) {
      this.contextMenuTemplate = [
        { label: '选择封面图', click: this.selectCover, id: id },
        { label: '删除封面图', click: this.deleteCover, id: id },
        { type: 'separator' }
      ]
    },
    chooseFiles() {
      const { dialog } = require('@electron/remote')
      // Electron 10之后下面这种引入方法已经不可用了，使用上面的方法，这个是需要注意的
      // const { BrowserWindow } = require('electron').remote;

      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择文件夹',
          properties: ['openDirectory']
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          console.log(result.filePaths[0])
          this.dicPath = result.filePaths[0]

          //选择文件夹后读取文件夹下所有文件（只读取到第一级）
          this.getFileList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openFile(path) {
      shell.openPath(path)
    },
    openFolder(path) {
      shell.showItemInFolder(path)
    },
    showCheckedList() {
      console.log(this.checkedList)
    },
    deleteFile(path) {
      //shell.trashItem(path)
      this.$confirm('此操作将永久删除该文件（包括本地文件）, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          shell.trashItem(path)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          location.reload()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openDialogForm(fileId) {
      this.reNameForm.fileId = fileId
      this.reNameForm.oldName = this.videoInfo[fileId].video_name
      this.reNameForm.filePath = this.videoCol.vc_path
      this.dialogFormVisible = true
    },
    editFileName() {
      this.dialogFormVisible = false //关闭dialog页面
      //移动文件、目录, 会删除以前的, 等于改名
      var form = this.reNameForm
      var result = false
      try {
        fs.moveSync(form.filePath + '\\' + form.oldName, form.filePath + '\\' + form.newName)
        result = true
        console.log('success!')
      } catch (err) {
        console.log(err)
      }
      //接下来应该还要处理前端逻辑，修改所存储的文件名称与路径
      console.log(result)
      if (result) {
        this.videoInfo[form.fileId].video_name = form.newName
      }
    },
    pasteCover() {},
    rtClickOpenMenu(id) {
      this.initMenuTemplate(id)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
    },
    refreshVc(){
      var vcID=this.videoCol.id
      // console.log(vcID)
      this.refreshVcData({vcID})

    }
  }
}
</script>
<style lang="scss">
/* element滚动条组件 隐藏水平滚动条 */
.sidebar-wrapper .el-scrollbar__wrap {
  overflow-x: hidden;
}
.is-horizontal {
  display: none;
}

#title {
  width: 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  //background-color: red($color: #cfcbcb);
}
</style>