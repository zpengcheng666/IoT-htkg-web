<!--
 * @Description:保养方案
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-25 10:01:40
-->
<script lang="ts" setup name="PersonalSetting">
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addMaintenancePlanDialog from './components/addMaintenancePlanDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

const data = reactive({
  tableData: [],
  form: {
    schemasName: '',
    itemClassId: '',
    pageNo: 1,
    pageSize: 30,

  },
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  multipleSelection: [],
  classOptions: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'schemasName',
    label: '方案名称',
    sortable: true,
  },
  {
    prop: 'itemClass_disp',
    label: '保养类型',
    sortable: true,
  },

  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '240px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/maintain/maintainSchemas/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取保养类别
function getClassList() {
  const postData = {}
  api.get('/facility/deviceType/queryTreeList', postData).then((res: any) => {
    data.classOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    schemasName: '',
    itemClassId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '详情'
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
      api.delete(`/maintain/maintainSchemas/delete?id=${id}`).then((res: any) => {
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
// 保养类别
function getAlarmType(val: any) {
  data.form.itemClassId = val
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
// 多选事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}
// 点击新增
function clickAdd() {
  data.infoData = {
    deviceClassIds: [],
  }
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
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/maintain/maintainSchemas/addSchemasDevice', postData).then((res: any) => {
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
    api.post('/maintain/maintainSchemas/editSchemasDevice', postData).then((res: any) => {
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
  getClassList()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="data.form" label-width="100px">
            <el-form-item label="保养类别：">
              <CommonSelect post-param="maintain-item-class" :select-value="data.form.itemClassId" @select-change="getAlarmType" />
            </el-form-item>
            <el-form-item label="方案名称：">
              <el-input v-model="data.form.schemasName" placeholder="" />
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
          <el-button v-auth="'fem:mrmPlan:add'" type="warning" @click="clickAdd()">
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
        :is-index="true"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template #operation="{ item }">
          <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">
            详情
          </el-button>
          <el-button v-auth="'fem:mrmPlan:edit'" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'fem:mrmPlan:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addMaintenancePlanDialog v-if="dialogAdd" :class-options="data.classOptions" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

