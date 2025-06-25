<!--
 * @Description:终端模板
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:37:16
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import addInfoDialog from './components/addInfoDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const router = useRouter()
const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
  infoData: {},
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '模板名称',
  },
  {
    prop: 'describe', // prop
    label: '描述',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])
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
const total = ref(0) // 总条数

function getList() {
  // console.log(params)
  const postData = {
    params: data.form,
  }
  api.get('system/baseTerminalTemplate/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击新增
function clickAdd() {
  router.push({
    name: 'templateConfig',
    query: {
      terminalId: '',
    },
  })
}
// 点击编辑
function clickEdit(row: any) {
  router.push({
    name: 'templateConfig',
    query: {
      terminalId: row.id,
    },
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
      api.delete(`system/baseTerminalTemplate/delete?id=${id}`).then((res: any) => {
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
  <page-main class="pageBox">
    <el-col :span="4" :offset="20" class="col-right">
      <el-button v-auth="'system:template:add'" type="warning" :icon="Plus" @click="clickAdd()">
        新增
      </el-button>
    </el-col>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'system:template:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:template:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
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
