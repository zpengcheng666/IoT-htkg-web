<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'
const formInline = reactive({
  user: '',
  region: '',
  delivery: true,
})

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'programmeName',
    label: '方案名称',
  },
  {
    prop: 'programmeNum',
    label: '方案编号',
  },
  {
    prop: 'controlSystem',
    label: '所属控制系统',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

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
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="22" />
      <el-col :span="2" class="col-right">
        <el-button type="warning" :icon="Plus">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate>
        <el-button type="primary" :icon="Edit" :dark="true" />
        <el-button type="primary" :icon="Delete" :dark="true" />
        <el-switch v-model="formInline.delivery" />
      </template>
    </CommonTable>
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
