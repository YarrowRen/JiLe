<template>
  <el-scrollbar style="height: 100%">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="120px" style="width: 50%">
          <el-form-item label="选择文件夹">
            <el-button size="small" type="primary" @click="chooseFiles">选择文件夹</el-button>
          </el-form-item>

          <el-form-item label="目标文件夹">
            <div>{{ dicPath }}</div>
          </el-form-item>
          <el-form-item label="文件夹列表">
            <div>{{ fileList }}</div>
            <div v-for="file in fileList" :key="file">
              <el-link @click="clickFile(file)">{{ file }}</el-link>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form ref="form" :model="form" label-width="120px" style="width: 50%">
          <el-form-item label="图片显示">
            <el-image :src="imagePath"></el-image>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script>
const { shell, clipboard } = require('electron')
const fs = require('fs-extra')
const { dialog } = require('@electron/remote')
// Electron 10之后下面这种引入方法已经不可用了，使用上面的方法，这个是需要注意的
// const { BrowserWindow } = require('electron').remote;

export default {
  data() {
    return {
      imagePath: '',
      dicPath: '',
      fileList: []
    }
  },
  methods: {
    chooseFiles() {
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
    clickFile(file) {
      // console.log(file)

      this.imagePath = this.dicPath + '\\' + file
    }
  }
}
</script>

