<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, Edit, Link, Operation, Plus, Setting } from '@element-plus/icons-vue'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
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
    default: '选择属性',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})
const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
})

const total = ref(0) // 总条数
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  window.console.log(val)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
}

const tableHeader = reactive([
  {
    prop: 'equipmentTypeName',
    label: '属性名称',
  },
  {
    prop: 'englishName',
    label: '英文名称',
  },
])

const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submintDialog', val)
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
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="40%"
    :before-close="closeDialog"
  >
    <el-form :inline="true" :model="infoDataForm" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="infoDataForm.doorName" placeholder="请输入名称搜索" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="true" @size-change="sizeChange" @current-change="currentChange"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-form-item {
  width: calc(100% / 3 - 12px);
  margin-right: 12px;
}

.el-form-item.fullWidth {
  width: 100%;
  margin-right: 0;

  :deep(.el-form-item__label) {
    text-align: right;
    width: 120px;
  }
}
</style>
