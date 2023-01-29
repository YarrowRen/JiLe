<template>
  <div v-if="targetVal == contentArr.length">
    <div>
      <el-button type="primary" @click="enlargeImage">enlargeImage</el-button>
      <el-button type="primary" @click="decreaseImage">decreaseImage</el-button>
      <el-button type="primary" @click="getContentArr">getContentArr</el-button>
      <el-button type="primary" @click="getColors">getColors</el-button>
    </div>

    <div style="position: relative">
      <div class="container">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <div v-for="(item, i) in column.columnArr" :key="i" class="item" :style="{ width: itemWidth + 'px' }">
            <div @click="openDrawer(item)" class="imageFigure">
              <img
                :src="item.thumbnail"
                :style="{ height: item.height + 'px', width: itemWidth + 'px' }"
                class="image"
                :id="'background' + item.imageID"
              />
            </div>
            <div style="text-align: center">
              <el-link>
                <p style="font-size: 13px">
                  <strong>{{ item.imageName }}</strong>
                </p>
              </el-link>
            </div>
            <p style="font-size: 12px; text-align: center; user-select: none; color: grey">
              {{ item.width }} × {{ item.trueHeight }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <el-drawer class="el-drawer" v-model="imageDrawer" :with-header="false">
      <div style="height: 200px; text-align: center; line-height: 200px">
        <el-image
          :src="imageInfo.thumbnail"
          fit="contain"
          style="height: 200px; vertical-align: middle"
          class="drawerImage"
        ></el-image>
      </div>
      <div class="show">
        <el-tooltip
          class="box-item"
          effect="light"
          :content="
            '#' +
            ((1 << 24) + (parseInt(color[0]) << 16) + (parseInt(color[1]) << 8) + parseInt(color[2]))
              .toString(16)
              .slice(1)
          "
          placement="top"
          v-for="color in colors"
          :key="color"
        >
          <div
            @contextmenu="rtClickOpenMenu(color)"
            :style="{ background: `rgb(${color.toString()})`, display: 'inline-block' }"
          ></div>
        </el-tooltip>
      </div>
      <div style="width: 100%; text-align: center; margin-bottom: 10px">
        <el-button
          v-if="imageInfo.followed == 0"
          type="danger"
          style="width: 30%; text-align: center"
          @click="imageInfo.followed = 1"
        >
          {{ showFollowed }}
        </el-button>
        <el-button
          v-if="imageInfo.followed == 1"
          type="info"
          style="width: 30%; text-align: center"
          @mouseenter="showNotFollowed = '取消收藏'"
          @mouseleave="showNotFollowed = '已收藏'"
          @click="imageInfo.followed = 0"
        >
          {{ showNotFollowed }}
        </el-button>
      </div>
      <el-form :model="imageInfo">
        <el-form-item>
          <el-input v-model="imageInfo.imageName" placeholder="图像名" size="default"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="imageInfo.url" placeholder="相关链接" size="default"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="imageInfo.remark"
            :autosize="{ minRows: 4, maxRows: 6 }"
            type="textarea"
            placeholder="添加备注"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-tag
              v-for="tag in imageInfo.tags"
              :key="tag.id"
              style="margin-right: 10px; margin-bottom: 10px"
              size="large"
              closable
              :disable-transitions="false"
              type="success"
              :hit="true"
              @close="handleTagClose(tag)"
            >
              {{ tag.tag_name }}
            </el-tag>
            <el-col :span="9">
              <el-input
                v-model="tagInputValue"
                size="small"
                placeholder="请输入标签"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div style="margin-bottom: 14px">
        <h3><strong>基本信息</strong></h3>
      </div>
      <el-form label-position="left">
        <el-form-item label="评分" :label-width="formLabelWidth">
          <el-rate v-model="imageInfo.imageScore"></el-rate>
        </el-form-item>
        <el-form-item label="分辨率" :label-width="formLabelWidth">
          <p>{{ imageInfo.width }} x {{ imageInfo.trueHeight }}</p>
        </el-form-item>
        <el-form-item label="文件类型" :label-width="formLabelWidth">
          <p>{{ imageInfo.suffix }}</p>
        </el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth">
          <p>{{ imageInfo.createDate }}</p>
        </el-form-item>
      </el-form>
      <div style="float: right; margin: 20px">
        <el-button type="primary">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#yw-icon-select-bold"></use>
          </svg>
          保存
        </el-button>
        <el-button type="info">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#yw-icon-close-bold"></use>
          </svg>
          取消
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ColorThief from 'color-thief'
const { shell, clipboard } = require('electron')
import { ElMessage } from 'element-plus'
const remote = require('@electron/remote')
const { Menu, dialog } = remote
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
      showFollowed: '❤ 收藏',
      showNotFollowed: '已收藏',
      formLabelWidth: '80px',
      tagInputValue: '',
      imageDrawer: false,
      itemWidth: 220, //默认图片框宽度
      targetVal: 0, //标志值，用来记录已读取图片信息数目，待全部读取完成后显示瀑布流
      columns: [],
      arrIndex: [],
      imageInfo: {
        imagePath: '',
        imageName: '',
        imageID: 0,
        thumbnail: '',
        imageScore: 0,
        remark: '',
        followed: 0,
        createDate: '',
        url: '',
        tags: [
          {
            id: 0,
            tag_name: ''
          }
        ],
        height: 0,
        width: 0,
        top: 0,
        trueHeight: 0,
        suffix: ''
      },

      contextMenuTemplate: [],
      colors: []
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
    console.log(this.contentArr)
  },
  mounted() {
    //监听键盘与鼠标（CTRL+鼠标滚轮）实现瀑布流图片缩放
    this.keyDownAndScroll()
  },
  methods: {
    //初始化页面
    initPage() {
      console.log(this.contentArr)
      //调用初始化方法
      this.init()
      //在页面大小出现变化时重新加载瀑布流
      window.onresize = () => {
        this.init()
      }
    },

    initMenuTemplate(color) {
      var hex =
        '#' +
        ((1 << 24) + (parseInt(color[0]) << 16) + (parseInt(color[1]) << 8) + parseInt(color[2])).toString(16).slice(1)
      var rgb = 'RGB(' + color + ')'
      this.contextMenuTemplate = [
        { label: '复制 ' + hex, click: this.copyText, data: hex },
        { label: '复制 RGB(' + color.toString() + ')', click: this.copyText, data: rgb },
        { type: 'separator' },
        { label: '寻找相似颜色图片', click: this.sameColorSearch, data: hex }
      ]
    },

    copyText(item) {
      clipboard.writeText(item.data)
      ElMessage({
        showClose: true,
        message: '已复制成功.',
        type: 'success'
      })
    },
    sameColorSearch(item) {
      window.open('http://labs.tineye.com/multicolr/#colors=' + item.data + ';weights=100;')
    },
    rtClickOpenMenu(color) {
      this.initMenuTemplate(color)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
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
      console.log('进入异步方法' + this.contentArr.length)
      let sel = this
      //遍历contentArr（从父组件获取并传递过来）
      for (let i = 0; i < this.contentArr.length; i++) {
        // console.log(this.contentArr[i].imagePath)
        let img = new Image() //初始化图像对象
        //获取指定图像（在请求路径后加入随机数保证强制刷新请求）
        img.src = this.contentArr[i].imagePath + '?' + Date.parse(new Date())
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
    },

    openDrawer(item) {
      this.ImgColor(item.imageID)
      this.imageInfo = item
      //对表单数据进行单独初始化
      this.imageInfo.tags = []
      //获取文件后缀并转换为大写
      this.imageInfo.suffix = item.imageName.substring(item.imageName.lastIndexOf('.') + 1).toLocaleUpperCase()
      //格式化日期
      var date = new Date(this.imageInfo.createDate)
      //date.getMonth获取到的是0~11中的数字，所以格式化时要对月份单独+1
      if (date.getMonth() + 1 < 10) {
        //月份补0
        if (date.getMinutes() < 10) {
          //分钟前补0
          this.imageInfo.createDate =
            date.getFullYear() +
            '/0' +
            (date.getMonth() + 1) +
            '/' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':0' +
            date.getMinutes()
        } else {
          this.imageInfo.createDate =
            date.getFullYear() +
            '/0' +
            (date.getMonth() + 1) +
            '/' +
            date.getDate() +
            ' ' +
            date.getHours() +
            ':' +
            date.getMinutes()
        }
      } else {
        //不需要在月份前补0
        this.imageInfo.createDate =
          date.getFullYear() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getDate() +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes()
      }
      this.imageDrawer = true
    },

    //分析图片主色调
    ImgColor(itemID) {
      // this.url = 'I:\\JiLeFile\\test1\\73599890_p0.png'
      //根据ID获取指定组件
      let domImg = document.querySelector('#background' + itemID)
      // 调用组件
      let colorthief = new ColorThief()
      //分析主色调，并提取前五种主色
      this.colors = colorthief.getPalette(domImg, 5)
    },
    getColors() {
      console.log(this.colors)
      for (var i = 0; i < this.colors.length; i++) {
        var color = this.colors[i]
        var hex =
          '#' +
          ((1 << 24) + (parseInt(color[0]) << 16) + (parseInt(color[1]) << 8) + parseInt(color[2]))
            .toString(16)
            .slice(1)
        // var hex = '#' + ((1 << 24) + (color[0] << 16) + ([1] << 8) + [2]).toString(16).slice(1)
        console.log(color[0], color[1], color[2], hex)
      }
    },
    handleTagClose(tag) {
      for (var i = 0; i < this.imageInfo.tags.length; i++) {
        if (this.imageInfo.tags[i].id == tag.id && this.imageInfo.tags[i].tag_name == tag.tag_name) {
          this.imageInfo.tags.splice(i, 1)
          break
        }
      }
    },
    handleInputConfirm() {
      if (this.tagInputValue) {
        var tag = {
          id: 0,
          tag_name: this.tagInputValue
        }
        //确认不存在相同值的情况下再加入
        var i = 0
        for (i = 0; i < this.imageInfo.tags.length; i++) {
          if (this.tagInputValue == this.imageInfo.tags[i].tag_name) {
            break
          }
        }
        if (i == this.imageInfo.tags.length) {
          this.imageInfo.tags.push(tag)
        }
      }
      this.tagInputValue = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
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
  /* display: flex; */
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
}

.image {
  border-radius: 4px;
  object-fit: cover;
}

/* 1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}

.show {
  width: 100%;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}

.show > div {
  width: 40px;
  height: 22px;
  border-radius: 5px;
  margin: 2px;
}

.show > div:hover {
  /* 当鼠标经过时div里面的图片宽高同时变为原来的1.1倍 */
  transform: scale(1.1);

  cursor: pointer;
}

.imageFigure > img:hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(70%);
  cursor: pointer;
}

.el-input__inner {
  color: black;
}
.el-textarea__inner {
  color: black;
}
</style>