// 大屏启动
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import pageBg from '@/assets/images/page-bg.jpg'
import api from '@/api'
const router = useRouter()
const bgStyle = reactive({
  backgroundImage: `url(${pageBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const form = reactive({
  start: '',
})
const data = reactive({
  terminalList: [] as any,
})
function toTerminal() {
  if (!form.start) {
    ElMessage({
      type: 'error',
      message: '请先选择终端',
    })
  }
  else {
    router.push({ path: `/bigScreenNew/${form.start}` })
  }
}
// 查询终端列表
function listTerminal() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/system/baseTerminal/list', postData).then((res: any) => {
    if (res.code === 200) {
      data.terminalList = res.result.records
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  listTerminal()
  // allScreen()
})
</script>

<template>
  <div class="bg-banner" :style="bgStyle">
    <div class="big-screen-start">
      <el-form :model="form" label-width="120px">
        <el-form-item label="选择终端">
          <el-select v-model="form.start" placeholder="请选择终端" filterable clearable>
            <el-option v-for="item in data.terminalList" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toTerminal">
            进入终端
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-banner {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-screen-start {
  width: 480px;
}

.el-select {
  width: 100%;
}
</style>
