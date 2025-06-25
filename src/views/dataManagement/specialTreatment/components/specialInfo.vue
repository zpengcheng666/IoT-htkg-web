<script lang="ts" setup>
import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
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
    default: '详情',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['closeDialog'])

const data = reactive({
  tableData: [],
  form: {
    recordId: '',

  },
  workItemInfoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增',

})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    type: 'expand',
    width: '100px',
    slot: 'expand',
  },
  {
    prop: 'name',
    label: '阶段名称',
  },
  {
    slot: 'status',
    prop: 'status',
    label: '阶段完成状态',
  },

])
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/system/contingencyRecord/details', postData).then((res: any) => {
    data.tableData = res.result[0].planStageList
    // console.log(data.tableData)
  }).catch((error) => {
    window.console.log(error)
  })
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
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

onMounted(() => {
  data.form.recordId = props.infoData.id
  getList()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader"
      :is-select="false" :is-page="false"
    >
      <template #status="{ item }">
        <span>{{ item.row.status === 0 ? '未完成' : '已完成' }} </span>
      </template>
      <template #expand="{ item }">
        <el-table :data="item.row.workitemList" border>
          <el-table-column type="index" width="80" label="序号" align="center" />
          <el-table-column align="center" label="工作项名称" prop="name" />
          <el-table-column align="center" label="完成状态" prop="status">
            <template #default="scope">
              <span>{{ scope.status === 0 ? '未完成' : '已完成' }} </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提交时间" prop="sumbitTime" />
          <el-table-column align="center" label="提交人" prop="sumbitPerson" />
        </el-table>
      </template>
    </CommonTable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
