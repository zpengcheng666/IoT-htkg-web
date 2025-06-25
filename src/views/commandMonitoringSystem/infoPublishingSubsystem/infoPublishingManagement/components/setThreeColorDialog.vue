<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'
const props = defineProps({
  // 详情数据
  threeColorData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '设置三色声光',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  threeColorOptions: {
    type: Array<any>,
    default() {
      return []
    },
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
const infoDataForm = ref(props.threeColorData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  threeColor: [
    { required: true, message: '请选择三色声光设备', trigger: 'change' },
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
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="150px">
      <el-form-item label="三色声光报警器" prop="threeColor">
        <el-select
          v-model="infoDataForm.threeColor"
          multiple
          placeholder="请选择"
          style="width: 300px;"
          filterable clearable
        >
          <el-option
            v-for="i in props.threeColorOptions"
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
