<!--
 * @Description:手动值班
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-27 09:16:09
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-27 09:18:15
-->

<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import addHandDuty from './components/addHandDuty.vue'
import publishDialog from './components/publishDialog.vue'
import importDutyDialog from './components/importDutyDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
import selectLabel from '@/utils/select'
const selectTerminalOption = {
  getKeyFun: (item: any) => item.id,
  getValueFun: (item: any) => item.name,
}
const formInline = reactive({
  publishingTerminal: '',
})
const data = reactive({
  tableData: [],
  form: {
    terminalIds: '',
    pageNo: 1,
    pageSize: 10,
  },
  infoData: {},
  dialogType: 'add',
  dialogTitle: '手动值班',
  publishInfoData: {},
  personOptions: [],
  terminalOptions: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'workName',
    label: '工作名称',
    sortable: true,
  },
  {
    prop: 'workDay',
    label: '值班开始日期',
  },
  {
    prop: 'workEndDay',
    label: '值班结束日期',
  },
  {
    prop: 'persons', // prop
    label: '值班人员',
  },
  {
    prop: 'terminalIds', // prop
    label: '发布终端',
    slot: 'terminalIds',
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
const dialogImport = ref(false)// 导入弹窗

// 获取列表
function getList() {

  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.terminalIds = data.form.terminalIds.toString()
  api.get('/message/doWork/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
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
  data.dialogTitle = '手动值班信息'
  dialogAdd.value = true
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '手动值班信息'
  dialogAdd.value = true
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
      api.delete(`/message/doWork/delete?id=${id}`).then((res: any) => {
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

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/message/doWork/add', postData).then((res: any) => {
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
    api.post('/message/doWork/edit', postData).then((res: any) => {
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
  api.put('/message/doWork/publish', postData).then((res: any) => {
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
      api.put(`/message/doWork/revocation/${id}`).then((res: any) => {
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
// 获取终端下拉
function getTerminalOptions() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/system/baseTerminal/list', postData).then((res: any) => {
    data.terminalOptions = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取内部人员下拉
function getListInternalOptions() {
  api.get('/inOutPosition/inOutList/listInternalOptions').then((res: any) => {
    data.personOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    terminalIds: '',
    pageNo: 1,
    pageSize: 10,
  }
  getList()
}

// 关闭导入弹窗
function closeImportDialog() {
  dialogImport.value = false
}
// 打开导入弹窗
function openImportDialog() {
  dialogImport.value = true
}
// 导入提交
function importSubmint(val: any) {
  // console.log(val)
  const postData = val
  api.post('/message/doWork/importExcel', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogImport.value = false
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

// 导出
function exportXls() {
  ElMessageBox.confirm(
    '此操作将导出该数据，是否导出?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        params: data.form,
        responseType: 'blob' as any,
      }
      api.get('/message/doWork/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '值班信息.xls'
        const url = window.URL.createObjectURL(new Blob([data], blobOptions))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', name + fileSuffix)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }).catch((error) => {
        window.console.log(error)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消导出',
      })
    })
}

onMounted(() => {
  getList()
  getTerminalOptions()
  getListInternalOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" :model="formInline" label-width="100px">
            <el-form-item label="发布终端：">
              <el-select
                v-model="data.form.terminalIds"
                placeholder="请选择"
                multiple
                filterable
                clearable
                style="width: 240px;"
              >
                <el-option
                  v-for="i in data.terminalOptions"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                />
              </el-select>
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
          <el-button v-auth="'ips:handDuty:import'" type="primary" @click="openImportDialog()">
            导入
          </el-button>
          <el-button v-auth="'ips:handDuty:export'" type="primary" @click="exportXls()">
            导出
          </el-button>
          <el-button v-auth="'ips:handDuty:add'" type="warning" :icon="Plus" @click="clickAdd()">
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
        <template #terminalIds="{ item }">
          <el-tag v-for="(v, i) in item.row.terminalIds" v-show="item.row.terminalIds.length > 0" :key="`ter${i}`" type="success" style="margin-right: 10px;">
            {{ selectLabel(v, data.terminalOptions, selectTerminalOption) }}
          </el-tag>
          <span v-show="item.row.terminalIds.length === 0">暂无</span>
        </template>
        <template #operation="{ item }">
          <el-button v-auth="'ips:handDuty:edit'" :disabled="item.row.state === 1 || item.row.state === 2" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-if="item.row.state === 0" v-auth="'ips:handDuty:publish'" type="primary" plain size="small" @click="clickPublish(item.row)">
            发布
          </el-button>
          <el-button v-if="item.row.state === 1 || item.row.state === 2" v-auth="'ips:handDuty:publish'" size="small" @click="cancelPublish(item.row.id)">
            撤销
          </el-button>
          <el-button v-if="item.row.state === 3" type="primary" size="small" disabled>
            已过期
          </el-button>
          <el-button v-auth="'ips:handDuty:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addHandDuty v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
      <publishDialog v-if="dialogPublish" :terminal-options="data.terminalOptions" :info-data="data.publishInfoData" :dialog-visible="dialogPublish" @close-dialog="closePublishDialog" @submit-dialog="publishSubmint" />

      <!-- 导入弹窗 -->
      <importDutyDialog v-if="dialogImport" :dialog-visible="dialogImport" @close-dialog="closeImportDialog" @submit-dialog="importSubmint" />
    </page-main>
  </div>
</template>

  <style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
  </style>

