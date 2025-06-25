<!--
 * @Description:新增储存策略弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-08 16:05:50
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:33:05
-->
<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
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
  // 设备列表，在存储策略管理中传递
  deviceList: {
    type: Array<any>,
    required: false,
    default: [] as any[],
  },
  // 存储策略类型
  caseType: {
    type: Array<any>,
    required: true,
  },
  // 是否是来自设备类型管理
  isConfig: {
    type: Boolean,
    required: false,
    default: false,
  },
  // 查询设备属性列表url
  listAttrUrl: {
    type: String,
    required: true,
  },

})
const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive({
  rangeStart: '',
  rangeEnd: '',
  attrList: [] as any[],
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (infoDataForm.type === 'rateOfChange') {
        val.range = `${data.rangeStart}~${data.rangeEnd}`
      }
      emits('submitDialog', val)
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
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

// 校验
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
    { required: true, message: '请选择时间', trigger: 'change' },
  ],
  variableId: [
    { required: true, message: '请选择变量', trigger: 'change' },
  ],
  deviceId: [
    { required: true, message: '请选择设备', trigger: 'change' },
  ],

})
function changeDevice() {
  listAttrByDeviceId(infoDataForm.deviceId)
  infoDataForm.variableId = ''
}
function listAttrByDeviceId(deviceId: string) {
  api.get(`${props.listAttrUrl}=${deviceId}`).then((res: any) => {
    if (res.code === 200) {
      data.attrList = res.result
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

onMounted(() => {
  if (props.isConfig) {
    listAttrByDeviceId(props.infoData.typeId)
  }
  else if (props.infoData.deviceId) {
    listAttrByDeviceId(props.infoData.deviceId)
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
      <el-form-item label="存储策略类型" prop="type">
        <!-- <el-input v-model="infoDataForm.type" placeholder="请输入" /> -->
        <el-select v-model="infoDataForm.type" filterable clearable placeholder="请选择" class="form-input">
          <el-option v-for="item in props.caseType" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="form-input" />
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
      <el-form-item v-if="infoDataForm.type === 'cycle'" label="周期：" prop="period">
        <el-input v-model="infoDataForm.period" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item v-if="!props.isConfig" label="设备：" prop="deviceId">
        <el-select v-model="infoDataForm.deviceId" filterable clearable placeholder="请选择设备" class="form-input" @change="changeDevice">
          <el-option v-for="item in props.deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="变量：" prop="variableId">
        <el-select v-model="infoDataForm.variableId" filterable clearable placeholder="请选择变量" class="form-input">
          <el-option v-for="item in data.attrList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isEnable">
        <el-radio-group v-model="infoDataForm.isEnable" class="form-input">
          <el-radio label="1" size="large">
            启用
          </el-radio>
          <el-radio label="2" size="large">
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
