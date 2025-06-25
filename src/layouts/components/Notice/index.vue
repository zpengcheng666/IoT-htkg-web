<!--
 * @Description: 报警灯
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-18 14:34:15
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-23 17:26:04
-->
<script lang="ts" setup name="Logo">
import { Bell, Fold, MuteNotification } from '@element-plus/icons-vue'
import Speech from 'speak-tts'
import { ElMessage, ElMessageBox } from 'element-plus'
import alarmList from './components/alarmList.vue'
import noticeList from './components/noticeList.vue'
import remindList from './components/remindList.vue'
import noticeImg from '@/assets/images/notice.png'
import noticeLightImg from '@/assets/images/notice_light.png'
import api from '@/api'
const synth = window.speechSynthesis // 启用文本
const msg = new SpeechSynthesisUtterance() // 表示一次发音请求。其中包含了将由语音服务朗读的内容，以及如何朗读它（例如：语种、音高、音量）。
const data = reactive({
  alarmCnt: 0,
  notifyCnt: 0,
  remindCnt: 0,
  speech: '' as any,
  alarmMsg: '',//报警弹窗文本
  sceneId: '',//场景id
  isBroadcast: 1, // 是否播报，1是0否
  isHasMsg:0,//是否有弹窗，1是 0 否
})

// 语音播报停止
function handleStop(e: any) {
  msg.text = e
  msg.lang = 'zh-CN'
  synth.cancel() // 取消该次语音播放
}
const router = useRouter()
// 复制代码
const bgStyle = reactive({
  background: `radial-gradient(rgba(255, 255, 255, 0) 49%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, .6) 80%, rgba(255, 255, 255, .8) 90%),url(${noticeImg}) center/140%`,
})
const bgStyleLight = reactive({
  background: `radial-gradient(rgba(255, 255, 255, 0) 49%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, .6) 80%, rgba(255, 255, 255, .8) 90%),url(${noticeLightImg}) center/140%`,
})
const isHover = ref(false)
const isShowList = ref(false)
const isAlarm = ref(false)// 是否报警
const activeName = ref('0')

const alarmRef = ref()

// 播放音频
const audio = ref(null) as any
const voicePath = ref('')
const playVoice = (deviceName: any) => {

  const baseUrl = reactive((window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL)
  voicePath.value = baseUrl + '/system/filesUtil/voice/' + deviceName + '.wav'

  nextTick(() => {
    audio.value?.play()
  })
}
const stopVoice = () => {

}

function showNoticeBox() {
  isHover.value = true
}
function hideNoticeBox() {
  isHover.value = false
}
function closeList() {
  isShowList.value = false
  isHover.value = false
  getCount()
}
// 展开报警列表
function openList(val: any) {
  activeName.value = val
  isShowList.value = true
  nextTick(() => {
    alarmRef.value.getList()
  })
}

// 静音
function mute() {
  if (data.isBroadcast === 1) {
    data.isBroadcast = 0
    handleStop('已关闭播报')
    stopVoice()

    ElMessage({
      type: 'success',
      message: '已关闭播报',
    })
  }
  else if (data.isBroadcast === 0) {
    data.isBroadcast = 1
    playVoice('已开启播报')
    ElMessage({
      type: 'success',
      message: '已开启播报',
    })
  }
}

// 语音初始化
function speechInit() {
  data.speech = new Speech()
  data.speech.setLanguage('zh-CN')
  data.speech.init().then(() => {
  })
}


let websock

// 接受ws消息
function websocketOnmessage(e: any) {
  const parse = JSON.parse(e.data)
  // console.log(parse)
  if (parse.type === 1) {
    if (parse.message) {
      isAlarm.value = true
      // 语音播报
      speechInit()
      if (data.isBroadcast === 1) {
        playVoice(parse.deviceName)
        openList('0')
      }
    }
    data.alarmMsg = parse.deviceName + parse.message
    data.sceneId = parse.sceneId
    if (data.isHasMsg ===0&& parse.levelId==='62b0d296c25ac3b9ab31e31dbbdadcb5') {
      openMessageBox()
    }

    // 重新获取数量
    getCount()
    nextTick(() => {
      alarmRef.value.getList()
    })
  }
}
const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
const url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/${'wsAlarm'}/666`
function websocketclose(e: any) {
  setTimeout(() => {
    initWebSocket()
  }, 1000)
}
function initWebSocket() {
  websock = new WebSocket(url)
  websock.onmessage = websocketOnmessage
  websock.onclose = websocketclose
}
// 获取列表
function getCount() {
  api.get('/alarm/alarmData/findNoAckAlarmCount').then((res: any) => {
    data.alarmCnt = res.result[0].alarmCnt
    data.notifyCnt = res.result[0].notifyCnt
    data.remindCnt = res.result[0].remindCnt
  }).catch((error) => {
    window.console.log(error)
  })
}

// 确认框
const openMessageBox = () => {
  data.isHasMsg = 1
  ElMessageBox.confirm(
    data.alarmMsg,
    '紧急告警',
    {
      confirmButtonText: '确认',
      type: 'warning',
      center: true,
      showCancelButton: false
    }
  )
    .then(() => {
      data.isHasMsg = 0
      // openList('0')
      router.push({
        name: 'stage' + data.sceneId,
      })
    })
    .catch(() => {
      data.isHasMsg = 0
    })
}

onMounted(() => {
  initWebSocket()
  getCount()
})
</script>

<template>
  <div class="noticeALLBox" @mouseenter="showNoticeBox()">
    <div :class="isHover ? 'childBoxBg_hover' : 'childBoxBg'" @mouseout="hideNoticeBox()" />
    <div :class="isHover ? 'childBox alarmBox' : 'childBox'" @mouseenter="showNoticeBox()" @click="openList('0')">
      报警
      <div class="badeg">
        {{ data.alarmCnt > 99 ? '99+' : data.alarmCnt }}
      </div>
    </div>
    <div :class="isHover ? 'childBox noticeBox' : 'childBox'" @mouseenter="showNoticeBox()" @click="openList('1')">
      通知
      <div class="badeg">
        {{ data.notifyCnt > 99 ? '99+' : data.notifyCnt }}
      </div>
    </div>
    <div :class="isHover ? 'childBox remindBox' : 'childBox'" @mouseenter="showNoticeBox()" @click="openList('2')">
      提醒
      <div class="badeg">
        {{ data.remindCnt > 99 ? '99+' : data.remindCnt }}
      </div>
    </div>
    <div class="noticeImg" :style="isAlarm ? bgStyleLight : bgStyle">
      <div v-show="!isHover" class="badeg">
        {{ (data.alarmCnt + data.notifyCnt + data.remindCnt) > 99 ? '99+' : data.alarmCnt + data.notifyCnt +
          data.remindCnt }}
      </div>
    </div>
    <div :class="isShowList ? 'noticeList' : 'noticeList noticeListHide'">
      <el-tabs v-model="activeName" class="tabsBox">
        <el-tab-pane label="警告" name="0" />
        <el-tab-pane label="通知" name="1" />
        <el-tab-pane label="提醒" name="2" />
      </el-tabs>
      <div>
        <alarmList v-if="activeName === '0'" ref="alarmRef" />
        <noticeList v-if="activeName === '1'" />
        <remindList v-if="activeName === '2'" />
      </div>
      <div class="audioBox">
        <audio ref="audio" controls hidden="true" :src="voicePath">
          <source :src="voicePath" type="">
        </audio>
      </div>
      <div class="iconBox">
        <el-icon class="icon" @click.stop="mute">
          <el-tooltip class="box-item" effect="dark" content="关闭播报" placement="bottom">
            <MuteNotification v-if="data.isBroadcast === 1" />
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" content="开启播报" placement="bottom">
            <Bell v-if="data.isBroadcast === 0" />
          </el-tooltip>
        </el-icon>
        <el-icon class="icon" @click="closeList">
          <Fold />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.noticeALLBox {
  position: fixed;
  z-index: 2000;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  // text-align: center;
  transition: top 0.5s ease, left 0.5s ease;

  .logo {
    width: 100%;
    height: 100%;
  }

  .childBoxBg {
    width: 60px;
    height: 60px;
    background: rgb(73 95 101 / 80%);
    left: -1rem;
    bottom: -1rem;
    border-radius: 10% 100% 10% 10%;
    position: absolute;
    opacity: 0;
    transition: 0.3s ease-in;
  }

  .childBoxBg_hover {
    width: 175px;
    height: 175px;
    background: rgb(73 95 101 / 80%);
    left: -1rem;
    bottom: -1rem;
    border-radius: 10% 100% 10% 10%;
    position: absolute;
    opacity: 1;
    transition: 0.3s ease-in;
  }

  .noticeImg {
    width: 60px;
    height: 60px;
    position: absolute;
    border-radius: 50%;
    cursor: pointer;
    z-index: 999;
  }

  .childBox {
    position: absolute;
    // display: box;
    // display: flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: radial-gradient(rgb(255 255 255 / 0%) 49%, rgb(255 255 255 / 100%) 75%, rgb(255 255 255 / 60%) 80%, rgb(255 255 255 / 80%) 90%);
    font-size: 0.6rem;
    color: #fff;
    cursor: pointer;
    left: 10px;
    bottom: 10px;
    opacity: 0;
    transition: left 0.2s ease-in, bottom 0.2s ease-in, opacity 0.2s 0.1s;
  }

  .alarmBox {
    left: 5px;
    bottom: 75px;
    opacity: 1;
    transition: left 0.3s ease-in, bottom 0.3s ease-in, opacity 0.2s;
  }

  .noticeBox {
    left: 55px;
    bottom: 55px;
    opacity: 1;
    transition: left 0.3s ease-in, bottom 0.3s ease-in, opacity 0.2s;
  }

  .remindBox {
    left: 75px;
    bottom: 5px;
    opacity: 1;
    transition: left 0.3s ease-in, bottom 0.3s ease-in, opacity 0.2s;
  }

  .badeg {
    position: absolute;
    top: 0;
    right: 0;
    width: auto;
    min-width: 14px;
    height: 14px;
    line-height: 14px;
    border-radius: 0.4rem;
    padding: 0 2px;
    background: rgb(255 0 0 / 100%);
    color: #fff;
    font-size: 12px;
  }
}

.noticeList {
  width: 1150px;
  height: 400px;
  position: absolute;
  background-color: #fff;
  box-shadow: 2px 2px 20px 0;
  padding: 0 10px;
  left: 0;
  bottom: 0;
  z-index: 2000;
  opacity: 1;
  transition: width 0.5s ease, height 0.5s ease, opacity 0.5s;

  .tabsBox {
    // padding: 0 20px;
  }

  .audioBox {
    position: absolute;
    top: 0;
    right: 110px;
  }

  .iconBox {
    position: absolute;
    top: 0;
    right: 10px;

    .icon {
      width: 40px;
      height: 40px;
      font-size: 24px;
      cursor: pointer;
    }
  }
}

.noticeListHide {
  width: 40px;
  height: 40px;
  opacity: 0;
  transition: width 0.5s ease, height 0.5s ease, opacity 0.5s;
  position: absolute;
  z-index: -1;
}
</style>
