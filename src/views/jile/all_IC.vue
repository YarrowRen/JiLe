<template>
  <el-scrollbar style="height: 100%; padding: 10px">
    <div v-if="randomImageList.length == randomNum" style="width: 80%; margin: 0 auto; text-align: center">
      <h1 style="margin: 10px"><strong>随机推荐</strong></h1>
      <el-carousel trigger="click" :interval="3000" type="card" height="300px">
        <el-carousel-item v-for="item in randomImageList" :key="item" @click="openFile(item.imagePath)">
          <div>
            <el-image :src="item.imagePath" style="width: 100%; height: 300px" fit="cover"></el-image>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div>
      <el-row :gutter="15">
        <el-col v-for="(item, id) in icList" :key="id" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div
            class="ic_card"
            @click="$router.push('/jile/waterfall?ic_id=' + item.id)"
            @contextmenu="rtClickOpenMenu(item)"
          >
            <el-image
              v-if="item.ic_cover != null && item.ic_cover != ''"
              fit="cover"
              class="ic_cover"
              :src="item.ic_cover"
            ></el-image>
            <img v-else style="object-fit: cover" class="ic_cover" src="/src/assets/pic/book.png" />
            <div style="float: left; width: calc(100% - 150px)">
              <h2 id="ic_title">
                <strong>{{ item.ic_name }}</strong>
              </h2>
              <p v-if="item.ic_desc != null && item.ic_desc != ''" class="ic_desc">{{ item.ic_desc }}</p>
              <p v-else class="ic_desc">{{ defaultDesc }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="ic_card" style="text-align: center" @click="addIcDialog">
            <svg class="icon" aria-hidden="true" style="width: 80px; height: 80px; margin-top: 35px; color: #67716e">
              <use xlink:href="#yw-icon-add-bold"></use>
            </svg>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="图集信息">
        <el-form :model="ic_info">
          <el-form-item
            prop="ic_name"
            label="图集名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '图集名称不能为空' }]"
          >
            <el-input v-model="ic_info.ic_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图集简介" :label-width="formLabelWidth">
            <el-input
              v-model="ic_info.ic_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
          <el-form-item
            label="选择文件夹"
            :label-width="formLabelWidth"
            prop="ic_path"
            :rules="[{ required: true, trigger: 'change', message: '图集名称不能为空' }]"
          >
            <el-input v-model="ic_info.ic_path" placeholder="请选择文件夹" readonly class="input-with-select">
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

          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="ic_cover">
            <el-input v-model="ic_info.ic_cover" placeholder="请选择书库封面图" readonly class="input-with-select">
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
            v-if="ic_info.ic_cover != '' && ic_info.ic_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="ic_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="ic_info.ic_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addIcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div id="editDialog">
      <el-dialog v-model="editDialogFormVisible" title="编辑图集信息">
        <el-form :model="edit_ic_info">
          <el-form-item label="文件夹地址" :label-width="formLabelWidth" prop="ic_path">
            {{ edit_ic_info.ic_path }}
          </el-form-item>
          <el-form-item
            prop="ic_name"
            label="图集名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '图集名称不能为空' }]"
          >
            <el-input v-model="edit_ic_info.ic_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书库简介" :label-width="formLabelWidth">
            <el-input
              v-model="edit_ic_info.ic_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>

          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="ic_cover">
            <el-input v-model="edit_ic_info.ic_cover" placeholder="请选择图集封面图" readonly class="input-with-select">
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
            v-if="edit_ic_info.ic_cover != '' && edit_ic_info.ic_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="ic_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="edit_ic_info.ic_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateIcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script>
const { shell, clipboard } = require('electron')
import { ElMessage } from 'element-plus'
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'
export default {
  inject: ['refresh'],
  data() {
    return {
      contextMenuTemplate: [],
      defaultDesc: '暂无简介',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      ic_info: {
        ic_name: '',
        ic_path: '',
        ic_desc: '',
        ic_cover: '',
        id: 0
      },
      edit_ic_info: {
        ic_name: '',
        ic_path: '',
        ic_desc: '',
        ic_cover: '',
        id: 0
      },
      icList: [
        {
          ic_name: '',
          ic_path: '',
          ic_desc: '',
          ic_cover: '',
          id: 0
        }
      ],
      randomImageList: [
        {
          imagePath: '',
          imageName: '',
          imageID: 0,
          thumbnail: '',
          imageScore: 0,
          remark: '',
          followed: 0
        }
      ],
      radio: '',
      res_data: '',
      randomNum: 10,
      editDialogFormVisible: false
    }
  },

  created() {
    this.getRandomImageList(this.randomNum)
    this.getIcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('img-col', ['addIc', 'getIc', 'getRandomImage', 'deleteIC', 'updateIC']),
    getRandomImageList(num) {
      this.getRandomImage({ num }).then((response) => {
        this.randomImageList = response.data
      })
    },
    addIcTest() {
      if (this.ic_info.ic_name == '' || this.ic_info.ic_name == null) {
        ElMessage({
          message: '图集名称不能为空！',
          type: 'error'
        })
      } else if (this.ic_info.ic_path == '' || this.ic_info.ic_path == null) {
        ElMessage({
          message: '请选择图集路径！',
          type: 'error'
        })
      } else {
        this.addIc(this.ic_info).then((response) => {
          this.res_data = response

          this.dialogFormVisible = false
          this.refresh()
        })
      }
    },

    getIcTest() {
      this.getIc().then((response) => {
        this.icList = response.data
      })
    },

    getIcByRadio(radio) {
      if (radio == 0) {
        return '输出全部图集'
      } else {
        for (var i = 0; i < this.icList.length; i++) {
          if (this.icList[i].id == radio) {
            return this.icList[i]
          }
        }
      }
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
          this.ic_info.ic_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
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
          this.edit_ic_info.ic_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openFile(path) {
      shell.openPath(path)
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
          this.ic_info.ic_path = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addIcDialog() {
      this.dialogFormVisible = true
    },
    showRadioValue() {
      console.log(this.radio)
    },

    rtClickOpenMenu(item) {
      this.initMenuTemplate(item)
      //创建菜单项
      this.menu = Menu.buildFromTemplate(this.contextMenuTemplate)
      this.menu.popup({ window: remote.getCurrentWindow() })
    },

    initMenuTemplate(item) {
      this.contextMenuTemplate = [
        { label: '打开图集', click: this.openIC, data: item },
        { label: '编辑图集', click: this.editIcDialog, data: item },
        { label: '删除图集', click: this.deleteImgCol, data: item },
        { type: 'separator' },
        { label: '在文件管理器中打开', click: this.openInFolder, data: item }
      ]
    },

    editIcDialog(item) {
      var ic = item.data
      this.edit_ic_info = ic
      this.editDialogFormVisible = true
    },
    updateIcTest() {
      var data = {
        id: this.edit_ic_info.id,
        ic_name: this.edit_ic_info.ic_name,
        ic_desc: this.edit_ic_info.ic_desc,
        ic_cover: this.edit_ic_info.ic_cover,
        ic_path: this.edit_ic_info.ic_path
      }
      this.updateIC(data).then((response) => {
        this.refresh()
      })
    },
    deleteImgCol(item) {
      this.$confirm('此操作将删除该图集配置信息和封面等内容，不会删除图集本地文件, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = item.data
          var ic_id = data.id
          this.deleteIC({ ic_id }).then((response) => {
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
    openIC(item) {
      var data = item.data
      this.$router.push('/jile/waterfall?ic_id=' + data.id)
    },
    openInFolder(item) {
      var path = item.data.ic_path
      shell.showItemInFolder(path)
    }
  }
}
</script>

<style scoped>
#ic_title {
  margin: 20px;
  border: 1px solid #efefef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ic_card {
  cursor: pointer;
  margin-top: 20px;
  height: 150px;
  border-radius: 10px;
  background: #efefef;
  transition: transform 0.4s; /* 改变 opacity 属性，持续1秒 */
}

.ic_card:hover {
  transform: translateY(-10px);
}

.ic_desc {
  margin: 20px;
  color: #67716e;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.ic_cover {
  height: 100%;
  width: 150px;
  border-radius: 10px;
  float: left;
  transition: filter 0.4s; /* 改变 opacity 属性，持续1秒 */
}
.ic_cover:hover {
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