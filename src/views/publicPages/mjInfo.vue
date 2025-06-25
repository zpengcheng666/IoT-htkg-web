<route lang="yaml">
name: personalSetting
meta:
  title: 类别管理
  cache: personal-edit.password
              </route>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

import offline from '@/assets/images/mjIcon/offline.png'
import alarm_close from '@/assets/images/mjIcon/alarm_close.png'
import alarm_open from '@/assets/images/mjIcon/alarm_open.png'
import fault from '@/assets/images/mjIcon/fault.png'
import online_close from '@/assets/images/mjIcon/online_close.png'
import online_open from '@/assets/images/mjIcon/online_open.png'
interface Tree {
  id: string
  pid: string
  title: string
  childs?: Tree[]
}
const formInline = reactive({
  publishingTerminal: '',
})

const data = reactive({
  treeData: [] as any,
  ruleForm: {
    id: '',
    title: '',
  },
  tableData: [] as any,
  form: {
    name: '',
    pageNo: 1,
    pageSize: 10,

  },
  dialogClassType: 'add',
  classInfo: {
    id: '',
    title: '',
  },
  classId: '',
  currentNodeKey: '',
  multipleSelection: [] as any,
  infoData: {} as any,
  mjInfoData: {} as any, // 门禁详情
  dialogType: 'add',
  dialogTitle: '选择属性',
  addBtnDisabled: true,
  editBtnDisabled: true,
  selectId: '',
  imgUrl: '',
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '属性名称',
  },
  {
    prop: 'attrType',
    label: '属性类型',
  },
  {
    prop: 'unit',
    label: '属性单位',
  },
])

const total = ref(0) // 总条数

const dialogAdd = ref(false) // 添加弹窗
const dialogAddClass = ref(false) // 添加弹窗

// 获取门列表
const getTree = () => {
  const postData = {
    params: { typeId: '1621319441445920769' },
  }
  api.get('scada/conSheBei/listByTypeId', postData).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

let websock: any
const httpUrl = (window as any).baseUrl || import.meta.env.VITE_APP_API_BASEURL
let url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/doorWebSocket`
function websocketClose(ev: CloseEvent) {
  // console.log(66666)
}
function websocketonerror() {
  setTimeout(() => {
    initWebSocket()
  }, 1000)
}
function websocketOnmessage(e: any) {
  const parse = JSON.parse(e.data)
  data.mjInfoData = parse
  const attrMap = new Map()
  for (let i = 0; i < data.mjInfoData.attrs.length; i++) {
    const attr = data.mjInfoData.attrs[i]
    attrMap.set(attr.enName, attr)
  }
  data.imgUrl = online_close
  const online = attrMap.get('onlineState')
  // console.log(attrMap)

  // 离线
  if (!online || online.valueData === '0') {
    data.imgUrl = offline
  }
  // 在线
  else {
    let alarmFlag = false
    const forceInvasion = attrMap.get('forceInvasion')
    const stressEntry = attrMap.get('stressEntry')
    const openTimeout = attrMap.get('openTimeout')
    const shortCircuit = attrMap.get('shortCircuit')
    const openCircuit = attrMap.get('openCircuit')
    const magnetState = attrMap.get('doorState')
    let isOpen = false
    if (magnetState && magnetState.valueData === '1') {
      isOpen = true
    }
    // 报警判断
    if (forceInvasion && forceInvasion.valueData === '1') {
      alarmFlag = true
    }
    else if (stressEntry && stressEntry.valueData === '1') {
      alarmFlag = true
    }
    else if (openTimeout && openTimeout.valueData === '1') {
      alarmFlag = true
    }
    else if (shortCircuit && shortCircuit.valueData === '1') {
      alarmFlag = true
    }
    else if (openCircuit && openCircuit.valueData === '1') {
      alarmFlag = true
    }
    // console.log(alarmFlag)
    // console.log(isOpen)
    if (alarmFlag) {
    // 报警状态
      if (isOpen) {
        data.imgUrl = alarm_open
      }
      else {
        data.imgUrl = alarm_close
      }
    }
    else {
    // 非报警状态
      if (isOpen) {
        data.imgUrl = online_open
      }
      else {
        data.imgUrl = online_close
      }
    }
  }
  //
  //   // 在线
  //   if (data.mjInfoData.attrs[i].enName.onlineState) {
  //     // 报警
  //     if (
  //       data.mjInfoData.attrs[i].forceInvasion
  //         || data.mjInfoData.attrs[i].stressEntry
  //         || data.mjInfoData.attrs[i].openTimeout
  //         || data.mjInfoData.attrs[i].shortCircuit
  //         || data.mjInfoData.attrs[i].openCircuit
  //     ) {
  //       // 在线+无故障+报警+(门开/门关) -> 报警颜色闪烁
  //       data.imgUrl = !data.mjInfoData.attrs[i].magnetState ? alarm_close : alarm_open
  //     }
  //     else {
  //       // 在线+无故障+无报警+(门开/门关) -> 在线
  //       data.imgUrl = !data.mjInfoData.attrs[i].magnetState ? online_close : online_open
  //     }
  //   }
  //   else {
  //     // 离线
  //     data.imgUrl = offline
  //   }
  // }
}

function initWebSocket() {
  websock = new WebSocket(url)
  websock.onmessage = websocketOnmessage
  // websock.onopen = websocketonopen
  websock.onerror = websocketonerror
  websock.onclose = websocketClose
}

// 发送数据
function sendWebSocket(id: any) {
  // websock = new WebSocket(url)
  // websock.onmessage = websocketOnmessage
  // websock.onopen = websocketonopen
  // websock.onerror = websocketonerror
  if (websock) {
    websock.send(id)
  }
}

// 点击列表
function clickList(id: any) {
  data.selectId = id
  url = `${httpUrl.replace('https://', 'ws://').replace('http://', 'ws://')}/doorWebSocket/${id}`
  sendWebSocket(id)
}

// 点击按钮
function cilckBtn(enName: any, value: any) {
  const postData = {
    attrEnName: enName,
    deviceId: data.selectId,
    value,
  }
  api.post('scada/conSheBei/execute', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogAdd.value = false
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
// callback methods
onMounted(() => {
  getTree()
  initWebSocket()
})

// 切换页面关闭ws
onBeforeUnmount(() => {
  // console.log('guanle')
  websock.close()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="4" style="padding: 20px;">
        <div v-for="(v, i) in data.treeData" :key="i" class="leftList" @click="clickList(v.id)">
          <el-check-tag class="btnTag" :checked="data.selectId === v.id ? true : false ">
            {{ v.otherName }}
          </el-check-tag>
        </div>
      </el-col>
      <el-col :span="20" class="el-col-cont">
        <!-- <el-form :inline="true" :model="formInline" label-width="140px"> -->
        <el-row>
          <img :src="data.imgUrl">
        </el-row>

        <el-row>
          <el-col v-for="(v, i) in data.mjInfoData.attrs" :key="i" :span="24">
            <span>{{ v.name }}</span> ： <span>{{ v.value }}</span>
          </el-col>
        </el-row>
        <el-row v-for="(v, i) in data.mjInfoData.services" :key="i">
          <el-button v-if="v.name === '远程开门'" type="primary" @click="cilckBtn(v.enName, v.value)">
            远程开门
          </el-button>
          <el-button v-for="(item, index) in v.values" v-else :key="`c${index}`" type="primary" @click="cilckBtn(v.enName, item.value)">
            {{ item.name }}
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </page-main>
</template>

  <style lang="scss" scoped>
  .leftList {
    // margin-left: 30px;
    margin-bottom: 10px;
    cursor: pointer;
    text-align: center;
  }

  .btnTag {
    width: 150px;
  }

  .page-main {
    padding: 0;
  }

  .el-row {
    height: calc(100vh - 294px);
  }

  .el-row .el-row {
    height: auto;
    padding-top: 16px;
  }

  .el-row .el-col {
    height: 100%;
  }

  .el-col-cont {
    padding: 20px;
  }

  .el-row .el-col:first-child {
    background: #fff;
  }

  .el-row .el-row .el-col {
    background: none;
    height: auto;
  }

  .el-tree {
    background: none;
    margin-top: 20px;

    .is-current * {
      background: #fff;
    }
  }

  .form-pa {
    padding: 1rem 400px 0 0;
  }

  .col-right {
    display: flex;
    justify-content: flex-end;
  }
  </style>

