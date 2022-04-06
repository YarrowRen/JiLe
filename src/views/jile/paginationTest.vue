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
          </el-card>
        </el-col>
      </el-row>
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
      rootPath: 'D:\\data\\OneDrive\\miho_kaneko\\r4_kaneko_m04',
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
      console.log(this.fileList.length+":"+this.pathList.length)
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
        this.pathList=[]
      for (var i = 0; i < this.fileList.length; i++) {
        this.pathList[i] = this.rootPath + '\\' + this.fileList[i]
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