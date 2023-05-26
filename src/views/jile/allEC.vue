<template>
  <el-scrollbar style="height: 100%; padding: 10px">
    <div v-if="randomEBookList.length == randomNum" style="width: 80%; margin: 0 auto; text-align: center">
      <h1 style="margin: 10px"><strong>随机推荐</strong></h1>
      <el-carousel trigger="click" :interval="3000" type="card" height="300px">
        <el-carousel-item v-for="item in randomEBookList" :key="item" @click="openEBook(item.filePath)">
          <div>
            <el-image :src="item.coverPath" style="width: 100%; height: 300px" fit="cover"></el-image>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div>
      <el-row :gutter="15">
        <el-col v-for="(item, id) in ecList" :key="id" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div
            class="ec_card"
            @click="$router.push('/jile/ebook-page?ec_id=' + item.id)"
            @contextmenu="rtClickOpenMenu(item)"
          >
            <el-image
              v-if="item.ec_cover != null && item.ec_cover != ''"
              fit="cover"
              class="ec_cover"
              :src="item.ec_cover"
            ></el-image>
            <img v-else style="object-fit: cover" class="ec_cover" src="/src/assets/pic/book.png" />
            <div style="float: left; width: calc(100% - 150px)">
              <h2 id="ec_title">
                <strong>{{ item.ec_name }}</strong>
              </h2>
              <p v-if="item.ec_desc != null && item.ec_desc != ''" class="ec_desc">{{ item.ec_desc }}</p>
              <p v-else class="ec_desc">{{ defaultDesc }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
          <div class="ec_card" style="text-align: center" @click="addEcDialog">
            <svg class="icon" aria-hidden="true" style="width: 80px; height: 80px; margin-top: 35px; color: #67716e">
              <use xlink:href="#yw-icon-add-bold"></use>
            </svg>
          </div>
        </el-col>
      </el-row>
    </div>

    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="书库信息">
        <el-form :model="ec_info">
          <el-form-item
            prop="ec_name"
            label="书库名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '书库名称不能为空' }]"
          >
            <el-input v-model="ec_info.ec_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书库简介" :label-width="formLabelWidth">
            <el-input
              v-model="ec_info.ec_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
          <el-form-item
            label="选择文件夹"
            :label-width="formLabelWidth"
            prop="ec_path"
            :rules="[{ required: true, trigger: 'change', message: '书库路径不能为空' }]"
          >
            <el-input v-model="ec_info.ec_path" placeholder="请选择文件夹" readonly class="input-with-select">
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
          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="ec_cover">
            <el-input v-model="ec_info.ec_cover" placeholder="请选择书库封面图" readonly class="input-with-select">
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
            v-if="ec_info.ec_cover != '' && ec_info.ec_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="ec_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="ec_info.ec_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div id="editDialog">
      <el-dialog v-model="editDialogFormVisible" title="编辑书库信息">
        <el-form :model="edit_ec_info">
          <el-form-item label="文件夹地址" :label-width="formLabelWidth" prop="ec_path">
            {{ edit_ec_info.ec_path }}
          </el-form-item>
          <el-form-item
            prop="ec_name"
            label="书库名称"
            :label-width="formLabelWidth"
            :rules="[{ required: true, trigger: 'blur', message: '书库名称不能为空' }]"
          >
            <el-input v-model="edit_ec_info.ec_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书库简介" :label-width="formLabelWidth">
            <el-input
              v-model="edit_ec_info.ec_desc"
              :autosize="{ minRows: 2, maxRows: 6 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>

          <el-form-item label="选择封面图" :label-width="formLabelWidth" prop="ec_cover">
            <el-input v-model="edit_ec_info.ec_cover" placeholder="请选择书库封面图" readonly class="input-with-select">
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
            v-if="edit_ec_info.ec_cover != '' && edit_ec_info.ec_cover != null"
            label="封面图"
            :label-width="formLabelWidth"
            prop="ec_cover"
          >
            <el-image
              fit="cover"
              style="height: 150px; width: 150px; border-radius: 10px"
              :src="edit_ec_info.ec_cover"
            ></el-image>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateEcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-scrollbar>
</template>

<script>
import { ElMessage } from 'element-plus'
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'
const { shell } = require('electron')
export default {
  inject: ['refresh'],
  data() {
    return {
      randomNum: 10,
      defaultDesc: '暂无介绍',
      dialogFormVisible: false,
      editDialogFormVisible: false,
      formLabelWidth: '100px',
      contextMenuTemplate: [],
      ec_info: {
        ec_name: '',
        ec_path: '',
        ec_desc: '',
        id: 0,
        ec_cover: ''
      },
      edit_ec_info: {
        ec_name: '',
        ec_path: '',
        ec_desc: '',
        id: 0,
        ec_cover: ''
      },
      ecList: [
        {
          ec_name: '',
          ec_path: '',
          ec_desc: '',
          id: 0,
          ec_cover: ''
        }
      ],
      randomEBookList: [
        {
          filePath: '',
          ec_id: 0,
          language: '',
          format: '',
          authorList: [
            {
              id: '',
              name: '',
              profile: '',
              birthday: '',
              followed: 0
            }
          ],
          publishDate: '',
          publishDateStr: '',
          intro: '',
          followed: 0,
          url: '',
          tags: [
            {
              id: 0,
              tag_name: ''
            }
          ],
          publisher: '',
          identifier: '',
          coverPath: '',
          extension: '',
          ebookTitle: '',
          ebookName: '',
          ebookID: '',
          pages: 0,
          ebookScore: 0
        }
      ],
      radio: '',
      res_data: ''
    }
  },

  created() {
    this.getRandomEBookList(this.randomNum)
    this.getEcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('ebook-col', ['addEc', 'getEc', 'getRandomEBook', 'deleteEC', 'updateEC']),

    addEcTest() {
      if (this.ec_info.ec_name == '' || this.ec_info.ec_name == null) {
        ElMessage({
          message: '书库名称不能为空！',
          type: 'error'
        })
      } else if (this.ec_info.ec_path == '' || this.ec_info.ec_path == null) {
        ElMessage({
          message: '请选择书库路径！',
          type: 'error'
        })
      } else {
        this.addEc(this.ec_info).then((response) => {
          this.res_data = response
          this.refresh()
        })
      }
    },
    getRandomEBookList(num) {
      this.getRandomEBook({ num }).then((response) => {
        this.randomEBookList = response.data
        this.randomNum = response.data.length
        console.log(this.randomEBookList)
      })
    },
    getEcTest() {
      this.getEc().then((response) => {
        this.ecList = response.data
      })
    },
    updateEcTest() {
      var data = {
        id: this.edit_ec_info.id,
        ec_name: this.edit_ec_info.ec_name,
        ec_desc: this.edit_ec_info.ec_desc,
        ec_cover: this.edit_ec_info.ec_cover,
        ec_path: this.edit_ec_info.ec_path
      }
      this.updateEC(data).then((response) => {
        this.refresh()
      })
    },
    getEcByRadio(radio) {
      if (radio == 0) {
        return '输出全部书库信息'
      } else {
        for (var i = 0; i < this.ecList.length; i++) {
          if (this.ecList[i].id == radio) {
            return this.ecList[i]
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
          this.ec_info.ec_path = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
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
          this.ec_info.ec_cover = result.filePaths[0]
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
          this.edit_ec_info.ec_cover = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addEcDialog() {
      this.dialogFormVisible = true
    },
    editEcDialog(item) {
      var ebook = item.data
      this.edit_ec_info = ebook
      this.editDialogFormVisible = true
    },
    showRadioValue() {
      console.log(this.radio)
    },
    openEBook(filePath) {
      // console.log(filePath)
      shell.openPath(filePath)
    },

    initMenuTemplate(item) {
      this.contextMenuTemplate = [
        { label: '打开书库', click: this.openEC, data: item },
        { label: '编辑书库', click: this.editEcDialog, data: item },
        { label: '删除书库', click: this.deleteEBookCol, data: item },
        { type: 'separator' },
        { label: '在文件管理器中打开', click: this.openInFolder, data: item }
      ]
    },
    deleteEBookCol(item) {
      this.$confirm('此操作将删除该书库配置信息和封面等内容，不会删除电子书本地文件, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = item.data
          var ec_id = data.id
          this.deleteEC({ ec_id }).then((response) => {
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
    openEC(item) {
      var data = item.data
      this.$router.push('/jile/ebook-page?ec_id=' + data.id)
    },

    openInFolder(item) {
      var path = item.data.ec_path
      shell.showItemInFolder(path)
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
#ec_title {
  margin: 20px;
  border: 1px solid #efefef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ec_card {
  cursor: pointer;
  margin-top: 20px;
  height: 150px;
  border-radius: 10px;
  background: #efefef;
  transition: transform 0.4s; /* 改变 opacity 属性，持续1秒 */
}

.ec_card:hover {
  transform: translateY(-10px);
}

.ec_desc {
  margin: 20px;
  color: #67716e;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.ec_cover {
  height: 100%;
  width: 150px;
  border-radius: 10px;
  float: left;
  transition: filter 0.4s; /* 改变 opacity 属性，持续1秒 */
}
.ec_cover:hover {
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