<!--
 * @Description:用户管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:19:08
-->


<script lang="ts" setup name="PersonalSetting">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addUserDialog from './components/addUserDialog.vue'
import configRoleDialog from './components/configRoleDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    username: '',
    pageNo: 1,
    pageSize: 30,
  },
  userId: '',
  multipleSelection: [],
  allAuthList: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增用户',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'username',
    label: '用户名',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: 'papersIdDisp',
    label: '证件类型',
  },
  {
    prop: 'numberId',
    label: '证件号码',
  },
  {
    prop: 'militaryId',
    label: '军衔',
  },
  {
    prop: 'positionId',
    label: '职称',
  },
  {
    prop: 'phone', // prop
    label: '联系电话', // label
  },
  {
    prop: 'lockStatus', // prop
    slot: 'lockStatus',
    label: '冻结状态',
  },
  {
    prop: 'organizationIdDisp', // prop
    label: '组织机构',
  },
  {
    prop: 'remark', // prop
    label: '描述',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '320px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogAuth = ref(false)

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

// 多选事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}

// 获取用户列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseUser/listUser', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取所有角色列表
function getAuthList() {
  api.get('system/baseRole/listRole').then((res: any) => {
    data.allAuthList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}

// 删除用户
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
      api.delete(`system/baseUser/deleteUser?id=${id}`).then((res: any) => {
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

// 重置
function reset() {
  data.form.username = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑用户'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增用户'
  dialogAdd.value = true
}

// 点击重置密码
function clickReset(id: string) {
  ElMessageBox.confirm(
    '此操作将重置该用户密码，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.get(`system/baseUser/resetPwd?id=${id}`).then((res: any) => {
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

// 设置冻结状态
function setLockStatus(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    lockStatus: val.lockStatus,
  }
  api.post('system/baseUser/frozenBatch', postData).then((res: any) => {
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
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/baseUser/addUser', postData).then((res: any) => {
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
    api.post('system/baseUser/editUser', postData).then((res: any) => {
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

// 点击分配权限
function clickAuth(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.userId = row.id
  dialogAuth.value = true
}

// 关闭权限弹窗
function closeAuthDialog() {
  dialogAuth.value = false
}
// 提交分配权限
function addAuthSubmint(val: any) {
  const postData = {
    userId: data.userId,
    roleId: val.join(','),
  }
  api.post('system/baseRoleUser/addRoleUser', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogAuth.value = false
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

onMounted(() => {
  getList()
  getAuthList()
})
</script>

<script>
</script>

<template>
  <page-main class="pageBox">
    <!-- 用户管理页面 -->
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="用户名：">
            <el-input v-model="data.form.username" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">
              搜索
            </el-button>
            <el-button @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="col-right">
        <el-button v-auth="'system:user:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增用户
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
    >
      <template #lockStatus="{ item }">
        <el-switch v-model="item.row.lockStatus" inline-prompt :active-value="0" :inactive-value="1" active-text="是" inactive-text="否" @click="setLockStatus(item.row)" />
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'system:user:role'" type="primary" size="small" :dark="true" @click="clickAuth(item.row)">
          分配角色
        </el-button>
        <el-button v-auth="'system:user:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:user:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
        <el-button v-auth="'system:user:reset'" type="primary" size="small" :dark="true" @click="clickReset(item.row.id)">
          重置密码
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增弹窗 -->
    <addUserDialog v-if="dialogAdd" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
    <!-- 权限弹窗 -->
    <configRoleDialog v-if="dialogAuth" :all-auth-list="data.allAuthList" :dialog-visible="dialogAuth" :info-data="data.infoData" @close-dialog="closeAuthDialog" @submint-dialog="addAuthSubmint" />
  </page-main>
</template>

  <style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

