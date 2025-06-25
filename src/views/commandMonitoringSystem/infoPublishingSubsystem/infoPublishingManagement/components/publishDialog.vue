<!--
 * @Description: 值班发布弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-04-24 10:03:54
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:29:45
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
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
      <el-form-item label="终端" prop="terminalIds">
        <el-select
          v-model="infoDataForm.terminalIds"
          multiple
          placeholder="请选择"
          style="width: 240px;"
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
