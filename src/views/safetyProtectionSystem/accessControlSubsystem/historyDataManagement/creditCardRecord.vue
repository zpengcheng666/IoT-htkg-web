<!--
 * @Description:刷卡记录
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-13 08:58:16
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-02 10:41:55
-->

<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    doorIds: [] as Array<string>,
    perName: '',
    cardCode: '',
    accessTypes: [] as Array<string>,
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  devDoorOptions: [{ // 门名称下拉数据
    id: '',
    name: '',
  }],
  times: '',
  selectIds: [] as any,
  infoData: {},
  dialogType: 'edit',
  dialogTitle: '编辑刷卡记录',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'doorName',
    label: '门名称',
  },
  {
    prop: 'doorType',
    label: '门类型',
  },
  {
    prop: 'perName', // prop
    label: '人员名称',
  },
  {
    prop: 'perDept', // prop
    label: '单位',
  },
  {
    prop: 'perTitle', // prop
    label: '职务',
  },
  {
    prop: 'cardCode', // prop
    label: '卡号',
  },
  {
    prop: 'swipeTime', // prop
    label: '刷卡时间',
  },
  {
    prop: 'accessType', // prop
    label: '进出类型',
  },
  {
    prop: 'openType', // prop
    label: '开门类型',
  },
  {
    prop: 'cardResult', // prop
    label: '刷卡结果',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '140px',
  },
])

const total = ref(0) // 总条数
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
  api.get('door/doorData/cardRecordList', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 多选事件
const selectionChange = (val: []) => {
  data.selectIds = val
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
      api.delete(`door/doorData/delete?id=${id}`).then((res: any) => {
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

// 批量删除
function batchDel() {
  ElMessageBox.confirm(
    '此操作将批量删除选中的数据，是否删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const selectArr = []
      for (const i in data.selectIds) {
        selectArr.push(data.selectIds[i].id)
      }
      const ids = selectArr.toString()
      api.delete(`/door/doorData/deleteBatch?ids=${ids}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          data.selectIds = [] as any
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
      data.selectIds = [] as any
      getList()
    })
}

// 获取门名称下拉
function getDoorOptions() {
  api.get('scada/conSheBei/conSheBeiDoorOptiongs').then((res: any) => {
    data.devDoorOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  getDoorOptions()
})
// 重置
function reset() {
  data.form = {
    doorIds: [] as Array<string>,
    perName: '',
    cardCode: '',
    accessTypes: [] as Array<string>,
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
  getList()
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
      api.get('/door/doorData/entry/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '刷卡记录.xls'
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
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline" label-width="100px">
        <el-form-item label="门名称：">
          <el-select v-model="data.form.doorIds" :filterable="true" :clearable="true" :multiple="true" placeholder="请选择门名称">
            <el-option
              v-for="item in data.devDoorOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人员姓名：">
          <el-input v-model="data.form.perName" placeholder="" />
        </el-form-item>

        <el-form-item label="卡号：">
          <el-input v-model="data.form.cardCode" placeholder="" />
        </el-form-item>
        <el-form-item label="进出类型：">
          <el-select v-model="data.form.accessTypes" filterable clearable placeholder="请选择出入类型">
            <el-option label="进门" value="entryCard" />
            <el-option label="出门" value="exitCard" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="data.form.startTime"
            style="width: 100%;"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="data.form.endTime"
            style="width: 100%;"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="getList()">
            查询
          </el-button>
          <el-button type="info" plain @click="reset()">
            重置
          </el-button>
          <el-button v-auth="'access:card:export'" type="primary" @click="exportXls()">
            导出
          </el-button>
          <el-button v-auth="'access:card:del'" type="danger" :disabled="data.selectIds.length === 0" @click="batchDel">
            批量删除
          </el-button>
        </el-form-item>
      </el-form>
      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template #operate="{ item }">
          <el-button v-auth="'access:card:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </page-main>
  </div>
</template>

  <style lang="scss" scoped>
  .el-form--inline .el-form-item {
    width: calc(100% / 3 - 60px);
  }

  .el-select {
    width: 100%;
  }

  .flex-nowrap {
    flex-wrap: nowrap;
  }
  </style>

