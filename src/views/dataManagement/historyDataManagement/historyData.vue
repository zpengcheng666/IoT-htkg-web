<!--
 * @Description:历史数据
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-18 14:35:33
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-23 14:54:01
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    deviceId: '',
    deviceType: '',
    attrId: '',
    startTime: '',
    endTime: '',
    subsystem: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: '',
  subsystemName: '',
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'deviceType_disp',
    label: '设备类型',
  },
  {
    prop: 'deviceName',
    label: '设备名称',
  },
  {
    prop: 'attrName', // prop
    label: '设备属性',
  },
  {
    prop: 'recordValue', // prop
    label: '记录值',
  },
  {
    prop: 'unit', // prop
    label: '单位',
  },
  {
    prop: 'recordTime', // prop
    label: '记录时间',
  },
  {
    prop: 'locationId', // prop
    label: '所在位置',
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
  data.tableData = []
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.deviceId = postData.params.deviceId.toString()
  postData.params.deviceType = postData.params.deviceType.toString()
  postData.params.attrId = postData.params.attrId.toString()

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

  api.get('store/storeHistory/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
function reset() {
  data.form = {
    deviceId: '',
    deviceType: '',
    attrId: '',
    startTime: '',
    endTime: '',
    subsystem: data.subsystemName,
    pageNo: 1,
    pageSize: 30,
  }
  data.devOptions = []
  data.devAttrOptions = []
  data.times = ''
  // getList()
  data.tableData = []
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.form.subsystem
  api.get(`api/scada/listStoreDeviceTypeBySubSystem?subSystemId=${subSystemId}`).then((res: any) => {
    data.devTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 选择设备类型
function selectdevType(val: any) {
  data.form.deviceId = ''
  data.form.attrId = ''
  getDeviceOptions(val)
}

// 选择设备
function selectDev(val: any) {
  data.form.attrId = ''
  getDeviceAttrOptions(val)
}

// 获取设备属性下拉
function getDeviceAttrOptions(id: any) {
  const postData = {
    params: {
      devIds: id.toString(),
    },
  }
  api.get('scada/conSheBei/listStoreAttrByDeviceIds', postData).then((res: any) => {
    data.devAttrOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.get('/store/storeHistory/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '历史数据.xls'
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
  if (str !== 'historyData') {
    data.form.subsystem = str
    data.subsystemName = str
  }
  else {
    data.form.subsystem = ''
  }
  reset()
  getDeviceTypeOptions()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-form :inline="true" :model="data.form" class="demo-form-inline">
      <el-form-item label="设备类型">
        <el-select v-model="data.form.deviceType" multiple filterable clearable placeholder="请选择设备类型" @change="selectdevType">
          <el-option
            v-for="item in data.devTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-select v-model="data.form.deviceId" multiple filterable clearable :disabled="data.form.deviceType === ''" placeholder="请选择设备" @change="selectDev">
          <el-option
            v-for="item in data.devOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备属性">
        <el-select v-model="data.form.attrId" multiple filterable clearable :disabled="data.form.deviceType === ''" placeholder="请选择设备属性">
          <el-option
            v-for="item in data.devAttrOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
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
      <el-form-item label="">
        <el-button type="primary" @click="getList()">
          查询
        </el-button>
        <el-button type="info" plain @click="reset()">
          重置
        </el-button>
        <el-button v-auth="['data:history:export', 'access:history:export', 'fire:history:export', 'pas:history:export', 'ems:history:export', 'pms:history:export', 'wsds:history:export']" type="primary" @click="exportXls()">
          导出
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
    />
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
