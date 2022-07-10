<template>
  <el-scrollbar style="height: 100%">
    <div>
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :page-sizes="[12, 16, 20, 30]"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <div>
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
              <el-link @click="openDialogForm(id)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-edit"></use>
                </svg>
              </el-link>
              <el-link @click="openFolder(item)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-folder-close"></use>
                </svg>
              </el-link>
              <el-link @click="deleteFile(item)">
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
import Item from '@/layout/components/Sidebar/Item'
import global from '../Global.vue'
const { shell } = require('electron')
const fs = require('fs-extra')

export default {
  data() {
    return {
      dialogFormVisible: false,
      fit: 'cover',
      rootPath: global.test1File,
      fileList: [],
      pathList: [],
      checkedList: [],
      reNameForm: {
        fileId: 0,
        filePath: '',
        oldName: '',
        newName: ''
      },
      formLabelWidth: '80px',
      total: 0,
      currentPage: 1,
      pageSize: 12,
      listLoading: false
    }
  },
  created() {
    this.getFileListPagination(this.currentPage, this.pageSize)
  },
  methods: {
    getFileList() {
      //注意这里使用Sync同步方法才能获取到返回的文件值
      //使用异步方法（readdir）由于不能确定结果返回时间，所以无法在外部得到文件列表，只能进行内部处理
      this.fileList = fs.readdirSync(this.rootPath)
    },
    openFile(path) {
      shell.openPath(path)
    },
    getFileListPagination(page, pageSize) {
      console.log('test: ' + page + ' : ' + pageSize)
      //this.listLoading = true
      var list = fs.readdirSync(this.rootPath)
      console.log(list)
      this.total = list.length
      var head = (page - 1) * pageSize
      var tail = page * pageSize
      //   if(tail>=this.total){
      //       tail=this.total
      //   }
      this.fileList = list.slice(head, tail)
      this.getPathList()
      console.log(this.fileList.length + ':' + this.pathList.length)
    },
    handleCurrentChange(current) {
      this.fileList = []
      this.currentPage = current
      this.getFileListPagination(this.currentPage, this.pageSize)
    },
    handleSizeChange(size) {
      this.fileList = []
      this.pageSize = size
      this.getFileListPagination(this.currentPage, this.pageSize)
    },
    getPathList() {
      this.pathList = []
      for (var i = 0; i < this.fileList.length; i++) {
        this.pathList[i] = this.rootPath + '\\' + this.fileList[i]
      }
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  //background-color: red($color: #cfcbcb);
}
</style>