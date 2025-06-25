<!--
 * @Description:信息发布终端
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-26 15:23:22
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import addInfoDialog from './components/addInfoDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const router = useRouter()
const data = reactive({
  tableData: [],
  treeData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增终端信息',
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '终端名称',
  },
  {
    prop: 'code',
    label: '编码',
  },
  {
    prop: 'locationId_disp', // prop
    label: '所在位置',
  },
  {
    prop: 'description', // prop
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
const dialogAdd = ref(false)
const total = ref(0) // 总条数

function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseTerminal/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击新增
function clickAdd() {

  router.push({
    name: 'bigScreenConfig',
    query: {
      terminalId: '',
    },
  })
}
// 点击编辑
function clickEdit(row: any) {

  router.push({
    name: 'bigScreenConfig',
    query: {
      terminalId: row.id,
    },
  })
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 获取树状列表
const getTree = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/baseTerminal/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
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
  }
  else if (data.dialogType === 'edit') {
    api.post('system/baseTerminal/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
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
  }
}

// 删除
function del(id: string) {
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
      api.delete(`system/baseTerminal/delete?id=${id}`).then((res: any) => {
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

// 跳转大屏页
function toBigScreen() {
  const url = router.resolve({
    path: '/bigScreenStartNew',
  });
  window.open(url.href, '_blank');
}

onMounted(() => {
  getList()
  getTree()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row justify="space-between">
      <el-col :span="20">
        <el-button type="primary" @click="toBigScreen()">
          前往大屏页
        </el-button>
      </el-col>
      <el-col :span="4" class="col-right">
        <el-button v-auth="'system:infomation:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange">
      <template #operate="{ item }">
        <el-button v-auth="'system:infomation:edit'" type="primary" size="small" :dark="true"
          @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:infomation:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addInfoDialog v-if="dialogAdd" :tree-data="data.treeData" :title="data.dialogTitle" :dialog-type="data.dialogType"
      :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
