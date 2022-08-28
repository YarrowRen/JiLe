<template>
  <el-scrollbar v-if="targetVal == contentArr.length">
    <div>
      <el-button type="primary" @click="enlargeImage">enlargeImage</el-button>
      <el-button type="primary" @click="decreaseImage">decreaseImage</el-button>
      <el-button type="primary" @click="getContentArr">getContentArr</el-button>
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
    //从父组件获取图集信息
    contentArr: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      itemWidth: 220, //默认图片框宽度
      targetVal: 0, //标志值，用来记录已读取图片信息数目，待全部读取完成后显示瀑布流
      columns: [],
      arrIndex: []
      // pageSize: 25,
      // startPage: 1,
      // pageNum: 1
    }
  },
  watch: {
    //监听标志值变化，直到所有图片长度成功获取
    targetVal: {
      handler(newValue, oldValue) {
        if (newValue == this.contentArr.length) {
          this.initPage()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getImgHeight()
  },
  mounted() {
    // this.initPage()
    //监听键盘与鼠标（CTRL+鼠标滚轮）实现瀑布流图片缩放
    this.keyDownAndScroll()
  },
  methods: {
    //初始化页面
    initPage() {
      //调用初始化方法
      this.init()
      //在页面大小出现变化时重新加载瀑布流
      window.onresize = () => {
        this.init()
      }
    },

    //获取当前列下最短长度位置（用来确定下一张图片插入位置）
    getMinHeight(arr) {
      let a = []
      for (let i = 0; i < arr.length; i++) {
        a.push(parseInt(arr[i].height) + parseInt(arr[i].top))
      }
      return Math.min.apply(null, a)
    },

    //获取指定长度位置后，进一步获取该位置索引值以确定图片插入位置
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

    //测试方法，打印contentArr
    getContentArr() {
      console.log(this.contentArr)
    },

    //刷新图片高度
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

    //初始化（重载）页面瀑布流
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
    },

    //图像放大（宽度加10）
    enlargeImage() {
      this.itemWidth += 10
      this.refreshImageHeight()
      this.init()
    },
    //图片缩小（宽度减10）
    decreaseImage() {
      this.itemWidth -= 10
      this.refreshImageHeight()
      this.init()
    },

    // 监听键盘和鼠标滚轮组合
    keyDownAndScroll() {
      let ctrlDown = false //ctrl按键按压情况
      ;(document.onkeydown = function (e) {
        //事件对象兼容
        let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
        //按下CTRL键下后记录当前情况
        if (e1.keyCode === 17) ctrlDown = true
      }),
        (document.onkeyup = function (e) {
          let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
          //松开后修改CTRL键按压情况
          if (e1.keyCode === 17) ctrlDown = false
        }),
        //监听鼠标滚轮情况
        document.addEventListener(
          'mousewheel',
          (e) => {
            // e.preventDefault()
            let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
            //判断CTRL键是否被按下
            if (ctrlDown) {
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