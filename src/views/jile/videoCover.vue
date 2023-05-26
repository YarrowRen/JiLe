<template>
  <el-scrollbar style="height: 100%; padding: 10px">
    <div>
      <div>
        <div style="width: 100%; height: 35px">
          <el-button color="#2acda0" round style="width: 100px" @click="addVideo">
            <div style="color: white">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#yw-icon-add-bold"></use>
              </svg>
              上传视频
            </div>
          </el-button>
          <el-button type="warning" round style="width: 75px" @click="refreshVc">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#yw-icon-refresh"></use>
            </svg>
            刷新
          </el-button>
          <!-- <el-input
            style="width: calc(100% - 250px); margin-left: 10px; margin-right: 10px"
            v-model="searchValue"
            placeholder="Please input"
          >
            <template #prepend>
              <el-select v-model="searchType" placeholder="Select" style="width: 150px">
                <el-option label="视频名称" value="1" />
                <el-option label="导演" value="2" />
                <el-option label="编剧" value="3" />
                <el-option label="演员" value="4" />
                <el-option label="其他人员" value="4" />
                <el-option label="标签" value="4" />
              </el-select>
            </template>
            <template #append>
              <el-button @click="searchEBookCol">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#yw-icon-search"></use>
                </svg>
              </el-button>
            </template>
          </el-input> -->
          <!-- <el-button type="danger">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#yw-icon-gear"></use>
            </svg>
          </el-button> -->
        </div>
      </div>
      <el-row v-if="videoInfo.length != 0" :gutter="5" class="main-page">
        <el-col v-for="(item, id) in videoInfo" :key="id" :xs="12" :sm="8" :md="8" :lg="6" :xl="6" class="col-card">
          <div :body-style="{ padding: '0px' }" shadow="always" class="videoCard">
            <!-- <figure class="imghvr-shutter-out-diag-1 videoFigure" @contextmenu="rtClickOpenMenu(item.video_id)">
              <img class="videoCover" :src="videoInfo[id].video_cover" />

              <figcaption class="videoFigcaption">
                <img src="@/assets/pic/videoNew.png" class="figcaption-img" @click="openFile(item.video_path)" />
              </figcaption>
            </figure> -->

            <div class="videoFigure" @contextmenu="rtClickOpenMenu(item.video_id)">
              <el-image
                v-if="item.video_cover != null && item.video_cover != ''"
                class="videoCover"
                fit="cover"
                :src="item.video_cover"
                @click="openFile(item.video_path)"
              ></el-image>
              <img
                v-else
                class="videoCover"
                style="object-fit: cover"
                src="/src/assets/pic/video-default-horizontal.png"
                @click="openFile(item.video_path)"
              />
            </div>
            <!-- <div class="videoFigure" @contextmenu="rtClickOpenMenu(item.video_id)">
              <img class="videoCover" :src="videoInfo[id].video_cover" @click="openFile(item.video_path)"/>

              <figcaption class="videoFigcaption">
                <img src="@/assets/pic/videoNew.png" class="figcaption-img"  />
              </figcaption>
            </div> -->

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
                  <div style="cursor: pointer" @click="$router.push('/jile/video-player?video_id=' + item.video_id)">
                    <strong>{{ videoInfo[id].video_name }}</strong>
                  </div>
                </div>
              </el-tooltip>
              <!-- <el-rate v-model="videoInfo[id].video_score" disabled></el-rate> -->
            </div>

            <div style="margin-top: 5px; margin-bottom: 5px; margin-left: 5px; margin-right: 5px">
              <div style="display: inline">
                <el-rate v-model="item.video_score" style="display: inline" disabled />
              </div>
              <el-divider direction="vertical" />
              <div style="display: inline;float:right;margin-right:5px">
                <el-link @click="openDialogForm(item)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#yw-icon-attachment"></use>
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
                    <use xlink:href="#yw-icon-edit"></use>
                  </svg>
                </el-link>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-else style="height: 83vh; text-align: center" class="main-page">
        <img src="@/assets/pic/jile.png" class="cover" style="height: 150px; margin-top: 30vh" />
        <h2>暂无视频</h2>
      </div>

      <div style="text-align: center">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
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

    <el-dialog v-model="videoEditVisible" title="🎞️ 编辑视频信息" width="60%">
      <el-scrollbar max-height="60vh">
        <el-row>
          <el-col :span="6">
            <el-image :src="videoDetails.videoCover" style="aspect-ratio: 57/84; margin: 5px" fit="cover" />
            <div style="width: 100%; text-align: center">
              <el-link target="_blank" @click="selectCoverInDetails">更新封面图/海报</el-link>
            </div>
            <div style="width: 100%; text-align: center">
              <el-button
                v-if="videoDetails.followed == 0"
                type="danger"
                style="width: 80%; margin-top: 10px; text-align: center"
                @click="videoDetails.followed = 1"
              >
                {{ showFollowed }}
              </el-button>
              <el-button
                v-if="videoDetails.followed == 1"
                type="info"
                style="width: 80%; margin-top: 10px; text-align: center"
                @mouseenter="showNotFollowed = '取消收藏'"
                @mouseleave="showNotFollowed = '已收藏'"
                @click="videoDetails.followed = 0"
              >
                {{ showNotFollowed }}
              </el-button>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form :model="videoDetails" :rules="rules">
              <el-form-item label="视频名称" :label-width="formLabelWidth">
                <div>{{ videoDetails.videoName }}</div>
              </el-form-item>
              <el-form-item label="评分" :label-width="formLabelWidth">
                <el-rate
                  v-model="videoDetails.videoScore"
                  :texts="['很差', '较差', '还行', '推荐', '力荐']"
                  show-text
                ></el-rate>
              </el-form-item>
              <el-form-item label="标签" :label-width="formLabelWidth">
                <el-row>
                  <el-tag
                    v-for="tag in videoDetails.tags"
                    :key="tag.id"
                    style="margin-right: 10px; margin-bottom: 10px"
                    size="large"
                    closable
                    :disable-transitions="false"
                    type="success"
                    :hit="true"
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
                  placeholder="选择上映日期"
                  size="default"
                />
              </el-form-item>
              <el-form-item label="相关网址" :label-width="formLabelWidth" prop="url">
                <el-input v-model="videoDetails.url" placeholder="请输入相关网址" size="default"></el-input>
              </el-form-item>
              <el-form-item label="导演" :label-width="formLabelWidth">
                <el-row>
                  <el-tag
                    v-for="director in videoDetails.directorList.list"
                    :key="director.id"
                    style="margin-right: 10px; margin-bottom: 10px"
                    size="large"
                    closable
                    :disable-transitions="false"
                    effect="dark"
                    type="danger"
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
                    :key="author.id"
                    style="margin-right: 10px; margin-bottom: 10px"
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
                    :key="actor.id"
                    style="margin-right: 10px; margin-bottom: 10px"
                    size="large"
                    closable
                    :disable-transitions="false"
                    effect="dark"
                    type="success"
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
                    :key="other.id"
                    style="margin-right: 10px; margin-bottom: 10px"
                    size="large"
                    closable
                    :disable-transitions="false"
                    effect="dark"
                    type="info"
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
      </el-scrollbar>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="showDetailsConfirm">确 认</el-button>

          <el-button @click="videoEditVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <div id="updateDialog">
      <el-dialog
        v-model="updateDialogVisible"
        title="视频上传"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>读取元数据并添加视频中...</span>
        <el-progress :percentage="updatePercentage" />
        <template v-if="updatePercentage == 100" #footer>
          <span class="dialog-footer">
            <el-button type="success" @click="refreshVc">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script >
import 'imagehover.css/scss/imagehover.scss'
import { ElMessage } from 'element-plus'

const { shell } = require('electron')
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'
import SvgIcon from '@/icons/SvgIcon.vue'
const fs = require('fs-extra')

export default {
  components: { SvgIcon },
  inject: ['refresh'],
  data() {
    return {
      updatePercentage: 0,
      searchType: null,
      updateDialogVisible: false,
      searchValue: '',
      starRateIcon: ['👻', '🤡', '😥', '😑', '🥰', '😍'],
      showFollowed: '❤ 收藏',
      showNotFollowed: '已收藏',
      inputValue: '',
      inputDirectorValue: '',
      inputAuthorValue: '',
      inputActorValue: '',
      inputOtherValue: '',
      dialogFormVisible: false,
      videoEditVisible: false,
      vc_id: 1,
      currentPage: 1,
      pageSize: 12,
      totalSize: 0,
      fit: 'cover',
      rules: {
        url: [
          {
            pattern: /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/,
            message: '请输入正确URL格式',
            trigger: 'blur'
          }
        ]
      },
      videoCol: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        vc_cover: '',
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
        url: '',
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
    var vc_id = this.$route.query.vc_id //获取编号
    this.vc_id = vc_id
    this.getFileList(this.vc_id, this.currentPage, this.pageSize)
    // console.log(this.videoInfo.length)
  },
  methods: {
    ...mapActions('video-col', [
      'getFirstVC',
      'refreshVcData',
      'videoRename',
      'videoDelete',
      'editVideoCover',
      'autoGetCover',
      'getVideoDetails',
      'updateVideoDetails',
      'getVideoCol'
    ]),
    getFileList(vc_id, page, pageSize) {
      let pageInfo = {
        vc_id: vc_id,
        page: page,
        pageSize: pageSize
      }
      //重置表单信息
      this.videoInfo.length = 0
      this.getVideoCol(pageInfo).then((response) => {
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

        var fileList = response.data.vc_info.list
        //获取详细影视文件信息列表
        for (var i = 0; i < fileList.length; i++) {
          // console.log(fileList)
          var videoCover = ''
          videoCover = fileList[i].videoCover
          this.videoInfo[i] = {
            video_id: fileList[i].videoID,
            video_name: fileList[i].videoName,
            video_path: this.videoCol.vc_path + '\\' + fileList[i].videoName,
            video_cover: videoCover,
            video_score: fileList[i].videoScore,
            video_tag: fileList[i].videoTag
          }
        }
        //配置分页信息
        this.pageSize = response.data.vc_info.pageSize
        this.currentPage = response.data.vc_info.pageNum
        this.totalSize = response.data.vc_info.total
      })
    },
    handleCurrentChange(val) {
      this.getFileList(this.vc_id, val, this.pageSize)
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
      //删除封面图
      var data = {
        videoID: id,
        coverPath: ''
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

    addVideo() {
      dialog
        .showOpenDialog({
          title: '请选择视频',
          properties: ['openFile', 'multiSelections'],
          filters: [
            {
              name: 'video',
              extensions: [
                'mp4',
                'flv',
                'f4v',
                'webm',
                'm4v',
                'mov',
                'rm',
                'rmvb',
                'wmv',
                'avi',
                'mpg',
                'mpeg',
                'ts',
                'vob'
              ]
            }
          ]
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          //不为空情况下进行复制上传
          //获得拖拽的文件集合
          var files = result.filePaths
          if (files.length > 0) {
            console.log('可以加入')
            this.updateDialogVisible = true
            var destParentPath = this.videoCol.vc_path
            //由于fs.copyFile是异步方法，所以无法通过循环计数i来判断进度
            //所以这里添加变量j作为复制计数
            var j = 0
            for (var i = 0; i < files.length; i++) {
              var filePath = files[i]
              console.log(filePath.substr(filePath.lastIndexOf('\\') + 1))
              var src = filePath
              var dest = destParentPath + '\\' + filePath.substr(filePath.lastIndexOf('\\') + 1)
              fs.copyFile(src, dest, (err) => {
                if (err) throw err
                j += 1
                this.updatePercentage = parseInt((j / files.length) * 100)
              })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
        this.videoDetails.videoScore = response.data.videoScore
        this.videoDetails.intro = response.data.intro
        this.videoDetails.followed = response.data.followed
        this.videoDetails.releaseDate = response.data.releaseDate
        this.videoDetails.tags = response.data.tags
        this.videoDetails.url = response.data.url

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
    },
    showDetailsConfirm() {
      // console.log(this.videoDetails)
      this.$confirm('是否确定保存修改内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateDetails()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    },
    updateDetails() {
      //处理VideoDetails数据，主要是对角色数据进行合并
      var personList = []
      for (var i = 0; i < this.videoDetails.directorList.list.length; i++) {
        var person = new Object()
        person = this.videoDetails.directorList.list[i]
        person.roleID = this.videoDetails.directorList.roleID
        person.roleName = this.videoDetails.directorList.roleName
        personList.push(person)
      }
      for (var i = 0; i < this.videoDetails.authorList.list.length; i++) {
        var person = new Object()
        person = this.videoDetails.authorList.list[i]
        person.roleID = this.videoDetails.authorList.roleID
        person.roleName = this.videoDetails.authorList.roleName
        personList.push(person)
      }
      for (var i = 0; i < this.videoDetails.actorList.list.length; i++) {
        var person = new Object()
        person = this.videoDetails.actorList.list[i]
        person.roleID = this.videoDetails.actorList.roleID
        person.roleName = this.videoDetails.actorList.roleName
        personList.push(person)
      }
      for (var i = 0; i < this.videoDetails.otherList.list.length; i++) {
        var person = new Object()
        person = this.videoDetails.otherList.list[i]
        person.roleID = this.videoDetails.otherList.roleID
        person.roleName = this.videoDetails.otherList.roleName
        personList.push(person)
      }
      //这里用JSON.parse(JSON.stringify());方式进行深拷贝避免删除几个角色列表后表单报错
      var details = JSON.parse(JSON.stringify(this.videoDetails))
      delete details.directorList
      delete details.actorList
      delete details.authorList
      delete details.otherList
      details.personList = personList
      this.updateVideoDetails(details).then((response) => {
        this.videoEditVisible = false
        this.refresh()
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
  border-radius: 15px;
  transition: filter 0.5s; /* 改变 opacity 属性，持续1秒 */
}
.videoCover:hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(50%);
  cursor: pointer;
}
.videoFigure {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
}

.videoFigcaption {
  position: relative;
  background-color: #0000008f !important;
}

.figcaption-img {
  cursor: pointer;
  width: 30%;
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
  margin-bottom: 10px;
  margin-top: 10px;
}

.videoCard {
  margin: 5px;
  margin-bottom: 15px;
}
.videoCard:hover{
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.1);
}
</style>