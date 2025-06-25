<!--
 * @Description:预案管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:07:06
-->
<script lang="ts" setup>
import {  Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addPlanmanagement from './components/addPlanmanagement.vue'
import uploadContingencyDialog from './components/uploadContingencyDialog.vue'
import stageListDialog from './components/stageListDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const formInline = reactive({
  region: '',
  date1: '',
  date2: '',
})
const data = reactive({
  tableData: [],
  form: {
    contingencyClass: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增',
  contingencyOptions: [{
    id: '',
    name: '',
  }], // 设备名称下拉数据
})

// 重置
function reset() {
  data.form = {
    name: '',
    contingencyClass: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '预案名称',
  },
  {
    prop: 'contingencyClass_disp',
    label: '突发事件类型',
  },
  {
    prop: 'description', // prop
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
const dialogUpload = ref(false)// 上传图片
const dialogStage = ref(false)
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/system/contingencyPlan/list', postData).then((res: any) => {
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
function closeUploadImgDialog() {
  dialogUpload.value = false
}
// 点击上传图片
function uploadImg(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  dialogUpload.value = true
}
// 上传图片提交
function addUploadImgSubmit(val: any) {
  const postData = {
    id: data.infoData.id,
    imgUrls: val.join(','),
  }
  api.post('/system/contingencyPlan/saveImgContingency', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogUpload.value = false
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
// 查看阶段
function viewStage(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogTitle = '阶段'
  dialogStage.value = true
}
function closeStageDialog() {
  dialogStage.value = false
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/system/contingencyPlan/add', postData).then((res: any) => {
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
    api.post('/system/contingencyPlan/edit', postData).then((res: any) => {
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
      api.delete(`/system/contingencyPlan/delete?id=${id}`).then((res: any) => {
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
// 突发事件下拉
function getContingencyOptions() {
  api.get('system/contingencyPlan/listContingencyPlanOptions').then((res: any) => {
    data.contingencyOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  getContingencyOptions()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="突发事件类型：">
            <el-select v-model="data.form.contingencyClass" placeholder="" filterable clearable>
              <el-option
                v-for="item in data.contingencyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="预案名称">
            <el-input v-model="data.form.name" placeholder="" />
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
        <el-button v-auth="'data:plan:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button type="primary" size="small" @click="viewStage(item.row)">
          查看阶段
        </el-button>
        <el-button v-auth="'data:plan:edit'" type="primary" size="small" @click="uploadImg(item.row)">
          上传图片
        </el-button>
        <el-button v-auth="'data:plan:edit'" type="primary" size="small" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'data:plan:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <addPlanmanagement v-if="dialogAdd" :contingency-options="data.contingencyOptions" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    <uploadContingencyDialog v-if="dialogUpload" :dialog-visible="dialogUpload" :info-data="data.infoData" @close-dialog="closeUploadImgDialog" @submit-dialog="addUploadImgSubmit" />
    <stageListDialog v-if="dialogStage" :title="data.dialogTitle" :dialog-visible="dialogStage" :info-data="data.infoData" @close-dialog="closeStageDialog" />
  </PageMain>
</template>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
