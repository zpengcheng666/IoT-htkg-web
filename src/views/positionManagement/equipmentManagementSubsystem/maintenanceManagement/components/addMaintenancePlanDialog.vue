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
    default: '属性关联选择',
  },
  dialogType: {
    type: String,
    default: '新增',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

  classOptions: {
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
const infoDataForm: any = reactive(props.infoData)

// 保养类别
function siteLocation(val: any) {
  infoDataForm.itemClassId = val
}
const defaultProps = {
  children: 'children',
  label: 'title',
  value: 'id',
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  schemasName: [
    { required: true, message: '请输入方案名称', trigger: 'blur' },
  ],
  itemClassId: [
    { required: true, message: '请选择保养类别', trigger: 'change' },
  ],
  period: [
    { required: true, message: '请输入运行时长', trigger: 'blur' },
  ],
  deviceClassIds: [
    { required: true, message: '请选择设备类别', trigger: 'change' },
  ],
})
onMounted(() => {

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" label-width="140px" :rules="rules">
      <el-form-item label="方案名称：" prop="schemasName">
        <el-input v-model="infoDataForm.schemasName" :disabled="props.dialogType === 'info'" placeholder="请输入方案名称" />
      </el-form-item>
      <el-form-item label="保养类别：" prop="itemClassId">
        <CommonSelect :disabled="props.dialogType === 'info'" post-param="maintain-item-class" :select-value="infoDataForm.itemClassId" class="formInput" @select-change="siteLocation" />
      </el-form-item>

      <el-form-item label="运行时长(小时)：" prop="period">
        <el-input v-model="infoDataForm.period" :disabled="props.dialogType === 'info'" placeholder="请输入运行时长" />
      </el-form-item>
      <el-form-item label="设备类别(多选)：" prop="deviceClassIds">
        <el-tree-select
          v-model="infoDataForm.deviceClassIds"
          :disabled="props.dialogType === 'info'"
          :data="props.classOptions"
          :props="defaultProps"
          multiple
          node-key="id"
          :default-expand-all="true"
          :render-after-expand="false"
          show-checkbox
          class="formInput"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button v-if="props.dialogType !== 'info'" type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
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
