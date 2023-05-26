<template>
  <div>
    <div style="text-align: center; margin-top: 5px; margin-bottom: 5px">
      <el-button type="error" @click="$router.push('/jile/all-ic/index')" round style="margin-left: 5px; color: white">
        <svg class="icon" aria-hidden="true" style="color: white">
          <use xlink:href="#yw-icon-back"></use>
        </svg>
        返回
      </el-button>
      <el-button color="#1dd0a1" @click="decreaseImage" circle style="margin-right: 5px">
        <svg class="icon" aria-hidden="true" style="color: white">
          <use xlink:href="#yw-icon-minus-bold"></use>
        </svg>
      </el-button>
      <el-progress
        color="#1dd0a1"
        :percentage="((itemWidth - 120) * 2) / 5"
        :stroke-width="8"
        style="width: 150px; display: inline-block"
        :show-text="false"
      />
      <el-button color="#1dd0a1" @click="enlargeImage" circle style="margin-left: 5px">
        <svg class="icon" aria-hidden="true" style="color: white">
          <use xlink:href="#yw-icon-add"></use>
        </svg>
      </el-button>
      <el-button type="warning" @click="refreshIc" round>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#yw-icon-refresh"></use>
        </svg>
        同步
      </el-button>
      <el-button type="info" @click="addImage" round>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#yw-icon-upload"></use>
        </svg>
        上传
      </el-button>
    </div>
    <div v-if="targetVal == contentArr.length && contentArr.length != 0" style="position: relative">
      <div class="container">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <div v-for="(item, i) in column.columnArr" :key="i" class="item" :style="{ width: itemWidth + 'px' }">
            <div class="imageFigure" @click="openDrawer(item)">
              <img
                :id="'background' + item.imageID"
                :src="item.thumbnail"
                :style="{ height: item.height + 'px', width: itemWidth + 'px' }"
                class="image"
                @contextmenu="rtClickOpenMainMenu(item)"
              />
            </div>
            <div style="text-align: center">
              <el-link @click="$router.push('/jile/image-player?image_id=' + item.imageID)">
                <p style="font-size: 13px; width: 100%;">
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
    <div v-else style="height: 80vh; text-align: center">
      <img src="@/assets/pic/jile.png" class="cover" style="height: 150px; margin-top: 30vh" />
      <h2>暂无图片</h2>
    </div>

    <el-drawer v-model="imageDrawer" class="el-drawer" :with-header="false">
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
          v-for="color in colors"
          :key="color"
          class="box-item"
          effect="light"
          :content="
            '#' +
            ((1 << 24) + (parseInt(color[0]) << 16) + (parseInt(color[1]) << 8) + parseInt(color[2]))
              .toString(16)
              .slice(1)
          "
          placement="top"
        >
          <div
            :style="{ background: `rgb(${color.toString()})`, display: 'inline-block' }"
            @contextmenu="rtClickOpenMenu(color)"
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
          <n-h3 prefix="bar" type="success">
            <strong>{{ imageInfo.imageName }}</strong>
          </n-h3>
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
          <p>{{ imageInfo.createDateFormat }}</p>
        </el-form-item>
      </el-form>
      <div style="float: right; margin: 20px">
        <el-button type="success" color="#18a058" @click="showDrawerConfirm">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#yw-icon-select-bold"></use>
          </svg>
          保存
        </el-button>
        <el-button type="info" @click="closeDrawer">
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
const { shell, clipboard } = require('electron')
import { ElMessage } from 'element-plus'
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { NButton, NSpace, NH3 } from 'naive-ui'

import { mapState, mapActions } from 'vuex'

export default {
  components: {
    NButton,
    NSpace,
    NH3
  },
  inject: ['refresh'],
  props: {
    //从父组件获取图集信息
    contentArr: {
      type: Object,
      required: true
    },
    currentPage: {
      type: Number,
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
        createDateFormat: '',
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
      contextMainMenuTemplate: [],
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
    },
    //监听页签变化，当页签变化时重新载入页面
    currentPage: {
      handler(newValue, oldValue) {
        this.targetVal = 0
        this.getImgHeight()
      }
    }
  },
  created() {
    this.getImgHeight()
  },
  mounted() {
    //监听键盘与鼠标（CTRL+鼠标滚轮）实现瀑布流图片缩放
    this.keyDownAndScroll()
  },
  methods: {
    ...mapActions('img-col', ['getImageTag', 'updateImageInfo', 'getMainColor', 'deleteImage']),
    //上传图书
    addImage() {
      this.$parent.$parent.addImage()
    },
    //初始化页面
    initPage() {
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

    initMainMenuTemplate(item) {
      this.contextMainMenuTemplate = [
        { label: '图片详情', click: this.openImagePlayer, data: item },
        { label: '打开图片', click: this.openFile, data: item.imagePath },
        { label: '复制路径', click: this.copyText, data: item.imagePath },
        { label: '打开文件夹', click: this.openFolder, data: item.imagePath },
        { type: 'separator' },
        { label: '删除图片', click: this.deleteImg, data: item }
      ]
    },
    deleteImg(item) {
      this.$confirm('此操作将永久删除该文件（包括本地文件）, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var imageID = item.data.imageID
          this.deleteImage({ imageID }).then((response) => {
            this.refresh()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openImagePlayer(item) {
      var data = item.data
      this.$router.push('/jile/image-player?image_id=' + data.imageID)
    },
    openFile(item) {
      shell.openPath(item.data)
    },
    openFolder(item) {
      shell.showItemInFolder(item.data)
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
    rtClickOpenMainMenu(item) {
      this.initMainMenuTemplate(item)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMainMenuTemplate)
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
    showContentArr() {
      console.log(this.contentArr)
    },
    //调用父组件方法，同步数据库
    refreshIc() {
      this.$parent.$parent.refreshIc()
    },
    //异步获取图像宽高等基本信息
    async getImgHeight() {
      //在异步方法下的this与JS全局中的this意义不同，
      //所以在方法开始时重新定义全局this变量用来获得全局数据
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
      }
    },

    //初始化（重载）页面瀑布流
    init() {
      this.columns = []
      let contentLen = this.contentArr.length
      //判断长度 处理空数据库情况
      if (contentLen != 0) {
        // let contentLen = this.pageSize
        // 根据可视区域的宽度判断需要几列
        let cWidth = document.documentElement.clientWidth || document.body.clientWidth
        // 假设图片宽度为240px
        let cLen = Math.floor(cWidth / (this.itemWidth + 20) - 1)

        // 初始化每一列的第一行元素  此处要注意判断如果整个图库数量很少 少于行数则会出现初始化问题，所以要判断 i < contentLen
        for (let i = 0; i < cLen && i < contentLen; i++) {
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
    },

    //图像放大（宽度加10）
    enlargeImage() {
      if (this.itemWidth < 370) {
        this.itemWidth += 10
        this.refreshImageHeight()
        this.init()
      } else {
        ElMessage({
          showClose: true,
          message: '不能再大啦😭',
          type: 'error'
        })
      }
    },
    //图片缩小（宽度减10）
    decreaseImage() {
      if (this.itemWidth > 120) {
        this.itemWidth -= 10
        this.refreshImageHeight()
        this.init()
      } else {
        ElMessage({
          showClose: true,
          message: '已经很小喽👿',
          type: 'error'
        })
      }
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
                this.enlargeImage()
              } else {
                // 缩小
                this.decreaseImage()
              }
            }
          },
          false
        )
    },

    openDrawer(item) {
      this.ImgColor(item.thumbnail)
      //获取对象 避免浅拷贝
      let _tmp = JSON.stringify(item) //将对象转换为json字符串形式
      this.imageInfo = JSON.parse(_tmp) //将转换而来的字符串转换为原生js对象
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
          this.imageInfo.createDateFormat =
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
          this.imageInfo.createDateFormat =
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
        this.imageInfo.createDateFormat =
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
      //获取Tag列表
      var imageID = this.imageInfo.imageID
      this.getImageTag({ imageID }).then((response) => {
        this.imageInfo.tags = response.data
        this.imageDrawer = true
      })
    },

    closeDrawer() {
      this.imageDrawer = false
    },

    //分析图片主色调
    ImgColor(filePath) {
      // this.url = 'I:\\JiLeFile\\test1\\73599890_p0.png'
      var data = {
        filePath: filePath,
        colorCount: 5
      }
      this.getMainColor(data).then((response) => {
        this.colors = response.data
      })
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
    },
    showDrawerConfirm() {
      this.$confirm('是否确定保存修改内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateInfo()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    },
    updateInfo() {
      //保存表单数据
      var info = JSON.parse(JSON.stringify(this.imageInfo))
      this.updateImageInfo(info).then((response) => {
        this.refresh()
      })
    },
    onPercentChange(num) {
      this.percentNum = Math.ceil(num / 10) * 10
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
  overflow: hidden;
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

.imageFigure > img {
  transition: filter 0.4s; /* 改变 opacity 属性，持续1秒 */
}
.imageFigure > img:hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(50%);
  cursor: pointer;
}
.imageFigure {
  transition: transform 0.4s; /* 改变 opacity 属性，持续1秒 */
}

.imageFigure:hover {
  transform: translateY(-10px);
}

.el-input__inner {
  color: black;
}
.el-textarea__inner {
  color: black;
}
</style>