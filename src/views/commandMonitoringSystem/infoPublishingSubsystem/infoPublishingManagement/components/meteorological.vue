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
    default: '气象信息',
  },
  type: {
    type: String,
    default: 'add',
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

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  weatherTime: [
    { required: true, message: '请选择气象时间', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请选择气象信息', trigger: 'change' },
  ],
  highTmp: [
    { required: true, message: '请填写最高气温', trigger: 'blur' },
  ],
  lowTmp: [
    { required: true, message: '请填写最低气温', trigger: 'blur' },
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
    <el-form ref="ruleFormRef" :model="infoDataForm" class="demo-form-inline" label-width="130px" :rules="rules">
      <el-form-item label="气象时间" prop="weatherTime">
        <el-date-picker v-model="infoDataForm.weatherTime" :disabled="props.type === 'edit'" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="气象信息" prop="content">
        <!-- <el-input v-model="infoDataForm.content" type="textarea" placeholder="请输入" class="formInput" /> -->
        <el-select v-model="infoDataForm.content" filterable placeholder="请选择" clearable style="width: 100%;">
          <el-option label="晴" value="Sunny" />
          <el-option label="阴" value="AllCloudy" />
          <el-option label="雨" value="Rain" />
          <el-option label="雪" value="Snow" />
          <el-option label="多云" value="Cloudy" />
          <el-option label="阵雨" value="RainShower" />
        </el-select>
      </el-form-item>
      <el-form-item label="最低气温（℃）" prop="lowTmp">
        <el-input v-model="infoDataForm.lowTmp" placeholder="请填写" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="最高气温（℃）" prop="highTmp">
        <el-input v-model="infoDataForm.highTmp" placeholder="请填写" style="width: 100%;" />
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
