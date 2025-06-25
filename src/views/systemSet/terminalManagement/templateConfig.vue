<!--
 * @Description: 模板配置
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-04-24 10:03:54
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-11 10:39:23
-->
<!-- eslint-disable no-mixed-operators -->
<!-- eslint-disable array-callback-return -->
<!-- eslint-disable no-unmodified-loop-condition -->
<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { ElMessage } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick } from 'vue'
import notice from './components/notic.vue'
import alarm from './components/alarm.vue'
import frontage from './components/frontage.vue'
import oneCard from './components/oneCard.vue'
import satelliteSecure from './components/satelliteSecure.vue'
import satelliteAll from './components/satelliteAll.vue'
import card from './components/card.vue'
import duty from './components/duty.vue'
import preview from './components/preview.vue'
import weather from './components/weather.vue'
import bigHeader from './components/header.vue'
import bigVideo from './components/video.vue'
import bigDoor from './components/door.vue'
import emergency from './components/emergency.vue'
import satelliteNot from './components/satelliteNot.vue'
import safetyDoor from './components/safetyDoor.vue'
import ImagesUpload from '@/components/ImagesUpload/index.vue'
import uploadFile from '@/components/uploadFile/index.vue'
import api from '@/api'
import bj from '@/assets/images/bigIcon/bj.png'
import mj from '@/assets/images/bigIcon/mj.png'
import tq from '@/assets/images/bigIcon/tq.png'
import tz from '@/assets/images/bigIcon/tz.png'
import wx from '@/assets/images/bigIcon/wx.png'
import yj from '@/assets/images/bigIcon/yj.png'
import zb from '@/assets/images/bigIcon/zb.png'
import sp from '@/assets/images/bigIcon/sp.png'
import aj from '@/assets/images/bigIcon/aj.png'
import sk from '@/assets/images/bigIcon/sk.png'
const route = useRoute()
const router = useRouter()
const gridlayout = ref()
const content = ref()
const weatherRef = ref()
const data = reactive({
  // 布局列数
  layoutColNum: 12,
  // 定义上栅格系统每行的高度，单位像素。
  rowHeight: 55,
  // 栅格中的元素是否可拖拽
  draggable: true,
  // 栅格中的元素是否可调整大小
  resizable: true,
  // 栅格中的元素是否可以删除
  deleteBtn: true,
  // 子组件列表
  componentList: [
    { terminalName: '天气', infoType: 'weather', imgUrl: tq },
    { terminalName: '值班信息', infoType: 'duty', imgUrl: zb },
    { terminalName: '通知公告', infoType: 'notice', imgUrl: tz },
    { terminalName: '报警信息', infoType: 'alarm', imgUrl: bj },
    { terminalName: '卫星临空', infoType: 'satellite', imgUrl: wx },
    { terminalName: '视频', infoType: 'video', imgUrl: sp },
    { terminalName: '即将临空', infoType: 'satelliteNot', imgUrl: wx },
    { terminalName: '门禁', infoType: 'door', imgUrl: mj },
    { terminalName: '应急处置', infoType: 'yjcz', imgUrl: yj },
    { terminalName: '安检门', infoType: 'ajm', imgUrl: aj },
    { terminalName: '刷卡信息', infoType: 'card', imgUrl: sk },
    { terminalName: '刷卡详情', infoType: 'oneCard', imgUrl: sk },
    { terminalName: '安全时段', infoType: 'satelliteSecure', imgUrl: wx },
    { terminalName: '所有卫星', infoType: 'satelliteAll', imgUrl: wx },
  ] as any,

  layoutList: [] as any,
  layoutIndex: 0,
  draggedItem: '', // 拖拽的组件
  activeTab: '1',
  terminalInfo: {
    img: '',
    color: '',
  } as any,
  devDoorOptions: [] as any,
  ajmOptions: [] as any,
  alarmLevelOptions: [] as any,
  imgUrls: [] as any,
  filesList: [] as any,
  selectIndex: '',
  selectItemInfo: {} as any,
})
const groupA = reactive({
  name: 'site',
  pull: true,
  put: false,
})
const groupB = reactive({
  name: 'site',
  pull: false,
  put: true,
})
const dialogPreview = ref(false)
// 关闭弹窗
function closeDialog() {
  dialogPreview.value = false
}
// 打开预览弹窗
function openDialog() {
  dialogPreview.value = true
}

const bgStyle = reactive({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${data.terminalInfo.img})`,
  backgroundColor: data.terminalInfo.color,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})

function onStart(e: any) {
}
function onEnd(e: any) {
  addItem(data.draggedItem)
}
function onMove(e: any, originalEvent: any) {
  data.draggedItem = e.draggedContext.element
  return false
}

// 添加
function addItem(item: any) {

  item.w = 4
  item.h = 3

  // 重复校验
  for (let i = 0; i < data.layoutList.length; i++) {
    if (item.infoType === data.layoutList[i].infoType) {
      ElMessage({
        type: 'error',
        message: '该组件已存在！',
      })

      return false
    }
  }

  if (item.infoType === 'yjcz') {
    data.terminalInfo.yjcz = 1
  }

  if (item.infoType === 'card') {
    data.terminalInfo.mj = 1
  }

  if (item.infoType === 'ajm') {
    data.terminalInfo.ajm = 1
  }

  if (item.infoType === 'alarm') {
    data.terminalInfo.alarmStatus = 1
  }

  // 初始化元素
  const newItem = {
    ...item,
    i: data.layoutIndex,
    x: 0,
    y: 0,
    w: item.w,
    h: item.h,
  }
  // 无组件
  if (data.layoutList.length === 0) {
    data.layoutList.push(newItem)
    data.layoutIndex++
    return false
  }
  // 确定边界
  const Ys = [] as any; const maxX = 0; let maxY = 0; let edgeX = 0; let edgeY = 0
  data.layoutList.map((item: { y: any; h: any }) => {
    Ys.push(item.y + item.h)
  })
  maxY = Ys.length && Math.max.apply(null, Ys) || 1
  edgeX = data.layoutColNum || 12
  edgeY = maxY
  // 使用二维数组生成地图
  const gridMap = [] as any
  for (let x = 0; x < edgeX; x++) {
    gridMap[x] = []
    for (let y = 0; y < edgeY; y++) {
      gridMap[x][y] = 0
    }
  }
  // 标记占位
  data.layoutList.map((item: { y: any; h: any; x: any; w: any }) => {
    // 将layout中卡片所占区域标记为1
    for (let x = item.x; x < (item.x + item.w); x++) {
      for (let y = item.y; y < (item.y + item.h); y++) {
        gridMap[x][y] = 1
      }
    }
  })
  // 遍历地图，申请位置
  for (let y = 0; y < edgeY; y++) {
    for (let x = 0; x < edgeX; x++) {
      // 申请所需空间
      if (edgeX - x >= item.w && edgeY - y >= item.h) {
        const itemSignArr = [] as any
        for (let a = x; a < (x + item.w); a++) {
          for (let b = y; b < (y + item.h); b++) {
            itemSignArr.push(gridMap[x][y])
          }
        }
        if (!itemSignArr.includes(1)) {
          newItem.x = x
          newItem.y = y
          data.layoutList.push(newItem)
          data.layoutIndex++
          return
        }
      }
    }
  }
  // 无满足条件
  newItem.x = 0
  newItem.y = edgeY
  data.layoutList.push(newItem)
  data.layoutIndex++
}

// 拖拽后
function resizedEvent(item: any) {
  if (item.infoType === 'weather') {
    nextTick(() => {
      weatherRef.value[0].resizeChart()
    })
  }
}

// 删除
function removeItem(val: any) {
  const index = data.layoutList.map((item: { i: any }) => item.i).indexOf(val.i)

  data.layoutList.splice(index, 1)
  if (val.infoType === 'yjcz') {
    data.terminalInfo.yjcz = 0
  }

  if (val.infoType === 'card') {
    data.terminalInfo.mj = 0
  }
  if (val.infoType === 'ajm') {
    data.terminalInfo.ajm = 0
  }
  if (val.infoType === 'alarm') {
    data.terminalInfo.alarmStatus = 0
  }
}

// 获取子组件列表
function getList() {
  api.get('system/baseTerminalModel/list').then((res: any) => {
    data.componentList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取图片
function onSuccess(val: any) {
  data.imgUrls.push(val.result)
  data.terminalInfo.img = val.result
  bgStyle.backgroundImage = `url(${val.result})`
}
function update(val: any) {
  data.imgUrls = val
  data.terminalInfo.img = ''
  bgStyle.backgroundImage = ''
}
// 选择背景颜色
function selectBgColor(val: any) {
  bgStyle.backgroundColor = val
}

// 保存
async function saveBigScreen(formEl: FormInstance | undefined) {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      const postData = JSON.parse(JSON.stringify(data.terminalInfo))
      postData.tempList = data.layoutList
      if (route.query.terminalId === '') {
        // 新增
        api.post('system/baseTerminalTemplate/add', postData).then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: res.message,
            })
            // 返回上一页面
            router.go(-1)
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
      else {
        // 修改
        api.post('system/baseTerminalTemplate/edit', postData).then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              type: 'success',
              message: res.message,
            })
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
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入编码', trigger: 'blur' },
  ],
  locationId: [
    { required: true, message: '请选择位置', trigger: 'change' },
  ],
  doorId: [
    { required: true, message: '请选择门禁', trigger: 'change' },
  ],
  checkDoorId: [
    { required: true, message: '请选择门禁', trigger: 'change' },
  ],
  alarmLevel: [
    { required: true, message: '请选择报警级别', trigger: 'change' },
  ],
})
// 获取门名称下拉
function getDoorOptions() {
  api.get('scada/conSheBei/conSheBeiDoorOptiongs').then((res: any) => {
    data.devDoorOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取安检门下拉
function getAjmOptions() {
  api.get('scada/conSheBei/checkDoor').then((res: any) => {
    data.ajmOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取报警级别下拉
function getAlarmLevelOptions() {
  const postData = {
    params: { type: 'alarm-level-list' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.alarmLevelOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取大屏详情
function getInfo(id: any) {
  api.get(`system/baseTerminalTemplate/queryById?id=${id}`).then((res: any) => {
    const imgArr = []
    if (res.result.img) {
      imgArr.push(res.result.img)
    }
    data.imgUrls = imgArr
    data.layoutList = res.result.tempList
    data.terminalInfo = res.result
    bgStyle.backgroundColor = res.result.color
    bgStyle.backgroundImage = `url(${res.result.img})`
  })
}
function getFile(val: any) {
  data.filesList = val
  if (val.length > 0) {
    data.terminalInfo.videoUrl = val[0].url
  }
  else {
    data.terminalInfo.videoUrl = ''
  }
}

// 点击单个组件
function selectItem(item: any) {
  data.selectItemInfo = item
}

// 移动单个组件
function moveItem(type: any) {
  if (type === 'up') {
    if (data.selectItemInfo.y < 1) {
      return false
    }
    data.selectItemInfo.y -= 1
  }
  else if (type === 'down') {
    if (data.selectItemInfo.y > (8 - data.selectItemInfo.h)) {
      return false
    }
    data.selectItemInfo.y += 1
  }
  else if (type === 'left') {
    if (data.selectItemInfo.x < 1) {
      return false
    }
    data.selectItemInfo.x -= 1
  }
  else if (type === 'right') {
    if (data.selectItemInfo.x > (11 - data.selectItemInfo.w)) {
      return false
    }
    data.selectItemInfo.x += 1
  }
}
onMounted(() => {
  getDoorOptions()
  getAjmOptions()
  getAlarmLevelOptions()
  data.layoutIndex = data.layoutList.length

  // 编辑获取详情
  if (route.query.terminalId !== '') {
    getInfo(route.query.terminalId)
    data.layoutIndex = 100
  }

})
</script>

<template>
  <page-main class="pageBox">
    <div class="big_config_box">
      <div class="big_config_left_box">
        <VueDraggableNext :list="data.componentList" class="drag_box" :sort="false" :group="groupA" animation="300" :move="onMove" @start="onStart" @end="onEnd">
          <div v-for="(v, i) in data.componentList" :key="i" class="big_config_component_item">
            <img class="big_config_component_img" :src="v.imgUrl">
            <span class="big_config_component_text">{{ v.terminalName }}</span>
          </div>
        </VueDraggableNext>
      </div>
      <div class="big_config_center_box">
        <VueDraggableNext :list="[{ name: 'grid' }]" :group="groupB" class="drag_box" animation="300">
          <div :class="data.draggable ? 'big_config_grid_box isEdit' : 'big_config_grid_box'">
            <div ref="content" :style="bgStyle">
              <grid-layout
                ref="gridlayout"
                v-model:layout="data.layoutList"
                :col-num="data.layoutColNum"
                :row-height="data.rowHeight"
                :max-rows="9"
                :margin="[12, 12]"
                :is-draggable="data.draggable"
                :is-resizable="data.resizable"
                :is-mirrored="false"
                :vertical-compact="true"
                :use-css-transforms="true"
              >
                <grid-item
                  v-for="item in data.layoutList"
                  :key="item.i"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :i="item.i"
                  style="cursor: pointer;"
                  :class="item.i === data.selectItemInfo.i ? 'selectBorder' : ''"
                  :static="item.infoType === 'header' ? true : false"
                  @resized="resizedEvent(item)"
                  @click="selectItem(item)"
                >
                  <span v-if="data.deleteBtn " class="close-icon">
                    <el-icon @click="removeItem(item)"><CircleCloseFilled color="red" /></el-icon>
                  </span>
                  <div style="height: 100%;">
                    <notice v-if="item.infoType === 'notice'" />
                    <alarm v-if="item.infoType === 'alarm'" />
                    <frontage v-if="item.infoType === 'satellite'" />
                    <duty v-if="item.infoType === 'duty'" />
                    <weather v-if="item.infoType === 'weather' && dialogPreview === false" ref="weatherRef" />
                    <bigHeader v-if="item.infoType === 'header'" />
                    <bigVideo v-if="item.infoType === 'video'" :video-url="data.terminalInfo.videoUrl" />
                    <satelliteNot v-if="item.infoType === 'satelliteNot'" />
                    <bigDoor v-if="item.infoType === 'door'" />
                    <emergency v-if="item.infoType === 'yjcz'" />
                    <safetyDoor v-if="item.infoType === 'ajm'" />
                    <card v-if="item.infoType === 'card'" />
                    <oneCard v-if="item.infoType === 'oneCard'" />
                    <satelliteSecure  v-if="item.infoType === 'satelliteSecure'"/>
                    <satelliteAll  v-if="item.infoType === 'satelliteAll'"/>
                  </div>
                </grid-item>
              </grid-layout>
            </div>
          </div>
        </VueDraggableNext>
      </div>

      <div class="big_config_right_box">
        <el-tabs v-model="data.activeTab" class="demo-tabs">
          <el-tab-pane label="基本信息" name="1">
            <el-form ref="ruleFormRef" :model="data.terminalInfo" :rules="rules" class="demo-form-inline" label-width="80px">
              <el-form-item label="名称" placeholder="请输入" class="formInput" prop="name">
                <el-input v-model="data.terminalInfo.name" />
              </el-form-item>

              <el-form-item label="背景图片" placeholder="请输入" class="formInput">
                <ImagesUpload :notip="true" :width="80" :height="80" :max="1" :img-urls="data.imgUrls" @update:img-urls="update" @on-success="onSuccess" />
              </el-form-item>
              <el-form-item label="背景颜色" placeholder="请输入" class="formInput">
                <el-color-picker v-model="data.terminalInfo.color" show-alpha @change="selectBgColor" />
              </el-form-item>

              <el-form-item label="上传视频">
                <uploadFile :is-show-warn="false" :file-lists="data.filesList" :ext="['mp4', 'wmv', 'avi', 'rmvb']" :max="1" style="width: 100%;" @get-file="getFile" />
              </el-form-item>
              <el-form-item v-if="data.terminalInfo.mj" label="门禁" placeholder="请选择" class="formInput" prop="doorId">
                <el-select v-model="data.terminalInfo.doorId" filterable clearable placeholder="请选择门名称" @change="getDoorOptions">
                  <el-option
                    v-for="item in data.devDoorOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="data.terminalInfo.ajm" label="安检门" placeholder="请选择" class="formInput" prop="checkDoorId">
                <el-select v-model="data.terminalInfo.checkDoorId" filterable clearable placeholder="请选择安检门" @change="getAjmOptions">
                  <el-option
                    v-for="item in data.ajmOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="data.terminalInfo.alarmStatus" label="报警级别" placeholder="请选择" class="formInput" prop="alarmLevel">
                <el-select v-model="data.terminalInfo.alarmLevel" filterable clearable placeholder="请选择报警级别" @change="getAlarmLevelOptions">
                  <el-option
                    v-for="item in data.alarmLevelOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="描述" placeholder="请输入" class="formInput">
                <el-input v-model="data.terminalInfo.describe" />
              </el-form-item>
            </el-form>
            <div class="drag_bottom">
              <el-button type="primary" size="small" :dark="true" @click="openDialog">
                预览
              </el-button>
              <el-button type="primary" size="small" :dark="true" @click="saveBigScreen(ruleFormRef)">
                保存
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="内容设置" name="2">
            <div style="text-align: center;margin-bottom: 20px;">
              <el-button type="primary" size="small" :dark="true" @click="moveItem('up')">
                上
              </el-button>
              <el-button type="primary" size="small" :dark="true" @click="moveItem('down')">
                下
              </el-button>
              <el-button type="primary" size="small" :dark="true" @click="moveItem('left')">
                左
              </el-button>
              <el-button type="primary" size="small" :dark="true" @click="moveItem('right')">
                右
              </el-button>
            </div>
            <el-form :model="{}" label-width="50px">
              <el-form-item label="宽">
                <el-input-number v-model="data.selectItemInfo.w" :min="1" :max="12" />
              </el-form-item>
              <el-form-item label="高">
                <el-input-number v-model="data.selectItemInfo.h" :min="1" :max="9" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <preview v-if="dialogPreview" :terminal-info="data.terminalInfo" :dialog-visible="dialogPreview" :layout-list="data.layoutList" @close-dialog="closeDialog" />
  </page-main>
</template>

<style lang="scss" scoped>
.pageBox {
  height: 100%;
}

.big_config_box {
  min-height: 610px;
  display: flex;
  justify-content: flex-start;

  .big_config_left_box {
    width: 200px;
    border-right: solid 1px #e0e0e0;
    margin-right: 20px;

    .drag_box {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
    }

    .big_config_component_item {
      width: 80px;
      height: 80px;
      // background-color: aqua;
      margin-right: 10px;
      margin-bottom: 10px;
      text-align: center;
      padding-bottom: 20px;
      box-sizing: border-box;
      position: relative;
      display: flex;
      cursor: pointer;

      .big_config_component_img {
        width: 50px;
        height: 50px;
        object-fit: fill;
        margin: 0 auto;
      }

      .big_config_component_text {
        display: block;
        width: 100%;
        position: absolute;
        bottom: 0;
        font-size: 14px;
      }
    }
  }

  .big_config_center_box {
    flex: 1;

    .big_config_grid_box {
      width: 100%;
      height: 100%;
      background-size: calc((100% - 12px) / 12) 67px;
      overflow: hidden;
    }

    .drag_box {
      width: 100%;
      height: 100%;
    }

    .selectBorder {
      border: solid 2px rgb(207 27 27 / 100%);
    }

    .isEdit {
      background:
        linear-gradient(to right, #f4f4f5 12px, transparent 1px),
        linear-gradient(to bottom, #f4f4f5 12px, transparent 1px);
      background-size: calc((100% - 12px) / 12) 67px;
      background-attachment: local;
      overflow-y: scroll;
    }

    .isEdit .vue-grid-item:hover {
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      transition: box-shadow 0.2s ease;
    }

    .vue-grid-item {
      border-radius: 2px;
      background: linear-gradient(to right, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left top/100% 1px, linear-gradient(to right, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left bottom/100% 1px, linear-gradient(to top, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat left top/1px 100%, linear-gradient(to top, #09abff, #09abff 10px, transparent 10px, transparent calc(100% - 10px), #09abff calc(100% - 10px), #09abff) no-repeat right top/1px 100%, linear-gradient(to right, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat left 1px/100% 1px, linear-gradient(to right, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat left calc(100% - 1px)/100% 1px, linear-gradient(to top, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat 1px top/1px 100%, linear-gradient(to top, #09abff, #09abff 9px, transparent 9px, transparent calc(100% - 9px), #09abff calc(100% - 9px), #09abff) no-repeat calc(100% - 1px) top/1px 100%, linear-gradient(to top, #0d7ac7, #0d7ac7 1px, transparent 1px, transparent calc(100% - 1px), #0d7ac7 calc(100% - 1px), #0d7ac7) no-repeat left top/100% 100%, linear-gradient(to right, #0d7ac7, #0d7ac7 1px, transparent 1px, transparent calc(100% - 1px), #0d7ac7 calc(100% - 1px), #0d7ac7) no-repeat left top/100% 100%, rgb(48 80 153 / 35%);
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
        z-index: 999;
      }
    }
  }

  .big_config_right_box {
    width: 260px;
    border-left: solid 1px #e0e0e0;
    margin-left: 20px;
    padding-left: 20px;
    box-sizing: border-box;

    .drag_bottom {
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
