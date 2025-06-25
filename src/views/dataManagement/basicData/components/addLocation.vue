<script setup lang='ts'>
// import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue'

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
    default: '新增位置',
  },
  // 菜单下拉
  groudOptions: {
    type: Array,
    default() {
      return []
    },
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
const groupProps = {
  value: 'id',
  label: 'title',

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
  classId: [
    { required: true, message: '请输入选择位置类别', trigger: 'change' },
  ],
})
function getClassId(val: any) {
  infoDataForm.classId = val
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="120px">
      <el-form-item label="上级位置" placeholder="请输入" class="formInput">
        <el-tree-select v-model="infoDataForm.pid" clearable default-expand-all node-key="id" check-strictly :props="groupProps" :data="props.groudOptions" class="formInput" />
      </el-form-item>
      <el-form-item label="位置名称" prop="name">
        <el-input v-model="infoDataForm.name" class="formInput" />
      </el-form-item>
      <el-form-item label="位置类别" prop="classId">
        <CommonSelect post-param="location-class" :select-value="infoDataForm.classId" class="formInput" @select-change="getClassId" />
      </el-form-item>
      <el-form-item label="位置描述">
        <el-input v-model="infoDataForm.description" class="formInput" />
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
