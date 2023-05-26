<template>
  <el-sub-menu index="2">
    <template #title>
      <el-icon>
        <svg class="svg-icon nav-icon" aria-hidden="true">
          <use xlink:href="#yw-icon-ai-img-list"></use>
        </svg>
      </el-icon>
      <span>图集管理</span>
    </template>
    <!-- <el-menu-item 
      @click="openAll_Image"
      :route="'/jile/all-ic'"
      :index="'/jile/all-ic'">全部图集</el-menu-item> -->
    <el-menu-item
      v-for="item in icList"
      :key="item.id"
      :route="'/jile/waterfall?ic_id=' + item.id"
      :index="'/jile/waterfall?ic_id=' + item.id"
      @click="openImagePage(item.id)"
    >
      {{ item.ic_name }}
    </el-menu-item>
  </el-sub-menu>
</template>

<script>
//重写SideBar部分 动态生成书库等侧边栏
import Link from './Link.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      icList: [
        {
          ic_name: '',
          ic_path: '',
          ic_desc: '',
          id: 0,
          ic_cover: '',
          ic_route: null
        }
      ]
    }
  },
  created() {
    this.getIcTest()
  },

  methods: {
    ...mapActions('img-col', ['getIc']),
    getIcTest() {
      this.getIc().then((response) => {
        this.icList = response.data
      })
    },
    //vue项目中路由跳转默认采用hash的方式，而hash的变化不会导致浏览器发送请求到服务器；
    //所以这里需要用跳转链接重新定位到新页面
    openImagePage(id) {
      this.$router.push('/redirect/jile/waterfall?ic_id=' + id)
      // console.log('/redirect/jile/ebook-page?ec_id=' + id)
      // console.log(window.location.href)
    },
    openAll_Image(){

      this.$router.push('/jile/all-ic')
    }
  }
}
</script>

<style>
</style>