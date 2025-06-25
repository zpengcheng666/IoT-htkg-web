<!--
 * @Description: 新增值班弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-06-02 14:31:23
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:28:10
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps({
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  title: {
    type: String,
    default: '值班安排',
  },
  dialogVisible: {
    type: Boolean,
    required: true,
    default: false,
  },

})
const emits = defineEmits(['submitDialog', 'closeDialog'])
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
const infoDataForm = reactive(props.infoData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入值班安排名字', trigger: 'blur' },
  ],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="25%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="值班安排" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
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

