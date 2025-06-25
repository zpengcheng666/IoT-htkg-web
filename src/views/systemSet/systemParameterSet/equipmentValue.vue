<script lang="ts" setup>
import type { ElTable, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const form = reactive({
  deviceType: '',
  user: '',
})
const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'deviceName',
    label: '设备名称',
  },
])
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  window.console.log(val)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
}
const total = ref(0) // 总条数
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :model="form" label-position="left" :inline="true">
          <el-form-item label="设备类型：">
            <el-select v-model="form.deviceType" filterable clearable placeholder="设备类型">
              <el-option label="40米长大砍刀" value="shanghai" />
              <el-option label="0.1米手枪" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="form.user" placeholder="请输入设备名称" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="row-border">
      <el-col :span="10">
        设备列表（当前选中0条）
      </el-col>
      <el-col :span="4" :offset="10" class="col-right">
        <el-button>修改标定值</el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </page-main>
</template>

<style lang="scss" scoped>
.row-border {
  border: 1px solid #ebeef5;
  border-bottom: none;
  padding: 0.5rem;
}

:deep(.table) {
  margin-top: 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
