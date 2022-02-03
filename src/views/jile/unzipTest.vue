<template>
<el-scrollbar>
  <el-button type="primary" @click="readingArchives(source,target)">获取压缩文件信息</el-button>
  <el-button type="primary" @click="setCover">设置封面</el-button>
  <div>{{fileList}}</div>
  <el-image :src="imageSrc" style="width: 30%"></el-image>
</el-scrollbar>
</template>

<script>
const fs = require('fs-extra')
const extract = require('extract-zip')
const AdmZip = require('adm-zip')

export default {
  data() {
    return {
      source: 'F:\\暂存资源-寒假篇\\boostore\\[VYCMa] 蒙德温泉节.zip',
      target: 'C:\\Users\\Ywrby\\Desktop\\temp',
      fileList: [],
      imageSrc: ''
    }
  },
  methods: {
    readingArchives(zipFile,targetPath) {
      // reading archives
      var zip = new AdmZip(zipFile)
      var zipEntries = zip.getEntries() // an array of ZipEntry records
      zipEntries.forEach(function (zipEntry) {
          var entryName=zipEntry.entryName
          //利用正则表达式筛选压缩文件中的图片文件
          if(entryName.search(/\.jpg/)!==-1){
            //console.log(entryName)
            //将图片文件解压到指定位置
            zip.extractEntryTo(entryName,targetPath,false,true)
            console.log(entryName+"：解压成功！")
          }

      })
    },
    setCover(){
        this.fileList = fs.readdirSync(this.target)
        for(var i=0;i<this.fileList.length;i++){
            if(this.fileList[i].search(/\.jpg/)!==-1){
                this.imageSrc=this.target+"\\"+this.fileList[i]
                break
            }
        }
    }
  }
}
</script>

<style>
</style>