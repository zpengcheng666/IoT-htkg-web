<script lang="ts" setup>
const props = defineProps({
  // 详情数据
  videoUrl: {
    type: String,
    default() {
      return ''
    },
  },

})
onMounted(() => {
})
</script>

<template>
  <div class="common-layout">
    <video class="video_box" loop controls autoplay :src="props.videoUrl" />
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
}

.video_box {
  width: 100%;
  height: 100%;
}
</style>
