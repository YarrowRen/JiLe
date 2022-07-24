<template>
<el-scrollbar>
  <div style="position:relative;">
    <div class="container">
      <div class="column" v-for="(column,index) in columns" :key="index">
        <div
          class="item"
          v-for="(item,i) in column.columnArr"
          :key="i"
          :style="{ height: item.height + 'px', background: item.background }"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="loading" v-if="loading" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"></div>
  </div>
</el-scrollbar>
</template>
<script>
export default {
  data() {
    return {
      contentArr: [
        { value: 0, height: "150", background: "#409eff", text: "1", top: "" },
        { value: 1, height: "250", background: "#67c23a", text: "2", top: "" },
        { value: 2, height: "250", background: "#e6a23c", text: "3", top: "" },
        { value: 3, height: "250", background: "#f56c6c", text: "4", top: "" },
        { value: 4, height: "180", background: "#909399", text: "5", top: "" },
        { value: 5, height: "250", background: "#409eff", text: "6", top: "" },
        { value: 6, height: "180", background: "#67c23a", text: "7", top: "" },
        { value: 7, height: "250", background: "#e6a23c", text: "8", top: "" },
        { value: 8, height: "180", background: "#f56c6c", text: "9", top: "" },
        { value: 9, height: "150", background: "#909399", text: "10", top: "" },
        { value: 10, height: "150", background: "#409eff", text: "11", top: "" },
        { value: 11, height: "250", background: "#67c23a", text: "12", top: "" },
        { value: 12, height: "250", background: "#e6a23c", text: "13", top: "" },
        { value: 13, height: "250", background: "#f56c6c", text: "14", top: "" },
        { value: 14, height: "180", background: "#909399", text: "15", top: "" },
        { value: 15, height: "250", background: "#409eff", text: "16", top: "" },
        { value: 16, height: "180", background: "#67c23a", text: "17", top: "" },
        { value: 17, height: "250", background: "#e6a23c", text: "18", top: "" },
        { value: 18, height: "180", background: "#f56c6c", text: "19", top: "" },
        { value: 19, height: "150", background: "#909399", text: "20", top: "" },
        { value: 20, height: "150", background: "#409eff", text: "21", top: "" },
        { value: 21, height: "250", background: "#67c23a", text: "22", top: "" },
        { value: 22, height: "250", background: "#e6a23c", text: "23", top: "" },
        { value: 23, height: "250", background: "#f56c6c", text: "24", top: "" },
        { value: 24, height: "180", background: "#909399", text: "25", top: "" },
        { value: 25, height: "250", background: "#409eff", text: "26", top: "" },
        { value: 26, height: "180", background: "#67c23a", text: "27", top: "" },
        { value: 27, height: "250", background: "#e6a23c", text: "28", top: "" },
        { value: 28, height: "180", background: "#f56c6c", text: "29", top: "" },
        { value: 29, height: "150", background: "#909399", text: "30", top: "" },
      ],
      columns: [],
      arrIndex:[],
      loading:false,
      contentArr2:[]
    };
  },
  methods: {

    pushElement(){
        return new Promise((resolve,reject) =>{
            setTimeout(() =>{
                for (let i = 0; i < 20; i++) {
                    this.contentArr2[i] = { value: i+this.contentArr.length, height: 50*Math.random()+50, background: "#409eff", text: i+this.contentArr.length, top: "" }
                }
                resolve()
            },500)
        })
    },
    getMinHeight(arr){
      let a = []
      for (let i = 0; i < arr.length; i++) {
        a.push(parseInt(arr[i].height)+parseInt(arr[i].top))
      }
      return Math.min.apply(null,a)
    },
    getMinIndex(val){
      for (let i = 0; i < this.columns.length; i++) {
        let height = this.columns[i].columnArr[this.columns[i].columnArr.length-1].height
        let top = this.columns[i].columnArr[this.columns[i].columnArr.length-1].top
        if(parseInt(height)+parseInt(top)==val){
          this.arrIndex.push(i)
        }
      }
    },

    init() {
      this.columns = []
      let contentLen = this.contentArr.length
      // 根据可视区域的宽度判断需要几列
      let cWidth = document.documentElement.clientWidth || document.body.clientWidth;
      // 假设图片宽度为100px
      let cLen = Math.floor((cWidth/140)-1)
        console.log(cLen);

      // 初始化每一列的第一行元素
      for (let i = 0; i < cLen; i++) {
        this.contentArr[i].top = 0 //预设距离顶部值为0
        this.columns.push({columnArr:[this.contentArr[i]]})
      }
 
      // 对剩余元素的判断，应该放到哪一列
      for (var index = cLen; index < contentLen; index++) {
        
        this.arrIndex = []
        let arr = [] //找到高度最小的一列，可能有多个
        let minHeight = 0 //高度最小的一列的高度
        let pushIndex = 0  //高度最小的一列所在位置的索引

        for (let i = 0; i < this.columns.length; i++) {
          arr.push({
            height:this.columns[i].columnArr[this.columns[i].columnArr.length-1].height,
            top:this.columns[i].columnArr[this.columns[i].columnArr.length-1].top
          })
        }

        minHeight = this.getMinHeight(arr)
        this.getMinIndex(minHeight)
        if(this.arrIndex.length>0){
          pushIndex = Math.min.apply(null,this.arrIndex) //出现高度一样的，去索引最小的
        }

        this.contentArr[index].top = minHeight +20
        this.columns[pushIndex].columnArr.push(this.contentArr[index])

      }
    },
  },
  mounted() {
    this.init()
    window.onresize = () =>{
      this.init()
    }
    let clientH = document.documentElement.clientHeight ||  document.body.clientHeight
    document.onscroll = (e) =>{
        
        let top = e.target.documentElement.scrollTop || e.target.body.scrollTop
        
        let height = e.target.documentElement.scrollHeight || e.target.body.scrollHeight
        
        if((top+clientH)==height){
          this.loading = true
          this.pushElement().then(() =>{
            //  从接口最新获取的元素push到目前高度最小的一列
            for (var index = 0; index < this.contentArr2.length; index++) {
        
                this.arrIndex = []
                let arr = [] //找到高度最小的一列，可能有多个
                let minHeight = 0 //高度最小的一列的高度
                let pushIndex = 0  //高度最小的一列所在位置的索引

                for (let i = 0; i < this.columns.length; i++) {
                    arr.push({
                        height:this.columns[i].columnArr[this.columns[i].columnArr.length-1].height,
                        top:this.columns[i].columnArr[this.columns[i].columnArr.length-1].top
                    })
                }

                minHeight = this.getMinHeight(arr)
                this.getMinIndex(minHeight)
                if(this.arrIndex.length>0){
                    pushIndex = Math.min.apply(null,this.arrIndex) //出现高度一样的，去索引最小的
                }

                this.contentArr[index].top = minHeight +20
                this.columns[pushIndex].columnArr.push(this.contentArr[index])
                this.loading = false

            }
          })
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div,
p {
  margin: 0;
  padding: 0;
}
.container {
  margin: 0 auto;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-around;
  background: pink;
  transition: all 0.5s ease-in-out;
}
.item {
  width: 120px;
  color: #000;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
}
.loading{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
</style>