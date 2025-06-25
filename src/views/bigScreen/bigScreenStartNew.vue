// 大屏启动
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { HomeFilled } from '@element-plus/icons-vue'
import pageBg from '@/assets/images/big-screen-bg.jpg'
import api from '@/api'
const router = useRouter()
const bgStyle = reactive({
  backgroundImage: `url(${pageBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const data = reactive({
  terminalList: [] as any,
})
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
function toTerminal(val: any) {
  router.push({ path: `/bigScreenNew/${val.id}` })
}

function clickHome() {
  router.push({
    name: 'home',
  })
}
onMounted(() => {
  listTerminal()
  // allScreen()
})
</script>

<template>
  <div class="bg-banner" :style="bgStyle">
    <div class="screen-wrapper">
      <div v-for="(item, index) in data.terminalList" :key="index" class="screen-start" @click="toTerminal(item)">
        <span><em /></span>
        {{ item.name }}
      </div>
    </div>
    <el-icon class="icon" @click="clickHome()">
      <HomeFilled />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.bg-banner {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }

  .screen-wrapper {
    width: calc(240px * 3 + 20px);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;

    .screen-start {
      width: 240px;
      height: 136px;
      background: rgb(255 255 255 / 15%);
      border-radius: 8px;
      backdrop-filter: blur(2px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: 0.3s;

      span {
        position: relative;
        display: block;
        width: 100px;
        height: 60px;
        border: 1px solid #e3e3e3;
        border-radius: 6px;
        margin-bottom: 10px;
        transition: 0.3s;
        background: url(@/assets/images/chart.png) no-repeat calc(100% - 6px) 6px;

        em {
          position: absolute;
          top: 6px;
          right: 6px;
          display: block;
          width: 46px;
          height: 48px;
          mask: url(@/assets/images/chart.png) no-repeat left top;
          background: linear-gradient(to right, #f80, #f40) no-repeat left top/var(--mask-ani, 0) 100%;
          transition: 0.2s;
        }
      }

      span::after,
      span::before {
        content: "";
        position: absolute;
        left: 6px;
        display: block;
        width: 36px;
        height: 20px;
        border-radius: 4px;
        transition: 0.3s;
      }

      span::after {
        top: 6px;
        background: linear-gradient(#0082fc, #0082fc) no-repeat left top/var(--icon-rect, 0) 100%, #e3e3e3;
      }

      span::before {
        bottom: 6px;
        background: linear-gradient(#00b8fc, #00b8fc) no-repeat right top/var(--icon-rect, 0) 100%, #e3e3e3;
      }
    }

    .screen-start:hover {
      background: rgb(255 255 255 / 35%);
      cursor: pointer;
      transition: 0.3s;
    }

    .screen-start:hover span {
      border: 1px solid #00b8fc;
      transition: 0.3s;
    }

    .screen-start:hover span::after {
      --icon-rect: 100%;

      transition: 0.15s;
    }

    .screen-start:hover span::before {
      --icon-rect: 100%;

      transition: 0.15s;
      transition-delay: 0.2s;
    }

    .screen-start:hover span em {
      --mask-ani: 100%;

      transition: 0.25s;
      transition-delay: 0.35s;
    }
  }
}
</style>
