<!--
 * @Description:选择点位弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-04-07 16:57:27
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:54:32
-->
<script setup lang='ts'>
import api from '@/api'
const props = defineProps({

  // 标题
  title: {
    type: String,
    default: '选择点位',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  pointInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  form: {
    wgId: '',
    deviceId: '',
    variableId: '',
    gatewayAttrName: '',
  },
  variableInfo: {},
  wgList: [] as any,
  sbList: [] as any,
  pointList: [] as any,
})
const submitDialog = async () => {
  emits('submitDialog', data.variableInfo)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
function changePoint() {
  for (const point of data.pointList) {
    if (point.id === data.form.variableId) {
      data.variableInfo = point
      break
    }
  }
}
// 获取网关列表
function getWgList() {
  api.get('/api/scada/getWg').then((res: any) => {
    data.wgList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取设备列表
function getSbList() {
  const postData = {
    params: {
      wgId: data.form.wgId,
    },
  }
  api.get('/api/scada/getSb', postData).then((res: any) => {
    data.sbList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function getPointById(pointId: String) {
  const postData = {
    params: {
      id: pointId,
    },
  }
  api.get('/api/scada/ConDianWei/queryById', postData).then((res: any) => {
    data.variableInfo = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取点位列表
function getPointList() {
  const postData = {
    params: {
      wgId: data.form.wgId,
      deviceId: data.form.deviceId,
    },
  }
  api.get('/api/scada/getCgq', postData).then((res: any) => {
    data.pointList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  data.form.wgId = props.pointInfo.gatewayId
  data.form.deviceId = props.pointInfo.deviceId
  data.form.variableId = props.pointInfo.pointId
  if (props.pointInfo.pointId) {
    getPointById(props.pointInfo.pointId)
  }
  getWgList()
  if (props.pointInfo.gatewayId) {
    getSbList()
  }
  if (props.pointInfo.deviceId) {
    getPointList()
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <el-form :model="data.form" label-width="90px">
      <el-form-item label="选择网关：">
        <el-select v-model="data.form.wgId" filterable clearable placeholder="请选择" @change="getSbList">
          <el-option v-for="(v, i) in data.wgList" :key="`wg${i}`" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备：">
        <el-select v-model="data.form.deviceId" filterable clearable placeholder="请选择" @change="getPointList">
          <el-option v-for="(v, i) in data.sbList" :key="`sb${i}`" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择点位：">
        <el-select v-model="data.form.variableId" filterable clearable placeholder="请选择" @change="changePoint">
          <el-option v-for="(v, i) in data.pointList" :key="`point${i}`" :label="v.name" :value="v.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 100%;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
