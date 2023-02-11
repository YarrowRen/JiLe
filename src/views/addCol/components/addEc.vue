<template>
  <div>
    <div>
      <el-button type="primary" @click="addEcDialog">添加书库</el-button>
      <el-button type="primary" @click="showRadioValue">当前选择书库输出（radio值）</el-button>
    </div>
    <br />
    <div>
      <el-card>
        <el-radio :key="0" v-model="radio" :label="0">全部</el-radio>
        <el-radio v-for="(item, id) in ecList" :key="id" v-model="radio" :label="item.id">
          {{ item.ec_name }}
        </el-radio>
      </el-card>
    </div>
    <br />
    <div>
      <el-card>{{ getEcByRadio(radio) }}</el-card>
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
            :rules="[{ required: true, trigger: 'change', message: '书库名称不能为空' }]"
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
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEcTest">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
const { dialog } = require('@electron/remote')
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '100px',
      ec_info: {
        ec_name: '',
        ec_path: '',
        ec_desc: '',
        id: 0
      },
      ecList: [
        {
          ec_name: '',
          ec_path: '',
          ec_desc: '',
          id: 0
        }
      ],
      radio: '',
      res_data: ''
    }
  },

  created() {
    this.getEcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('ebook-col', ['addEc', 'getEc']),

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
          ElMessage({
            message: response.message,
            type: 'success'
          })
          this.dialogFormVisible = false
        })
      }
    },

    getEcTest() {
      this.getEc().then((response) => {
        this.ecList = response.data
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
    addEcDialog() {
      this.dialogFormVisible = true
    },
    showRadioValue() {
      console.log(this.radio)
    }
  }
}
</script>

<style>
</style>