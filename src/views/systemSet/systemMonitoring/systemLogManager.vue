<!--
 * @Description:系统日志管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:54:03
-->

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'

import dutyPersonList from './components/dutyPersonList.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    operateContent: '',
    username: '',
    stateTime: '',
    beginTime: '',
    attrId: '',
    deviceId: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: '',
  tabActive: '1', // tab栏索引
  infoData: {} as any,
  dialogType: 'add',
  tabList: [] as any,
  logType: '0',
  dutyPersonList: [] as any, // 值班人员
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'username',
    label: '用户名',
  },
  {
    prop: 'stateTime',
    label: '操作时间',
  },
  {
    prop: 'operateContent',
    label: '操作',
  },
])

const dutyTableHeader = reactive([
  {
    prop: 'dutyName',
    label: '值班安排',
  },
  {
    prop: 'groupName',
    label: '值班小组',
  },
  {
    prop: 'dutyDate',
    label: '值班日期',
  },
  {
    fixed: 'right',
    width: '260px',
    slot: 'operation',
    label: '操作',
  },
])

const sbTableHeader = reactive([

  {
    prop: 'deviceName',
    label: '设备名称',
  },
  {
    prop: 'attrName',
    label: '设备属性',
  },
  {
    prop: 'executeTime',
    label: '执行时间',
  },
  {
    prop: 'executeResult',
    slot: 'executeResult',
    label: '执行结果',
  },

])

const total = ref(0) // 总条数
const dialogAdd = ref(false)
const dialogPersonList = ref(false) // 值班人员弹窗

function showPersonList(val: any) {
  data.dutyPersonList = val
  dialogPersonList.value = true
}
function closeDutyPersonDialog() {
  dialogPersonList.value = false
}
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getList(data.tabActive)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getList(data.tabActive)
}

// 点击tab
function clickTab() {
  data.times = ''
  getList(data.tabActive)
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  api.get('api/scada/listAlarmDeviceTypeBySubSystem').then((res: any) => {
    data.devTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
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
function getDeviceOptions() {

  api.get('scada/deviceTypeManagement/devTypeIdBydevs').then((res: any) => {
    data.devOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取列表
function getList(type: any) {

  if (data.times !== null && data.times.length > 0) {
    data.form.beginTime = data.times[0]
    data.form.endTime = data.times[1]
  }
  else {
    data.form.beginTime = ''
    data.form.endTime = ''
  }

  // 获取系统日志
  if (type === '1') {
    const postData = {
      params: {
        startDate: data.form.beginTime,
        endDate: data.form.endTime,
        pageNo: data.form.pageNo,
        pageSize: data.form.pageSize,
      },
    }
    api.get('message/dutyShifts/listHistory', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  }
  else if (type === '2') {
    const postData = {
      params: {
        operateContent: data.form.operateContent,
        username: data.form.username,
        beginTime: data.form.beginTime,
        endTime: data.form.endTime,
        pageNo: data.form.pageNo,
        pageSize: data.form.pageSize,
      },
    }
    api.get('system/baseLog/list', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  }
  else if (type === '3') {
    const postData = {
      params: {
        attrId: data.form.attrId,
        deviceId: data.form.deviceId,
        pageNo: data.form.pageNo,
        pageSize: data.form.pageSize,
      },
    }
    api.get('/scada/deviceExecuteLog/list', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  }
  else {
    data.tableData = []
  }
}

const shortcuts = [
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 重置
function reset() {
  data.form = {
    operateContent: '',
    username: '',
    stateTime: '',
    beginTime: '',
    attrId: '',
    deviceId: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
  getList(data.tabActive)
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
      let url = ''
      let postData = {}
      let exportTitle = ''
      if (data.tabActive === '1') {
        url = '/message/dutyShifts/exportXls'
        exportTitle = '值班日志.xls'
        postData = {
          params: {
            startDate: data.form.beginTime,
            endDate: data.form.endTime,
            pageNo: data.form.pageNo,
            pageSize: data.form.pageSize,
          },
          responseType: 'blob' as any,
        }
      }
      else if (data.tabActive === '2') {
        url = 'system/baseLog/exportXls'
        exportTitle = '系统操作日志.xls'
        postData = {
          params: {
            operateContent: data.form.operateContent,
            username: data.form.username,
            beginTime: data.form.beginTime,
            endTime: data.form.endTime,
            pageNo: data.form.pageNo,
            pageSize: data.form.pageSize,
          },
          responseType: 'blob' as any,
        }
      }
      else if (data.tabActive === '3') {
        url = 'scada/deviceExecuteLog/exportXls'
        exportTitle = '设备操作日志.xls'
        postData = {
          params: {
            attrId: data.form.attrId,
            deviceId: data.form.deviceId,
            pageNo: data.form.pageNo,
            pageSize: data.form.pageSize,
          },
          responseType: 'blob' as any,
        }
      }
      api.get(url, postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = exportTitle
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
  getDeviceOptions()
  getList(data.tabActive)
})
</script>

<template>
  <page-main class="pageBox">
    <el-tabs v-model="data.tabActive" class="demo-tabs" @tab-change="clickTab">
      <el-tab-pane v-auth="'system:monitoring:dutylog'" label="值班日志" name="1" />
      <el-tab-pane v-auth="'system:monitoring:syslog'" label="系统操作日志" name="2" />
      <el-tab-pane v-auth="'system:monitoring:eqhandlelog'" label="设备操作日志" name="3" />
    </el-tabs>
    <el-row>
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-form-item v-if="data.tabActive === '2'" label="用户名：">
          <el-input v-model="data.form.username" placeholder="" />
        </el-form-item>
        <el-form-item v-if="data.tabActive === '2'" label="操作内容：">
          <el-input v-model="data.form.operateContent" placeholder="" />
        </el-form-item>

        <el-form-item v-if="data.tabActive === '2'" label="操作时间：">
          <el-date-picker
            v-model="data.times"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item v-if="data.tabActive === '1'" label="值班日期：">
          <el-date-picker
            v-model="data.times"
            type="daterange"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item v-if="data.tabActive === '3'" label="设备名称">
          <el-select v-model="data.form.deviceId" multiple filterable clearable placeholder="请选择设备" @change="selectDev">
            <el-option
              v-for="item in data.devOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.tabActive === '3'" label="设备属性">
          <el-select v-model="data.form.attrId" multiple filterable clearable :disabled="data.form.deviceId === ''" placeholder="请选择设备属性">
            <el-option
              v-for="item in data.devAttrOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList(data.tabActive)">
            查询
          </el-button>
          <el-button type="primary" plain @click="reset()">
            重置
          </el-button>
          <el-button type="primary" @click="exportXls()">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <CommonTable
      v-if="data.tabActive === '2'"
      :table-data="data.tableData" :max-height="500" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #duration="{ item }">
        <span>{{ item.row.duration }}</span>
      </template>
      <template #recoveryCnt="{ item }">
        <span>{{ item.row.recoveryCnt }}</span>
      </template>
      <template #results="{ item }">
        <el-tag v-if="item.row.results === '0'" type="success">
          成功
        </el-tag>
        <el-tag v-else type="danger">
          失败
        </el-tag>
      </template>
    </CommonTable>
    <CommonTable
      v-if="data.tabActive === '1'"
      :table-data="data.tableData" :max-height="500" :table-header="dutyTableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #duration="{ item }">
        <span>{{ item.row.duration }}</span>
      </template>
      <template #recoveryCnt="{ item }">
        <span>{{ item.row.recoveryCnt }}</span>
      </template>
      <template #operation="{ item }">
        <el-button type="warning" size="small" @click="showPersonList(item.row.shifts)">
          查看人员
        </el-button>
      </template>
    </CommonTable>

    <CommonTable
      v-if="data.tabActive === '3'"
      :table-data="data.tableData" :max-height="500" :table-header="sbTableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #duration="{ item }">
        <span>{{ item.row.duration }}</span>
      </template>
      <template #recoveryCnt="{ item }">
        <span>{{ item.row.recoveryCnt }}</span>
      </template>
      <template #executeResult="{ item }">
        <el-tag v-if="item.row.executeResult === 1" type="success">
          成功
        </el-tag>
        <el-tag v-else type="danger">
          失败
        </el-tag>
      </template>
    </CommonTable>

    <!-- 值班人员弹窗 -->
    <dutyPersonList v-if="dialogPersonList" :dialog-visible="dialogPersonList" :duty-person-list="data.dutyPersonList" @close-dialog="closeDutyPersonDialog" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

