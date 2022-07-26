<template>
  <el-card>
    <div style="height: 500px">
      <waterfall v-if="this.targetVal >= this.contentArr.length && this.targetPage==0" :content-arr="contentArr" />
    </div>
  </el-card>
  <br/>
  <el-button @click="showWaterfall" type="primary">瀑布流图片展示</el-button>
</template>

<script>
import waterfall from './components/waterfall.vue'
export default {
  components: {
    waterfall
  },
  data() {
    return {
      targetPage:0,
      targetVal: 0,
      loaded: true,
      contentArr: [
        { value: 0, height: 0, width: 0, src: './src/static/img/1.jpg', title: '1', top: 0 },
        { value: 1, height: 0, width: 0, src: './src/static/img/2.jpg', title: '2', top: 0 },
        { value: 2, height: 0, width: 0, src: './src/static/img/3.jpg', title: '3', top: 0 },
        { value: 3, height: 0, width: 0, src: './src/static/img/4.jpg', title: '4', top: 0 },
        { value: 4, height: 0, width: 0, src: './src/static/img/5.jpg', title: '5', top: 0 },
        { value: 5, height: 0, width: 0, src: './src/static/img/6.jpg', title: '6', top: 0 },
        { value: 6, height: 0, width: 0, src: './src/static/img/7.jpg', title: '7', top: 0 },
        { value: 7, height: 0, width: 0, src: './src/static/img/8.jpg', title: '8', top: 0 },
        { value: 8, height: 0, width: 0, src: './src/static/img/9.jpg', title: '9', top: 0 },
        { value: 9, height: 0, width: 0, src: './src/static/img/10.jpg', title: '10', top: 0 },
        { value: 10, height: 0, width: 0, src: './src/static/img/11.jpg', title: '11', top: 0 },
        { value: 11, height: 0, width: 0, src: './src/static/img/12.jpg', title: '12', top: 0 },
        { value: 12, height: 0, width: 0, src: './src/static/img/13.jpg', title: '13', top: 0 },
        { value: 13, height: 0, width: 0, src: './src/static/img/14.jpg', title: '14', top: 0 },
        { value: 14, height: 0, width: 0, src: './src/static/img/15.jpg', title: '15', top: 0 },
        { value: 15, height: 0, width: 0, src: './src/static/img/16.jpg', title: '16', top: 0 },
        { value: 16, height: 0, width: 0, src: './src/static/img/17.jpg', title: '17', top: 0 },
        { value: 17, height: 0, width: 0, src: './src/static/img/18.jpg', title: '18', top: 0 },
        { value: 18, height: 0, width: 0, src: './src/static/img/19.jpg', title: '19', top: 0 },
        { value: 19, height: 0, width: 0, src: './src/static/img/20.jpg', title: '20', top: 0 }
      ]
    }
  },
  created() {
    this.getImgHeight()
  },
  methods: {
    async getImgHeight() {
      let sel = this
      for (let i = 0; i < this.contentArr.length; i++) {
        console.log(i)
        let img = new Image()
        img.src = this.contentArr[i].src + '?' + Date.parse(new Date())
        var promise = new Promise((reslove) => {
          img.onload = function () {
            let scale = 220 / img.width
            var height = Math.floor(scale * img.height)
            console.log('src: ' + img.src + ', height: ' + img.height + ', width: ' + img.width + ', i: ' + i)

            reslove(height)
          }
        })
        await promise
        promise
          .then(function (data) {
            sel.contentArr[i].height = data
          })
          .finally(function () {
            sel.targetVal++
            console.log(sel.targetVal)
          })
      }
    },
    showWaterfall(){
      this.targetPage=0
    }
  }
}
</script>

<style>
</style>