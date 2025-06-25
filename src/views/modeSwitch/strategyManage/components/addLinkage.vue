<!--
 * @Description:新增联动策略弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-08-16 14:22:53
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-23 13:14:37
-->
<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import LinkageExpression from './LinkageExpression.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
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

})
const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive({
  rangeStart: '',
  rangeEnd: '',
  eventList: [] as any[],
  deviceList: [] as any[],
  attrList: [] as any[],
  selectOperation: [] as string[],
  show: false,
  alarmStrategyList: [] as any[],
})
const infoDataForm = reactive(props.infoData)
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
const listAlarmStrategy = (dId: string) => {
  const postData = {
    params: {
      deviceId: dId,
      pageNo: 1,
      pageSize: -1,
    },
  }
  api.get('/alarm/alarmStrategy/list', postData).then((res: any) => {
    if (res.code === 200) {
      data.alarmStrategyList = res.result.records
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
function selectType(val: any) {
  infoDataForm.expression = ''
  infoDataForm.expressionStr = ''
  if (infoDataForm.type === 'condition' || infoDataForm.type === 'alarmAck') {
    listDevice()
    if (infoDataForm.type === 'alarmAck' && infoDataForm.alarmDeviceId && infoDataForm.alarmDeviceId.length > 0) {
      listAlarmStrategy(infoDataForm.alarmDeviceId)
    }
  }
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择存储策略类型', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],

  unit: [
    { required: true, message: '请选择单位', trigger: 'change' },
  ],
  period: [
    { required: true, message: '请输入周期', trigger: 'blur' },
  ],
  isEnable: [
    { required: true, message: '请选择是否启用', trigger: 'change' },
  ],
  expression: [
    { required: true, message: '请填写表达式', trigger: 'change' },
  ],
  startTime: [
    { required: true, message: '请选择启动时间', trigger: 'change' },
  ],
  eventId: [
    { required: true, message: '请选择事件', trigger: 'change' },
  ],
  alarmStrategyId: [
    { required: true, message: '请选择报警', trigger: 'change' },
  ],
  alarmDeviceId: [
    { required: true, message: '请选择设备', trigger: 'change' },
  ],

})
function listEvent() {
  api.get('scada/eventManager/listAll').then((res: any) => {
    if (res.code === 200) {
      data.eventList = res.result
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
function listDevice() {
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
const alarmDeviceChange = (val: string) => {
  listAlarmStrategy(val)
}
onMounted(() => {
  listEvent()
  if (infoDataForm.type === 'condition' || infoDataForm.type === 'alarmAck') {
    listDevice()
    if (infoDataForm.type === 'alarmAck' && infoDataForm.alarmDeviceId && infoDataForm.alarmDeviceId.length > 0) {
      listAlarmStrategy(infoDataForm.alarmDeviceId)
    }
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="140px">
      <el-form-item label="联动策略类型" prop="type">
        <el-select v-model="infoDataForm.type" placeholder="请选择" filterable clearable class="form-input" @change="selectType">
          <el-option label="条件联动策略" value="condition" />
          <el-option label="定时联动策略" value="timing" />
          <el-option label="周期联动策略" value="cycle" />
          <el-option label="卫星临空联动策略" value="satellite" />
          <el-option label="报警确认联动策略" value="alarmAck" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="form-input" />
      </el-form-item>

      <el-form-item v-if="infoDataForm.type === 'condition'" label="联动触发条件：" prop="expression">
        <LinkageExpression v-model="infoDataForm.expression" :device-list="data.deviceList" size="700px" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'timing'" label="时间：" prop="expression">
        <el-time-picker v-model="infoDataForm.expression" placeholder="请选择" style="width: 260px;" value-format="HH:mm:ss" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'cycle'" label="单位：" prop="unit">
        <el-select v-model="infoDataForm.unit" filterable clearable placeholder="请选择" class="form-input">
          <el-option label="小时" value="hour" />
          <el-option label="分钟" value="minute" />
          <el-option label="秒" value="second" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'alarmAck'" label="报警设备：" prop="alarmDeviceId">
        <el-select v-model="infoDataForm.alarmDeviceId" filterable clearable placeholder="请选择" class="form-input" @change="alarmDeviceChange">
          <el-option v-for="item in data.deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'alarmAck'" label="报警策略：" prop="alarmStrategyId">
        <el-select v-model="infoDataForm.alarmStrategyId" filterable clearable placeholder="请选择" class="form-input">
          <el-option v-for="item in data.alarmStrategyList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'cycle'" label="周期：" prop="period">
        <el-input v-model="infoDataForm.period" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="事件：" prop="eventId">
        <el-select v-model="infoDataForm.eventId" filterable clearable placeholder="请选择" class="form-input">
          <el-option v-for="item in data.eventList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isEnable">
        <el-radio-group v-model="infoDataForm.isEnable" class="form-input">
          <el-radio label="1" size="large">
            启用
          </el-radio>
          <el-radio label="0" size="large">
            不启用
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述：">
        <el-input v-model="infoDataForm.description" placeholder="请输入" style="width: 100%;" />
      </el-form-item>
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

<style lang="scss" scoped>
.form-input {
  width: 260px;
}
</style>
