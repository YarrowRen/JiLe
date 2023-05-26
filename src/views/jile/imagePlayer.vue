<template>
  <el-scrollbar style="height: 100%">
    <!--实现background-image背景图片全屏铺满自适应 https://blog.csdn.net/mouday/article/details/121911910-->
    <div
      id="main-div"
      class="main-div"
      :style="{
        backgroundImage:
          'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0)),url(' + imageDetails.imagePath + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '90vh'
      }"
    >
      <!-- <el-image
        class="main-image"
        :src="imageDetails.imagePath"
        :zoom-rate="1.2"
        fit="scale-down"
        :preview-src-list="[imageDetails.imagePath]"
      /> -->
      <el-row>
        <el-col :span="14">
          <el-card style="margin: 20px">
            <div style="width: 100%; height: 500px; text-align: center; line-height: 500px">
              <el-image
                id="main-image"
                :src="imageDetails.imagePath"
                class="main-image"
                fit="scale-down"
                @click="onPreview"
              ></el-image>
            </div>
            <div>
              <el-image-viewer v-if="showViewer" :url-list="[imageDetails.imagePath]" @close="closeViewer" />
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
              <h3 style="text-align: center; margin-bottom: 10px">
                <strong>{{ imageDetails.imageName }}</strong>
              </h3>
            </div>
            <el-divider></el-divider>
            <div style="margin: 0 auto; text-align: center">
              <el-button size="large" style="border-radius: 10px" color="#e7e7e7" @click="capturePage">
                <svg class="icon" aria-hidden="true">
                  <use color="#61666d" xlink:href="#yw-icon-picture"></use>
                </svg>
                <strong style="color: #61666d; margin-left: 5px">截图</strong>
              </el-button>
              <el-button size="large" style="border-radius: 10px" color="#e7e7e7" @click="defaultOpenDir">
                <svg class="icon" aria-hidden="true">
                  <use color="#61666d" xlink:href="#yw-icon-menu"></use>
                </svg>
                <strong style="color: #61666d; margin-left: 5px">文件夹打开</strong>
              </el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <div>
            <el-card style="margin: 20px">
              <div>
                <div class="func-icon" @click="shareToWeibo">
                  <img src="@/assets/pic/weibo.png" />
                </div>
                <div class="func-icon" @click="shareToQQ">
                  <img src="@/assets/pic/QQZone.png" />
                </div>
                <div class="func-icon" @click="copyImagePath">
                  <img src="@/assets/pic/link.png" />
                </div>

                <el-dropdown trigger="click" style="float: right" size="large">
                  <div class="func-icon el-dropdown-link">
                    <img src="@/assets/pic/ellipsis.png" />
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="sameColorListSearch">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#yw-icon-search"></use>
                        </svg>
                        根据主色调搜索相似图片
                      </el-dropdown-item>
                      <el-dropdown-item @click="onPreview">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#yw-icon-fullscreen-expand"></use>
                        </svg>
                        打开预览界面
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <el-divider></el-divider>
              <div>
                <div class="tableItem">
                  <p style="display: inline; margin-right: 5px"><strong>评分：</strong></p>

                  <el-rate v-model="imageDetails.imageScore" disabled style="display: inline"></el-rate>
                </div>

                <div class="tableItem">
                  <p style="display: inline; margin-right: 5px"><strong>链接：</strong></p>

                  <el-link v-if="imageDetails.url != '' && imageDetails.url != null" type="warning" @click="openURL">
                    {{ imageDetails.url }}
                  </el-link>
                  <p v-else style="display: inline">暂无链接</p>
                </div>
                <div class="tableItem">
                  <p style="display: inline; margin-right: 5px"><strong>备注：</strong></p>

                  <p v-if="imageDetails.remark != '' && imageDetails.remark != null" style="display: inline">
                    {{ imageDetails.remark }}
                  </p>
                  <p v-else style="display: inline">暂无备注</p>
                </div>

                <div class="tableItem">
                  <p style="display: inline; margin-right: 5px"><strong>标签：</strong></p>
                  <div v-if="imageDetails.tags.length != 0" style="display: inline">
                    <div v-for="tag in imageDetails.tags" :key="tag.id" style="display: inline; margin-right: 5px">
                      <el-tag size="large" type="info">
                        {{ tag.tag_name }}
                      </el-tag>
                    </div>
                  </div>
                  <div v-else style="display: inline" class="tagList">暂无标签</div>
                </div>

                <div class="tableItem">
                  <p style="display: inline; margin-right: 5px"><strong>创建日期：</strong></p>

                  <p style="display: inline">{{ imageDetails.createDateFormat }}</p>
                </div>
              </div>
              <el-divider></el-divider>
              <div>
                <el-row>
                  <el-col :span="12">
                    <div class="tableItem">
                      <p style="display: inline; margin-right: 5px"><strong>分辨率：</strong></p>

                      {{ imageDetails.width }} x {{ imageDetails.height }}
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="tableItem">
                      <p style="display: inline; margin-right: 5px"><strong>文件类型：</strong></p>

                      {{ imageDetails.suffix }}
                    </div>
                  </el-col>
                </el-row>
              </div>
              <el-divider></el-divider>
              <div>
                <el-button size="large" style="border-radius: 25px" class="playButton" @click="defaultOpenImage">
                  <svg class="icon" aria-hidden="true">
                    <use color="white" xlink:href="#yw-icon-arrow-right-filling"></use>
                  </svg>
                  <strong style="color: white; margin-left: 5px">默认打开</strong>
                </el-button>

                <el-button
                  v-if="imageDetails.followed == 0"
                  size="large"
                  style="border-radius: 25px"
                  color="#fa3841"
                  @click="changeFollowed"
                >
                  <svg class="icon" aria-hidden="true">
                    <use color="white" xlink:href="#yw-icon-favorite-filling"></use>
                  </svg>
                  <strong style="color: white; margin-left: 5px">收藏</strong>
                </el-button>
                <el-button
                  v-if="imageDetails.followed == 1"
                  size="large"
                  style="border-radius: 25px"
                  color="#e7e7e7"
                  @click="changeFollowed"
                >
                  <svg class="icon" aria-hidden="true">
                    <use color="#99999b" xlink:href="#yw-icon-favorite-filling"></use>
                  </svg>
                  <strong style="color: #99999b; margin-left: 5px">已收藏</strong>
                </el-button>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapState, mapActions } from 'vuex'
const remote = require('@electron/remote')
const { shell, clipboard } = require('electron')
import { ElMessage } from 'element-plus'
const { Menu } = remote
export default {
  inject: ['refresh'],
  data() {
    return {
      formLabelWidth: '80px',
      showViewer: false,
      imageID: 0,
      colors: [],
      imageDetails: {
        height: 0,
        width: 0,
        suffix: '',
        createDateFormat: '',
        ic_id: 0,
        imageID: 0,
        imageName: '',
        imagePath: '',
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
        ]
      }
    }
  },
  created() {
    var imageID = this.$route.query.image_id //获取编号
    this.imageID = imageID
    // this.imageID=141
    this.getDetails(this.imageID)

    this.getImageHeightAndWidth()
  },
  mounted() {
    // this.ImgColor()
  },
  methods: {
    ...mapActions('img-col', ['getImageDetails', 'changeFollowedState', 'getMainColor']),

    getDetails() {
      var imageID = this.imageID
      this.getImageDetails({ imageID }).then((response) => {
        this.imageDetails = response.data

        //单独处理文件地址，避免使用时出现/\转义错误
        //https://blog.csdn.net/tonysh_zds/article/details/127439840
        var path = response.data.imagePath
        var newFilPath = path.replace(/\\/g, '/')
        this.imageDetails.imagePath = newFilPath
        var temp_thumb = response.data.thumbnail
        var newThumbnail = temp_thumb.replace(/\\/g, '/')
        this.imageDetails.thumbnail = newThumbnail
        //获取照片主色调
        this.ImgColor(this.imageDetails.thumbnail)
        //获取文件后缀并转换为大写
        this.imageDetails.suffix = this.imageDetails.imageName
          .substring(this.imageDetails.imageName.lastIndexOf('.') + 1)
          .toLocaleUpperCase()
        //格式化日期
        var date = new Date(this.imageDetails.createDate)
        //date.getMonth获取到的是0~11中的数字，所以格式化时要对月份单独+1
        if (date.getMonth() + 1 < 10) {
          //月份补0
          if (date.getMinutes() < 10) {
            //分钟前补0
            this.imageDetails.createDateFormat =
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
            this.imageDetails.createDateFormat =
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
          this.imageDetails.createDateFormat =
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
        //获取宽高数据
        this.getImageHeightAndWidth()
      })
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

    //异步获取图像宽高等基本信息
    async getImageHeightAndWidth() {
      //在异步方法下的this与JS全局中的this意义不同，
      //所以在方法开始时重新定义全局this变量用来获得全局数据
      let sel = this
      let img = new Image() //初始化图像对象
      //获取指定图像（在请求路径后加入随机数保证强制刷新请求）
      img.src = this.imageDetails.imagePath + '?' + Date.parse(new Date())
      //利用promise异步构造获取图像宽高等基本信息
      var promise = new Promise((reslove) => {
        img.onload = function () {
          let width = img.width
          let height = img.height
          //将长度作为返回值传递出去
          let data = {
            height: height,
            width: width
          }
          reslove(data)
        }
      })
      await promise
      //等待异步方法执行完成后，对图片列表数据进行刷新
      promise.then(function (data) {
        sel.imageDetails.height = data.height
        sel.imageDetails.width = data.width
      })
    },

    copyText(item) {
      clipboard.writeText(item.data)
      ElMessage({
        showClose: true,
        message: '已复制成功.',
        type: 'success'
      })
    },
    copyImagePath() {
      //   var image = nativeImage.createFromPath(this.imageDetails.imagePath)
      //   console.log(image.getSize())
      clipboard.writeText(this.imageDetails.imagePath)
      ElMessage({
        showClose: true,
        message: '已复制图片路径.',
        type: 'success'
      })
    },

    sameColorSearch(item) {
      // window.open('http://labs.tineye.com/multicolr/#colors=' + item.data + ';weights=100;')
      var url = 'http://labs.tineye.com/multicolr/#colors=' + item.data + ';weights=100;'
      shell.openExternal(url)
    },
    openURL() {
      // window.open(this.imageDetails.url)
      shell.openExternal(this.imageDetails.url)
    },

    sameColorListSearch() {
      var hexList = []
      for (var i = 0; i < this.colors.length; i++) {
        hexList[i] = (
          (1 << 24) +
          (parseInt(this.colors[i][0]) << 16) +
          (parseInt(this.colors[i][1]) << 8) +
          parseInt(this.colors[i][2])
        )
          .toString(16)
          .slice(1)
      }
      shell.openExternal('http://labs.tineye.com/multicolr/#colors=' + hexList.toString())
    },
    rtClickOpenMenu(color) {
      this.initMenuTemplate(color)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
    },
    //分析图片主色调
    ImgColor(filePath) {
      var data = {
        filePath: filePath,
        colorCount: 5
      }
      this.getMainColor(data).then((response) => {
        this.colors = response.data
      })
    },
    onPreview() {
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    defaultOpenImage() {
      shell.openPath(this.imageDetails.imagePath)
    },
    defaultOpenDir() {
      var path = this.imageDetails.imagePath
      //在文件管理器打开比较特殊 只接受\\格式的路径
      var newFilPath = path.replace(/\//g, '\\')
      // console.log(newFilPath)
      shell.showItemInFolder(newFilPath)
    },
    shareToWeibo() {
      //跳转地址
      window.open(
        'https://service.weibo.com/share/share.php?url=' +
          encodeURIComponent(this.imageDetails.url) +
          '&title=发现一张帅气的图片，与你分享🤳--' +
          this.imageDetails.imageName +
          '.'
      )
    },
    shareToQQ() {
      //跳转地址
      window.open(
        'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +
          encodeURIComponent(this.imageDetails.url) +
          '&title=发现一张帅气的图片，与你分享🤳--' +
          this.imageDetails.imageName +
          '.' +
          '&summary=' +
          this.imageDetails.remark
      )
    },
    capturePage() {
      html2canvas(document.querySelector('#main-div'), {
        allowTaint: true, //开启跨域
        useCORS: true,
        scrollY: 0, //设置scrollY，scrollX以确保截屏页面出现滚动条时图片不会只截一半
        scrollX: 0
      }).then((canvas) => {
        var dataURL = canvas.toDataURL()
        // console.log(dataURL)
        this.downCapturePic(dataURL)
        // document.body.appendChild(canvas)
      })
    },
    /**
     * @description 构建a标签，通过a标签下载文件
     * @param dataURL 下载地址
     */
    downCapturePic(dataURL) {
      var a = document.createElement('a')
      a.setAttribute('href', dataURL)
      var name = 'SharePoster_ByJile'
      a.setAttribute('download', name)
      a.setAttribute('target', '_blank')
      let clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    },
    changeFollowed() {
      var imageID = { imageID: this.imageDetails.imageID }
      this.changeFollowedState(imageID).then((response) => {
        this.refresh()
      })
    }
  }
}
</script>

<style scoped>
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

.main-image {
  cursor: pointer;
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.main-image:hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(70%);
}

.func-icon {
  width: 35px;
  height: 35px;
  margin-right: 10px;
  display: inline;
  border-radius: 50%;
}
.func-icon > img {
  width: 35px;
  height: 35px;
}
.func-icon :hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(90%);
  cursor: pointer;
  border-radius: 50%;
  /**背景颜色 */
  background: rgba(0, 0, 0, 0.096);
}

.tableItem {
  margin-bottom: 7px;
}

.playButton {
  background: -webkit-gradient(linear, 100% 0%, 0% 0%, from(#e70920), to(#ff711e));
}
</style>