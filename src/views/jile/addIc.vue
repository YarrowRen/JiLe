<template>
  <div>
    <el-button type="primary" @click="addIcTest">添加图集</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      ic_info: {
        ic_name: '',
        ic_path: '',
        ic_desc: '',
        id: 0
      },
      res_data: ''
    }
  },

  methods: {
    ...mapActions('img-col', ['addIc']),

    addIcTest() {
      this.ic_info.ic_name = '测试文章vue'
      this.ic_info.ic_path = 'I:\\JiLeFile\\test1'
      this.ic_info.ic_desc = '使用vue创建图集'
      console.log(this.ic_info.ic_name, this.ic_info.ic_path, this.ic_info.ic_desc)
      this.addIc(this.ic_info).then((response) => {
        this.res_data = response
        console.log(this.res_data)
      })
    }
  }
}
</script>

<style>
</style>