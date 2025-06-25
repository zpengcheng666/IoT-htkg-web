<script setup lang='ts'>
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
})
const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive({
  controlSystemList: [] as any[],
  deviceList: [] as any[],
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
  name: [
    { required: true, message: '请输入方案名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入编码', trigger: 'blur' },
  ],
  ddcId: [
    { required: true, message: '请选择所属控制系统', trigger: 'change' },
  ],
  deviceIds: [
    { required: true, message: '请选择启动设备', trigger: 'blur' },
  ],

})
function listControlSystem() {
  const postData = {
    params: {
      typeCode: 'VentilateControlSystem',
    },
  }
  api.get('/scada/conSheBei/listByType', postData).then((res: any) => {
    data.controlSystemList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function changeDdcId() {
  if (infoDataForm.ddcId?.length === 0) {
    return
  }
  const postData = {
    params: {
      systemDeviceId: infoDataForm.ddcId,
    },
  }
  api.get('/scada/conSheBei/listFanBySystemDeviceId', postData).then((res: any) => {
    data.deviceList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  listControlSystem()
  changeDdcId()
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
      <el-form-item label="方案名称：" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="方案编号：" prop="code">
        <el-input v-model="infoDataForm.code" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="所属控制系统：" prop="ddcId">
        <el-select v-model="infoDataForm.ddcId" filterable clearable placeholder="请选择" class="formInput" @change="changeDdcId">
          <el-option v-for="item in data.controlSystemList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="启动设备集合：" prop="deviceIds">
        <el-select v-model="infoDataForm.deviceIds" filterable clearable multiple  placeholder="请选择" class="formInput">
          <el-option v-for="item in data.deviceList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="infoDataForm.description" type="textarea" placeholder="请输入" style="width:260px" />
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
.formInput{
  width: 260px;
}
</style>
