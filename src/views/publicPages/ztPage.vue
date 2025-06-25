<!--
 * @Description:组态场景页
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-25 09:21:42
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-27 13:28:21
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage } from 'element-plus'
import api from '@/api'
const router = useRouter()
const data = reactive({
  url: '',
  isShow: false,
})

// 获取时间
function getTime() {
  api.get('/monitor/server/status').then((res: any) => {
    window.console.log(res.timestamp)
  }).catch((error) => {
    window.console.log(error)
  })
}

// 跳转登录
function toLogin() {
  // alert('我是父页面中的方法！')
  ElMessage({
    type: 'error',
    message: '登录过期，请重新登录！',
  })
  router.push({
    name: 'login',
  })
}
window.addEventListener('message', function(e){
    console.log(e) //{data:'params'}
    if(e.data ==='unToken'){
      toLogin()
    }
    // toLogin()
})
onMounted(() => {
  getTime()
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
    data.url = `${url}/byzt/client_view2.html?stageId=${str}`
  }
  else {
    data.url = ''
  }
})
</script>

<template>
  <!-- <div> -->
  <page-main class="pageBox">
    <div v-if="data.isShow" class="if_box">
      <iframe class="if" :src="data.url" />
    </div>
  </page-main>
  <!-- </div> -->
</template>

  <style lang="scss" scoped>
.if_box {
  width: 100%;
  height: calc(100vh - 308px);
  // height: 768px;
  .if {
    width: 100%;
    height: 100%;
    border: medium none;
  }
}
  </style>

