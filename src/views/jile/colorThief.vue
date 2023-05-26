<template>
  <div>
    <div>
      <el-button type="success" style="margin: 10px" @click="selectCover">选择图片</el-button>
    </div>
    <img id="background" :src="url" width="200" crossorigin="anonymous" />
    <!--后面的属性允许获取网络上的图片-->
    <ul class="show">
      <li v-for="color in colors" :key="color" :style="{ background: `rgb(${color.toString()})` }">
        <!--                rab:{{color.toString()}}-->
      </li>
    </ul>
  </div>
</template>
 
<script>
// import ColorThief from 'color-thief'
// import ColorThief from 'color-thief'
const { shell } = require('electron')
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote


export default {
  name: 'Color',
  data() {
    return {
      url: '',
      colors: [],

      filtersList: {
        imageFilters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
      }
      //210042 449818741 1442312981
    }
  },
  mounted() {
    this.ImgColor()
  },
  methods: {
    ImgColor() {
      // this.url = 'I:\\JiLeFile\\test1\\73599890_p0.png'
      // let domImg = document.querySelector('#background')
      // let colorthief = new ColorThief()
      // domImg.addEventListener('load', () => {
      //   console.log('加载好了并取色', colorthief.getPalette(domImg, 2)) //第二个参数可选(1~10)
      //   this.colors = colorthief.getPalette(domImg)
      // })
    },
    selectCover() {
      // //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      // dialog
      //   .showOpenDialog({
      //     title: '请选择图片',
      //     properties: ['openFile'],
      //     filters: this.filtersList.imageFilters
      //   })
      //   .then((result) => {
      //     if (!result || result.filePaths.length == 0) return //为空情况下表示未选择文件，直接return结束函数
      //     this.url = result.filePaths[0]
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
    }
  }
}
</script>
 
<style scoped>
* {
  padding: 0;
  margin: 0;
  list-style: none;
}

a {
  color: #835cff;
  text-decoration: none;
}

img {
  border-radius: 15px;
}

.show > li {
  width: 100px;
  height: 30px;
  border-radius: 15px;
}
</style>