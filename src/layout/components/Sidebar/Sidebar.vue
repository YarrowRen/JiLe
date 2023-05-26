<template>
  <div id="Sidebar" class="reset-menu-style">
    <!-- 已关闭sidebarLogo -->
    <!--logo-->
    <!-- <Logo v-if="settings.sidebarLogo" :collapse="!isCollapse" /> -->
    <!--router nav-->
    <el-scrollbar>
      <el-menu
        class="el-menu-vertical"
        :default-active="activeMenu"
        :collapse="!isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        :background-color="scssJson.menuBg"
        :text-color="scssJson.menuText"
        :active-text-color="scssJson.menuActiveText"
        mode="vertical"
      >
        <el-menu-item>
          <img src="@/assets/pic/jiLe.png" class="cover" style="height: 30%" />
          <span style="margin-left: 10px"><strong>集乐 - JiLe</strong></span>
        </el-menu-item>
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
        <!--vue-element-admin提供的router不支持动态从后端加载路由返回到前端响应，所以这里直接修改侧边栏文件-->
        <sidebar-item-book />
        <sidebar-item-image />
        <sidebar-item-video />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarItemBook from './SidebarItemBook.vue'
import SidebarItemImage from './SidebarItemImage.vue'
import SidebarItemVideo from './SidebarItemVideo.vue'
//导入配置文件
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
let routes = computed(() => {
  return store.state.permission.routes
})
const isCollapse = computed(() => {
  return store.state.app.sidebar.opened
})
let settings = computed(() => {
  return store.state.app.settings
})

//change  scss variable to js
const dillScssExportToJson = (scssExportJson) => {
  let jsonString = scssExportJson.replace(/:export\s*/, '').replace(/[\s+\r\n]/g, '')
  let scssJson = {}
  jsonString
    .slice(1, jsonString.length - 2)
    .split(';')
    .forEach((fItem) => {
      let arr = fItem.split(':')
      scssJson[arr[0]] = arr[1]
    })
  return scssJson
}

//get scss variable
import scssExportJson from '@/styles/variables-to-js.scss'
let scssJson = dillScssExportToJson(scssExportJson)
const activeMenu = computed(() => {
  const { meta, fullPath } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return fullPath
})
</script>

<style lang="scss">
.reset-menu-style {
  .el-menu {
    border-right: none;
  }
  .el-scrollbar__wrap {
    padding-bottom: 8vh;
  }
}

.el-menu-vertical {
  width: $sideBarWidth;
}
</style>
