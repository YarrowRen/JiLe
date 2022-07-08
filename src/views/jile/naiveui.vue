<template>
  <n-space>
    <n-button>Default</n-button>
    <n-button type="tertiary">Tertiary</n-button>
    <n-button type="primary">Primary</n-button>
    <n-button type="info">Info</n-button>
    <n-button type="success">Success</n-button>
    <n-button type="warning">Warning</n-button>
    <n-button type="error">Error</n-button>
    <n-button text>
      那车头依然吐着烟
    </n-button>
  </n-space>
</template>

<script>
import { defineComponent } from 'vue'
import { NButton, NSpace } from 'naive-ui'
export default defineComponent({
  components: {
    NButton,
    NSpace
  }
})
</script>

