<script setup lang='ts'>
import { ElTable } from 'element-plus'

const props = defineProps({
  // 所有属性
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 保养类型id
  itemClassId: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '属性关联选择',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  // 弹窗类型
  dialogType: {
    type: String,
    default: 'add',
  },
  // 保养方案下拉
  maintenancePlanOptions: {
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

const emits = defineEmits(['submitDialog', 'closeDialog'])

const data = reactive({
  tableData: [] as any,
  multipleSelection: [],

})

const activeName = ref('1')
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm: any = reactive(props.infoData)

const submitDialog = async (val: any) => {
  emits('submitDialog', val)
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

// 多选事件
const selectionChange = (val: any) => {
  data.multipleSelection = val
  const deviceList = []
  for (let i = 0; i < val.length; i++) {
    deviceList.push(val[i].id)
  }

  infoDataForm.operateIds = deviceList
  window.console.log(deviceList)
}

// 合并事件
const spanMethod = (val: any) => {
  if (infoDataForm.operates.length > 1) {
    if (val.columnIndex === 0 || val.columnIndex === 1) {
      if (val.row.counts !== 0) {
        return {
          rowspan: val.row.counts,
          colspan: 1,
        }
      }
      else if (val.row.counts === 0) {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
}
onMounted(() => {
  // 拿到选中的值，并处理数据
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="900px"
    :before-close="closeDialog"
  >
    <ElTable
      ref="multipleTableRef"
      :data="infoDataForm.operates"
      style="width: 100%;"
      max-height="600px"
      border
      :span-method="spanMethod"
      @selection-change="selectionChange"
    >
      <el-table-column label="设备名称" property="deviceName" />
      <el-table-column label="类别名称" property="deviceClassName" />
      <el-table-column label="序号" property="index1" />
      <el-table-column label="作业流程" property="name" />
      <el-table-column label="技术要求" property="thchRequire" />
      <el-table-column type="selection" width="55" />
    </ElTable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>

        <el-button type="primary" @click="submitDialog(infoDataForm)">
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
