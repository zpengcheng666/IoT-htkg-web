<route lang="yaml">
name: personalSetting
meta:
  title: 历史曲线
  cache: personal-edit.password
                    </route>

<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Back,  Plus } from '@element-plus/icons-vue'
import addDutyPerson from './components/addDutyPerson.vue'
import publishDialog from './components/publishDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const router = useRouter()

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
  terminalOptions: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
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
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogPublish = ref(false)
onMounted(() => {
  getList()
})
// 获取列表
function getList() {
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  api.get('/message/dutyPerson/list', postData).then((res: any) => {
    data.tableData = []
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

// 点击返回
function back() {
  router.go(-1)
}

// 点击新增
function clickAdd() {
  data.infoData = { types: [] }
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

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 点击发布
function clickPublish(val: any) {
  data.publishInfoData = {
    messageId: val.id,
    terminalIds: [],
  }
  dialogPublish.value = true
}
// 关闭发布弹窗
function closePublishDialog(id: any) {
  dialogPublish.value = false
}
// 提交发布
function publishSubmint(val: any) {
  const postData = val
  api.put('/message/dutyPerson/publish', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogPublish.value = false
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
// 撤销发布
function cancelPublish(id: any) {
  ElMessageBox.confirm(
    '此操作将撤销发布，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.put(`/message/dutyPerson/revocation/${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          dialogPublish.value = false
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
// 提交新增
function addSubmint(val: any) {
  const postData = val

  window.console.log(postData)
  if (data.dialogType === 'add') {
    api.post('/message/dutyPerson/add', postData).then((res: any) => {
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
    api.post('/message/dutyPerson/edit', postData).then((res: any) => {
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
          <el-button type="info" :icon="Back" @click="back()">
            返回
          </el-button>
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
        <template #status="{ item }">
          <el-tag v-if="item.row.status === 1" type="success" style="margin-right: 10px;">
            正常
          </el-tag>
          <el-tag v-if="item.row.status === 0" type="info" style="margin-right: 10px;">
            休息
          </el-tag>
        </template>

        <template #operation="{ item }">
          <el-button type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-if="item.row.state === 0" type="primary" plain size="small" @click="clickPublish(item.row)">
            发布
          </el-button>
          <el-button v-if="item.row.state === 1 || item.row.state === 2" size="small" @click="cancelPublish(item.row.id)">
            撤销
          </el-button>
          <el-button v-if="item.row.state === 3" type="primary" size="small" disabled>
            已过期
          </el-button>
          <!--  -->
          <el-button type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addDutyPerson v-if="dialogAdd" :title="data.dialogTitle" :person-options="data.personOptions" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmint" />
      <publishDialog v-if="dialogPublish" :terminal-options="data.terminalOptions" :info-data="data.publishInfoData" :dialog-visible="dialogPublish" @close-dialog="closePublishDialog" @submit-dialog="publishSubmint" />
    </page-main>
  </div>
</template>

  <style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
  </style>

