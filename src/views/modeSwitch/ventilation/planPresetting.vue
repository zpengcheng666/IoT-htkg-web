<!--
 * @Description:计划预设方案
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:36:59
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddPlanLoop from '@/views/modeSwitch/ventilation/components/addPlanLoop.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    name: '',
    levelId: '',
    deviceId: '',
    pageNo: 1,
    pageSize: 30,
  },
  alarmLive: [] as any[],
  deviceOptions: [] as any,
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '方案名称',
  },
  {
    prop: 'code',
    label: '方案编号',
  },
  {
    prop: 'controlSystemName', // prop
    label: '所属控制系統',
  },
  {
    prop: 'description', // prop
    label: '描述',
    overHidden: true,
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false)
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  window.console.log(val)
  getList()
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList()
}
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/ventilation/planPresetting/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 打开新增弹窗
function clickAdd() {
  data.infoData = {
    name: '',
    code: '',
    ddcId: '',
    description: '',
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 点击编辑
function clickEdit(row: any) {
  const postData = {
    params: {
      id: row.id,
    },
  }
  api.get('/ventilation/planPresetting/queryById', postData).then((res: any) => {
    if (!res.result) {
      ElMessage({
        type: 'error',
        message: '数据不存在',
      })
      return
    }
    data.infoData = res.result
    data.dialogType = 'edit'
    data.dialogTitle = '编辑'
    dialogAdd.value = true
  }).catch((error) => {
    window.console.log(error)
  })
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/ventilation/planPresetting/add', postData).then((res: any) => {
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
    api.post('/ventilation/planPresetting/edit', postData).then((res: any) => {
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
      api.delete(`/ventilation/planPresetting/delete?id=${id}`).then((res: any) => {
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
    <el-row>
      <el-col :span="22" />
      <el-col :span="2" class="col-right">
        <el-button v-auth="'config:planpre:add'" type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'config:planpre:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button v-auth="'config:planpre:del'" type="danger" :icon="Delete" :dark="true" @click="del(item.row.id)" />
      </template>
    </CommonTable>
    <AddPlanLoop
      v-if="dialogAdd"
      :dialog-visible="dialogAdd"
      :title="data.dialogTitle"
      :info-data="data.infoData"
      @close-dialog="closeDialog"
      @submit-dialog="addSubmit"
    />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
