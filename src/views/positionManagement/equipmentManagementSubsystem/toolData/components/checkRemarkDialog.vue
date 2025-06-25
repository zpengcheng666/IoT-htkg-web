<!--
 * @Description:新增盘库单弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-15 14:12:22
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
  dialogType: {
    type: String,
    default: 'add'
  },
  // 标题
  title: {
    type: String,
    default: '备注',
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
const infoDataForm = reactive(props.infoData) as any
console.log(infoDataForm);

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  orderNo: [
    { required: true, message: '请输入入库单号', trigger: 'blur' },
  ],
  useName: [
    { required: true, message: '请输入负责人', trigger: 'blur' },
  ],
})

onMounted(() => {
})
</script>

<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="50%" :before-close="closeDialog">
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="infoDataForm" class="demo-form-inline"
      label-width="100px">

      <el-form-item label="备注" placeholder="请输入" style="width: 80%;">
        <el-input type="textarea" v-model="infoDataForm.remark" resize="none" :disabled="props.dialogType === 'info'"/>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)" v-if="props.dialogType === 'add'">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>
.formInput {
  width: 200px;
}
</style>
