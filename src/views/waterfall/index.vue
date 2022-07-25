<template>
  <waterfall v-if="loaded" :content-arr="contentArr"/>
</template>

<script>
import waterfall from "./components/waterfall.vue"
export default {
  components: {
    waterfall
  },
  data(){
    return{
        loaded:true,
      contentArr: [
        { value: 0, height: 0, width: 0, src: './src/static/img/1.jpg', background: '#409eff', text: '1', top: 0 },
        { value: 1, height: 0, width: 0, src: './src/static/img/2.jpg', background: '#67c23a', text: '2', top: 0 },
        { value: 2, height: 0, width: 0, src: './src/static/img/3.jpg', background: '#e6a23c', text: '3', top: 0 },
        { value: 3, height: 0, width: 0, src: './src/static/img/4.jpg', background: '#f56c6c', text: '4', top: 0 },
        { value: 4, height: 0, width: 0, src: './src/static/img/5.jpg', background: '#909399', text: '5', top: 0 },
        { value: 5, height: 0, width: 0, src: './src/static/img/6.jpg', background: '#409eff', text: '6', top: 0 },
        { value: 6, height: 0, width: 0, src: './src/static/img/7.jpg', background: '#67c23a', text: '7', top: 0 },
        { value: 7, height: 0, width: 0, src: './src/static/img/8.jpg', background: '#e6a23c', text: '8', top: 0 },
        { value: 8, height: 0, width: 0, src: './src/static/img/9.jpg', background: '#f56c6c', text: '9', top: 0 },
        { value: 9, height: 0, width: 0, src: './src/static/img/10.jpg', background: '#909399', text: '10', top: 0 },
        { value: 10, height: 0, width: 0, src: './src/static/img/11.jpg', background: '#409eff', text: '11', top: 0 },
        { value: 11, height: 0, width: 0, src: './src/static/img/12.jpg', background: '#67c23a', text: '12', top: 0 },
        { value: 12, height: 0, width: 0, src: './src/static/img/13.jpg', background: '#e6a23c', text: '13', top: 0 },
        { value: 13, height: 0, width: 0, src: './src/static/img/14.jpg', background: '#f56c6c', text: '14', top: 0 },
        { value: 14, height: 0, width: 0, src: './src/static/img/15.jpg', background: '#909399', text: '15', top: 0 },
        { value: 15, height: 0, width: 0, src: './src/static/img/16.jpg', background: '#409eff', text: '16', top: 0 },
        { value: 16, height: 0, width: 0, src: './src/static/img/17.jpg', background: '#67c23a', text: '17', top: 0 },
        { value: 17, height: 0, width: 0, src: './src/static/img/18.jpg', background: '#e6a23c', text: '18', top: 0 },
        { value: 18, height: 0, width: 0, src: './src/static/img/19.jpg', background: '#f56c6c', text: '19', top: 0 },
        { value: 19, height: 0, width: 0, src: './src/static/img/20.jpg', background: '#909399', text: '20', top: 0 }
      ],
    }
  },
  created(){
    // this.getImgHeight().then(this.loaded=true)
  },
  methods: {
    
    // async getImgHeight() {
    //   let sel = this
    //   for (let i = 0; i < this.contentArr.length; i++) {
    //     console.log(i)
    //     let img = new Image()
    //     img.src = this.contentArr[i].src + '?' + Date.parse(new Date())
    //     var promise = new Promise((reslove) => {
    //       img.onload = function () {
    //         let scale = 220 / img.width
    //         var height = Math.floor(scale * img.height)
    //         console.log('src: ' + img.src + ', height: ' + img.height + ', width: ' + img.width + ', i: ' + i)

    //         reslove(height)
    //       }
    //     })
    //     await promise
    //     promise.then(function (data) {
    //       sel.contentArr[i].height = data
    //     })
    //   }
    // }

  }
}
</script>

<style>

</style>