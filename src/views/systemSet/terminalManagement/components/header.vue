<script lang="ts" setup>
import api from '@/api'
const nowTime = ref('')
function getNowTime() {
  const rollFun = function () {
    api.get('/monitor/server/status').then((res: any) => {
      nowTime.value = toDateStr(new Date(res.timestamp))
    }).catch((error) => {
      window.console.log(error)
    })
  }
  setInterval(rollFun, 1000)
}
function toDateStr(today: Date) {
  const date = `${today.getFullYear()}-${twoDigits(today.getMonth() + 1)}-${twoDigits(today.getDate())}`
  const time = `${twoDigits(today.getHours())}:${twoDigits(today.getMinutes())}:${twoDigits(today.getSeconds())}`
  return `${date}  ${time}`
}
function twoDigits(val: number) {
  if (val < 10) {
    return `0${val}`
  }
  return val
}

onMounted(() => {
  getNowTime()
})
</script>

<template>
  <div class="common-layout">
    <el-header height="96px" class="wx-header">
      <h2 data-content="阵地综合信息发布系统">
        阵地综合信息发布系统
      </h2>

    </el-header>
    <div class="date">
      {{ nowTime }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
  position: relative;
}

.date {
  color: #fff;
  position: absolute;
  top: 16px;
  right: 150px;
  font-size: 24px;
  font-weight: bold;
}

.wx-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #fff;
  height: 100%;
  gap: 92px;
  background: url("@/assets/images/big-screen-header2.png") no-repeat center top;

  h3 {
    position: relative;
    flex: 1;
    margin: 0;
    margin-top: 22px;
    text-align: right;
    font-size: 16px;
    height: 18px;
    font-weight: normal;
    overflow: hidden;

    span {
      position: absolute;
      top: 0;
      width: 100%;
      line-height: 18px;
      animation: trotting-lamp 10s ease-in-out infinite;
    }

    @keyframes trotting-lamp {
      0% {
        right: -100%;
      }

      100% {
        right: 100%;
      }
    }
  }

  h2 {
    width: 100%;
    line-height: 80px;
    text-align: center;
    margin: 0;
    padding: 0;
    color: #fff;
    font-weight: bold;
    font-size: 40px;
    letter-spacing: 6px;
    -webkit-text-stroke: 6px #666;
  }

  .el-button {
    position: absolute;
    right: 16px;
    top: 16px;
    border-radius: 16px;

    :deep(.el-icon) {
      font-size: 20px;
      transition: 0.3s;
    }

    :hover {
      transform: rotate(90deg);
      transition: 0.3s;
    }
  }
}

[data-content]::before {
  content: attr(data-content);
  position: absolute;
  -webkit-text-stroke: 0;
  background: linear-gradient(to top, #e3e3e3, #fff);
  background-clip: text;
  color: transparent;
}
</style>
