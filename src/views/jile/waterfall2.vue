<template>
  <Waterfall :list="list" :breakpoints="{1200:{rowPerView:4,},800:{rowPerView:3,},500: {rowPerView: 2,}}"
             :loadProps="{loading,error}">
    <template #item="{ item }">
      <el-card :body-style="{ padding: '0px' }">
        <LazyImg :url="item.hoverURL" />
        <div style="padding: 14px">
          <span>{{item.fromPageTitleEnc}}</span>
        </div>
      </el-card>
    </template>
  </Waterfall>
</template>

<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/style.css'
import loading from '@/assets/logo.png'
import error from '@/assets/404_images/404.png'

export default {
  name: "MyWaterfall",
  components: {
    Waterfall,
    LazyImg
  },
  data() {
    return {
      loading,
      error,
      list: [{
        hoverURL: "./src/static/img/1.jpg",
        fromPageTitleEnc: "nihao"
      }]
    }
  }
}
</script>
