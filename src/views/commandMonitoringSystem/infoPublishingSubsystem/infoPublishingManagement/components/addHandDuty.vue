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
    default: '手动值班',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])

const data = reactive({
  organOptions: [{
    id: '',
    title: '',
  }],
})

const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submintDialog', val)
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
}
// 页数改变的时候触发的事件
// const submintDialog = (val: any) => {
//   emits('submintDialog', val)
// }
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
const props1 = {
  checkStrictly: true,
  emitPath: false,
  children: 'childs',
  label: 'title',
  value: 'id',
}

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  workName: [
    { required: true, message: '请输入工作名称', trigger: 'blur' },
  ],
  workDay: [
    { required: true, message: '请选择值班日期', trigger: 'change' },
  ],
  workEndDay: [
    { required: true, message: '请选择值班日期', trigger: 'change' },
  ],
  persons: [
    { required: true, message: '请输入值班人员', trigger: 'blur' },
  ],
  // effectiveTime: [
  //   { required: true, message: '请选择生效时间', trigger: 'change' },
  // ],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="40%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="150px">
      <el-form-item label="工作名称" prop="workName">
        <el-input v-model="infoDataForm.workName" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="值班开始日期" prop="workDay">
        <el-date-picker v-model="infoDataForm.workDay" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="值班结束日期" prop="workEndDay">
        <el-date-picker v-model="infoDataForm.workEndDay" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="值班人员" prop="persons">
        <el-input v-model="infoDataForm.persons" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
