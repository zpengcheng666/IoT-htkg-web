tool management<route lang="yaml">
name: personalSetting
title: 系统备份
cache: personal-edit.password
    </route>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'

import addBackRecover from './components/addBackRecover.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    backupType: '1',
    pageNo: 1,
    pageSize: 30,
  },
  tabActive: '1', // tab栏索引
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增手动备份',
  tabList: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'backupName',
    label: '名称',
  },
  {
    prop: 'filePath',
    label: '文件名称',
  },
  {
    prop: 'startTime',
    label: '备份时间',
  },
  {
    prop: 'duration',
    label: '持续时长（秒）',
    slot: 'duration',
  },
  {
    prop: 'operator',
    label: '操作人员',
  },
  {
    prop: 'results',
    label: '操作结果',
    slot: 'results',
  },
  {
    prop: 'recoveryCnt',
    label: '恢复次数',
    slot: 'recoveryCnt',
  },
  {
    prop: 'notes',
    label: '备注',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false)
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

// 点击备份
function clickBackUp() {
  data.infoData = {}
  data.infoData.backupType = data.tabActive
  dialogAdd.value = true
}
// 点击恢复备份
function clickRestoreBackUp(id: any) {
  ElMessageBox.confirm(
    '此操作将恢复该备份数据，是否恢复?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        backupId: id,
      }
      api.post('/system/sysRecovery/recovery', postData).then((res: any) => {
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

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
}

// 点击tab
function clickTab() {
  getList()
}
// 获取列表
function getList() {
  data.form.backupType = data.tabActive
  const postData = {
    params: data.form,
  }
  api.get('/system/sysBackup/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 手动备份提交
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/sysBackup/backup', postData).then((res: any) => {
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
  // else if (data.dialogType === 'edit') {
  //   api.post('system/baseRole/editRole', postData).then((res: any) => {
  //     if (res.code === 200) {
  //       ElMessage({
  //         type: 'success',
  //         message: res.message,
  //       })
  //       dialogAdd.value = false
  //       getList()
  //     }
  //     else {
  //       ElMessage({
  //         type: 'error',
  //         message: res.message,
  //       })
  //     }
  //   }).catch((error) => {
  //     window.console.log(error)
  //   })
  // }
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
      api.delete(`/system/sysBackup/delete?id=${id}`).then((res: any) => {
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
    <el-tabs v-model="data.tabActive" class="demo-tabs" @tab-change="clickTab">
      <!-- <el-tab-pane label="系统备份" name="0" /> -->
      <el-tab-pane v-auth="'system:monitoring:ptbackup'" label="平台备份" name="1" />
      <el-tab-pane v-auth="'system:monitoring:databackup'" label="数据备份" name="2" />
    </el-tabs>
    <el-form :inline="true" :model="data.form" label-width="100px">
      <el-button v-auth="'system:monitoring:handbackup'" type="warning" @click="clickBackUp">
        手动备份
      </el-button>
    </el-form>
    <CommonTable
      :table-data="data.tableData" :max-height="400" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #duration="{ item }">
        <span>{{ item.row.duration }}</span>
      </template>
      <template #recoveryCnt="{ item }">
        <span>{{ item.row.recoveryCnt }}</span>
      </template>
      <template #results="{ item }">
        <el-tag v-if="item.row.results === '0'" type="success">
          成功
        </el-tag>
        <el-tag v-else type="danger">
          失败
        </el-tag>
      </template>
      <template #operation="{ item }">
        <!-- <el-button type="primary" size="small" @click="clickEdit(item.row)">
          编辑
        </el-button> -->
        <el-button v-if="item.row.results === '0'" v-auth="'system:monitoring:renewbackup'" type="warning" size="small" @click="clickRestoreBackUp(item.row.id)">
          恢复备份
        </el-button>
        <el-button v-auth="'system:monitoring:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <addBackRecover v-if="dialogAdd" :info-data="data.infoData" :dialog-visible="dialogAdd" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
  </page-main>
</template>

    <style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
    </style>

