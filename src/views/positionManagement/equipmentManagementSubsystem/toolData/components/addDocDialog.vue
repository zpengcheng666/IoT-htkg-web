<script setup lang='ts'>
import type {  FormInstance, FormRules } from 'element-plus'
import uploadFile from '@/components/uploadFile/index.vue'

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
    default: '新增',
  },
  locationTreeData: {
    type: Array,
    default() {
      return []
    },
  },
  dialogType: {
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

  classOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },

  // 人员下拉
  personnelOptions: {
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
const defaultProps = {
  children: 'childs',
  label: 'title',
  value: 'id',
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

function getFile(val: any) {
  infoDataForm.filesList = val
}

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  goodsNum: [
    { required: true, message: '请输入工具编号', trigger: 'blur' },
  ],
  goodsSort: [
    { required: true, message: '请选择配套类型', trigger: 'change' },
  ],
  site: [
    { required: true, message: '请选择存放位置', trigger: 'change' },
  ],

  standard: [
    { required: true, message: '请输入标准数量', trigger: 'blur' },
  ],
  inUseCount: [
    { required: true, message: '请输入可用数量', trigger: 'blur' },
  ],
  count: [
    { required: true, message: '请输入实际数量', trigger: 'blur' },
  ],

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="800px"
    :before-close="closeDialog"
    top="3vh"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :inline="true" label-width="120px" :rules="rules">
      <el-form-item label="资料名称：" prop="name">
        <el-input v-model="infoDataForm.name" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="资料编码：" prop="code">
        <el-input v-model="infoDataForm.code" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="infoDataForm.unit" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="资料类型：">
        <span>{{ infoDataForm.model_disp }}</span>
      </el-form-item>
      <el-form-item label="存档时间：">
        <el-date-picker
          v-model="infoDataForm.pigeonholeTime"
          :disabled="props.dialogType === 'info'"
          type="date"
          placeholder="请选择"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%;"
        />
      </el-form-item>

      <el-form-item label="存放位置：" prop="site">
        <el-tree-select v-model="infoDataForm.site" default-expand-all node-key="id" :disabled="props.dialogType === 'info'" check-strictly :props="defaultProps" :data="props.locationTreeData" />
      </el-form-item>

      <el-form-item label="数量">
        <el-input v-model="infoDataForm.quantity" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="编制单位">
        <el-input v-model="infoDataForm.producer" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>

      <el-form-item label="备注：">
        <el-input v-model="infoDataForm.remark" :disabled="props.dialogType === 'info'" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <el-form :model="{}" label-width="120px">
      <el-form-item label="资料附件：">
        <uploadFile :file-lists="infoDataForm.filesList" :read-only="props.dialogType === 'info' ? true : false" style="width: 100%;" @get-file="getFile" />
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
.el-form--inline .el-form-item {
  width: calc(100% / 2 - 32px);
}

.inline-one .el-form-item {
  width: calc(100% / 6 - 4px);
  margin-right: 4px;
}

.formInput {
  width: 100%;
}

.el-select {
  width: 100%;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
