<!--
 * @Description:
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-06 15:13:07
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:05:04
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
    default: '报警处理',
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

// 校验
const ruleFormRef = ref<FormInstance>()

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
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="处理人" prop="handler">
        <el-input v-model="infoDataForm.handler" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="处理方法" prop="handleMethod">
        <el-input v-model="infoDataForm.handleMethod" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
