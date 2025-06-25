<!--
 * @Description:新增设备弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 10:58:13
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import type { CascaderProps } from 'element-plus/lib/components/cascader-panel/src/types'
import api from '@/api'
const props = defineProps({
  // 设备id
  id: {
    type: String,
    default() {
      return ''
    },
  },
  // 设备类型列表
  deviceTypeList: {
    type: Array<any>,
    required: true,
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  form: {
    name: '',
    code: '',
    deviceTypeId: '',
    locationId: '',
    description: '',
    otherName: '',
  },
  locationList: [],
})
// 级联选择框
const locationListProps: CascaderProps = {
  value: 'id',
  label: 'title',
}
const submitDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submitDialog', data.form, props.id.length > 0)
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
const validatePass = (rule: any, value: any, callback: any) => {
  let isHas = /^[A-Za-z0-9\u4e00-\u9fa5-]+$/.test(value)
  if (isHas) {
    callback()
  } else {
    callback(new Error("只允许输入中英文、数字和'-'符号"))
  }
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { validator: validatePass,  trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入设备编码', trigger: 'blur' },
  ],
  deviceTypeId: [
    { required: true, message: '请选择设备类型', trigger: 'blur' },
  ],
  otherName: [
    { required: true, message: '请输入设备别名', trigger: 'blur' },
    { validator: validatePass,  trigger: 'blur' }
  ],
})
function getById() {
  if (!props.id) {
    return
  }
  const postData = {
    params: {
      id: props.id,
    },
  }
  api.get('/scada/conSheBei/queryById', postData).then((res: any) => {
    data.form = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getById()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.id ? '编辑' : '新增'"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="data.form" class="demo-form-inline" label-width="120px" size="small">
      <el-form-item label="设备名称：" prop="name">
        <el-input v-model="data.form.name" :disabled="props.id.length > 0" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="设备编号：" prop="code">
        <el-input v-model="data.form.code" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="设备别名：" prop="otherName">
        <el-input v-model="data.form.otherName" placeholder="请输入" class="form-input" />
      </el-form-item>

      <el-form-item label="设备类型：" prop="deviceTypeId">
        <el-select v-model="data.form.deviceTypeId" :disabled="props.id.length > 0" class="form-input" filterable clearable placeholder="请选择">
          <el-option v-for="t in props.deviceTypeList" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="所在位置：" >
        <el-input v-model="data.form.locationId" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="data.form.description" placeholder="请输入" class="form-input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef)">
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
