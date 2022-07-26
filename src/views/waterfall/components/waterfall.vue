<template>
  <el-scrollbar>
    <div style="position: relative">
      <div class="container">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <div v-for="(item, i) in column.columnArr" :key="i" class="item" :style="{ height: item.height + 'px' }">
            <el-image
              :src="item.src"
              fit="cover"
              :style="{ height: item.height + 'px', width: '220px' }"
              class="image"
            />
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
export default {
  props: {
    contentArr: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [],
      arrIndex: []
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.init()
      window.onresize = () => {
        this.init()
      }
    },
    getMinHeight(arr) {
      let a = []
      for (let i = 0; i < arr.length; i++) {
        a.push(parseInt(arr[i].height) + parseInt(arr[i].top))
      }
      return Math.min.apply(null, a)
    },
    getMinIndex(val) {
      for (let i = 0; i < this.columns.length; i++) {
        let height = this.columns[i].columnArr[this.columns[i].columnArr.length - 1].height
        let top = this.columns[i].columnArr[this.columns[i].columnArr.length - 1].top
        if (parseInt(height) + parseInt(top) == val) {
          this.arrIndex.push(i)
        }
      }
    },
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
        promise.then(function (data) {
          sel.contentArr[i].height = data
        })
      }
    },
    init() {
      this.columns = []
      let contentLen = this.contentArr.length
      // 根据可视区域的宽度判断需要几列
      let cWidth = document.documentElement.clientWidth || document.body.clientWidth
      // 假设图片宽度为100px
      let cLen = Math.floor(cWidth / 240 - 1)
      console.log(cLen)

      // 初始化每一列的第一行元素
      for (let i = 0; i < cLen; i++) {
        this.contentArr[i].top = 0 //预设距离顶部值为0
        this.columns.push({ columnArr: [this.contentArr[i]] })
      }

      // 对剩余元素的判断，应该放到哪一列
      for (var index = cLen; index < contentLen; index++) {
        this.arrIndex = []
        let arr = [] //找到高度最小的一列，可能有多个
        let minHeight = 0 //高度最小的一列的高度
        let pushIndex = 0 //高度最小的一列所在位置的索引

        for (let i = 0; i < this.columns.length; i++) {
          arr.push({
            height: this.columns[i].columnArr[this.columns[i].columnArr.length - 1].height,
            top: this.columns[i].columnArr[this.columns[i].columnArr.length - 1].top
          })
        }

        minHeight = this.getMinHeight(arr)
        this.getMinIndex(minHeight)
        if (this.arrIndex.length > 0) {
          pushIndex = Math.min.apply(null, this.arrIndex) //出现高度一样的，去索引最小的
        }

        this.contentArr[index].top = minHeight + 20
        this.columns[pushIndex].columnArr.push(this.contentArr[index])
      }
    }
  }
}
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
  transition: all 0.5s ease-in-out;
}
.item {
  border-radius: 4px;
  width: 220px;
  color: #000;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
}
.image {
  border-radius: 4px;
}
</style>