<!--
 * @Description:新增站点弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-06-08 09:53:56
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:00:58
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
})
const emits = defineEmits(['submitDialog', 'update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const data = reactive({
  form: {
    name: '',
    siteCode: '',
    ip: '',
    port: '',
  },
})
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
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
  ],
  siteCode: [
    { required: true, message: '请输入站点编号', trigger: 'blur' },
  ],
  ip: [
    { required: true, message: '请输入ip地址', trigger: 'blur' },
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
  ],
})
function getById() {
  if (!props.id) {
    return
  }
  const config = {
    params: {
      id: props.id,
    },
  }
  api.get('scada/siteManager/queryById', config).then((res: any) => {
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
    v-model="value"
    :title="props.id ? '编辑' : '新增'"
    width="50%"
  >
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="data.form" class="demo-form-inline" label-width="120px" size="small">
      <el-form-item label="站点名称：" prop="name">
        <el-input v-model="data.form.name" :disabled="props.id.length > 0" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="站点编号：" prop="siteCode">
        <el-input v-model="data.form.siteCode" :disabled="props.id.length > 0" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="站点ip：" prop="ip">
        <el-input v-model="data.form.ip" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="站点端口：" prop="port">
        <el-input v-model="data.form.port" placeholder="请输入" class="form-input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="value = false">关闭</el-button>
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
