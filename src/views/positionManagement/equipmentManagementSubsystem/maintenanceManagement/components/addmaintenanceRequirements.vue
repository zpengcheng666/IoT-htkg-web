<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps({
  // 所有属性
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '新增流程项',
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
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm: any = reactive(props.infoData)

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

onMounted(() => {

})

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  index1: [
    { required: true, message: '请输入序号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入作业流程', trigger: 'blur' },
  ],
  thchRequire: [
    { required: true, message: '请输入技术要求', trigger: 'blur' },
  ],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" label-width="120px" :rules="rules">
      <el-form-item label="序号：" prop="index1">
        <el-input v-model="infoDataForm.index1" placeholder="请输入序号" />
      </el-form-item>
      <el-form-item label="作业流程：" prop="name">
        <el-input v-model="infoDataForm.name" type="textarea" placeholder="请输入作业流程" />
      </el-form-item>
      <el-form-item label="技术要求：" prop="thchRequire">
        <el-input v-model="infoDataForm.thchRequire" type="textarea" placeholder="请输入技术要求" />
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

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
