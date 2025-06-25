<!--
 * @Description:交接管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 16:49:34
-->


<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import handoverManagementDialog from './components/handoverManagementDialog.vue'
import uploadImgDialog from './components/uploadImgDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const data = reactive({
  tableData: [],
  treeData: [],
  form: {
    devId: '',
    deliverer: '',
    receiver: '',
    handoverTime: '',
    end_handoverTime: '',
    begin_handoverTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: '',
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增属性字典',
  deviceNameOptions: [{
    id: '',
    name: '',
  }], // 设备名称下拉数据

})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'devId_disp',
    label: '设备名称',
    sortable: true,
  },
  {
    prop: 'handoverTime',
    label: '交接时间',
    sortable: true,
  },
  {
    prop: 'deliverer', // prop
    label: '交付单位',
    sortable: true,
  },
  {
    prop: 'deliverMan', // prop
    label: '交付人',
  },
  {
    prop: 'receiver', // prop
    label: '接收单位',
    sortable: true,
  },
  {
    prop: 'receiveMan', // prop
    label: '接收人',
  },
  {
    prop: 'monitor', // prop
    label: '监交人',
  },
  {
    prop: 'note', // prop
    label: '备注',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '280px',
  },
])
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogUpload = ref(false)// 上传图片
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
// 获取列表
function getList() {

  const postData = {
    params: data.form,
  }
  api.get('/facility/deviceHandover/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    devId: '',
    deliverer: '',
    receiver: '',
    handoverTime: '',
    end_handoverTime: '',
    begin_handoverTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
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
// 点击上传图片
function uploadImg(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  dialogUpload.value = true
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
      api.delete(`/facility/deviceHandover/delete?id=${id}`).then((res: any) => {
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

function closeUploadImgDialog() {
  dialogUpload.value = false
}

// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/facility/deviceHandover/add', postData).then((res: any) => {
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
    api.post('/facility/deviceHandover/edit', postData).then((res: any) => {
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

// 上传图片提交
function addUploadImgSubmit(val: any) {
  const postData = {
    id: data.infoData.id,
    imgUrls: val.join(','),
  }
  api.post('/system/filesUtil/saveImg', postData).then((res: any) => {
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
// 获取设备名称下拉
function getDeviceNameOptions() {
  api.get('facility/deviceRunLog/listDeviceOptions').then((res: any) => {
    data.deviceNameOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  getDeviceNameOptions()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-form :inline="true" :model="data.form" class="demo-form-inline">
      <el-form-item label="设备名称：">
        <el-select v-model="data.form.devId" placeholder="" filterable clearable>
          <el-option
            v-for="item in data.deviceNameOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交付单位">
        <el-input v-model="data.form.deliverer" placeholder="请输入设备类型" />
      </el-form-item>
      <el-form-item label="接收单位">
        <el-input v-model="data.form.receiver" placeholder="请输入设备" />
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="data.form.begin_handoverTime"
          style="width: 100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="data.form.end_handoverTime"
          style="width: 100%;"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="getList()">
          查询
        </el-button>
        <el-button type="info" plain @click="reset()">
          重置
        </el-button>
        <el-button v-auth="'fem:handover:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增
        </el-button>
      </el-form-item>
    </el-form>
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
        <el-button v-auth="'fem:handover:edit'" type="primary" size="small" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'fem:handover:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
        <el-button v-auth="'fem:handover:edit'" type="primary" size="small" @click="uploadImg(item.row)">
          上传图片
        </el-button>
      </template>
    </CommonTable>
    <handoverManagementDialog v-if="dialogAdd" :device-name-options="data.deviceNameOptions" :tree-data="data.treeData" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    <uploadImgDialog v-if="dialogUpload" :dialog-visible="dialogUpload" :info-data="data.infoData" @close-dialog="closeUploadImgDialog" @submit-dialog="addUploadImgSubmit" />
  </PageMain>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100% / 5 - 32px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.chart_box {
  width: 100%;
  min-height: 500px;

  #maychar {
    width: 100%;
    min-height: 500px;
  }
}

:deep(.btn-right .el-form-item__content) {
  justify-content: flex-end;
}
</style>

