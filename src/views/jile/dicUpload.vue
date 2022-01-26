<template>
  <el-form ref="form" :model="form" label-width="120px" style="width: 50%">
    <el-form-item label="选择文件夹">
      <el-button size="small" type="primary" @click="chooseFiles">选择文件夹</el-button>
    </el-form-item>
  </el-form>
</template>

<script>



export default {
  data() {
    return {
    }
  },
  methods: {
    chooseFiles() {
        const { dialog } = require('@electron/remote')
        // Electron 10之后下面这种引入方法已经不可用了，使用上面的方法，这个是需要注意的
        // const { BrowserWindow } = require('electron').remote;


        //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
        dialog.showOpenDialog({ 
            title: '请选择文件夹',
            properties: ['openDirectory'] })
        .then(result => {
            if(!result) return;
            console.log(result.filePaths[0]);
        }).catch(err =>{
        console.log(err);
        })
    }
  }
}
</script>