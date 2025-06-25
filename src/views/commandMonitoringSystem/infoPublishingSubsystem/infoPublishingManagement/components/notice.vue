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
    default: '通知公告',
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
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
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
    width="25%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="infoDataForm.title" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="infoDataForm.content" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item>
      <!-- <el-form-item label="生效时间" prop="effectiveTime">
        <el-date-picker v-model="infoDataForm.effectiveTime" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="过期时间" prop="overdueTime">
        <el-date-picker v-model="infoDataForm.overdueTime" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="infoDataForm.publishTime" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="发布人" prop="publisher">
        <el-input v-model="infoDataForm.publisher" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item> -->
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
