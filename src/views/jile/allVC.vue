<template>
  <el-scrollbar style="height: 100%; padding: 10px">
    <div v-if="randomVideoList.length == randomNum" style="width: 80%; margin: 0 auto; text-align: center">
      <h1 style="margin: 10px"><strong>随机推荐</strong></h1>
      <el-carousel trigger="click" :interval="3000" type="card" height="300px">
        <el-carousel-item v-for="item in randomVideoList" :key="item" @click="openVideo(item.videoPath)">
          <div>
            <el-image
              v-if="item.videoCover != null && item.videoCover != ''"
              :src="item.videoCover"
              style="width: 100%; height: 300px"
              fit="cover"
            ></el-image>
            <img
              v-else
              style="object-fit: cover; width: 100%; height: 300px"
              src="/src/assets/pic/video-default-horizontal.png"
              @click="openFile(item.video_path)"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div>
      <el-row :gutter="15">
        <el-col v-for="(item, id) in vcList" :key="id" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div
            class="vc_card"
            @click="$router.push('/jile/video-cover?vc_id=' + item.id)"
            @contextmenu="rtClickOpenMenu(item)"
          >
            <el-image
              v-if="item.vc_cover != null && item.vc_cover != ''"
              fit="cover"
              class="vc_cover"
              :src="item.vc_cover"
            ></el-image>
            <img v-else style="object-fit: cover" class="vc_cover" src="/src/assets/pic/book.png" />
            <div style="float: left; width: calc(100% - 150px)">
              <h2 id="vc_title">
                <strong>{{ item.vc_name }}</strong>
              </h2>
              <p v-if="item.vc_desc != null && item.vc_desc != ''" class="vc_desc">{{ item.vc_desc }}</p>
              <p v-else class="vc_desc">{{ defaultDesc }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="vc_card" style="text-align: center" @click="addVcDialog">
            <svg class="icon" aria-hidden="true" style="width: 80px; height: 80px; margin-top: 35px; color: #67716e">
              <use xlink:href="#yw-icon-add-bold"></use>
            </svg>
          </div>
        </el-col>
      </el-row>
    </div>

    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="影视集信息">
        <el-form :model="vc_info">
          <el-form-item
            prop="vc_name"
            label="影视集名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '影视集名称不能为空' }]"
          >
            <el-input v-model="vc_info.vc_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="影视集简介" :label-width="formLabelWidth">
            <el-input
              v-model="vc_info.vc_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
          <el-form-item
            label="选择文件夹"
            :label-width="formLabelWidth"
            prop="vc_path"
            :rules="[{ required: true, trigger: 'change', message: '影视集名称不能为空' }]"
          >
            <el-input v-model="vc_info.vc_path" placeholder="请选择文件夹" readonly class="input-with-select">
              <template #append>
                <el-button type="warning" @click="chooseFiles">
                  点击选择
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#yw-icon-folder-close"></use>
                  </svg>
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="vc_cover">
            <el-input v-model="vc_info.vc_cover" placeholder="请选择图集封面图" readonly class="input-with-select">
              <template #append>
                <el-button type="warning" @click="chooseCover">
                  点击选择
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#yw-icon-file"></use>
                  </svg>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="vc_info.vc_cover != '' && vc_info.vc_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="vc_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="vc_info.vc_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addVcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div id="editDialog">
      <el-dialog v-model="editDialogFormVisible" title="编辑影集信息">
        <el-form :model="edit_vc_info">
          <el-form-item label="文件夹地址" :label-width="formLabelWidth" prop="vc_path">
            {{ edit_vc_info.vc_path }}
          </el-form-item>
          <el-form-item
            prop="vc_name"
            label="影集名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '影集名称不能为空' }]"
          >
            <el-input v-model="edit_vc_info.vc_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="影集简介" :label-width="formLabelWidth">
            <el-input
              v-model="edit_vc_info.vc_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>

          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="vc_cover">
            <el-input v-model="edit_vc_info.vc_cover" placeholder="请选择影集封面图" readonly class="input-with-select">
              <template #append>
                <el-button type="warning" @click="reChooseCover">
                  点击选择
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#yw-icon-file"></use>
                  </svg>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="edit_vc_info.vc_cover != '' && edit_vc_info.vc_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="vc_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="edit_vc_info.vc_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateVcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script>
import { ElMessage } from 'element-plus'
const { shell } = require('electron')
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'
export default {
  inject: ['refresh'],
  data() {
    return {
      editDialogFormVisible: false,
      contextMenuTemplate: [],
      randomNum: 10,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      vc_info: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        vc_cover: '',
        id: 0
      },
      vcList: [
        {
          vc_name: '',
          vc_path: '',
          vc_desc: '',
          vc_cover: '',
          id: 0
        }
      ],
      radio: '',
      res_data: '',

      randomVideoList: [
        {
          videoID: 0,
          videoName: '',
          videoPath: '',
          videoCover: ''
        }
      ],
      
      edit_vc_info: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        id: 0,
        vc_cover: ''
      },
    }
  },

  created() {
    this.getRandomVideoList(this.randomNum)
    this.getVcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('video-col', ['addVc', 'getVc', 'getRandomVideo', 'deleteVC','updateVC']),
    getRandomVideoList(num) {
      this.getRandomVideo({ num }).then((response) => {
        this.randomVideoList = response.data
        this.randomNum = response.data.length
      })
    },
    addVcTest() {
      if (this.vc_info.vc_name == '' || this.vc_info.vc_name == null) {
        ElMessage({
          message: '影视集名称不能为空！',
          type: 'error'
        })
      } else if (this.vc_info.vc_path == '' || this.vc_info.vc_path == null) {
        ElMessage({
          message: '请选择影视集路径！',
          type: 'error'
        })
      } else {
        this.addVc(this.vc_info).then((response) => {
          this.res_data = response
          console.log('里边：' + this.res_data)
          ElMessage({
            message: response.message,
            type: 'success'
          })
          this.dialogFormVisible = false
          this.refresh()
        })
      }
    },

    getVcTest() {
      this.getVc().then((response) => {
        this.vcList = response.data
      })
    },

    getVcByRadio(radio) {
      if (radio == 0) {
        return '输出全部影视集'
      } else {
        for (var i = 0; i < this.vcList.length; i++) {
          if (this.vcList[i].id == radio) {
            return this.vcList[i]
          }
        }
      }
    },

    chooseFiles() {
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择文件夹',
          properties: ['openDirectory']
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          console.log(result.filePaths[0])
          this.vc_info.vc_path = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openVideo(filePath) {
      // console.log(filePath)
      shell.openPath(filePath)
    },
    updateVcTest() {
      var data = {
        id: this.edit_vc_info.id,
        vc_name: this.edit_vc_info.vc_name,
        vc_desc: this.edit_vc_info.vc_desc,
        vc_cover: this.edit_vc_info.vc_cover,
        vc_path: this.edit_vc_info.vc_path
      }
      this.updateVC(data).then((response) => {
        this.refresh()
      })
    },
    addVcDialog() {
      this.dialogFormVisible = true
    },
    showRadioValue() {
      console.log(this.radio)
    },

    chooseCover() {
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择封面图',
          properties: ['openFile'],
          filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          console.log(result.filePaths[0])
          this.vc_info.vc_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    initMenuTemplate(item) {
      this.contextMenuTemplate = [
        { label: '打开影集', click: this.openVC, data: item },
        { label: '编辑影集', click: this.editVcDialog, data: item },
        { label: '删除影集', click: this.deleteVideoCol, data: item },
        { type: 'separator' },
        { label: '在文件管理器中打开', click: this.openInFolder, data: item }
      ]
    },
    editVcDialog(item) {
      var video = item.data
      this.edit_vc_info = video
      this.editDialogFormVisible = true
    },
    deleteVideoCol(item) {
      this.$confirm('此操作将删除该影集配置信息和封面等内容，不会删除视频本地文件, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = item.data
          var vc_id = data.id
          this.deleteVC({ vc_id }).then((response) => {
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
    reChooseCover() {
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择封面图',
          properties: ['openFile'],
          filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        })
        .then((result) => {
          if (!result) return //为空情况下表示未选择文件夹，直接return结束函数
          console.log(result.filePaths[0])
          this.edit_vc_info.vc_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openInFolder(item) {
      var path = item.data.vc_path
      shell.showItemInFolder(path)
    },
    openVC(item) {
      var data = item.data
      this.$router.push('/jile/video-cover?vc_id=' + data.id)
    },

    rtClickOpenMenu(item) {
      this.initMenuTemplate(item)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
    }
  }
}
</script>

<style scoped>
#vc_title {
  margin: 20px;
  border: 1px solid #efefef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vc_card {
  cursor: pointer;
  margin-top: 20px;
  height: 150px;
  border-radius: 10px;
  background: #efefef;
  transition: transform 0.4s; /* 改变 opacity 属性，持续1秒 */
}

.vc_card:hover {
  transform: translateY(-10px);
}

.vc_desc {
  margin: 20px;
  color: #67716e;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.vc_cover {
  height: 100%;
  width: 150px;
  border-radius: 10px;
  float: left;
  transition: filter 0.4s; /* 改变 opacity 属性，持续1秒 */
}
.vc_cover:hover {
  /**图片变暗 强化点击效果 */
  filter: brightness(50%);
  cursor: pointer;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  border-radius: 10px;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
  border-radius: 10px;
}
</style>