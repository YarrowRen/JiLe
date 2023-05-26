<template>
  <el-sub-menu index="1">
    <template #title>
      <el-icon>
        <svg class="svg-icon nav-icon" aria-hidden="true">
          <use xlink:href="#yw-icon-book"></use>
        </svg>
      </el-icon>
      <span>书籍管理</span>
    </template>
    <!-- <el-menu-item 
      @click="openAllEBook"
      :route="'/jile/all-ec'"
      :index="'/jile/all-ec'">全部书库</el-menu-item> -->
    <el-menu-item
      v-for="item in ecList"
      :key="item.id"
      :route="'/jile/ebook-page?ec_id=' + item.id"
      :index="'/jile/ebook-page?ec_id=' + item.id"
      @click="openEBookPage(item.id)"
    >
      {{ item.ec_name }}
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
      ecList: [
        {
          ec_name: '',
          ec_path: '',
          ec_desc: '',
          id: 0,
          ec_cover: '',
          ec_route: null
        }
      ]
    }
  },
  created() {
    this.getEcTest()
  },

  methods: {
    ...mapActions('ebook-col', ['getEc']),
    getEcTest() {
      this.getEc().then((response) => {
        this.ecList = response.data
      })
    },
    //vue项目中路由跳转默认采用hash的方式，而hash的变化不会导致浏览器发送请求到服务器；
    //所以这里需要用跳转链接重新定位到新页面
    openEBookPage(id) {
      this.$router.push('/redirect/jile/ebook-page?ec_id=' + id)
      // console.log('/redirect/jile/ebook-page?ec_id=' + id)
      // console.log(window.location.href)
    },
    openAllEBook(){

      this.$router.push('/jile/all-ec')
    }
  }
}
</script>

<style>
</style>