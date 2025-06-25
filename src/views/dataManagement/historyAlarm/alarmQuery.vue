<!--
 * @Description:报警查询
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-18 14:35:33
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-02 14:25:24
-->

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addAlarmQuery from './components/addAlarmQuery.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import CommonSelect from '@/components/CommonSelect/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  selectIds: [] as any,
  form: {
    deviceType: '',
    deviceId: '',
    attrId: '',
    levelId: '',
    alarmTypeId: '',
    isHandle: '',
    subsystem: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: '',
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  subsystemName: '',
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'deviceName',
    label: '设备名称',
  },
  {
    prop: 'attrName', // prop
    label: '设备属性',
  },
  {
    prop: 'alarmValue', // prop
    label: '报警值',
  },
  {
    prop: 'range', // prop
    label: '标定值',
  },
  {
    prop: 'alarmStartTime', // prop
    label: '开始时间',
    width: '180px',
  },
  {
    prop: 'alarmEndTime', // prop
    label: '结束时间',
    width: '180px',
  },
  {
    prop: 'alarmTypeName', // prop
    label: '报警类型',
  },
  {
    prop: 'levelName', // prop
    label: '报警级别',
  },
  {
    prop: 'confirmor', // prop
    label: '确认人',
  },
  {
    prop: 'confirmTime', // prop
    label: '确认时间',
  },
  {
    prop: 'isHandleTxt', // prop
    label: '处理状态',
  },
  {
    prop: 'handler', // prop
    label: '处理人',
  },
  {
    prop: 'handleTime', // prop
    label: '处理时间',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '100px',
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
  postData.params.deviceTypeId = postData.params.deviceType.toString()
  postData.params.attrId = postData.params.attrId.toString()
  api.get('alarm/alarmHistory/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.form.subsystem
  api.get(`api/scada/listAlarmDeviceTypeBySubSystem?subSystemId=${subSystemId}`).then((res: any) => {
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
  api.get('scada/conSheBei/listAlarmAttrByDeviceIds', postData).then((res: any) => {
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
const dialogAdd = ref(false) // 添加弹窗

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
function reset() {
  data.form = {
    deviceType: '',
    deviceId: '',
    attrId: '',
    levelId: '',
    alarmTypeId: '',
    isHandle: '',
    startTime: '',
    endTime: '',
    subsystem: data.subsystemName,
    pageNo: 1,
    pageSize: 30,
  }
  data.devOptions = []
  data.devAttrOptions = []
  data.times = ''
  getList()
}

// 批量处理
const batchHandler = () => {
  data.infoData = {}
  data.dialogType = 'batchHandler'
  data.dialogTitle = '报警处理'
  dialogAdd.value = true
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
      const ids = data.selectIds
      api.delete(`/alarm/alarmHistory/deleteBatch?ids=${ids}`).then((res: any) => {
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

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '报警处理'
  dialogAdd.value = true
}

function getAlarmLevel(val: any) {
  data.form.levelId = val
}

function getAlarmType(val: any) {
  data.form.alarmTypeId = val
}
const selectChange = (rows: any[]) => {
  data.selectIds = rows.map(row => row.id as string)
}
// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('alarm/alarmHistory/add', postData).then((res: any) => {
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
    api.post('alarm/alarmHistory/edit', postData).then((res: any) => {
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
  else if (data.dialogType === 'batchHandler') {
    const handlerData = {
      ids: data.selectIds,
      handler: val.handler,
      handleMethod: val.handleMethod,
    }
    api.put('alarm/alarmHistory/handler', handlerData).then((res: any) => {
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
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const str = route.path.substring(index + 1, route.path.length)
  if (str !== 'alarmQuery') {
    data.form.subsystem = str
    data.subsystemName = str
  }
  else {
    data.form.subsystem = ''
  }
  getDeviceTypeOptions()
  reset()
})
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
      api.get('/alarm/alarmHistory/historyAlarm/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '报警查询.xls'
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
  <PageMain class="pageBox">
    <el-form :inline="true" :model="data.form" class="demo-form-inline">
      <el-row>
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
      </el-row>
      <el-row>
        <el-form-item label="报警级别">
          <CommonSelect post-param="alarm-level-list" :select-value="data.form.levelId" @select-change="getAlarmLevel" />
        </el-form-item>
        <el-form-item label="报警类型">
          <CommonSelect post-param="alarm-type-list" :select-value="data.form.alarmTypeId" @select-change="getAlarmType" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="data.form.isHandle" filterable clearable placeholder="请选择处理状态">
            <el-option label="未处理" value="0" />
            <el-option label="已处理" value="1" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
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
          <el-button
            v-auth="['data:alarm:export', 'access:alarm:export', 'fire:alarm:export', 'avs:alarm:export', 'pas:alarm:export', 'ems:alarm:export', 'pms:alarm:export', 'wsds:alarm:export']" type="primary" @click="exportXls()"
          >
            导出
          </el-button>
          <el-button type="info" plain @click="batchHandler()">
            批量处理
          </el-button>
          <el-button v-auth="'data:alarm:del'" type="danger" :disabled="data.selectIds.length === 0" @click="batchDel">
            批量删除
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="true"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="['data:alarm:dispose', 'access:alarm:dispose', 'fire:alarm:dispose', 'avs:alarm:dispose', 'pas:alarm:dispose', 'ems:alarm:dispose', 'pms:alarm:dispose', 'wsds:alarm:dispose']" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          处理
        </el-button>

      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addAlarmQuery v-if="dialogAdd" :dialog-type="data.dialogType" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmint" />
  </PageMain>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100% / 3 - 40px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
