<script lang="ts" setup name="PersonalSetting">
import api from '@/api'

const data = reactive({
  tableData: [] as any,
})
const deviceData = reactive(new Map<string, any>())
function getList(scId: string) {
  const postData = {
    params: {
      sceneId: scId,
    },
  }
  api.get('/api/scada/listEnvDeviceBySceneId', postData).then((res: any) => {
    data.tableData = res.result
    for (const v of data.tableData) {
      for (const dev of v.deviceList) {
        if (!dev.data) {
          continue
        }
        const entries = Object.entries(dev.data)
        deviceData.set(dev.id, new Map(entries))
      }
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
function websocketOnmessage(e: any) {
  const wsData = JSON.parse(e.data)
  if (wsData.messageType === '01') {
    const wdDeviceData = wsData.messageContent
    const deviceId = wdDeviceData.deviceId
    const attr = deviceData.get(deviceId)
    if (!attr) {
      return
    }
    for (const attrData of wdDeviceData.attrs) {
      attr.set(attrData.enName, attrData.value)
    }
  }
}
let reCollectionState = false
function reCollection(sceneId: string) {
  if (reCollectionState) {
    return
  }
  setTimeout(() => {
    initWebSocket(sceneId)
    reCollectionState = false
  }, 5000)
}
function websocketclose(sceneId: string) {
  setTimeout(() => {
    initWebSocket(sceneId)
  }, 1000)
}
let websock: WebSocket
function initWebSocket(sceneId: string) {
  if (sceneId.length === 0) {
    return
  }
  const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
  const url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/websocket/${sceneId}`
  websock = new WebSocket(url)
  websock.onerror = function (e) {
    reCollection(sceneId)
  }
  websock.onmessage = websocketOnmessage
  websock.onclose = function () {
    websocketclose(sceneId)
  }
}
function getRange(deviceId: string, at: any) {
  const d = deviceData.get(deviceId)
  if (!d) {
    return ''
  }
  const ll = d.get(at.llEnName)
  if (!ll) {
    return ''
  }
  const hh = d.get(at.hhEnName)
  if (!hh) {
    return ''
  }
  return `${ll}-${hh}`
}

// 获取数值方法
function getValue(deviceId: string, enName: string) {
  const d = deviceData.get(deviceId)
  if (!d) {
    return ''
  }
  // const value = d.get(enName)
  let value = d.get(enName)// 获取数值

  if (!value) {
    value = '暂无数据'
  }else{
    value =  Number(value).toFixed(2)
  }

  return value
}
function wsClose() {
  if (websock) {
    websock.close()
  }
}

onMounted(() => {
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const sceneId = route.path.substring(index + 1, route.path.length)
  initWebSocket(sceneId)
  getList(sceneId)
})
onBeforeUnmount(() => {
  wsClose()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <div v-for="t in data.tableData" :key="t.title" class="if_box">
        <el-table :data="t.deviceList" style="width: 100%;" stripe>
          <el-table-column :label="t.title">
            <el-table-column prop="name" label="设备名称" />
            <el-table-column v-for="at in t.attrList" :key="at.enName" :label="at.name">
              <el-table-column label="实测值">
                <template #default="scope">
                  <span :class="getValue(scope.row.id, at.alarmEnName) !== '0.00' ? 'alarm' : ''">
                    {{ getValue(scope.row.id, at.enName) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="标定值">
                <template #default="scope">
                  {{ getRange(scope.row.id, at) }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </page-main>
  </div>
</template>

  <style lang="scss" scoped>
.if_box {
  width: 100%;
  max-height: calc(100vh - 124px);
  overflow-y: auto;
  // height: 768px;
  .if {
    width: 100%;
    height: 100%;
    min-height: 630px;
    border: medium none;
  }
}

.alarm {
  color: red;
}
  </style>

