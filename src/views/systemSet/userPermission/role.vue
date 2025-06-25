<!--
 * @Description:角色管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:22:31
-->


<script lang="ts" setup name="PersonalSetting">
import {  Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addRoleDialog from './components/addRoleDialog.vue'
import addAuthDialog from './components/addAuthDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  allAuthList: [],
  multipleSelection: [],
  infoData: {
  },
  roleId: '',
  dialogType: 'add',
  dialogTitle: '新增角色',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '角色名称',
  },
  {
    prop: 'state',
    slot: 'status',
    label: '角色状态',
  },
  {
    prop: 'describe', // prop
    label: '描述',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogAuth = ref(false)

// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getList()
  window.console.log(val)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList()
}

// 事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}

// 获取角色列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseRole/listRole', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取所有权限列表
function getAuthList() {
  const postData = {
    params: {
      status: 0,
    },
  }
  api.get('system/baseMenu/list', postData).then((res: any) => {
    data.allAuthList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form.name = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑角色'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增角色'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 删除角色
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
      api.delete(`system/baseRole/delete?id=${id}`).then((res: any) => {
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

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/baseRole/addRole', postData).then((res: any) => {
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
    api.post('system/baseRole/editRole', postData).then((res: any) => {
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
// 设置状态
function setFrozenState(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    state: val.state,
  }
  api.post('system/baseRole/frozenState', postData).then((res: any) => {
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

// 点击分配权限
function clickAuth(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.roleId = row.id
  dialogAuth.value = true
}

// 关闭权限弹窗
function closeAuthDialog() {
  dialogAuth.value = false
}
// 提交分配权限
function addAuthSubmint(val: any) {
  const postData = {
    roleId: data.roleId,
    resIds: val.resIds.join(','),
    childrenIds: val.childrenIds.join(','),
  }

  api.post('system/baseRole/editRoleMenu', postData).then((res: any) => {
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
          <el-form-item label="角色名：">
            <el-input v-model="data.form.name" />
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
        <el-button v-auth="'system:role:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增角色
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :is-select="false"
      :size="data.form.pageSize"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
    >
      <template #status="{ item }">
        <el-switch v-model="item.row.state" inline-prompt :active-value="1" :inactive-value="0" active-text="有效" inactive-text="无效" @click="setFrozenState(item.row)" />
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'system:role:auth'" type="primary" size="small" :dark="true" @click="clickAuth(item.row)">
          分配权限
        </el-button>
        <el-button v-auth="'system:role:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:role:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addRoleDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
    <!-- 权限弹窗 -->
    <addAuthDialog v-if="dialogAuth" :all-auth-list="data.allAuthList" :dialog-visible="dialogAuth" :info-data="data.infoData" @close-dialog="closeAuthDialog" @submint-dialog="addAuthSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
</style>

