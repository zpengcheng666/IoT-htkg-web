/* stylelint-disable block-opening-brace-space-before */
<script setup lang='ts'>
import dhIcon from '@/assets/images/wxIcon/dh.png'
import cdIcon from '@/assets/images/wxIcon/cd.png'
import jdIcon from '@/assets/images/wxIcon/jd.png'
import jsIcon from '@/assets/images/wxIcon/js.png'
import qxIcon from '@/assets/images/wxIcon/qx.png'
import twIcon from '@/assets/images/wxIcon/tw.png'
import txIcon from '@/assets/images/wxIcon/tx.png'
import zyIcon from '@/assets/images/wxIcon/zy.png'
import noData from '@/assets/images/noData.png'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Array<any>,
    default() {
      return []
    },
  },

})
let lists = reactive(props.infoData)

let timer: any
function countDownFun(rightTime: any) {
  let showTime = ''
  if (rightTime > 0) { // 判断剩余倒计时时间如果大于0就执行倒计时否则就结束
    const dd = Math.floor(rightTime / 1000 / 60 / 60 / 24)
    const hh = Math.floor((rightTime / 1000 / 60 / 60) % 24)
    const mm = Math.floor((rightTime / 1000 / 60) % 60)
    const ss = Math.floor((rightTime / 1000) % 60)
    showTime = `${dd}天${hh}小时${mm}分${ss}秒`
  }
  else {
    showTime = '卫星已离开'
  }
  return showTime
}
function wxIcon(type: any) {
  if (type === '导航卫星') {
    return dhIcon
  }
  else if (type === '地球资源卫星') {
    return zyIcon
  }
  else if (type === '军事卫星') {
    return jsIcon
  }
  else if (type === '通讯卫星') {
    return txIcon
  }
  else if (type === '气象卫星') {
    return qxIcon
  }
  else if (type === '近地空间科研卫星') {
    return jdIcon
  }
  else if (type === '测地卫星') {
    return cdIcon
  }
  else if (type === '天文观测卫星') {
    return twIcon
  }
}
function countDownStart() {
  timer = setInterval(() => {
    lists.forEach((item: { countDownMs: any }, index) => {
      if (item.countDownMs > 0) {
        item.countDownMs -= 1000
      }
      else {
        lists.splice(index, 1)
      }
    })
  }, 1000)
}
watch(
  () => props.infoData,
  (newVal, oldVal) => {
    lists = newVal
    if (timer) {
      clearInterval(timer) // 清除定时器
    }
    countDownStart()
  },
)

onMounted(() => {
  if (lists.length > 0) {
    if (timer) {
      clearInterval(timer) // 清除定时器
    }
    countDownStart()
  }
})
</script>

<template>
  <div class="common-layout">
    <el-card class="box-card current-airport">
      <template #header>
        <div class="card-header bs-tit">
          <span>当前临空<em>{{ props.infoData.length }}</em>颗</span>
        </div>
      </template>
      <div class="list_box">
        <vue3-seamless-scroll v-if="props.infoData.length > 0" singleLine="true" direction="left" :limit-scroll-num="3"
          step="0.5" class="scroll-box" :list="props.infoData">
          <div v-for="(item) in props.infoData" v-show="item.countDownMs > 0" :key="item.id" class="box-card-child">
            <div class="box-card-item">
              {{ item.name }}
            </div>
            <div class="box-card-item ">
              {{ item.satelliteType }}
            </div>
            <div class="box-card-item ">
              {{ item.nationality }}
            </div>
            <div class="box-card-item ">
              {{ item.enterTime }}
            </div>
            <div class="box-card-item ">
              {{ item.leaveTime }}
            </div>
            <div class="box-card-item ">
              {{ countDownFun(item.countDownMs) }}
            </div>
          </div>
        </vue3-seamless-scroll>
      </div>

      <!-- <div class="list_box">
        <el-carousel height="100%" indicator-position="none" class="carousel-box">
          <el-carousel-item v-for="(val, index) in props.infoData" :key="index" class="box-card-child-box">
            <div v-for="(item) in val" v-show="item.countDownMs > 0" :key="item.id" class="box-card-child">
              <div class="box-card-item">
                {{ item.name }}
              </div>
              <div class="box-card-item">
                {{ item.satelliteType }}
              </div>
              <div class="box-card-item">
                {{ item.nationality }}
              </div>
              <div class="box-card-item">
                {{ item.enterTime }}
              </div>
              <div class="box-card-item">
                {{ item.leaveTime }}
              </div>
              <div class="box-card-item">
                {{ countDownFun(item.countDownMs) }}
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div> -->

      <div v-if="props.infoData.length === 0" style="width: 100%;height: 100%;">
        <img :src="noData" alt="" style="width: auto;height: 98%;margin: 0 auto;display: block;">
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  height: 100%;
}

.box-card {
  height: 100%;
  border: none;
  border-radius: 0;
}

.list_box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  // overflow: hidden;
  // display: flex;
  // justify-content: space-between;
  // flex-wrap: wrap;
}

.scroll-box {
  height: 100%;
}

.scroll-box > :first-child {
  height: 100%;
}

.box-card-child-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.box-card-child {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  padding: 10px;
  color: #fff;
  background: rgb(255 255 255 / 15%);
  box-shadow: var(--el-box-shadow-light);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: left;
  margin: 0;
  margin-right: 20px;
}

:deep(::-webkit-scrollbar) {
  width: 5px;
  height: 5px;
  border-radius: 10px;
  transition: all 2s;
}

:deep(::-webkit-scrollbar-track) {
  box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background-color: #e3e3e3;
}

:deep(::-webkit-scrollbar-thumb) {
  border: none;
  border-radius: 10px;
  background: repeating-linear-gradient(45deg, #0179c9, #0179c9 6px, #008eec 6px, #008eec 12px) no-repeat left top/5px 100%;
}

:deep(.el-card__header) {
  border-bottom: none;
  color: #fff;
  padding: 0;
}

:deep(.box-card .el-card__body) {
  height: calc(100% - 62px);
  margin: 0 5px;
  padding: 0 5px;
  overflow: hidden;
  overflow-y: auto;
}

:deep(.el-space__item .el-card__body) {
  background: none;
  text-align: center;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 90%;
}

:deep(.el-space__item .el-card__body .item div) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  font-size: 1.75rem;
}

:deep(.current-airport>.el-card__body>.el-card) {
  margin-bottom: 12px;
  background: rgb(255 255 255 / 15%);

  >.el-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    color: #fff;

    .pic {
      padding: 0 20px;
      flex: none;
    }

    .wx_icon {
      width: 40px;
      height: 40px;
    }

    // > * {
    //   flex: 1;
    // }
  }

  h2 {
    padding: 0;
    margin: 0;
    font-size: 18px;
    line-height: 2;

    em {
      font-size: 14px;
      font-style: normal;
      font-weight: normal;
    }
  }

  h2.count-down-tit {
    color: #f86767;
  }

  h2.transit-time {
    color: #00aeff;
  }

  h2.exit-time {
    color: #c3c3c3;
  }

  .count-down {
    font-size: 20px;
    font-weight: bold;
  }
}

:deep(.current-airport>.el-card__body>.el-card:first-child) {
  border-color: #fe0;
}

.bs-tit {
  $bs-tit-bgcolor: #51b893;

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  font-size: 18px;
  text-shadow: 0 0 3px #333;
  background: linear-gradient(135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat 10px calc(50% + 10px) / 10px 10px, repeating-linear-gradient(45deg, $bs-tit-bgcolor, $bs-tit-bgcolor 3px, transparent 3px, transparent 6px) no-repeat 2em calc(50% + 10px) / calc(100% - 2.625em) 10px;
  color: #fff;

  span {
    display: block;
    line-height: 48px;
    padding: 0 1em 0 calc(1em + 10px);
    background: linear-gradient(-135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat right calc(50% + 10px) / 10px 10px, linear-gradient($bs-tit-bgcolor, $bs-tit-bgcolor) no-repeat 20px calc(50% + 10px) / calc(100% - 30px) 10px;
  }

  span em {
    font-style: normal;
    padding: 0 0.5em;
    font-size: 20px;
    font-weight: bold;
  }

  span em.badge {
    font-style: normal;
    padding: 0 0.5em;
    background: #f05a65;
    border-radius: 14px;
    font-size: 14px;
    font-weight: normal;
    margin: 0 0.5em;
  }
}

:deep(.el-card) {
  background: none;
}
</style>
