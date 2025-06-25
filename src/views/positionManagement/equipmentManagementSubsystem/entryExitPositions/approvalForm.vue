<route lang="yaml">
name: personalSetting
meta:
  title: 审批单管理
  cache: personal-edit.password
                  </route>

<script lang="ts" setup name="PersonalSetting">
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import approvalFormDialog from './components/approvalFormDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

const formInline = reactive({
  publishingTerminal: '',
})
const data = reactive({
  tableData: [],
  form: {
    department: '',
    leaderId: '',
    status: '',
    pageNo: 1,
    pageSize: 30,

  },
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  internalOptions: [] as any[], // 内部人员下拉
  idTypeOptions: [], // 证件类型下拉
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'department',
    label: '申请单位',
  },
  {
    prop: 'leaderId_disp',
    label: '带队人',
  },
  {
    prop: 'count',
    label: '人数',
  },
  {
    prop: 'zone',
    label: '活动区域',
  },
  {
    prop: 'position1',
    label: '职位',
  },
  {
    prop: 'reason',
    label: '入库事由',
  },
  {
    prop: 'inTime',
    label: '入库时间',
  },
  {
    prop: 'outTime',
    label: '出库时间',
  },
  {
    prop: 'status',
    slot: 'status',
    label: '申请状态',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗

// 重置
function reset() {
  data.form = {
    department: '',
    leaderId: '',
    status: '',
    pageNo: 1,
    pageSize: 30,

  }
  getList()
}

// 获取列表
function getList() {
  // console.log(params)
  const postData = {
    params: data.form,
  }
  api.get('/inOutPosition/inOutList/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取内部人员下拉
function getListInternalOptions() {
  api.get('/inOutPosition/inOutList/listInternalOptions').then((res: any) => {
    data.internalOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取下拉数据
function getIdTypeOptions() {
  const postData = {
    params: { type: 'credentials-type' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.idTypeOptions = res.result
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
      api.delete(`/inOutPosition/inOutList/delete?id=${id}`).then((res: any) => {
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
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 提交新增
function addSubmit(val: any) {
  // console.log(val)
  // return false
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/inOutPosition/inOutList/add', postData).then((res: any) => {
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
    api.post('/inOutPosition/inOutList/edit', postData).then((res: any) => {
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

onMounted(() => {
  getList()
  getListInternalOptions()
  getIdTypeOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="formInline" label-width="100px">
            <el-form-item label="申请单位：">
              <el-input v-model="data.form.department" placeholder="" />
            </el-form-item>
            <el-form-item label="带队人：">
              <el-select v-model="data.form.leaderId" placeholder="" filterable clearable>
                <el-option
                  v-for="i in data.internalOptions"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="申请状态：">
              <el-select v-model="data.form.status" placeholder="请选择" filterable clearable>
                <el-option label="待审核" :value="0" />
                <el-option label="已审核" :value="1" />
                <el-option label="未通过" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList()">
                查询
              </el-button>
              <el-button type="info" plain @click="reset()">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="col-right">
          <el-button v-auth="'fem:approval:add'" type="warning" @click="clickAdd()">
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
        <template #status="{ item }">
          <span>{{ item.row.status === 0 ? '待审核' : item.row.status === 1 ? '已审核' : '未通过' }}</span>
        </template>
        <template #operation="{ item }">
          <el-button v-auth="'fem:approval:edit'" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>

          <el-button v-auth="'fem:approval:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <approvalFormDialog v-if="dialogAdd" :title="data.dialogTitle" :id-type-options="data.idTypeOptions" :internal-options="data.internalOptions" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
