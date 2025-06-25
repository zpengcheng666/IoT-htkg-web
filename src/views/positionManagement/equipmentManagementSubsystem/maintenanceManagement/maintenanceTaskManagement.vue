<!--
 * @Description:保养任务
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:12:45
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import addMaintenanceTaskDialog from './components/addMaintenanceTaskDialog.vue'
import submitDialog from './components/submitDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    status: '',
    principalId: '',
    startTime_begin: '',
    startTime_end: '',
    itemClass: '',
    pageNo: 1,
    pageSize: 30,
  },
  tabList: [] as any,
  times: '',
  multipleSelection: [],
  maintenancePlanOptions: [],
  personnelOptions: [] as any,
  infoData: {},
  dialogType: 'add',
  dialogTitle: '保养任务',
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'schemaName',
    label: '保养方案',
  },
  {
    prop: 'principal',
    label: '负责人',
  },
  {
    prop: 'creator', // prop
    label: '签发人',
  },
  {
    prop: 'startTime', // prop
    label: '开始时间',
  },
  {
    prop: 'endTime', // prop
    label: '结束时间',
  },
  {
    prop: 'status', // prop
    slot: 'status',
    label: '状态',
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
const dialogSubmit = ref(false)
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


// 点击新增
function clickAdd() {
  data.infoData = {
    itemClass: data.form.itemClass,
    times: '',
  }
  data.dialogType = 'add'
  data.dialogTitle = '保养任务'
  dialogAdd.value = true
}

// 点击编辑
function clickEdit(row: any) {
  const times = []
  times.push(row.startTime)
  times.push(row.endTime)
  row.times = times
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

// 点击详情
function clickInfo(row: any) {
  const postData = {
    params: {
      id: row.id,
    },
  }
  api.get('/maintain/maintainRecord/queryById', postData).then((res: any) => {
    data.infoData = res.result
    const array = JSON.parse(JSON.stringify(res.result.operates))
    const arr = []
    const test = []
    let num = 1
    let size = array.length
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        if (array[i].deviceId === array[j].deviceId) {
          array.splice(j, 1)
          size--
          j--
          num++
        }
      }
      test[i] = num
      num = 1
      arr[i] = array[i]
    }
    for (let i = 0; i < size; i++) {
      let a = true
      for (let j = 0; j < res.result.operates.length; j++) {
        if (res.result.operates[j].deviceId === arr[i].deviceId) {
          if (a) {
            a = false
            res.result.operates[j].counts = test[i]
          }
          else {
            res.result.operates[j].counts = 0
          }
        }
      }
    }
    data.dialogType = 'info'
    data.dialogTitle = '详情'
    dialogAdd.value = true
  }).catch((error) => {
    window.console.log(error)
  })
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 获取列表
function getList() {

  const postData = {
    params: data.form,
  }
  api.get('/maintain/maintainRecord/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取保养方案下拉
function getMaintenancePlanOptions(itemClassId: any) {
  const postData = {
    params: {
      itemClassId,
    },
  }
  api.get('/maintain/maintainSchemas/schemasOptions', postData).then((res: any) => {
    data.maintenancePlanOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

function reset() {
  data.form.status = ''
  data.times = ''
  data.form.startTime_begin = ''
  data.form.startTime_end = ''
  getList()
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
      api.delete(`/maintain/maintainRecord/delete?id=${id}`).then((res: any) => {
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

// 签发
function clickSign(id: string) {
  ElMessageBox.confirm(
    '此操作将签发该任务，是否签发?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.post(`/maintain/maintainRecord/confirm?id=${id}`).then((res: any) => {
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

// 执行
function clickExecute(id: string) {
  ElMessageBox.confirm(
    '此操作将执行该任务，是否执行?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.post(`/maintain/maintainRecord/act?id=${id}`).then((res: any) => {
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

// 点击提交
function clickSubmit(row: any) {
  const postData = {
    params: {
      id: row.id,
    },
  }
  api.get('/maintain/maintainRecord/queryById', postData).then((res: any) => {
    data.infoData = res.result
    const array = JSON.parse(JSON.stringify(res.result.operates))
    const arr = []
    const test = []
    let num = 1
    let size = array.length
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        if (array[i].deviceId === array[j].deviceId) {
          array.splice(j, 1)
          size--
          j--
          num++
        }
      }
      test[i] = num
      num = 1
      arr[i] = array[i]
    }
    for (let i = 0; i < size; i++) {
      let a = true
      for (let j = 0; j < res.result.operates.length; j++) {
        if (res.result.operates[j].deviceId === arr[i].deviceId) {
          if (a) {
            a = false
            res.result.operates[j].counts = test[i]
          }
          else {
            res.result.operates[j].counts = 0
          }
        }
      }
    }
    data.dialogTitle = '提交'
    dialogSubmit.value = true
  }).catch((error) => {
    window.console.log(error)
  })
}

// 关闭提交弹窗
function closeSubmitDialog() {
  dialogSubmit.value = false
}
// 开始提交
function submitStart(val: any) {
  ElMessageBox.confirm(
    '此操作将提交该任务，是否提交?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        id: val.id,
        operateIds: val.operateIds,
      }
      api.post('/maintain/maintainRecord/submit', postData).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          dialogSubmit.value = false
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
// 审核
function clickAudit(id: string) {
  ElMessageBox.confirm(
    '此操作将审核该任务，是否审核?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.post(`/maintain/maintainRecord/complete?id=${id}`).then((res: any) => {
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
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/maintain/maintainRecord/add', postData).then((res: any) => {
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
    api.post('/maintain/maintainRecord/edit', postData).then((res: any) => {
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

// 获取tab数据
function getTabsList() {
  const postData = {
    params: { type: 'maintain-item-class' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.tabList = res.result
    data.form.itemClass = res.result[0].id
    getMaintenancePlanOptions(res.result[0].id)
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取内部人员下拉
function getListInternalOptions() {
  api.get('/inOutPosition/inOutList/listInternalOptions').then((res: any) => {
    data.personnelOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击tab
function clcikTab() {
  getList()
  getMaintenancePlanOptions(data.form.itemClass)
}
onMounted(() => {
  getList()
  getTabsList()
  getListInternalOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-tabs v-model="data.form.itemClass" class="demo-tabs" @tab-change="clcikTab">
        <el-tab-pane
          v-for="(v, i) in data.tabList" :key="i" :label="v.name" :name="v.id"
        />
      </el-tabs>
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="data.form" class="demo-form-inline">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="data.form.startTime_begin"
                style="width: 100%;"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="data.form.startTime_end"
                style="width: 100%;"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="任务状态：">
              <el-select v-model="data.form.status" placeholder="请选择" filterable clearable>
                <el-option label="待签发" :value="0" />
                <el-option label="待审核" :value="1" />
                <el-option label="已完成" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="负责人：">
              <el-select v-model="data.form.principalId" placeholder="" filterable clearable>
                <el-option
                  v-for="item in data.personnelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="">
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
          <el-button v-auth="'fem:mrmTask:add'" type="warning" @click="clickAdd()">
            新增任务
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
        @selection-change="selectionChange"
      >
        <template #status="{ item }">
          <span>{{ item.row.status === 0 ? '待签发' : item.row.status === 1 ? '待执行' : item.row.status === 2 ? '执行中' : item.row.status === 3 ? '待审核' : '已完成' }}</span>
        </template>
        <template #operate="{ item }">
          <el-button v-if="item.row.status === 0" v-auth="'fem:mrmTask:sign'" type="primary" size="small" :dark="true" @click="clickSign(item.row.id)">
            签发
          </el-button>
          <el-button v-if="item.row.status === 1" v-auth="'fem:mrmTask:execute'" type="primary" size="small" :dark="true" @click="clickExecute(item.row.id)">
            执行
          </el-button>
          <el-button v-if="item.row.status === 2" v-auth="'fem:mrmTask:submit'" type="primary" size="small" :dark="true" @click="clickSubmit(item.row)">
            提交
          </el-button>
          <el-button v-if="item.row.status === 3" v-auth="'fem:mrmTask:check'" type="primary" size="small" :dark="true" @click="clickAudit(item.row.id)">
            审核
          </el-button>
          <el-button type="primary" size="small" :dark="true" @click="clickInfo(item.row)">
            详情
          </el-button>
          <el-button v-auth="'fem:mrmTask:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'fem:mrmTask:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addMaintenanceTaskDialog v-if="dialogAdd" :dialog-type="data.dialogType" :item-class-id="data.form.itemClass" :personnel-options="data.personnelOptions" :maintenance-plan-options="data.maintenancePlanOptions" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" @submit-dialog="addSubmit" @close-dialog="closeDialog" />
      <!-- 提交弹窗 -->
      <submitDialog v-if="dialogSubmit" :title="data.dialogTitle" :dialog-visible="dialogSubmit" :info-data="data.infoData" @submit-dialog="submitStart" @close-dialog="closeSubmitDialog" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

