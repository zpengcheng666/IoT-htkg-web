<script lang="ts" setup name="PersonalSetting">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

const data = reactive({
  url: '',
  isShow: false,
})
onMounted(() => {
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const str = route.path.substring(index + 1, route.path.length)
  // console.log(index)
  data.isShow = true
  if (index !== -1) {
    // console.log(11)
    // const url = window.location.origin
    let url = window.location.origin
    if (url === 'http://127.0.0.1:9000' || url === 'http://localhost:9000') {
      url = 'http://192.168.0.10:8090'
    }
    data.url = `${url}/byzt/client_view2.html?stageId=1646719181201182721`
  }
  else {
    data.url = ''
  }
})
</script>

<template>
  <div v-if="data.isShow" class="if_box">
    <iframe class="if" :src="data.url" />
  </div>
</template>

  <style lang="scss" scoped>
.if_box {
  width: 100%;
  height: 100%;
  // height: 768px;
  .if {
    width: 100%;
    height: 100%;
    min-height: 630px;
    border: medium none;
  }
}
  </style>

