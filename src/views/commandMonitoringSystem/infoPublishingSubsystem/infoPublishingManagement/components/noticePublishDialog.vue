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
    default: '发布',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  terminalOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  personOptions: {
    type: Array<any>,
    default() {
      return []
    },
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
// 页数改变的时候触发的事件
// const submitDialog = (val: any) => {
//   emits('submitDialog', val)
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

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  terminalIds: [
    { required: true, message: '请选择终端', trigger: 'change' },
  ],
  publisher: [
    { required: true, message: '请选择终端', trigger: 'change' },
  ],
  publishType: [
    { required: true, message: '请选择发布类型', trigger: 'change' },
  ],

  effectiveTime: [
    { required: true, message: '请选择发布时间', trigger: 'change' },
  ],
  overdueTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
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
      <el-form-item label="发布人" prop="publisher">
        <el-select
          v-model="infoDataForm.publisher"
          placeholder="请选择"
          style="width: 100%;"
          filterable clearable
        >
          <el-option
            v-for="i in props.personOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布类型" prop="publishType">
        <el-select
          v-model="infoDataForm.publishType"
          placeholder="请选择"
          style="width: 100%;"
          filterable clearable
        >
          <el-option label="预约发布" value="reserve" />
          <el-option label="立即发布" value="immediate" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="infoDataForm.publishType === 'reserve' " label="发布时间" prop="effectiveTime">
        <el-date-picker v-model="infoDataForm.effectiveTime" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="结束时间" prop="overdueTime">
        <el-date-picker v-model="infoDataForm.overdueTime" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="终端" prop="terminalIds">
        <el-select
          v-model="infoDataForm.terminalIds"
          multiple
          placeholder="请选择"
          style="width: 100%;"
          filterable clearable
        >
          <el-option
            v-for="i in props.terminalOptions"
            :key="i.id"
            :label="i.name"
            :value="i.id"
          />
        </el-select>
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
