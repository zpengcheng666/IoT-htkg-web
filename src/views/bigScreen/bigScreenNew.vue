<script lang="ts" setup>
import { nextTick } from 'vue'
import { Bell, Close, Switch } from '@element-plus/icons-vue'
import notice from '../systemSet/terminalManagement/components/notic.vue'
import alarm from '../systemSet/terminalManagement/components/alarm.vue'
import card from '../systemSet/terminalManagement/components/card.vue'
import oneCard from '../systemSet/terminalManagement/components/oneCard.vue'
import frontage from '../systemSet/terminalManagement/components/frontage.vue'
import dutyBox from '../systemSet/terminalManagement/components/duty.vue'
import handDuty from '../systemSet/terminalManagement/components/handDuty.vue'
import weather from '../systemSet/terminalManagement/components/weather.vue'
import bigHeader from '../systemSet/terminalManagement/components/header.vue'
import bigVideo from '../systemSet/terminalManagement/components/video.vue'
import satelliteNot from '../systemSet/terminalManagement/components/satelliteNot.vue'
import bigDoor from '../systemSet/terminalManagement/components/door.vue'
import emergency from '../systemSet/terminalManagement/components/emergency.vue'
import safetyDoor from '../systemSet/terminalManagement/components/safetyDoor.vue'
import satelliteSecure from '../systemSet/terminalManagement/components/satelliteSecure.vue'
import satelliteAll from '../systemSet/terminalManagement/components/satelliteAll.vue'
import emergencyDialog from './components/emergencyDialog.vue'
import doorDialog from './components/doorDialog.vue'
import pageBg from '@/assets/images/big-screen-bg3.jpg'
import api from '@/api'
const props = defineProps({
  // 详情数据
  terminalInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  layoutList: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 是否预览
  isPre: {
    type: Boolean,
    // 类型
    default: false,
  },

})
const router = useRouter()
interface Duty {
  id: string
  name: string
  typeId: string
  typeName: string
  watchkeepers: string
}
const dataInfo = reactive({
  weather: [] as any,
  duty: [] as any,
  handDuty: [] as any,
  notice: [] as any,
  satellite: [] as any,
  satelliteNot: [] as any,
  doorList: [] as any,
  emergencyList: {} as any,
  alarmList: [] as any,
  ajmList: { in: 0, out: 0 } as any,
  cardList: [] as any,
  safePeriodList: [] as any,
  satelliteAllList: [] as any
})
const terminalInfoNew = reactive(props.terminalInfo)
const layoutListNew = reactive(props.layoutList)
const gridlayout = ref()
const content = ref()
// const heightW = document.documentElement.offsetHeight
// console.log(heightW)
let timer: any
const data = reactive({
  // 布局列数
  layoutColNum: 12,
  // 定义上栅格系统每行的高度，单位像素。
  rowHeight: 84,
  // 栅格中的元素是否可拖拽
  draggable: false,
  // 栅格中的元素是否可调整大小
  resizable: false,
  layoutList: layoutListNew,
  terminalInfo: terminalInfoNew,
})

const bgStyle = reactive({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${pageBg})`,
  backgroundColor: terminalInfoNew.backgroundColor,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})

const dutyIndexMarge: number[] = []
// 像下面这样做就使 prop 和后续更新无关了
// function checkMarge(list: any[]) {
//   let upId = ''
//   let upIndex = 0
//   for (let i = 0; i < list.length; i++) {
//     dutyIndexMarge[i] = 1
//     const duty = list[i]
//     if (duty.id === upId) {
//       dutyIndexMarge[i] = 0
//       dutyIndexMarge[upIndex] = dutyIndexMarge[upIndex] + 1
//     }
//     else {
//       upIndex = i
//       upId = duty.id
//     }
//   }
// }
// 滚动效果
function scrollTable() {
  if (dataInfo.duty.length > 5) {
    const tmp = dataInfo.duty.shift()
    dataInfo.duty.push(tmp)
    // checkMarge(dataInfo.duty)
  }
  if (dataInfo.satelliteNot.length > 3) {
    const tmp = dataInfo.satelliteNot.shift()
    dataInfo.satelliteNot.push(tmp)
  }
  if (dataInfo.satellite.length > 3) {
    const tmp = dataInfo.satellite.shift()
    dataInfo.satellite.push(tmp)
  }

  if (dataInfo.notice.length > 4) {
    const tmp = dataInfo.notice.shift()
    dataInfo.notice.push(tmp)
  }
  if (dataInfo.handDuty.length > 4) {
    const tmp = dataInfo.handDuty.shift()
    dataInfo.handDuty.push(tmp)
  }
}
function getTimeByMs(ms: number): string {
  const s = ms / 1000
  const countH = ~~(s / 3600)
  const countM = ~~(s % 3600 / 60)
  const countSS = ~~(s % 3600 % 60)
  return `${twoDigits(countH)}:${twoDigits(countM)}:${twoDigits(countSS)}`
}
function twoDigits(val: number) {
  if (val < 10) {
    return `0${val}`
  }
  return val
}
const dialogDoor = ref(false) // 门禁弹窗
const dialogEmergency = ref(false) // 应急弹窗
// 退出
function exit() {
  router.push({ name: 'bigScreenStartNew' })
}
// 门禁
function door() {
  dialogDoor.value = true
}
function closeDoor() {
  dialogDoor.value = false
}

// 应急
function openEmergency() {
  dialogEmergency.value = true
}
function closeEmergency() {
  dialogEmergency.value = false
}
let websock
const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
const url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/wsTerminal/${useRoute().params.terminalId}`
function websocketClose(ev: CloseEvent) {
  setTimeout(() => {
    initWebSocket()
  }, 1000)
}
function websocketOnmessage(e: any) {
  const parse = JSON.parse(e.data)
  // console.log(parse)

  if (parse.type === '100') {
    setInfo(parse.message)
  }
  else if (parse.type === '1') { // 值班
    if (parse.message.length > 0) {
      const dutyList = parse.message
      const newArr = []
      for (let i = 0; i < dutyList.length; i += 3) {
        newArr.push(dutyList.slice(i, i + 3))
      }
      // infoDataForm = newArr
      // console.log(dutyList)
      dataInfo.duty = newArr
    }
    else {
      dataInfo.duty = []
    }
  }
  else if (parse.type === '2') { // 通知公告
    dataInfo.notice = parse.message
  }
  else if (parse.type === '3') {//所有卫星
    const slicedArrays = [];
    for (let i = 0; i < parse.message.length; i += 3) {
      slicedArrays.push(parse.message.slice(i, i + 3));
    }
    console.log(slicedArrays);

    // return slicedArrays;
    dataInfo.satelliteAllList = slicedArrays
  }
  else if (parse.type === '31') {
    // 当前临空
    const satelliteList = parse.message
    // console.log(satelliteList)
    const nowMs = new Date().getTime()
    for (const satellite of satelliteList) {
      satellite.countDownMs = new Date(satellite.leaveTime).getTime() - nowMs
      satellite.countDown = getTimeByMs(satellite.countDownMs)
    }

    // const slicedArrays = [];
    // for (let i = 0; i < satelliteList.length; i += 3) {
    //   slicedArrays.push(satelliteList.slice(i, i + 3));
    // }
    dataInfo.satellite = satelliteList
  }
  else if (parse.type === '32') {
    // 即将临空
    const satelliteNot = parse.message
    const nowMs = new Date().getTime()
    for (const satellite of satelliteNot) {
      satellite.countDownMs = new Date(satellite.leaveTime).getTime() - nowMs
      satellite.countDown = getTimeByMs(satellite.countDownMs)
    }
    dataInfo.satelliteNot = satelliteNot
  }
  else if (parse.type === '33') {
    dataInfo.safePeriodList = parse.message
  }
  else if (parse.type === '4') { // 天气
    dataInfo.weather = parse.message
  }
  else if (parse.type === '5') { // 进出
    dataInfo.doorList = parse.message
  }
  else if (parse.type === '6') { // 报警
    dataInfo.alarmList = parse.message
  }
  else if (parse.type === '7') { // 安检门
    dataInfo.ajmList = parse.message
  }
  else if (parse.type === '8') { // 应急
    if (!parse.message) {
      dialogEmergency.value = false
      dataInfo.emergencyList = parse.message
    }
    else {
      dataInfo.emergencyList = parse.message
    }
  }
  else if (parse.type === '51') { // 刷卡
    dataInfo.cardList = parse.message
  }
  else if (parse.type === '12') { // 手动值班
    dataInfo.handDuty = parse.message
  }
}

function initWebSocket() {
  websock = new WebSocket(url)
  websock.onmessage = websocketOnmessage

  // websock.onopen = websocketonopen
  // websock.onerror = websocketonerror
  websock.onclose = websocketClose
}

function setInfo(result: any) {
  data.layoutList = result.infoList
  data.terminalInfo = result
  nextTick(() => {
    bgStyle.backgroundColor = result.backgroundColor
  })
}

// 获取大屏详情
function getInfo(id: any) {
  api.get(`system/baseTerminal/queryById?id=${id}`).then((res: any) => {
    setInfo(res.result)
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取即将临空信息
function getWill(id: any) {
  api.get(`message/publishSatellite/listWillInByTerminal/${id}`).then((res: any) => {
    const satelliteNot = res.result
    const nowMs = res.timestamp
    for (const satellite of satelliteNot) {
      satellite.countDownMs = new Date(satellite.enterTime).getTime() - nowMs
      satellite.countDown = getTimeByMs(satellite.countDownMs)
    }
    dataInfo.satelliteNot = satelliteNot
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取当前临空信息
function getNow(id: any) {
  api.get(`message/publishSatellite/listInByTerminal//${id}`).then((res: any) => {
    const satelliteList = res.result
    const nowMs = res.timestamp
    for (const satellite of satelliteList) {
      satellite.countDownMs = (satellite.period * 60 * 1000) - (nowMs - new Date(satellite.enterTime).getTime())
      satellite.countDown = getTimeByMs(satellite.countDownMs)
    }
    dataInfo.satellite = satelliteList
  }).catch((error) => {
    window.console.log(error)
  })
}
const allScreen = () => {
  const domElement = document.documentElement
  if (domElement.requestFullscreen) {
    domElement.requestFullscreen()
  }
}
function listenFull() {
  // 监听键盘按下事件
  document.addEventListener('keydown', (event) => {
    // 判断按下的键是否为F11键
    if (event.key === 'F11') {
      location.reload()
      // 如果当前不在全屏模式，则进入全屏模式
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        }
      }
      else { // 否则退出全屏模式
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }

      // 监听退出全屏模式事件
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          location.reload()
        }
      })
    }
  })
}
onMounted(() => {
  if (props.isPre === false) {
    data.rowHeight = Math.floor((document.body.offsetHeight - 190) / 9)
    getInfo(useRoute().params.terminalId)
    const terminalId = useRoute().params.terminalId
    // getWill(terminalId)
    // getNow(terminalId)
    // if (timer) {
    //   clearInterval(timer) // 清除定时器
    // }
    // timer = setInterval(() => {
    //   getWill(terminalId)
    //   getNow(terminalId)
    // }, 60000)

    listenFull()
    // location.reload()
  }
  else {
    data.rowHeight = Math.floor((document.body.offsetHeight - 316) / 9)
  }
  // console.log(terminalInfoNew)
  setInterval(scrollTable, 10000)
  initWebSocket()
})
</script>

<template>
  <div class="big_config_center_box">
    <div class="big_config_grid_box" :style="bgStyle">
      <div class="header_box">
        <bigHeader />
      </div>
      <!-- <el-button v-if="data.terminalInfo.yjcz === 1 && isPre === false && dataInfo.emergencyList" class="emergencyBtn" type="warning" :icon="Bell" circle @click="openEmergency" /> -->
      <!-- <el-button v-if="data.terminalInfo.mj === 1 && isPre === false" class="doorBtn" type="success" :icon="Switch" circle @click="door" /> -->
      <el-button v-if="isPre === false" class="exitBtn" type="danger" :icon="Close" circle @click="exit" />
      <div ref="content">
        <grid-layout ref="gridlayout" v-model:layout="data.layoutList" :col-num="data.layoutColNum"
          :row-height="data.rowHeight" :max-rows="9" :margin="[12, 12]" :is-draggable="data.draggable"
          :is-resizable="data.resizable" :is-mirrored="false" :vertical-compact="true" :use-css-transforms="true">
          <grid-item v-for="item in data.layoutList" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
            :i="item.i" :style="item.infoType === 'header' ? { background: 'none' } : ''">
            <div style="height: 100%;">
              <notice v-if="item.infoType === 'notice'" :info-data="dataInfo.notice" />
              <alarm v-if="item.infoType === 'alarm'" :info-data="dataInfo.alarmList" />
              <frontage v-if="item.infoType === 'satellite'" :info-data="dataInfo.satellite" />
              <dutyBox v-if="item.infoType === 'duty'" :info-data="dataInfo.duty" :duty-index-marge="dutyIndexMarge" />
              <handDuty v-if="item.infoType === 'handDuty'" :info-data="dataInfo.handDuty" />

              <weather v-if="item.infoType === 'weather'" :info-data="dataInfo.weather" />
              <bigDoor v-if="item.infoType === 'door'" :door-info="dataInfo.doorList" />
              <!-- <bigHeader v-if="item.infoType === 'header'" /> -->
              <bigVideo v-if="item.infoType === 'video'" :video-url="data.terminalInfo.videoUrl" />
              <satelliteNot v-if="item.infoType === 'satelliteNot'" :info-data="dataInfo.satelliteNot" />
              <emergency v-if="item.infoType === 'yjcz'" :info-data="dataInfo.emergencyList" />
              <safetyDoor v-if="item.infoType === 'ajm'" :info-data="dataInfo.ajmList" />
              <card v-if="item.infoType === 'card'" :info-data="dataInfo.cardList" />
              <oneCard v-if="item.infoType === 'oneCard'" :info-data="dataInfo.cardList" />
              <satelliteSecure v-if="item.infoType === 'satelliteSecure'" :info-data="dataInfo.safePeriodList" />
              <satelliteAll v-if="item.infoType === 'satelliteAll'" :info-data="dataInfo.satelliteAllList" />
            </div>
          </grid-item>
        </grid-layout>
      </div>
    </div>
    <!-- 门禁弹窗 -->
    <doorDialog v-if="dialogDoor" :terminal-info="dataInfo.cardList" :door-info="dataInfo.doorList"
      :dialog-visible="dialogDoor" @close-dialog="closeDoor" />
    <!-- 应急弹窗 -->
    <emergencyDialog v-if="dialogEmergency" :dialog-visible="dialogEmergency" :info-data="dataInfo.emergencyList"
      @close-dialog="closeEmergency" />
  </div>
</template>

<style lang="scss" scoped>
.pageBox {
  height: 100%;
}

.big_config_center_box {
  width: 100%;
  height: 100%;

  .big_config_grid_box {
    width: 100%;
    height: 100%;
    background-size: calc((100% - 12px) / 12) 60px;
    overflow: hidden;
    position: relative;

    .exitBtn {
      position: absolute;
      top: 20px;
      right: 10px;
      z-index: 999;
    }

    .doorBtn {
      position: absolute;
      top: 20px;
      right: 50px;
      z-index: 999;
    }

    .emergencyBtn {
      position: absolute;
      top: 20px;
      right: 90px;
      z-index: 999;
    }
  }

  .drag_box {
    width: 100%;
    height: 100%;
  }

  .vue-grid-item {
    $box-border-style: #82cdb1;
    $box-border-color: #2ca97e;

    border-radius: 2px;
    background: linear-gradient(to right, $box-border-style, $box-border-style 10px, transparent 10px, transparent calc(100% - 10px), $box-border-style calc(100% - 10px), $box-border-style) no-repeat left top/100% 1px, linear-gradient(to right, $box-border-style, $box-border-style 10px, transparent 10px, transparent calc(100% - 10px), $box-border-style calc(100% - 10px), $box-border-style) no-repeat left bottom/100% 1px, linear-gradient(to top, $box-border-style, $box-border-style 10px, transparent 10px, transparent calc(100% - 10px), $box-border-style calc(100% - 10px), $box-border-style) no-repeat left top/1px 100%, linear-gradient(to top, $box-border-style, $box-border-style 10px, transparent 10px, transparent calc(100% - 10px), $box-border-style calc(100% - 10px), $box-border-style) no-repeat right top/1px 100%, linear-gradient(to right, $box-border-style, $box-border-style 9px, transparent 9px, transparent calc(100% - 9px), $box-border-style calc(100% - 9px), $box-border-style) no-repeat left 1px/100% 1px, linear-gradient(to right, $box-border-style, $box-border-style 9px, transparent 9px, transparent calc(100% - 9px), $box-border-style calc(100% - 9px), $box-border-style) no-repeat left calc(100% - 1px)/100% 1px, linear-gradient(to top, $box-border-style, $box-border-style 9px, transparent 9px, transparent calc(100% - 9px), $box-border-style calc(100% - 9px), $box-border-style) no-repeat 1px top/1px 100%, linear-gradient(to top, $box-border-style, $box-border-style 9px, transparent 9px, transparent calc(100% - 9px), $box-border-style calc(100% - 9px), $box-border-style) no-repeat calc(100% - 1px) top/1px 100%, linear-gradient(to top, $box-border-color, $box-border-color 1px, transparent 1px, transparent calc(100% - 1px), $box-border-color calc(100% - 1px), $box-border-color) no-repeat left top/100% 100%, linear-gradient(to right, $box-border-color, $box-border-color 1px, transparent 1px, transparent calc(100% - 1px), $box-border-color calc(100% - 1px), $box-border-color) no-repeat left top/100% 100%, rgb(0 81 41 / 35%);
    // border: 1px solid #ededed;
    // padding: 10px;
    position: relative;

    .card-name {
      font-size: 14px;
      font-weight: 700;
    }

    .close-icon {
      cursor: pointer;
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
}
</style>
