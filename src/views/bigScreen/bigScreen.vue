/* stylelint-disable function-url-quotes */
/* stylelint-disable function-url-quotes */
<script setup lang='ts'>
import { Clock, Close } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'
const router = useRouter()
interface Duty {
  id: string
  name: string
  typeId: string
  typeName: string
  watchkeepers: string
}
const dataInfo = reactive({
  weather: '',
  duty: [] as any,
  notice: [] as any,
  satellite: [] as any,
  satelliteNot: [] as any,
})
const tableHeader = [
  {
    prop: 'name',
    label: '卫星名称',
  },
  {
    prop: 'code',
    label: '卫星编号',
  },
  {
    prop: 'nationality', // prop
    label: '卫星国别',
  },
  {
    prop: 'type_', // prop
    label: '卫星类别',
  },
  {
    prop: 'enterTime', // prop
    label: '进入时间',
  },
  {
    prop: 'leaveTime', // prop
    label: '离开时间',
  },
]
const nowTime = ref('')
function getNowTime() {
  const rollFun = function () {
    nowTime.value = toDateStr(new Date())
    satelliteOver()
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
function satelliteOver() {
  for (const satellite of dataInfo.satellite) {
    satellite.countDownMs = satellite.countDownMs - 1000
    satellite.countDown = getTimeByMs(satellite.countDownMs)
  }
}
function getTimeByMs(ms: number): string {
  const s = ms / 1000
  const countH = ~~(s / 3600)
  const countM = ~~(s % 3600 / 60)
  const countSS = ~~(s % 3600 % 60)
  return `${twoDigits(countH)}:${twoDigits(countM)}:${twoDigits(countSS)}`
}
const dutyIndexMarge: number[] = []
function objectSpanMethod(d: any) {
  if (d.columnIndex === 0) {
    const rowCount = dutyIndexMarge[d.rowIndex]
    if (rowCount === 0) {
      return [0, 0]
    }
    else {
      return [rowCount, 1]
    }
  }
}
function checkMarge(list: any[]) {
  let upId = ''
  let upIndex = 0
  for (let i = 0; i < list.length; i++) {
    dutyIndexMarge[i] = 1
    const duty = list[i]
    if (duty.id === upId) {
      dutyIndexMarge[i] = 0
      dutyIndexMarge[upIndex] = dutyIndexMarge[upIndex] + 1
    }
    else {
      upIndex = i
      upId = duty.id
    }
  }
}
// 滚动效果
function scrollTable() {
  if (dataInfo.duty.length > 5) {
    const tmp = dataInfo.duty.shift()
    dataInfo.duty.push(tmp)
    checkMarge(dataInfo.duty)
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
}
// websocket配哦之
let websock
// function websocketonopen() {
//   console.log("WebSocket连接成功");
// }
// function websocketonerror(e: any) {
//   console.log("WebSocket连接发生错误");
// }
// 接受ws消息
function websocketOnmessage(e: any) {
  const parse = JSON.parse(e.data)
  if (parse.type === '1') {
    const dutyList = parse.message.flatMap((d: any) => {
      return d.types.map((type: any, index: number) => {
        return {
          id: d.id,
          name: d.name,
          typeId: type.id,
          typeName: type.name,
          watchkeepers: type.watchkeepers.map((op: any) => op.name).join(' '),
        } as Duty
      })
    })
    checkMarge(dutyList)
    dataInfo.duty = dutyList
  }
  else if (parse.type === '2') {
    dataInfo.notice = parse.message
  }
  else if (parse.type === '31') {
    const satelliteList = parse.message
    const nowMs = new Date().getTime()
    for (const satellite of satelliteList) {
      satellite.countDownMs = new Date(satellite.leaveTime).getTime() - nowMs
      satellite.countDown = getTimeByMs(satellite.countDownMs)
    }
    dataInfo.satellite = satelliteList
  }
  else if (parse.type === '32') {
    dataInfo.satelliteNot = parse.message
  }
  else if (parse.type === '4') {
    dataInfo.weather = parse.message.content
  }
}

// 接收预案ws
function websocketOnmessageYa(e: any) {
  const parse = JSON.parse(e.data)
  window.console.log(parse)
}

// function websocketclose(e: any) {
// }
function initWebSocket() {
  const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
  const url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/${'wsTerminal'}/${useRoute().params.terminalId}`
  websock = new WebSocket(url)
  // websock.onopen = websocketonopen;
  // websock.onerror = websocketonerror;
  websock.onmessage = websocketOnmessage
  // websock.onclose = websocketclose;
}
function exit() {
  router.push({ name: 'bigScreenStart' })
}

function initWebSocketYa() {
  const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
  const url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/${'wsPrePlan'}/123`
  websock = new WebSocket(url)
  // websock.onopen = websocketonopen;
  // websock.onerror = websocketonerror;
  websock.onmessage = websocketOnmessageYa
  // websock.onclose = websocketclose;
}
onMounted(() => {
  getNowTime()
  setInterval(scrollTable, 10000)
  initWebSocket()
  initWebSocketYa()
})
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-header height="96px" class="wx-header">
        <h3><span>{{ dataInfo.weather }}</span></h3>
        <h2 data-content="阵地综合信息发布系统">
          阵地综合信息发布系统
        </h2>
        <div class="date">
          {{ nowTime }}
        </div>
        <el-button type="danger" :icon="Close" circle @click="exit" />
      </el-header>
      <el-container style="height: calc(100vh - 96px); display: flex; gap: 24px; padding: 16px 24px 0;">
        <el-aside width="450px">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>通知公告</span>
              </div>
            </template>
            <div v-for="notice in dataInfo.notice.length > 4 ? dataInfo.notice : dataInfo.notice.slice(0, 4)" :key="notice.id" class="text item notice">
              <div>
                <h3>{{ notice.title }}</h3>
                <p>{{ notice.content }}</p>
              </div>
              <p class="notice-time">
                {{ notice.overdueTime }}
              </p>
            </div>
          </el-card>

          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>值班信息</span>
              </div>
            </template>
            <el-table
              :data="dataInfo.duty"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 0;"
            >
              <el-table-column
                prop="name"
                label="值班安排"
              />
              <el-table-column
                prop="typeName"
                label="值班岗位"
              />
              <el-table-column
                prop="watchkeepers"
                label="值班人员"
              />
            </el-table>
          </el-card>
        </el-aside>
        <el-main>
          <div style="height: 520px; flex: none; position: relative;">
            <h2 style="position: absolute; top: 0; left: 0; right: 0; text-align: center; color: #fff; font-weight: normal; font-size: 18px;">
              当前临空<em style="color: #ff0; font-size: 20px; font-style: normal; margin: 0 0.5em; font-weight: bold;">{{ dataInfo.satellite.length }}</em>颗
            </h2>
            <img src="../../assets/images/temp.jpg" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <el-card class="box-card current-airport">
            <template #header>
              <div class="card-header">
                <span>当前临空<em>{{ dataInfo.satellite.length }}</em>颗</span>
              </div>
            </template>
            <el-card v-for="(item) in dataInfo.satellite.length < 3 ? dataInfo.satellite : dataInfo.satellite.slice(0, 3)" :key="item.id" class="box-card">
              <div class="pic item">
                <img src="../../assets/images/wx1.png">
              </div>
              <div class="text item">
                <div class="text item" style="line-height: 2;">
                  <h2>{{ item.name }} <em>{{ item.code }}</em></h2>
                </div>
                <div class="text item wx-attr">
                  {{ item.nationality }} {{ item.type_ }}
                </div>
              </div>
              <div class="text item count-down-box">
                <h2 class="count-down-tit">
                  倒计时
                </h2>
                <div class="count-down">
                  {{ item.countDown }}
                </div>
              </div>
              <div class="text item">
                <h2 class="transit-time">
                  过境时长
                </h2>
                {{ item.leaveTime }}
              </div>
              <div class="text item">
                <h2 class="exit-time">
                  离开时间
                </h2>
                {{ item.leaveTime }}
              </div>
            </el-card>
          </el-card>
        </el-main>
        <el-aside width="450px">
          <el-card class="box-card current-airport">
            <template #header>
              <div class="card-header">
                <span>即将临空<em>{{ dataInfo.satelliteNot.length }}</em>颗</span>
              </div>
            </template>
            <el-card v-for="(item) in dataInfo.satelliteNot.length < 3 ? dataInfo.satelliteNot : dataInfo.satelliteNot.slice(0, 3)" :key="item.id" class="box-card">
              <div class="pic item">
                <img src="../../assets/images/wx1.png">
              </div>
              <div class="text item">
                <div class="text item" style="line-height: 1.2;">
                  <em style="font-style: normal; font-size: 12px;">{{ item.code }}</em>
                </div>
                <div class="text item" style="line-height: 2;">
                  <h2>{{ item.name }}</h2>
                </div>
                <div class="text item wx-attr">
                  {{ item.nationality }} {{ item.type_ }}
                </div>
              </div>
              <div class="text item">
                <h2 class="transit-time">
                  进入时间
                </h2>
                {{ item.enterTime }}
              </div>
            </el-card>
          </el-card>
          <div class="alarm">
            <h2>报警信息</h2>
            <div class="alarm-view">
              <div class="cont">
                <p>卫星 厄佛格 即将过境至XXX省</p>
                <p>1分钟前</p>
              </div>
              <div class="cont">
                <p>卫星 阿博茨德•厄佛格 即将过境至 那然色布斯台音布拉格</p>
                <p>3分钟前</p>
              </div>
              <div class="cont">
                <p>卫星 厄佛格 即将过境至XXX省</p>
                <p>2023-03-02</p>
              </div>
            </div>
          </div>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>气象信息</span>
              </div>
            </template>
            <div>
              <img src="../../assets/images/temp-tq.png" style="width: 100%; height: 100%; object-fit: fill;">
            </div>
          </el-card>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
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

.common-layout {
  background: url(../../assets/images/big-screen-bg.jpg) no-repeat center center/100% 100%;
}

.wx-header {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #fff;
  gap: 92px;

  .date {
    padding-top: 24px;
    flex: 1;
    font-size: 12px;
  }

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
    width: 712px;
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

.el-header {
  height: 95px;
  background: url(../../assets/images/big-screen-header.png) no-repeat center top;
}

.el-aside,
.el-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;

  > .el-card {
    flex: 1;
    border-radius: 0;
    background: linear-gradient(to right, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left top/100% 1px, linear-gradient(to right, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left bottom/100% 1px, linear-gradient(to top, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left top/1px 100%, linear-gradient(to top, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat right top/1px 100%, linear-gradient(to right, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat left 1px/100% 1px, linear-gradient(to right, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat left calc(100% - 1px)/100% 1px, linear-gradient(to top, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat 1px top/1px 100%, linear-gradient(to top, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat calc(100% - 1px) top/1px 100%, linear-gradient(to top, #0d7ac7, #0d7ac7 1px, transparent 1px, transparent calc(100% - 1px), #0d7ac7 calc(100% - 1px), #0d7ac7) no-repeat left top/100% 100%, linear-gradient(to right, #0d7ac7, #0d7ac7 1px, transparent 1px, transparent calc(100% - 1px), #0d7ac7 calc(100% - 1px), #0d7ac7) no-repeat left top/100% 100%, rgb(48 80 153 / 35%);
    border: none;
  }
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.table) {
  margin: 0;
}

.el-space {
  display: flex;
  justify-content: space-between;
}

:deep(.el-space__item) {
  width: calc(100% / 3 - 8px);
}

.el-main {
  flex: 1;
  padding: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  font-size: 18px;
  background: linear-gradient(135deg, transparent, transparent 50%, #0d619b 50%, #0d619b) no-repeat 0.5em calc(50% + 8px)/10px 10px, linear-gradient(-135deg, transparent, transparent 50%, #0d619b 50%, #0d619b) no-repeat calc(16px * 10 + 0.5em + 10px) calc(50% + 8px)/10px 10px, linear-gradient(#0d619b, #0d619b) no-repeat calc(0.5rem + 10px) calc(50% + 8px)/calc(16px * 10 + 1px) 10px, repeating-linear-gradient(45deg, #0d619b, #0d619b 3px, transparent 3px, transparent 6px) no-repeat calc(0.5em + 20px + 151px) calc(50% + 8px)/calc(100% - 0.5em - 194px) 10px;

  > span {
    padding: 0 1rem;
    width: calc(16px * 10);
    text-align: center;
    margin-left: calc(0.5em + 10px);
  }

  em {
    color: #ff0;
    font-size: 20px;
  }
}

:deep(.el-card__header) {
  border-bottom: none;
  color: #fff;
  padding: 0;
}

.card-header em {
  font-style: normal;
  padding: 0 0.5rem;
  font-weight: bold;
}

:deep(.box-card .el-card__body) {
  height: calc(100% - 62px);
  margin: 0 5px;
  padding: 0 5px;
  overflow: hidden;
  overflow-y: auto;
}

.notice {
  border-bottom: 1px dashed #fff;
  padding: 0.85rem;
  color: #fff;
  display: flex;
  align-items: flex-end;
  gap: 20px;

  >div {
    flex: 1;
  }

  h3 {
    margin: 0;
    padding: 0;
    font-size: 18px;
  }

  p {
    margin: 0;
    padding: 0;
    line-height: 1.75;
    font-size: 16px;
  }

  p.notice-time {
    text-align: right;
    font-size: 12px;
    color: #e3e3e3;
  }
}

.notice :deep(.el-table tr),
:deep(.el-table th) {
  background: none;
  color: #333;
}

:deep(.el-table) {
  --el-table-bg-color: none;

  * {
    background: none;
    color: #fff;
    border-color: rgb(255 255 255 / 75%);
  }
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: transparent;
}

:deep(.el-space__item) {
  height: calc(100vh - 140px - 114px - 240px - 32px);
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

    > * {
      flex: 1;
    }

    .wx-attr {
      font-size: 14px;
    }
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

.alarm {
  height: 160px;
  padding: 16px;
  flex: none;
  background: #e76666aa;

  h2 {
    height: 40px;
    margin: 0;
    padding: 0;
    color: #ff0;
    font-size: 20px;
  }

  .alarm-view {
    height: 88px;
    padding: 0 10px;
    margin: 0 5px;
    overflow: hidden;
    overflow-y: auto;

    .cont {
      display: flex;
      align-items: flex-end;
      color: #fff;
      gap: 20px;
      padding: 6px 0;
      border-bottom: 1px solid #fff6;

      p {
        margin: 0;
        padding: 0;
      }

      p:first-child {
        flex: 1;
      }
    }

    .cont:last-child {
      border-bottom: none;
    }
  }

  ::-webkit-scrollbar-thumb {
    background: repeating-linear-gradient(45deg, #c9c900, #c9c900 6px, #ff0 6px, #ff0 12px) no-repeat left top/5px 100%;
  }
}
</style>
