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
function getClassId(val: any) {
  infoDataForm.position = val
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
  position: [
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
    width="40%"
    :before-close="closeDialog"
    top="3vh"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" label-width="120px" :rules="rules" :inline="true">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="infoDataForm.name" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="工具编号：" prop="goodsNum">
        <el-input v-model="infoDataForm.goodsNum" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="工具型号：">
        <el-input v-model="infoDataForm.goodsModel" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="配置类型：" prop="goodsSort">
        <el-select v-model="infoDataForm.goodsSort" filterable clearable :disabled="props.dialogType === 'info'" placeholder="">
          <el-option label="按阵地配套" value="1" />
          <el-option label="按工位配套" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="配套时间：">
        <el-date-picker
          v-model="infoDataForm.inDate"
          :disabled="props.dialogType === 'info'"
          type="date"
          placeholder="请选择"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%;"
        />
      </el-form-item>

      <el-form-item label="存放位置：" prop="position">
        <el-tree-select v-model="infoDataForm.position" default-expand-all node-key="id" :disabled="props.dialogType === 'info'" check-strictly :props="defaultProps" :data="props.locationTreeData" />
      </el-form-item>

      <el-form-item label="计数单位：">
        <el-input v-model="infoDataForm.unit" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="标准数量：" prop="standard">
        <el-input v-model="infoDataForm.standard" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="实际数量：" prop="count">
        <el-input v-model="infoDataForm.count" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>·
      <el-form-item label="可用数量：" prop="inUseCount">
        <el-input v-model="infoDataForm.inUseCount" :disabled="props.dialogType === 'info'" placeholder="" />
      </el-form-item>
      <el-form-item label="责任人：">
        <el-select v-model="infoDataForm.creatorId" filterable clearable :disabled="props.dialogType === 'info'" placeholder="">
          <el-option
            v-for="item in props.personnelOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="infoDataForm.note" :disabled="props.dialogType === 'info'" type="textarea" placeholder="" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>
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
