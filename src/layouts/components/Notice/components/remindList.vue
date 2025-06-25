<!--
 * @Description: 提醒列表
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 14:13:24
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Delete, Document,  VideoPlay } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    pageNo: 1,
    pageSize: 30,
  },
  selectIds: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'operateContent',
    label: '提醒类型',
  },
  {
    prop: 'username',
    label: '提醒详情',
  },
  {
    prop: 'stateTime',
    label: '开始时间',
  },
  {
    prop: 'stateTime',
    label: '截止时间',
  },

  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  // getList()
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
}

// 删除
function del(id: string) {
  // return false
  ElMessageBox.confirm(
    '此操作将删除该数据，是否删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.delete(`system/baseLog/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          // getList()
        }
        else {
          ElMessage({
            type: 'error',
            message: res.message,
          })
        }
      }).catch((error) => {
        window.console.log(error)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

</script>

<template>
  <div id="pageBox" class="pageBox">
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      max-height="225px" :is-select="true" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operation="{ item }">
        <el-tooltip
          effect="light"
          content="删除"
          placement="bottom"
        >
          <el-button type="danger" size="small" :icon="Delete" :dark="true" @click="del(item.row.id)" />
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="报警确认"
          placement="bottom"
        >
          <el-button type="primary" size="small" :icon="Check" :dark="true" />
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="查看预案"
          placement="bottom"
        >
          <el-button type="primary" size="small" :icon="Document" :dark="true" />
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="启动预案"
          placement="bottom"
        >
          <el-button type="primary" size="small" :icon="VideoPlay" :dark="true" />
        </el-tooltip>

      </template>
    </CommonTable>
  </div>
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
