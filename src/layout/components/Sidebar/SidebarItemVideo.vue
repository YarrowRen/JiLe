<template>
  <el-sub-menu index="3">
    <template #title>
      <el-icon>
        <svg class="svg-icon nav-icon" aria-hidden="true">
          <use xlink:href="#yw-icon-video"></use>
        </svg>
      </el-icon>
      <span>影集管理</span>
    </template>
    <!-- <el-menu-item 
      @click="openAll_Video"
      :route="'/jile/all-vc'"
      :index="'/jile/all-vc'">全部影集</el-menu-item> -->
    <el-menu-item
      @click="openVideoPage(item.id)"
      v-for="item in vcList"
      :key="item.id"
      :route="'/jile/video-cover?vc_id=' + item.id"
      :index="'/jile/video-cover?vc_id=' + item.id"
    >
      {{ item.vc_name }}
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
      vcList: [
        {
          vc_name: '',
          vc_path: '',
          vc_desc: '',
          id: 0,
          vc_cover: '',
          vc_route: null
        }
      ]
    }
  },
  created() {
    this.getVcTest()
  },

  methods: {
    ...mapActions('video-col', ['getVc']),
    getVcTest() {
      this.getVc().then((response) => {
        this.vcList = response.data
      })
    },
    //vue项目中路由跳转默认采用hash的方式，而hash的变化不会导致浏览器发送请求到服务器；
    //所以这里需要用跳转链接重新定位到新页面
    openVideoPage(id) {
      this.$router.push('/redirect/jile/video-cover?vc_id=' + id)
      // console.log('/redirect/jile/ebook-page?ec_id=' + id)
      // console.log(window.location.href)
    },
    openAll_Video(){

      this.$router.push('/jile/all-vc')
    }
  }
}
</script>

<style>
</style>