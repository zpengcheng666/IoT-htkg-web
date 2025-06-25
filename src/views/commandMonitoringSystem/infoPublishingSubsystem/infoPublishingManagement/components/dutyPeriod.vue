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
    default: '值班周期',
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
  days: [
    { required: true, message: '请输入值班值班周期', trigger: 'blur' },
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
      <el-form-item label="值班周期" prop="days">
        <el-input-number v-model="infoDataForm.days" placeholder="请输入" class="formInput" />
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
/* stylelint-disable-next-line no-empty-source */
</style>
