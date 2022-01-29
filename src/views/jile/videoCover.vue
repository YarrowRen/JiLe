<template>
  <el-scrollbar style="height: 100%">
    <div>
      <el-button @click="showCheckedList">查看checkedList</el-button>
      <el-row :gutter="5">
        <el-col v-for="(item, id) in this.pathList" :key="id" :span="4">
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
              <el-tooltip class="item" effect="dark" :content="this.fileList[id]" placement="top">
                <div id="title">
                  <div>{{ this.fileList[id] }}</div>
                </div>
              </el-tooltip>
              <el-rate v-model="value1"></el-rate>
            </div>

            <!-- 两个块级元素的style目的在于确定方形图片格式 #F5F5F5-->
            <div
              class="pointer"
              @contextmenu="rtClickOpenMenu"
              style="position: relative; width: 100%; height: 0; padding-top: 100%"
              @click="openFile(item)"
            >
              <el-image
                style="cursor: pointer; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                :src="this.coverList[id]"
                class="image"
                :fit="this.fit"
              ></el-image>
            </div>

            <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
              <el-link @click="openDialogForm(id)"><i class="yw-icon-edit"></i></el-link>
              <el-link @click="openFolder(item)"><i class="yw-icon-folder-close"></i></el-link>
              <el-link @click="deleteFile(item)"><i class="yw-icon-ashbin"></i></el-link>
              <el-link><i class="yw-icon-attachment"></i></el-link>
              <el-link @click="selectCover(id)"><i class="yw-icon-file-add"></i></el-link>

              <div style="float: right">
                <el-checkbox v-model="this.checkedList[id]"></el-checkbox>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div id="dialog">
      <el-dialog title="修改资源名称" v-model="dialogFormVisible">
        <el-form :model="reNameForm">
          <el-form-item label="原名称" :label-width="formLabelWidth">
            <div>{{ reNameForm.oldName }}</div>
          </el-form-item>
          <el-form-item label="新名称" :label-width="formLabelWidth">
            <el-input v-model="reNameForm.newName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
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
import Item from '@/layout/components/Sidebar/Item'
const { shell, clipboard, Tray, nativeImage, NativeImage } = require('electron')
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote

export default {
  data() {
    return {
      dialogFormVisible: false,
      fit: 'cover',
      rootPath: 'F:\\photo\\JAVHD\\Chie Aoi',
      fileList: [
        '1-cwpbd-153-chie-aoi-catwalk-poison-153_sh.mp4',
        '1-laf-77-chie-aoi-laforet-girl-77_sh.mp4',
        '1-mkbd-s130-chie-aoi-kirari-130_sh.mp4',
        '2-cwpbd-153-chie-aoi-catwalk-poison-153_sh.mp4',
        '2-laf-77-chie-aoi-laforet-girl-77_sh.mp4',
        '2-mkbd-s130-chie-aoi-kirari-130_sh.mp4',
        '3-cwpbd-153-chie-aoi-catwalk-poison-153_sh.mp4',
        '3-mkbd-s130-chie-aoi-kirari-130_sh.mp4',
        '4-mkbd-s130-chie-aoi-kirari-130_sh.mp4'
      ],
      coverList: [],
      pathList: [],
      checkedList: [],
      reNameForm: {
        fileId: 0,
        filePath: '',
        oldName: '',
        newName: ''
      },
      formLabelWidth: '80px',
      contextMenuTemplate: [
        { label: '复制', role: 'copy' },
        { label: '黏贴', role: 'paste' },
        { label: '选择封面图', click: this.selectCover },
        { type: 'separator' }
      ],
      filtersList: {
        imageFilters: [
          { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
        ]
      }
    }
  },
  created() {
    console.log(this.fileList)
    for (var i = 0; i < this.fileList.length; i++) {
      this.pathList[i] = this.rootPath + '\\' + this.fileList[i]
    }
    console.log(this.pathList)

    //创建菜单项
    this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
  },
  methods: {
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
    getFileList() {
      //注意这里使用Sync同步方法才能获取到返回的文件值
      //使用异步方法（readdir）由于不能确定结果返回时间，所以无法在外部得到文件列表，只能进行内部处理
      this.fileList = fs.readdirSync(this.dicPath)
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
      this.reNameForm.oldName = this.fileList[fileId]
      this.reNameForm.filePath = this.rootPath
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
        this.fileList[form.fileId] = form.newName
        //console.log(this.fileList[form.fileId])
      }
    },
    pasteCover() {},
    rtClickOpenMenu() {
      this.menu.popup({ window: remote.getCurrentWindow() })
    },
    selectCover(id) {
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
          this.coverList[id]=result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
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