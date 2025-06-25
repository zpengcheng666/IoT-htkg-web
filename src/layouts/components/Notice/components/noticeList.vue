<!--
 * @Description:通知列表
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 14:12:56
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {  Delete} from '@element-plus/icons-vue'
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
    prop: 'detail',
    label: '消息内容',
  },
  {
    prop: 'type_disp',
    label: '类型',
  },
  {
    prop: 'status',
    slot: 'status',
    label: '状态',
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
  getList()
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList()
}

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseMessage/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.delete(`system/baseMessage/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getList()
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

onMounted(() => {
  getList()
})
</script>

<template>
  <div id="pageBox" class="pageBox">
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      max-height="225px" :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #status="{ item }">
        <span>{{ item.row.status === 0 ? '已读' : '未读' }}</span>
      </template>
      <template #operation="{ item }">
        <el-tooltip
          effect="light"
          content="删除"
          placement="bottom"
        >
          <el-button type="danger" size="small" :icon="Delete" :dark="true" @click="del(item.row.id)" />
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
