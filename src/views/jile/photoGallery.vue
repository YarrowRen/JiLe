<template>
  <el-scrollbar style="height: 100%">
    <div>
      <el-button @click="showCheckedList">查看checkedList</el-button>
      <el-row :gutter="5">
        <el-col v-for="(item, id) in pathList" :key="id" :span="4">
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
              <el-tooltip class="item" effect="dark" :content="fileList[id]" placement="top">
                <div id="title">
                  <div>{{ fileList[id] }}</div>
                </div>
              </el-tooltip>
              <el-rate v-model="value1"></el-rate>
            </div>

            <!-- 两个块级元素的style目的在于确定方形图片格式 #F5F5F5-->
            <div style="position: relative; width: 100%; height: 0; padding-top: 100%" @click="openFile(item)">
              <el-image
                style="cursor: pointer; position: absolute; top: 0; left: 0; width: 100%; height: 100%"
                :src="item"
                class="image"
                :fit="fit"
              ></el-image>
            </div>

            <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
              <el-link @click="openDialogForm(id)"><i class="yw-icon-edit"></i></el-link>
              <el-link @click="openFolder(item)"><i class="yw-icon-folder-close"></i></el-link>
              <el-link @click="deleteFile(item)"><i class="yw-icon-ashbin"></i></el-link>
              <el-link><i class="yw-icon-attachment"></i></el-link>

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
import Item from '@/layout/components/Sidebar/Item'
const { shell } = require('electron')
const fs = require('fs-extra')

export default {
  data() {
    return {
      dialogFormVisible: false,
      fit: 'cover',
      rootPath: 'D:\\data\\OneDrive\\大塚みなみ\\r2_ootsuka_m02',
      fileList: [
        'r2_ootsuka_m02_001.jpg',
        'r2_ootsuka_m02_002.jpg',
        'r2_ootsuka_m02_003.jpg',
        'r2_ootsuka_m02_004.jpg',
        'r2_ootsuka_m02_005.jpg',
        'r2_ootsuka_m02_006.jpg',
        'r2_ootsuka_m02_007.jpg',
        'r2_ootsuka_m02_008.jpg',
        'r2_ootsuka_m02_009.jpg',
        'r2_ootsuka_m02_010.jpg',
        'r2_ootsuka_m02_011.jpg',
        'r2_ootsuka_m02_012.jpg',
        'r2_ootsuka_m02_013.jpg',
        'r2_ootsuka_m02_014.jpg',
        'r2_ootsuka_m02_015.jpg',
        'r2_ootsuka_m02_016.jpg',
        'r2_ootsuka_m02_017.jpg',
        'r2_ootsuka_m02_018.jpg',
        'r2_ootsuka_m02_019.jpg',
        'r2_ootsuka_m02_020.jpg',
        'r2_ootsuka_m02_021.jpg',
        'r2_ootsuka_m02_022.jpg',
        'r2_ootsuka_m02_023.jpg',
        'r2_ootsuka_m02_024.jpg',
        'r2_ootsuka_m02_025.jpg',
        'r2_ootsuka_m02_026.jpg',
        'r2_ootsuka_m02_027.jpg',
        'r2_ootsuka_m02_028.jpg',
        'r2_ootsuka_m02_029.jpg',
        'r2_ootsuka_m02_030.jpg',
        'r2_ootsuka_m02_031.jpg',
        'r2_ootsuka_m02_032.jpg',
        'r2_ootsuka_m02_033.jpg',
        'r2_ootsuka_m02_034.jpg'
      ],
      pathList: [],
      checkedList: [],
      reNameForm: {
        fileId: 0,
        filePath: '',
        oldName: '',
        newName: ''
      },
      formLabelWidth: '80px'
    }
  },
  created() {
    console.log(this.fileList)
    for (var i = 0; i < this.fileList.length; i++) {
      this.pathList[i] = this.rootPath + '\\' + this.fileList[i]
    }
    console.log(this.pathList)
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  //background-color: red($color: #cfcbcb);
}
</style>