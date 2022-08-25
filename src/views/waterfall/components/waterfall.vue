<template>
  <el-scrollbar v-if="this.targetVal == this.contentArr.length">
    <div>
      <el-button @click="enlargeImage" type="primary">enlargeImage</el-button>
      <el-button @click="decreaseImage" type="primary">decreaseImage</el-button>
      <el-button @click="getContentArr" type="primary">getContentArr</el-button>
    </div>
    <div style="position: relative">
      <div class="container">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <div v-for="(item, i) in column.columnArr" :key="i" class="item" :style="{ width: itemWidth + 'px' }">
            <el-image
              :src="item.src"
              fit="cover"
              :style="{ height: item.height + 'px', width: itemWidth + 'px' }"
              class="image"
              lazy
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
      itemWidth: 220,
      targetVal: 0,
      columns: [],
      arrIndex: [],
      loading: false,
      loadingSuccess: false,
      contentArr2: []
      // pageSize: 25,
      // startPage: 1,
      // pageNum: 1
    }
  },
  created() {
    this.getImgHeight()
  },
  watch: {
    targetVal: {
      handler(newValue, oldValue) {
        if (newValue == this.contentArr.length) {
          this.initPage()
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.initPage()
    this.keyDownAndScroll()
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

    //异步获取图像宽高等基本信息
    async getImgHeight() {
      //在异步方法下的this与JS全局中的this意义不同，
      //所以在方法开始时重新定义全局this变量用来获得全局数据
      let sel = this
      //遍历contentArr（从父组件获取并传递过来）
      for (let i = 0; i < this.contentArr.length; i++) {
        console.log(i)
        let img = new Image() //初始化图像对象
        //获取指定图像（在请求路径后加入随机数保证强制刷新请求）
        img.src = this.contentArr[i].src + '?' + Date.parse(new Date())
        //利用promise异步构造获取图像宽高等基本信息
        var promise = new Promise((reslove) => {
          img.onload = function () {
            let scale = sel.itemWidth / img.width //通过固定宽度计算长度缩放比例
            let width = img.width
            var height = Math.floor(scale * img.height) //对原长度进行缩放（height是真实展示在页面上的长度）
            let trueHeight = img.height //同时保存图片的实际长度（文件真实长度，用来方便后续在同步方法中刷新展示长度）

            // console.log(
            //   'src: ' +
            //     img.src +
            //     ', trueHeight: ' +
            //     img.height +
            //     ', height: ' +
            //     height +
            //     ', width: ' +
            //     img.width +
            //     ', i: ' +
            //     i
            // )

            //将展示长度与真实长度作为返回值传递出去
            let data = {
              height: height,
              trueHeight: trueHeight,
              width: width
            }
            reslove(data)
          }
        })
        await promise
        //等待异步方法执行完成后，对图片列表数据进行刷新
        promise.then(function (data) {
          console.log(data)
          sel.contentArr[i].height = data.height
          sel.contentArr[i].trueHeight = data.trueHeight
          sel.contentArr[i].width = data.width
          sel.targetVal++
        })
      }
    },
    getContentArr() {
      console.log(this.contentArr)
    },
    refreshImageHeight() {
      //刷新图片高度（用于在页面中通过CTRL+鼠标滚轮或滑动条动态调整图片宽度后进行图片高度的刷新）
      //由于在页面初始化中执行的getImgHeight方法已经获取到了图片的真实高度，
      //所以在此处就只需要重新计算宽度修改过之后的长度缩放比例以及新的高度（避免了在刷新页面过程中使用异步方法）
      for (let i = 0; i < this.contentArr.length; i++) {
        //计算缩放比例
        let scale = this.itemWidth / this.contentArr[i].width
        let trueHeight = this.contentArr[i].trueHeight
        let height = Math.floor(scale * trueHeight) //对原长度进行缩放（height是真实展示在页面上的长度）
        //更新刷新后的新高度
        this.contentArr[i].height = height
        // console.log(this.contentArr[i])
      }
    },
    init() {
      this.columns = []
      let contentLen = this.contentArr.length
      // let contentLen = this.pageSize
      // 根据可视区域的宽度判断需要几列
      let cWidth = document.documentElement.clientWidth || document.body.clientWidth
      // 假设图片宽度为240px
      let cLen = Math.floor(cWidth / (this.itemWidth + 20) - 1)
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

      // this.pageNum++
    },

    enlargeImage() {
      this.itemWidth += 10
      this.refreshImageHeight()
      this.init()
    },
    decreaseImage() {
      this.itemWidth -= 10
      this.refreshImageHeight()
      this.init()
    },

    // 监听键盘和鼠标滚轮组合
    keyDownAndScroll() {
      // document.onkeydown = (e) => {
      //   //事件对象兼容
      //   let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
      //   //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
      //   //左
      //   if (e1 && e1.keyCode == 37) {
      //     // 按下左箭头
      //     console.log('按下左箭头')
      //   } else if (e1 && e1.keyCode == 39) {
      //     // 按下右箭头
      //     console.log('按下右箭头')
      //   }
      // }

      // let w = this
      let ctrlDown = false
      ;(document.onkeydown = function (e) {
        // console.log(e)
        //事件对象兼容
        let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
        if (e1.keyCode === 17) ctrlDown = true
      }),
        (document.onkeyup = function (e) {
          let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
          if (e1.keyCode === 17) ctrlDown = false
        }),
        document.addEventListener(
          'mousewheel',
          (e) => {
            // e.preventDefault()

            let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
            if (ctrlDown) {
              let _newTimes = []
              if (e1.wheelDeltaY > 0) {
                // 放大
                console.log('放大')
                this.enlargeImage()
              } else {
                // 缩小
                console.log('缩小')
                this.decreaseImage()
              }
            }
          },
          false
        )
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