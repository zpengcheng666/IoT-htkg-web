<!--
 * @Description: 值班人员弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:28:53
-->
<script lang="ts" setup name="DutyGroup">
import { ElMessage, ElMessageBox } from 'element-plus'
import {  Plus } from '@element-plus/icons-vue'
import AddDutyPerson from './addDutyPerson.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({
  dutyId: {
    type: String,
    required: true,
  },
})
const data = reactive({
  tableData: [] as any,
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  publishInfoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  personOptions: [],
})

const tableHeader = reactive([
  {
    prop: 'code',
    label: '小组编号',
  },
  {
    prop: 'name',
    label: '小组名称',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])
const total = ref(0)
const dialogAdd = ref(false)

function getList() {
  const config = {
    params: {
      pageNo: data.form.pageNo,
      pageSize: data.form.pageSize,
      name: data.form.name,
      dutyId: props.dutyId,
    },
  }
  api.get('/message/dutyPerson/page', config).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
function reset() {
  data.form = {
    name: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getList()
}
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList()
}
function clickAdd() {
  data.infoData = { dutyId: props.dutyId }
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
function closeDialog() {
  dialogAdd.value = false
}
function addSubmit(val: any) {
  if (data.dialogType === 'add') {
    api.post('/message/dutyPerson/addGroup', val).then((res: any) => {
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
    api.post('/message/dutyPerson/editById', val).then((res: any) => {
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
      api.delete(`message/dutyPerson/delete?id=${id}`).then((res: any) => {
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
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" :model="data.form" label-width="100px">
            <el-form-item label="小组名称：">
              <el-input v-model="data.form.name" placeholder="请输入" class="formInput" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">
                查询
              </el-button>
              <el-button @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="col-right">
          <el-button type="warning" :icon="Plus" @click="clickAdd()">
            新增
          </el-button>
        </el-col>
      </el-row>
      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #operation="{ item }">
          <el-button type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <AddDutyPerson
        v-if="dialogAdd"
        :dialog-visible="dialogAdd"
        :title="data.dialogTitle"
        :person-options="data.personOptions"
        :type="data.dialogType"
        :info-data="data.infoData"
        @close-dialog="closeDialog"
        @submit-dialog="addSubmit"
      />
    </page-main>
  </div>
</template>

  <style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
  </style>

