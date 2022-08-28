<template>
  <div>
    <div>
      <el-button type="primary" @click="addVcDialog">添加影视集</el-button>
      <el-button type="primary" @click="showRadioValue">当前选择影视集输出（radio值）</el-button>
    </div>
    <br />
    <div>
      <el-card>
        <el-radio :key="0" v-model="radio" :label="0">全部</el-radio>
        <el-radio v-for="(item, id) in vcList" :key="id" v-model="radio" :label="item.id">
          {{ item.vc_name }}
        </el-radio>
      </el-card>
    </div>
    <br />
    <div>
      <el-card>{{ getVcByRadio(radio) }}</el-card>
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
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addVcTest">确 定</el-button>
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
      vc_info: {
        vc_name: '',
        vc_path: '',
        vc_desc: '',
        id: 0
      },
      vcList: [
        {
          vc_name: '',
          vc_path: '',
          vc_desc: '',
          id: 0
        }
      ],
      radio: '',
      res_data: ''
    }
  },

  created() {
    this.getVcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('video-col', ['addVc', 'getVc']),

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
    addVcDialog() {
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