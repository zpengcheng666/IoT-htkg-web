<!--
 * @Description:环境报表管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-18 14:35:33
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-26 14:14:55
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    deviceId: '',
    deviceType: '',
    reportType: '',
    date: '',
  },
  times: '',
  subsystemName: 'huanjing',
  devTypeOptions: [] as any,
  devOptions: [] as any,
})

function rounding(row: any, column: any){
  return parseFloat(row[column.property]).toFixed(2)
}

// 获取列表
function getList() {
  data.tableData = []
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.deviceId = postData.params.deviceId.toString()
  postData.params.deviceType = postData.params.deviceType.toString()
  postData.params.reportType = postData.params.reportType.toString()

  if (data.form.deviceType === '') {
    ElMessage({
      type: 'error',
      message: '请选择设备类型',
    })
    return false
  }
  if (postData.params.deviceId === '') {
    ElMessage({
      type: 'error',
      message: '请选择设备名称',
    })
    return false
  }
  if (postData.params.reportType === '') {
    ElMessage({
      type: 'error',
      message: '请选择报表类型',
    })
    return false
  }
  if (postData.params.date === '') {
    ElMessage({
      type: 'error',
      message: '请选择时间/日期',
    })
    return false
  }
  api.get('store/storeHistory/env/report', postData).then((res: any) => {
    data.tableData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function reset() {
  data.form = {
    deviceId: '',
    deviceType: '',
    reportType: '',
    date: '',
  }
  data.devOptions = []
  data.times = ''
  // getList()
  data.tableData = []
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.subsystemName
  api.get(`api/scada/listStoreDeviceTypeBySubSystem?subSystemId=${subSystemId}`).then((res: any) => {
    data.devTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 选择设备类型
function selectdevType(val: any) {
  data.form.deviceId = ''
  getDeviceOptions(val)
}

// 选择报表类型
function selectReportType() {
  data.form.date = ''
}

// 获取设备下拉
function getDeviceOptions(id: any) {
  const postData = {
    params: {
      devTypeIds: id.toString(),
    },
  }
  api.get('scada/deviceTypeManagement/devTypeIdBydevs', postData).then((res: any) => {
    data.devOptions = res.result
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
      api.get('/store/storeHistory/env/exportReport', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '环境温湿度报表.xls'
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
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const str = route.path.substring(index + 1, route.path.length)
  // if (str !== 'historyData') {
  //   data.form.subsystem = str
  //   data.subsystemName = str
  // }
  // else {
  //   data.form.subsystem = ''
  // }
  reset()
  getDeviceTypeOptions()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-form :inline="true" :model="data.form" class="demo-form-inline">
      <el-form-item label="设备类型">
        <el-select v-model="data.form.deviceType" filterable clearable placeholder="请选择设备类型" @change="selectdevType">
          <el-option v-for="item in data.devTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-select v-model="data.form.deviceId" filterable clearable :disabled="data.form.deviceType === ''"
          placeholder="请选择设备">
          <el-option v-for="item in data.devOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="报表类型">
        <el-select v-model="data.form.reportType" filterable clearable placeholder="请选择报表类型" @change="selectReportType">
          <el-option label="日报" value="1" />
          <el-option label="周报" value="2" />
          <el-option label="月报" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="时间/日期">
        <el-date-picker v-if="data.form.reportType !== '3'" v-model="data.form.date" style="width: 100%;" type="date"
          placeholder="请选择" value-format="YYYY-MM-DD HH:mm:ss" />

        <el-date-picker v-if="data.form.reportType === '3'" v-model="data.form.date" style="width: 100%;" type="month"
          placeholder="请选择" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="getList()">
          查询
        </el-button>
        <el-button type="info" plain @click="reset()">
          重置
        </el-button>
        <el-button
          v-auth="['data:history:export', 'access:history:export', 'fire:history:export', 'pas:history:export', 'ems:history:export', 'pms:history:export', 'wsds:history:export']"
          type="primary" @click="exportXls()">
          导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data.tableData" style="width: 100%;" stripe>
      <el-table-column prop="date" label="日期" width="120" v-if="data.form.reportType !== '1'" />
      <el-table-column prop="date" label="时间" width="120" v-if="data.form.reportType === '1'" />
      <el-table-column label="温度℃" align="center">
        <el-table-column align="center" prop="humAvg" label="均值" :formatter="rounding"/>
        <el-table-column align="center" prop="humMax" label="高值" :formatter="rounding"/>
        <el-table-column align="center" prop="humMin" label="低值" :formatter="rounding"/>
      </el-table-column>
      <el-table-column label="湿度%" align="center">
        <el-table-column align="center" prop="tempAvg" label="均值" :formatter="rounding"/>
        <el-table-column align="center" prop="tempMax" label="高值" :formatter="rounding"/>
        <el-table-column align="center" prop="tempMin" label="低值" :formatter="rounding"/>
      </el-table-column>
    </el-table>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100%/3 - 40px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
