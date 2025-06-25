<!--
 * @Description:新增动作弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-08-16 14:22:53
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:28:59
-->
<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'
const props = defineProps({
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  title: {
    type: String,
    default: '新增',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  typeOps: {
    type: Array<any>,
    requiredL: true,
  },

})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const infoDataForm = reactive(props.infoData)
const data = reactive(
  {
    deviceList: [] as any[],
  },
)
const attrList = ref<any[]>([])
const streamList = ref<string[]>([])
const changeType = () => {
  getDeviceList()
  infoDataForm.deviceId = ''
  infoDataForm.operationId = ''
  infoDataForm.operationValue = ''
}
const listStream = () => {
  if (infoDataForm.type === 'perLocation' && infoDataForm.deviceId) {
    api.get(`scada/conSheBei/getCameraByDeviceId?deviceId=${infoDataForm.deviceId}`).then((res: any) => {
      if (res.code === 200) {
        const jsonData = JSON.parse(res.result)
        streamList.value = jsonData.map((d: any) => d.channelid)
      }
      else {
        streamList.value = []
        infoDataForm.channelId = ''
        ElMessage({
          type: 'error',
          message: res.message,
        })
      }
    }).catch((error) => {
      window.console.log(error)
      streamList.value = []
      infoDataForm.channelId = ''
    })
  }
}
const perLocationSet = (attrList: any[]) => {
  let attrId = ''
  for (const attr of attrList) {
    if (attr.enName === 'cameraCtrl') {
      attrId = attr.id
      break
    }
  }
  if (!attrId) {
    ElMessage({
      type: 'error',
      message: '该摄像机不能控制',
    })
    return
  }
  infoDataForm.operationId = attrId
  listStream()
}
const publishSet = (attrList: any[]) => {
  let attrId = ''
  for (const attr of attrList) {
    if (attr.enName === 'startBroadcastCtrl') {
      attrId = attr.id
      break
    }
  }
  if (!attrId) {
    ElMessage({
      type: 'error',
      message: '设备不能控制',
    })
    return
  }
  infoDataForm.operationId = attrId
}
const checkTypeAndSetAttr = (attrList: any[]) => {
  if (infoDataForm.type === 'perLocation') {
    perLocationSet(attrList)
  }
  else if (infoDataForm.type === 'publishSH') {
    publishSet(attrList)
  }
}
const changeDevice = () => {
  if (infoDataForm.deviceId) {
    api.get(`scada/conSheBei/listDeviceAttrByDeviceId?id=${infoDataForm.deviceId}`).then((res: any) => {
      if (res.code === 200) {
        attrList.value = res.result
        checkTypeAndSetAttr(res.result)
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
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submitDialog', val)
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
}
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
const listAllDevice = () => {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/scada/conSheBei/list', postData).then((res: any) => {
    data.deviceList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
const listPublishDevice = () => {
  api.get('/scada/conSheBei/listAllPublish').then((res: any) => {
    data.deviceList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
const listCameraDevice = () => {
  api.get('/scada/conSheBei/listAllCamera').then((res: any) => {
    data.deviceList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function getDeviceList() {
  if (infoDataForm.type === 'set') {
    listAllDevice()
  }
  else if (infoDataForm.type === 'perLocation') {
    listCameraDevice()
  }
  else if (infoDataForm.type === 'publishSH') {
    listPublishDevice()
  }
}

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' },
  ],
  deviceId: [
    { required: true, message: '请选择设备', trigger: 'change' },
  ],
  operationId: [
    { required: true, message: '请选择属性', trigger: 'change' },
  ],
  operationValue: [
    { required: true, message: '请输入操作值', trigger: 'blur' },
  ],
  channelId: [
    { required: true, message: '请输入视频通道', trigger: 'blur' },
  ],
  delayTime: [
    { required: true, message: '请输入动作延时', trigger: 'blur' },
  ],
})
onMounted(() => {
  getDeviceList()
  changeDevice()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型：" prop="type">
            <el-select v-model="infoDataForm.type" filterable clearable placeholder="请选择" style="width: 100%;" @change="changeType">
              <el-option v-for="item in props.typeOps" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="infoDataForm.name" placeholder="" prop="name" />
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="infoDataForm.description" type="textarea" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备：" prop="deviceId">
            <el-select v-model="infoDataForm.deviceId" filterable clearable placeholder="请选择" style="width: 100%;" @change="changeDevice">
              <el-option v-for="item in data.deviceList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="属性：" prop="deviceId">
            <el-select v-model="infoDataForm.operationId" :disabled="infoDataForm.type !== 'set'" filterable clearable placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in attrList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="infoDataForm.type === 'perLocation'" label="视频通道：" prop="channelId">
            <el-select v-model="infoDataForm.channelId" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in streamList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="infoDataForm.type === 'set' || infoDataForm.type === 'videoSave'" label="操作值：" prop="operationValue">
            <el-input v-model="infoDataForm.operationValue" placeholder="" />
          </el-form-item>
          <el-form-item v-if="infoDataForm.type === 'perLocation' " label="预置位编号：" prop="operationValue">
            <el-input v-model="infoDataForm.operationValue" placeholder="" />
          </el-form-item>
          <el-form-item v-if="infoDataForm.type === 'publishSH' " label="任务编号：" prop="operationValue">
            <el-input v-model="infoDataForm.operationValue" placeholder="" />
          </el-form-item>
          <el-form-item label="动作延时(ms)：" prop="delayTime">
            <el-input v-model="infoDataForm.delayTime" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
