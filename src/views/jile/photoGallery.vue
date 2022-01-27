<template>

<el-scrollbar style="height: 100%">
    

  <div style="text-align:center">
    <el-row :gutter="20">
      <el-col v-for="(item, id) in this.pathList" :key="id" :span="4">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <!-- 两个块级元素的style目的在于确定方形图片格式 -->
          <div style="position: relative; width: 100%; height: 0; padding-top: 100%">
            <el-image
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
              :src="item"
              class="image"
              :fit="this.fit"
            ></el-image>
          </div>
        </el-card>
        
        <div style="font-size: 13px;
    margin-top: 8px;
    margin-bottom: 8px">
            <div id="title" >
                <el-tooltip class="item" effect="dark" :content="this.fileList[id]" placement="top">
                <div >{{this.fileList[id]}}</div>
                </el-tooltip>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</el-scrollbar>
</template>

<script>
const fs = require('fs-extra')

export default {
  data() {
    return {
      fit: 'cover',
      rootPath: 'F:\\photo\\onedrive\\大塚みなみ\\r2_ootsuka_m02',
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
      pathList:[]
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
    width:100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    
}
</style>