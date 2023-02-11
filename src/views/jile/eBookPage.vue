<template>
  <el-container style="height: 100%; width: 100%">
    <el-container style="height: 100%; width: 100%">
      <el-main>
        <el-table
          :data="eBook_info"
          stripe
          border
          height="100%"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column sortable :show-overflow-tooltip="true" prop="ebookTitle" label="书名" width="320" />
          <el-table-column sortable :show-overflow-tooltip="true" prop="authorsStr" label="作者" width="120" />
          <el-table-column :show-overflow-tooltip="true" prop="publisher" label="出版" width="120" />
          <el-table-column :show-overflow-tooltip="true" label="评分" width="135">
            <template #default="scope">
              <el-rate v-model="scope.row.ebookScore"  disabled/>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="language" label="语言" width="100" />
          <el-table-column :show-overflow-tooltip="true" prop="publishDateStr" label="出版日期" width="200" />
          <el-table-column :show-overflow-tooltip="true" prop="identifier" label="书号" width="180" />
          <el-table-column sortable :show-overflow-tooltip="true" prop="pages" label="页数" width="100" />
          <el-table-column :show-overflow-tooltip="true" prop="extension" label="类型" width="120" />
          <el-table-column :show-overflow-tooltip="true" label="标签" width="200">
            <template #default="scope">
              <el-tag
                v-for="tag in scope.row.tags"
                :key="tag.id"
                type="success"
                style="margin-right: 5px"
                effect="dark"
              >
                {{ tag.tag_name }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="1" style="text-align: center">
        <div>
          <el-pagination
            style="display: inline"
            background
            layout="total, prev, pager, next, jumper"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalSize"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </el-footer>
    </el-container>

    <el-aside width="300px" style="background: #f0f0f0; margin-left: 5px">
      <div v-if="this.targetEBook.ec_id == 0" style="height: 435px; margin-top: 25px; text-align: center">
        <img src="@/assets/pic/jile.png" class="cover" style="height: 150px" />
        <h3 style="margin-top: 30px; margin-bottom: 30px"><strong>暂未选择书籍</strong></h3>
        <div>
          <el-button type="warning" @click="refreshEc">刷新数据库</el-button>
          <el-button type="success">打开文件夹</el-button>
        </div>
      </div>
      <div v-else style="height: 435px; margin-top: 25px">
        <img
          :src="targetEBook.coverPath"
          class="cover"
          @click="openFile(ec_info.ec_path + '\\' + targetEBook.ebookName)"
        />
        <el-form style="margin: 10px" class="infoForm">
          <el-form-item label="书籍">{{ targetEBook.ebookTitle }}</el-form-item>
          <el-form-item label="作者" v-if="targetEBook.authorsStr != null && targetEBook.authorsStr != ''">
            {{ targetEBook.authorsStr }}
          </el-form-item>
          <el-form-item label="书号" v-if="targetEBook.identifier != null && targetEBook.identifier != ''">
            {{ targetEBook.identifier }}
          </el-form-item>
          <el-form-item label="格式">{{ targetEBook.extension }}</el-form-item>
          <el-form-item label="出版" v-if="targetEBook.publisher != null && targetEBook.publisher != ''">
            {{ targetEBook.publisher }}
          </el-form-item>
          <el-form-item label="语言" v-if="targetEBook.language != null && targetEBook.language != ''">
            {{ targetEBook.language }}
          </el-form-item>
          <el-form-item label="页数">{{ targetEBook.pages }}</el-form-item>
          <el-form-item label="日期">{{ targetEBook.publishDateStr }}</el-form-item>
          <el-form-item label="路径">
            <el-link class="path-link" @click="openFolder(ec_info.ec_path + '\\' + targetEBook.ebookName)">
              {{ ec_info.ec_path + '\\' + targetEBook.ebookName }}
            </el-link>
          </el-form-item>
        </el-form>
        <div style="text-align: center; margin: 5px">
          <el-button type="warning" @click="refreshEc">刷新数据库</el-button>
          <el-button type="success" @click="openDialogForm">编辑</el-button>
          <el-divider></el-divider>
        </div>
      </div>
    </el-aside>

    <div id="dialog">
      <el-dialog v-model="dialogFormVisible" title="编辑书籍元数据" width="60%">
        <el-scrollbar max-height="60vh">
          <el-row>
            <el-col :span="6">
              <el-image :src="ebookDetails.coverPath" style="aspect-ratio: 57/84; margin: 5px" fit="cover" />
              <div style="width: 100%; text-align: center">
                <el-link target="_blank" @click="selectCoverInDialog">更新封面图/海报</el-link>
              </div>
              <div style="width: 100%; text-align: center">
                <el-button
                  v-if="ebookDetails.followed == 0"
                  type="danger"
                  style="width: 80%; margin-top: 10px; text-align: center"
                  @click="ebookDetails.followed = 1"
                >
                  {{ showFollowed }}
                </el-button>
                <el-button
                  v-if="ebookDetails.followed == 1"
                  type="info"
                  style="width: 80%; margin-top: 10px; text-align: center"
                  @mouseenter="showNotFollowed = '取消收藏'"
                  @mouseleave="showNotFollowed = '已收藏'"
                  @click="ebookDetails.followed = 0"
                >
                  {{ showNotFollowed }}
                </el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <el-form :model="ebookDetails" :rules="rules">
                <el-form-item label="书名" :label-width="formLabelWidth">
                  <el-input v-model="ebookDetails.ebookTitle" placeholder="Please input" size="large" />
                </el-form-item>

                <el-form-item label="作者" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="author in ebookDetails.authorList"
                      :key="author.id"
                      style="margin-right: 10px; margin-bottom: 10px"
                      size="large"
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="warning"
                      @close="handleAuthorClose(ebookDetails.ebookID, author)"
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

                <el-form-item label="标签" :label-width="formLabelWidth">
                  <el-row>
                    <el-tag
                      v-for="tag in ebookDetails.tags"
                      :key="tag.id"
                      style="margin-right: 10px; margin-bottom: 10px"
                      size="large"
                      closable
                      :disable-transitions="false"
                      type="success"
                      :hit="true"
                      @close="handleTagClose(ebookDetails.ebookID, tag)"
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
                <el-form-item label="评分" :label-width="formLabelWidth">
                  <el-rate
                    v-model="ebookDetails.ebookScore"
                    :texts="['很差', '较差', '还行', '推荐', '力荐']"
                    show-text
                  ></el-rate>
                </el-form-item>
                <el-form-item label="页数" :label-width="formLabelWidth">
                  <el-input-number v-model="ebookDetails.pages" :min="0" controls-position="right" size="large" />
                </el-form-item>
                <el-form-item label="语言" :label-width="formLabelWidth">
                  <el-select
                    size="default"
                    v-model="ebookDetails.language"
                    filterable
                    default-first-option
                    :reserve-keyword="false"
                    placeholder="Choose E-Book language"
                  >
                    <el-option v-for="item in allLanguage" :key="item.value" :label="item.value" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="出版日期" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="ebookDetails.publishDate"
                    type="date"
                    placeholder="选择出版日期"
                    size="default"
                  />
                </el-form-item>

                <el-form-item label="出版商" :label-width="formLabelWidth">
                  <el-input v-model="ebookDetails.publisher" placeholder="Please input publisher" size="large" />
                </el-form-item>
                <el-form-item label="书号" :label-width="formLabelWidth">
                  <el-input v-model="ebookDetails.identifier" placeholder="Please input identifier" size="large" />
                </el-form-item>
                <el-form-item label="相关网址" :label-width="formLabelWidth" prop="url">
                  <el-input v-model="ebookDetails.url" placeholder="请输入相关网址" size="default"></el-input>
                </el-form-item>

                <el-form-item label="简介" :label-width="formLabelWidth">
                  <el-input
                    v-model="ebookDetails.intro"
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
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="showUpdateConfirm">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-container>
</template>

<script>
import { ElMessage } from 'element-plus'
const { shell } = require('electron')
const fs = require('fs-extra')
const remote = require('@electron/remote')
const { Menu, dialog } = remote
import { mapState, mapActions } from 'vuex'
import SvgIcon from '@/icons/SvgIcon.vue'
export default {
  components: { SvgIcon },
  inject: ['refresh'],
  data() {
    return {
      allLanguage: [
        { value: '汉语' },
        { value: '法语' },
        { value: '德语' },
        { value: '瑞士语' },
        { value: '希腊语' },
        { value: '犹太语' },
        { value: '匈牙利语' },
        { value: '爱尔兰语' },
        { value: '爱沙尼亚语' },
        { value: '芬兰语' },
        { value: '比利时佛兰芒语' },
        { value: '意大利语' },
        { value: '拉丁语' },
        { value: '拉脱维亚语' },
        { value: '荷兰语' },
        { value: '丹麦语' },
        { value: '葡萄牙语' },
        { value: '里斯本语' },
        { value: '立陶宛语' },
        { value: '马其顿语' },
        { value: '阿塞疆语' },
        { value: '孟加拉语' },
        { value: '波兰语' },
        { value: '罗马尼亚语' },
        { value: '英语' },
        { value: '捷克语' },
        { value: '马尔它语' },
        { value: '克罗地亚语' },
        { value: '缅甸语' },
        { value: '柬埔寨语' },
        { value: '菲律宾语' },
        { value: '印度尼西亚语' },
        { value: '日本语' },
        { value: '朝鲜语' },
        { value: '爪哇语' },
        { value: '老挝语' },
        { value: '马来西亚语' },
        { value: '蒙古语' },
        { value: '尼泊尔语' },
        { value: '波斯语' },
        { value: '北印度语' },
        { value: '俄罗斯语' },
        { value: '西班牙语' },
        { value: '古吉拉特语' },
        { value: '瑞典语' },
        { value: '土尔其语' },
        { value: '乌克兰语' },
        { value: '越南语' },
        { value: '冰岛语' },
        { value: '肯尼亚语' },
        { value: '阿拉伯语' },
        { value: '马达加斯加语' },
        { value: '阿尔萨斯语' },
        { value: '亚美尼亚语' },
        { value: '巴伐利亚语' },
        { value: '亚述语' },
        { value: '他加禄语' },
        { value: '南非语和泰国语' }
      ],
      inputAuthorValue: '',
      inputValue: '',
      rules: {
        url: [
          {
            pattern: /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/,
            message: '请输入正确URL格式',
            trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '80px',
      showFollowed: '❤ 收藏',
      showNotFollowed: '已收藏',
      dialogFormVisible: false,
      currentPage: 1,
      pageSize: 40,
      totalSize: 0,
      targetEBook: {
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
      },
      ebookDetails: {
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
      },
      ec_info: {
        id: 0,
        ec_name: '',
        ec_path: '',
        ec_desc: ''
      },
      eBook_info: [
        {
          ec_id: 0,
          language: '',
          format: '',
          authorsStr: '',
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

      filtersList: {
        imageFilters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
      }
    }
  },

  created() {
    this.ec_info.id = 1
    this.getEBookInfo(this.ec_info.id, this.currentPage, this.pageSize)
  },

  methods: {
    ...mapActions('ebook-col', ['getEBookCol', 'refreshEcData', 'updateEBookDetails']),
    updateEBook() {
      this.updateEBookDetails(this.ebookDetails).then((response) => {
        this.refresh()
      })
    },
    refreshEc() {
      var ecID = this.ec_info.id
      this.refreshEcData({ ecID }).then((response) => {
        this.refresh()
      })
    },
    getEBookInfo(ec_id, page, pageSize) {
      let pageInfo = {
        ec_id: ec_id,
        page: page,
        pageSize: pageSize
      }
      //重置表单信息
      this.eBook_info = this.$options.data().eBook_info
      this.ec_info = this.$options.data().ec_info

      this.getEBookCol(pageInfo).then((response) => {
        this.ec_info.id = response.data.id
        this.ec_info.ec_name = response.data.ec_name
        this.ec_info.ec_path = response.data.ec_path
        this.ec_info.ec_desc = response.data.ec_desc
        this.eBook_info = response.data.ec_info.list
        this.totalSize = response.data.ec_info.total
        this.currentPage = response.data.ec_info.pageNum
        this.pageSize = response.data.ec_info.pageSize
        //处理作者信息,将所有作者姓名拼接成字符串
        for (var i = 0; i < this.eBook_info.length; i++) {
          var eBook = this.eBook_info[i]
          var temp = []
          for (var j = 0; j < eBook.authorList.length; j++) {
            temp[j] = eBook.authorList[j].name
          }
          eBook.authorsStr = temp.join(',')

          //日期格式化
          var date = new Date(eBook.publishDate)
          var year = date.getFullYear() //  返回的是年份
          var month = date.getMonth() + 1 //  返回的月份上个月的月份，记得+1才是当月
          var dates = date.getDate()
          if (month < 10) month = '0' + month
          if (dates < 10) dates = '0' + dates
          var publishDate = year + '年 ' + month + '月 ' + dates + '日'
          eBook.publishDateStr = publishDate
        }
      })
    },
    openDialogForm() {
      let _tmp = JSON.stringify(this.targetEBook) //将对象转换为json字符串形式
      this.ebookDetails = JSON.parse(_tmp) //将转换而来的字符串转换为原生js对象
      console.log(this.ebookDetails)
      this.dialogFormVisible = true
    },
    handleCurrentChange(val) {
      //判断val是否为空，传入空值是因为换页时也会调用该函数
      if (val != null) {
        this.targetEBook = val
        console.log('运行')
        console.log(this.targetEBook)
      } else {
        this.targetEBook = this.$options.data().targetEBook
      }
    },
    handlePageChange(val) {
      //获取换页后数据
      this.getEBookInfo(this.ec_info.id, val, this.pageSize)
    },

    openFolder(path) {
      shell.showItemInFolder(path)
    },

    openFile(path) {
      shell.openPath(path)
    },
    selectCoverInDialog() {
      //利用Electron的Dialog打开文件选择器或文件夹选择器并进行特殊设置
      dialog
        .showOpenDialog({
          title: '请选择书籍封面',
          properties: ['openFile'],
          filters: this.filtersList.imageFilters
        })
        .then((result) => {
          if (!result || result.filePaths.length == 0) return //为空情况下表示未选择文件，直接return结束函数

          this.ebookDetails.coverPath = result.filePaths[0]
        })
        .catch((err) => {
          console.log(err)
        })
    },

    handleInputConfirm() {
      if (this.inputValue) {
        var tag = {
          id: 0,
          tag_name: this.inputValue
        }
        //确认不存在相同值的情况下再加入
        var i = 0
        for (i = 0; i < this.ebookDetails.tags.length; i++) {
          if (this.inputValue == this.ebookDetails.tags[i].tag_name) {
            break
          }
        }
        if (i == this.ebookDetails.tags.length) {
          this.ebookDetails.tags.push(tag)
        }
      }
      this.inputValue = ''
    },

    handleTagClose(ebookID, tag) {
      for (var i = 0; i < this.ebookDetails.tags.length; i++) {
        if (this.ebookDetails.tags[i].id == tag.id && this.ebookDetails.tags[i].tag_name == tag.tag_name) {
          this.ebookDetails.tags.splice(i, 1)
          break
        }
      }
    },
    handleAuthorConfirm() {
      if (this.inputAuthorValue) {
        var author = {
          id: 0,
          name: this.inputAuthorValue
        }
        var i = 0
        for (i = 0; i < this.ebookDetails.authorList.length; i++) {
          if (this.inputAuthorValue == this.ebookDetails.authorList[i].name) {
            break
          }
        }
        if (i == this.ebookDetails.authorList.length) {
          this.ebookDetails.authorList.push(author)
        }
      }
      this.inputAuthorValue = ''
    },
    handleAuthorClose(videoID, author) {
      for (var i = 0; i < this.ebookDetails.authorList.length; i++) {
        if (this.ebookDetails.authorList[i].id == author.id && this.ebookDetails.authorList[i].name == author.name) {
          this.ebookDetails.authorList.splice(i, 1)
          break
        }
      }
    },
    showUpdateConfirm() {
      // console.log(this.videoDetails)
      this.$confirm('是否确定保存修改内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.updateEBook()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    }
  }
}
</script>

<style scoped>
/**修改表单字体颜色 */
:deep(.el-table .el-table__body tr.el-table__row td) {
  color: #161616;
}

/**修改表单斑马项(深色项)背景颜色 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #f0f0f0;
  /* background: #e8e7e3; */
}
/**修改表单斑马项(浅色项)背景颜色 */
:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: #d8d8d8;
}
/**修改选中项显示效果 */
:deep(.el-table__body tr.current-row > td) {
  border: solid;
  border-color: #d6d3d3;
}

.cover {
  cursor: pointer;
  width: 100%;
  height: 100%;
  vertical-align: middle;
  object-fit: contain;
}

/**修改右侧侧边栏label字体 */
:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: bold;
  color: #161616;
}

/**修改ElementUI默认表单项el-form-item间距 */
.infoForm > .el-form-item {
  margin-bottom: 0px;
}
</style>