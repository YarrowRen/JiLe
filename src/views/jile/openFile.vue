<template>
  <div>
    <el-button @click="defaultOpenFile">默认方式打开文件</el-button>
    <el-button @click="openFileInFolder">打开文件所在文件夹</el-button>
    <el-button @click="beep">播放声音</el-button>
  </div>
</template>

<script>
const { shell } = require('electron')


export default {
  data() {
    return {
        filePath: 'F:\\photo\\onedrive\\miho_kaneko\\bs1_kaneko_m03\\bs1_kaneko_m03_005.jpg',
    }
  },
  methods: {
    defaultOpenFile(){
        shell.openPath(this.filePath)  
    },
    openFileInFolder(){
        shell.showItemInFolder(this.filePath)
    },
    beep(){
        shell.beep()
    }
  }
}

</script>

