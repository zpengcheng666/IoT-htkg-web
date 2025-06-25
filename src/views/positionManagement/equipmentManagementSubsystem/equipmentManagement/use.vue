<!--
 * @Description:动用使用
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-26 14:54:33
-->

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import useDialog from './components/useDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    type: '',
    name: '',
    code: '',
    devId: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增动用使用',
  deviceNameOptions: [{
    id: '',
    name: '',
  }], // 设备名称下拉数据
  deviceTypeList: [] as any,
})
// 重置
function reset() {
  data.form = {
    type: '',
    name: '',
    code: '',
    devId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'devId_disp',
    label: '设备名称',
  },
  {
    prop: 'startTime',
    label: '最后启动时间',
  },
  {
    prop: 'stopTime', // prop
    label: '最后停止时间',
  },
  {
    prop: 'duration', // prop
    label: '最后运行时长',
  },
  {
    prop: 'totalDuration', // prop
    label: '累计运行时长',
  },
  {
    prop: 'remark', // prop
    label: '备注',
  },

])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗

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
const defaultProps = {
  children: 'children',
  label: 'title',
  id: 'id',
  value: 'id',
}
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/facility/deviceRunLog/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
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
// 删除操作
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
      api.delete(`/facility/deviceRunLog/delete?id=${id}`).then((res: any) => {
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
// 提交新增或编辑
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/facility/deviceRunLog/add', postData).then((res: any) => {
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
    api.post('/facility/deviceRunLog/edit', postData).then((res: any) => {
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
// 获取设备名称下拉
function getDeviceNameOptions() {
  api.get('facility/deviceRunLog/listDeviceOptions').then((res: any) => {
    data.deviceNameOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function getDeviceTypeList() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/facility/deviceType/queryTreeList', postData).then((res: any) => {
    data.deviceTypeList = res.result
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
      api.get('/facility/deviceRunLog/export', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '设备动用使用报表.xls'
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
  getDeviceNameOptions()
  getDeviceTypeList()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="设备类型：">
            <el-tree-select v-model="data.form.type" style="width: 200px;" default-expand-all check-strictly
              :props="defaultProps" :data="data.deviceTypeList" />
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="data.form.name" placeholder="输入搜索设备名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">
              查询
            </el-button>
            <el-button type="info" plainb @click="reset()">
              重置
            </el-button>
            <el-button
              v-auth="['data:history:export', 'access:history:export', 'fire:history:export', 'pas:history:export', 'ems:history:export', 'pms:history:export', 'wsds:history:export']"
              type="primary" @click="exportXls()">
              导出
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>

    </el-row>
    <CommonTable :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange">
      <template #operate="{ item }">
        <el-button v-auth="'fem:use:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'fem:use:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>

    </CommonTable>
    <useDialog v-if="dialogAdd" :device-name-options="data.deviceNameOptions" :title="data.dialogTitle"
      :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog"
      @submit-dialog="addSubmit" />
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

