<!--
 * @Description:事件管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:26:40
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addEvent from './components/addEvent.vue'
import addAction from './components/addAction.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
import selectLabel from '@/utils/select'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  actionInfoData: {},
  dialogType: 'edit',
  dialogTitle: '新增',
  eventId: '',
})
const dialogAdd = ref(false) // 添加弹窗
const dialogAddAction = ref(false) // 添加弹窗
const actionOption = [
  {
    label: '变量赋值',
    value: 'set',
  },
  {
    label: '预置位调用',
    value: 'perLocation',
  },

  {
    label: '世邦广播任务',
    value: 'publishSH',
  },
]

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
// 点击新增动作
function clickAddAction(id: any) {
  data.eventId = id
  data.actionInfoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增动作'
  dialogAddAction.value = true
}

// 编辑动作
function clickEditAction(val: any) {
  data.eventId = val.eventId
  data.actionInfoData = val
  data.dialogType = 'edit'
  data.dialogTitle = '编辑动作'
  dialogAddAction.value = true
}

// 删除动作
function delAction(id: any) {
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
      api.delete(`/scada/eventAction/delete?id=${id}`).then((res: any) => {
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

function closeDialog() {
  dialogAdd.value = false
}
function closeActionDialog() {
  dialogAddAction.value = false
}

// 新增动作提交
function addActionSubmint(val: any) {
  const postData = val
  postData.eventId = data.eventId
  if (data.dialogType === 'add') {
    api.post('/scada/eventAction/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddAction.value = false
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
    api.post('/scada/eventAction/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddAction.value = false
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

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    type: 'expand',
    width: '200px',
    slot: 'expand',
  },
  {
    prop: 'name',
    label: '名称',
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
  api.get('/scada/eventManager/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    name: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/scada/eventManager/add', postData).then((res: any) => {
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
    api.post('/scada/eventManager/edit', postData).then((res: any) => {
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
// 删除事件
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
      api.delete(`/scada/eventManager/delete?id=${id}`).then((res: any) => {
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
      <el-col :span="22">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="事件名称：">
            <el-input v-model="data.form.name" placeholder="" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>
            <el-button @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" class="col-right">
        <el-button v-auth="'config:event:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'config:event:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button v-auth="'config:event:del'" type="danger" :icon="Delete" :dark="true" @click="del(item.row.id)" />
        <el-button v-auth="'config:action:add'" type="primary" :icon="Plus" :dark="true" @click="clickAddAction(item.row.id)" />
      </template>
      <template #expand="{ item }">
        <el-table :data="item.row.actionList" border>
          <el-table-column align="center" label="动作名称" prop="name" />
          <el-table-column align="center" label="类型" prop="type">
            <template #default="scope">
              {{ selectLabel(scope.row.type, actionOption) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作对象" prop="operationName" />
          <el-table-column align="center" label="操作值" prop="operationValue" />
          <el-table-column align="center" label="动作延时" prop="delayTime" />
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button v-auth="'config:action:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEditAction(scope.row)" />
              <el-button v-auth="'config:action:del'" type="danger" :icon="Delete" :dark="true" @click="delAction(scope.row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </CommonTable>

    <addEvent v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    <addAction v-if="dialogAddAction" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAddAction" :info-data="data.actionInfoData" :type-ops="actionOption" @close-dialog="closeActionDialog" @submit-dialog="addActionSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
