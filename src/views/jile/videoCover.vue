<template>
  <el-scrollbar style="height: 100%">
    <div>
      <div>
        <el-button @click="showVideoCol">查看VideoCol</el-button>
        <el-button @click="showVideoDetails">查看videoDetails</el-button>
        <el-button @click="getCover">获取封面</el-button>
        <el-button @click="refreshVc">刷新数据库</el-button>
      </div>
      <el-row :gutter="5">
        <el-col v-for="(item, id) in videoInfo" :key="id" :span="4">
          <el-card :body-style="{ padding: '0px' }" shadow="always" style="margin-top: 10px">
            <div
              style="
                text-align: center;
                font-size: 13px;
                margin-top: 8px;
                margin-bottom: 1px;
                margin-left: 8px;
                margin-right: 8px;
              "
            >
              <el-tooltip class="item" effect="dark" :content="videoInfo[id].video_name" placement="top">
                <div id="title">
                  <div>{{ videoInfo[id].video_name }}</div>
                </div>
              </el-tooltip>
              <el-rate v-model="videoInfo[id].video_score" disabled></el-rate>
            </div>

            <!-- 两个块级元素的style目的在于确定方形图片格式 #F5F5F5-->
            <!-- <div
              class="pointer hoverImage"
              style="position: relative; width: 100%; height: 0; padding-top: 100%"
              @contextmenu="rtClickOpenMenu(item.video_id)"
              @click="openFile(item.video_path)"
            >
              <figure class="imghvr-shutter-out-diag-1">
                <img class="videoCover" :src="videoInfo[id].video_cover" />

                <figcaption>这里是你划过后的出来文字 小可爱</figcaption>
              </figure>
            </div> -->
            <figure
              class="imghvr-shutter-out-diag-1 videoFigure"
              @contextmenu="rtClickOpenMenu(item.video_id)"
              @click="openFile(item.video_path)"
            >
              <img class="videoCover" :src="videoInfo[id].video_cover" />

              <figcaption class="videoFigcaption">
                <img src="../../icons/my-icon/videoNew.png" class="figcaption-img" />
              </figcaption>
            </figure>

            <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
              <el-link @click="openDialogForm(item)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-edit"></use>
                </svg>
              </el-link>
              <el-link @click="openFolder(item.video_path)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-folder-close"></use>
                </svg>
              </el-link>
              <el-link @click="deleteFile(item.video_id)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-ashbin"></use>
                </svg>
              </el-link>
              <el-link @click="openVideoInfoDialog(item.video_id)">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-attachment"></use>
                </svg>
              </el-link>

              <div style="float: right">
                <el-checkbox v-model="checkedList[id]"></el-checkbox>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="修改资源名称">
        <el-form :model="reNameForm">
          <el-form-item label="原名称" :label-width="formLabelWidth">
            <div>{{ reNameForm.oldName }}</div>
          </el-form-item>
          <el-form-item label="新名称" :label-width="formLabelWidth">
            <el-input v-model="reNameForm.newName" autocomplete="off">
              <template #append>{{ reNameForm.suffix }}</template>
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFileName">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div id="videoInfoEditDialog">
      <el-dialog v-model="videoEditVisible" title="编辑视频信息">
        <el-scrollbar max-height="60vh">
          <el-row>
            <el-col :span="6">
              <el-image :src="videoDetails.videoCover" style="aspect-ratio: 57/84; margin: 5px" fit="cover" />
              <div style="width: 100%; text-align: center">
                <el-link @click="selectCoverInDetails" target="_blank">更新封面图/海报</el-link>
              </div>
            </el-col>
            <el-col :span="18">
              <el-form :model="videoDetails">
                <el-form-item label="视频名称" :label-width="formLabelWidth">
                  <div>{{ videoDetails.videoName }}</div>
                </el-form-item>
                <el-form-item label="评分" :label-width="formLabelWidth">
                  <el-rate
                    :texts="['很差', '较差', '还行', '推荐', '力荐']"
                    show-text
                    v-model="videoDetails.videoScore"
                  ></el-rate>
                </el-form-item>
                <el-form-item label="标签" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="tag in videoDetails.tags"
                      style="margin-right: 10px; margin-bottom: 10px"
                      :key="tag.id"
                      size="large"
                      closable
                      :disable-transitions="false"
                      type="success"
                      effect="plain"
                      @close="handleTagClose(videoDetails.videoID, tag)"
                    >
                      {{ tag.tag_name }}
                    </el-tag>
                    <el-col :span="9">
                      <el-input
                        v-model="inputValue"
                        size="small"
                        placeholder="请输入标签"
                        @keyup.enter="handleInputConfirm"
                        @blur="handleInputConfirm"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="上映日期" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="videoDetails.releaseDate"
                    type="date"
                    placeholder="Pick a day"
                    size="default"
                  />
                </el-form-item>
                <el-form-item label="导演" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="director in videoDetails.directorList.list"
                      style="margin-right: 10px; margin-bottom: 10px"
                      :key="director.id"
                      size="large"
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="warning"
                      @close="handleDirectorClose(videoDetails.videoID, director)"
                    >
                      {{ director.name }}
                    </el-tag>
                    <el-col :span="9">
                      <el-input
                        v-model="inputDirectorValue"
                        size="small"
                        placeholder="请输入导演名称"
                        @keyup.enter="handleDirectorConfirm"
                        @blur="handleDirectorConfirm"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="编剧/作者" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="author in videoDetails.authorList.list"
                      style="margin-right: 10px; margin-bottom: 10px"
                      :key="author.id"
                      size="large"
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="warning"
                      @close="handleAuthorClose(videoDetails.videoID, author)"
                    >
                      {{ author.name }}
                    </el-tag>
                    <el-col :span="9">
                      <el-input
                        v-model="inputAuthorValue"
                        size="small"
                        placeholder="请输入编剧/作者名称"
                        @keyup.enter="handleAuthorConfirm"
                        @blur="handleAuthorConfirm"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="演员" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="actor in videoDetails.actorList.list"
                      style="margin-right: 10px; margin-bottom: 10px"
                      :key="actor.id"
                      size="large"
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="warning"
                      @close="handleActorClose(videoDetails.videoID, actor)"
                    >
                      {{ actor.name }}
                    </el-tag>
                    <el-col :span="9">
                      <el-input
                        v-model="inputActorValue"
                        size="small"
                        placeholder="请输入演员名称"
                        @keyup.enter="handleActorConfirm"
                        @blur="handleActorConfirm"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="其他人员" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="other in videoDetails.otherList.list"
                      style="margin-right: 10px; margin-bottom: 10px"
                      :key="other.id"
                      size="large"
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="warning"
                      @close="handleOtherClose(videoDetails.videoID, other)"
                    >
                      {{ other.name }}
                    </el-tag>
                    <el-col :span="9">
                      <el-input
                        v-model="inputOtherValue"
                        size="small"
                        placeholder="请输入其他人员名称"
                        @keyup.enter="handleOtherConfirm"
                        @blur="handleOtherConfirm"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="简介" :label-width="formLabelWidth">
                  <el-input
                    v-model="videoDetails.intro"
                    :autosize="{ minRows: 3, maxRows: 9 }"
                    maxlength="350"
                    placeholder="Please input"
                    show-word-limit
                    type="textarea"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="videoEditVisible = false">取 消</el-button>
            </div>
          </template>
        </el-scrollbar>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script >
import 'imagehover.css/scss/imagehover.scss'
import { ElMessage } from 'element-plus'

const { shell } = require('electron')
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      inputValue: '',
      inputDirectorValue: '',
      inputAuthorValue: '',
      inputActorValue: '',
      inputOtherValue: '',
      dialogFormVisible: false,
      videoEditVisible: false,
      fit: 'cover',
      defaultCover: 'src/icons/my-icon/video-o.svg',
      videoCol: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        id: ''
      },
      videoInfo: [
        {
          video_id: 0,
          video_name: '',
          video_path: '',
          video_cover: '',
          video_tag: [],
          video_score: 0
        }
      ],
      checkedList: [],
      reNameForm: {
        videoID: 0,
        videoPath: '',
        oldName: '',
        newName: '',
        suffix: ''
      },
      videoDetails: {
        vc_id: 0,
        videoID: 0,
        videoName: '',
        videoCover: '',
        videoScore: 0,
        intro: '',
        followed: 0,
        releaseDate: '',
        tags: [
          {
            id: 0,
            tag_name: ''
          }
        ],
        directorList: {
          roleID: 1,
          roleName: '导演',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        authorList: {
          roleID: 2,
          roleName: '编剧',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        actorList: {
          roleID: 3,
          roleName: '演员',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        },
        otherList: {
          roleID: 4,
          roleName: '其他',
          list: [
            {
              id: 0,
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ]
        }
      },
      coverSavePath: 'I:\\JiLeFile\\video\\cover',
      formLabelWidth: '80px',
      contextMenuTemplate: [],
      filtersList: {
        imageFilters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
      }
    }
  },
  created() {
    this.getFileList()
  },
  inject: ['refresh'],
  methods: {
    ...mapActions('video-col', [
      'addVc',
      'getVc',
      'getVideoCover',
      'getFirstVC',
      'refreshVcData',
      'videoRename',
      'videoDelete',
      'editVideoCover',
      'autoGetCover',
      'getVideoDetails'
    ]),
    getFileList() {
      this.getFirstVC().then((response) => {
        // console.log(response.data)
        this.videoCol = response.data
        // console.log(this.videoCol)

        //注意这里使用Sync同步方法才能获取到返回的文件值
        //使用异步方法（readdir）由于不能确定结果返回时间，所以无法在外部得到文件列表，只能进行内部处理
        // this.fileList = fs.readdirSync(this.videoCol.vc_path)

        // for (var i = 0; i < this.fileList.length; i++) {
        //   // console.log(this.videoInfo[i])
        //   this.videoInfo[i]={
        //     video_name: this.fileList[i],
        //     video_path: this.videoCol.vc_path + '\\' + this.fileList[i],
        //     video_cover: this.defaultCover
        //   }
        // }

        var fileList = response.data.video_list
        //获取详细影视文件信息列表
        for (var i = 0; i < fileList.length; i++) {
          // console.log(fileList)
          var videoCover = ''
          if (fileList[i].videoCover == null || fileList[i].videoCover == '') {
            videoCover = this.defaultCover
          } else {
            videoCover = fileList[i].videoCover
          }
          this.videoInfo[i] = {
            video_id: fileList[i].videoID,
            video_name: fileList[i].videoName,
            video_path: this.videoCol.vc_path + '\\' + fileList[i].videoName,
            video_cover: videoCover,
            video_score: fileList[i].videoScore,
            video_tag: fileList[i].videoTag
          }
        }
      })
    },
    getCover() {
      // console.log(this.videoCol)
      // console.log(this.coverSavePath)
      this.getVideoCover(this.videoCol).then((response) => {
        let resList = response.data
        for (var i = 0; i < this.videoInfo.length; i++) {
          for (var j = 0; j < resList.length; j++) {
            if (resList[j].videoName == this.videoInfo[i].video_name) {
              this.videoInfo[i].video_cover = resList[j].coverPath
            }
          }
        }
      })
    },
    selectCover(item) {
      var id = item.id
      console.log(id)
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择视频封面',
          properties: ['openFile'],
          filters: this.filtersList.imageFilters
        })
        .then((result) => {
          if (!result || result.filePaths.length == 0) return //为空情况下表示未选择文件，直接return结束函数
          var data = {
            videoID: id,
            coverPath: result.filePaths[0]
          }
          console.log(data)
          this.editVideoCover(data).then((response) => {
            this.refresh()
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteCover(item) {
      var id = item.id
      console.log(id)
      // this.videoInfo[id].video_cover = this.defaultCover
      //将视频封面图设为默认图
      var data = {
        videoID: id,
        coverPath: this.defaultCover
      }
      this.editVideoCover(data).then((response) => {
        this.refresh()
      })
    },
    initMenuTemplate(id) {
      this.contextMenuTemplate = [
        { label: '选择封面图', click: this.selectCover, id: id },
        { label: '自动生成封面图', click: this.autoCover, id: id },
        { label: '删除封面图', click: this.deleteCover, id: id },
        { type: 'separator' }
      ]
    },
    chooseFiles() {
      const { dialog } = require('@electron/remote')
      // Electron 10之后下面这种引入方法已经不可用了，使用上面的方法，这个是需要注意的
      // const { BrowserWindow } = require('electron').remote;

      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择文件夹',
          properties: ['openDirectory']
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          console.log(result.filePaths[0])
          this.dicPath = result.filePaths[0]

          //选择文件夹后读取文件夹下所有文件（只读取到第一级）
          this.getFileList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openFile(path) {
      shell.openPath(path)
    },
    openFolder(path) {
      shell.showItemInFolder(path)
    },
    showVideoCol() {
      console.log(this.videoCol)
    },
    autoCover(item) {
      var videoID = item.id
      this.autoGetCover({ videoID }).then((response) => {
        this.refresh()
      })
    },
    deleteFile(videoID) {
      //shell.trashItem(path)
      this.$confirm('此操作将永久删除该文件（包括本地文件）, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // shell.trashItem(path)
          this.videoDelete({ videoID }).then((response) => {
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
    openDialogForm(video) {
      this.reNameForm.videoID = video.video_id
      this.reNameForm.oldName = video.video_name
      this.reNameForm.videoPath = video.video_path
      //获取文件后缀
      this.reNameForm.suffix = video.video_name.substring(video.video_name.lastIndexOf('.'))
      this.dialogFormVisible = true
    },
    openVideoInfoDialog(videoID) {
      //重置表单信息
      this.videoDetails = this.$options.data().videoDetails
      this.inputValue = ''
      this.getVideoDetails({ videoID }).then((response) => {
        //处理初始表单
        this.videoDetails.vc_id = response.data.vc_id
        this.videoDetails.videoID = response.data.videoID
        this.videoDetails.videoName = response.data.videoName
        this.videoDetails.videoCover = response.data.videoCover
        this.videoDetails.intro = response.data.intro
        this.videoDetails.followed = response.data.followed
        this.videoDetails.releaseDate = response.data.releaseDate
        this.videoDetails.tags = response.data.tags

        var pList = response.data.personList
        var directors = []
        var authors = []
        var actors = []
        var others = []
        // console.log(this.videoDetails.tags)
        //处理角色表单数据
        for (var i = 0; i < pList.length; i++) {
          console.log(pList[i])
          var person = pList[i]
          if (person.roleID == 1) {
            directors.push(person)
          } else if (person.roleID == 2) {
            authors.push(person)
          } else if (person.roleID == 3) {
            actors.push(person)
          } else if (person.roleID == 4) {
            others.push(person)
          }
        }
        this.videoDetails.directorList.list = directors
        this.videoDetails.actorList.list = actors
        this.videoDetails.authorList.list = authors
        this.videoDetails.otherList.list = others
      })
      this.videoEditVisible = true
    },
    editFileName() {
      this.dialogFormVisible = false //关闭dialog页面
      var form = this.reNameForm
      var data = {
        newName: form.newName + form.suffix,
        videoID: form.videoID
      }
      this.videoRename(data).then((response) => {
        var code = response.code
        if (code != 20000) {
          // console.log(response.message)
          ElMessage.error(response.message)
        } else {
          this.refresh()
        }
      })
      //重置表单信息
      this.reNameForm = this.$options.data().reNameForm
    },
    rtClickOpenMenu(id) {
      this.initMenuTemplate(id)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
    },
    refreshVc() {
      var vcID = this.videoCol.id
      this.refreshVcData({ vcID }).then((response) => {
        //重新加载页面--使用provide和inject 普通刷新 不会使页面出现短暂的空白，体验效果比较好
        // (vue5种方式实现页面"刷新") https://www.jianshu.com/p/b9b7eae48f45
        this.refresh()
      })
    },
    showReNameForm() {
      console.log(this.reNameForm)
    },
    showVideoDetails() {
      console.log(this.videoDetails)
    },
    handleTagClose(videoID, tag) {
      for (var i = 0; i < this.videoDetails.tags.length; i++) {
        if (this.videoDetails.tags[i].id == tag.id && this.videoDetails.tags[i].tag_name == tag.tag_name) {
          this.videoDetails.tags.splice(i, 1)
          break
        }
      }
    },
    handleDirectorClose(videoID, director) {
      for (var i = 0; i < this.videoDetails.directorList.list.length; i++) {
        if (
          this.videoDetails.directorList.list[i].id == director.id &&
          this.videoDetails.directorList.list[i].name == director.name
        ) {
          this.videoDetails.directorList.list.splice(i, 1)
          break
        }
      }
    },
    handleAuthorClose(videoID, author) {
      for (var i = 0; i < this.videoDetails.authorList.list.length; i++) {
        if (
          this.videoDetails.authorList.list[i].id == author.id &&
          this.videoDetails.authorList.list[i].name == author.name
        ) {
          this.videoDetails.authorList.list.splice(i, 1)
          break
        }
      }
    },
    handleActorClose(videoID, actor) {
      for (var i = 0; i < this.videoDetails.actorList.list.length; i++) {
        if (
          this.videoDetails.actorList.list[i].id == actor.id &&
          this.videoDetails.actorList.list[i].name == actor.name
        ) {
          this.videoDetails.actorList.list.splice(i, 1)
          break
        }
      }
    },
    handleOtherClose(videoID, other) {
      for (var i = 0; i < this.videoDetails.otherList.list.length; i++) {
        if (
          this.videoDetails.otherList.list[i].id == other.id &&
          this.videoDetails.otherList.list[i].name == other.name
        ) {
          this.videoDetails.otherList.list.splice(i, 1)
          break
        }
      }
    },
    handleInputConfirm() {
      if (this.inputValue) {
        var tag = {
          id: 0,
          tag_name: this.inputValue
        }
        //确认不存在相同值的情况下再加入
        var i = 0
        for (i = 0; i < this.videoDetails.tags.length; i++) {
          if (this.inputValue == this.videoDetails.tags[i].tag_name) {
            break
          }
        }
        if (i == this.videoDetails.tags.length) {
          this.videoDetails.tags.push(tag)
        }
      }
      this.inputValue = ''
    },
    handleDirectorConfirm() {
      if (this.inputDirectorValue) {
        var director = {
          id: 0,
          name: this.inputDirectorValue
        }
        var i = 0
        for (i = 0; i < this.videoDetails.directorList.list.length; i++) {
          if (this.inputDirectorValue == this.videoDetails.directorList.list[i].name) {
            break
          }
        }
        if (i == this.videoDetails.directorList.list.length) {
          this.videoDetails.directorList.list.push(director)
        }
      }
      this.inputDirectorValue = ''
    },

    handleAuthorConfirm() {
      if (this.inputAuthorValue) {
        var author = {
          id: 0,
          name: this.inputAuthorValue
        }
        var i = 0
        for (i = 0; i < this.videoDetails.authorList.list.length; i++) {
          if (this.inputAuthorValue == this.videoDetails.authorList.list[i].name) {
            break
          }
        }
        if (i == this.videoDetails.authorList.list.length) {
          this.videoDetails.authorList.list.push(author)
        }
      }
      this.inputAuthorValue = ''
    },
    handleActorConfirm() {
      if (this.inputActorValue) {
        var actor = {
          id: 0,
          name: this.inputActorValue
        }
        var i = 0
        for (i = 0; i < this.videoDetails.actorList.list.length; i++) {
          if (this.inputActorValue == this.videoDetails.actorList.list[i].name) {
            break
          }
        }
        if (i == this.videoDetails.actorList.list.length) {
          this.videoDetails.actorList.list.push(actor)
        }
      }
      this.inputActorValue = ''
    },
    handleOtherConfirm() {
      if (this.inputOtherValue) {
        var other = {
          id: 0,
          name: this.inputOtherValue
        }
        var i = 0
        for (i = 0; i < this.videoDetails.otherList.list.length; i++) {
          if (this.inputOtherValue == this.videoDetails.otherList.list[i].name) {
            break
          }
        }
        if (i == this.videoDetails.otherList.list.length) {
          this.videoDetails.otherList.list.push(other)
        }
      }
      this.inputOtherValue = ''
    },
    selectCoverInDetails() {
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择视频封面或海报图',
          properties: ['openFile'],
          filters: this.filtersList.imageFilters
        })
        .then((result) => {
          if (!result || result.filePaths.length == 0) return //为空情况下表示未选择文件，直接return结束函数

          this.videoDetails.videoCover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss">
/* element滚动条组件 隐藏水平滚动条 */
.sidebar-wrapper .el-scrollbar__wrap {
  overflow-x: hidden;
}
.is-horizontal {
  display: none;
}
.videoCover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.videoFigure {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
}

.videoFigcaption {
  position: relative;
  background-color: #0000008f !important;
}

.figcaption-img {
  cursor: pointer;
  opacity: 0.9;
  width: 50%;
  height: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#title {
  width: 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  //background-color: red($color: #cfcbcb);
}
</style>