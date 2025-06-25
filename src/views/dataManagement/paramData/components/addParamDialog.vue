<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import CommonSelect from '@/components/CommonSelect/index.vue'
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
    default: '新增参数',
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
    // console.log(val)
    return val
  },
})
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入编号', trigger: 'blur' },
  ],
  value: [
    { required: true, message: '请输入值', trigger: 'blur' },
  ],

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="参数名称" placeholder="请输入" prop="name">
        <el-input v-model="infoDataForm.name" class="formInput" />
      </el-form-item>
      <el-form-item label="参数编号" placeholder="请输入" prop="code">
        <el-input v-model="infoDataForm.code" :disabled="infoDataForm.id && infoDataForm.id.length > 0" class="formInput" />
      </el-form-item>
      <el-form-item label="参数值" placeholder="请输入" prop="value">
        <el-input v-model="infoDataForm.value" type="textarea" class="formInput" />
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入" prop="description">
        <el-input v-model="infoDataForm.description" type="textarea" class="formInput" />
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
.formInput {
  width: 100%;
}
</style>
