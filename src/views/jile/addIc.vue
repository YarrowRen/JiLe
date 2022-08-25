<template>
  <div>
    <div>
      <el-button type="primary" @click="addIcDialog">添加图集</el-button>
      <el-button type="primary" @click="showRadioValue">当前选择图集输出（radio值）</el-button>
    </div>
    <br />
    <div>
      <el-card>
        <el-radio :key="0" v-model="radio" :label="0">全部</el-radio>
        <el-radio v-for="(item, id) in icList" :key="id" v-model="radio" :label="item.id">
          {{ item.ic_name }}
        </el-radio>
      </el-card>
    </div>
    <br />
    <div>
      <el-card>{{ this.getIcByRadio(this.radio) }}</el-card>
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
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addIcTest">确 定</el-button>
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
      ic_info: {
        ic_name: '',
        ic_path: '',
        ic_desc: '',
        id: 0
      },
      icList: [
        {
          ic_name: '',
          ic_path: '',
          ic_desc: '',
          id: 0
        }
      ],
      radio: '',
      res_data: ''
    }
  },

  created() {
    this.getIcTest()
  },
  mounted() {
    this.$bus
  },
  methods: {
    ...mapActions('img-col', ['addIc', 'getIc']),

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
          console.log('里边：' + this.res_data)
          ElMessage({
            message: response.message,
            type: 'success'
          })
          this.dialogFormVisible = false
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

    showIcList(icList){
      
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
    }
  }
}
</script>

<style>
</style>