<!--
 * @Description:报警列表
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-06-23 13:38:20
-->
<script lang="ts" setup>
import { Check, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import AlarmConfirm from './alarmConfirm.vue'
import StartPlan from './startPlan.vue'
import selectLabel from '@/utils/select'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const router = useRouter()
const data = reactive({
  tableData: [],
  alarmLiveList: [] as any[],
  form: {
    status: '',
    alarmLevel: '',
    pageNo: 1,
    pageSize: 30,
  },
  selectIds: [] as any,
  startPlanData: {} as any,
  confirmData: {} as any,
  confirmType: 'confirm',
})
const caseAlarmLeve = {
  getKeyFun: (d: any) => d.id,
  getValueFun: (d: any) => d.name,
}

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    // prop: 'deviceName',
    prop: 'otherName',
    label: '设备名称',
  },
  {
    prop: 'originVarName',
    label: '设备属性',
  },
  {
    prop: 'recordValue',
    label: '当前值',
  },
  {
    prop: 'range',
    label: '标定值',
  },
  {
    prop: 'alarmLevel',
    label: '报警级别',
    slot: 'alarmLevel',
  },
  {
    prop: 'status',
    label: '当前状态',
    slot: 'status',
  },
  {
    prop: 'recordTime',
    label: '开始时间',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogStartPlan = ref(false) // 添加弹窗
const dialogConfirm = ref(false)// 报警确认弹窗
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
// 获取多选
const selectionChange = (val: any) => {
  data.selectIds = val
}

// 列表点击
const rowClick = (val: any) => {
  // data.selectIds = val
  console.log(val);
  router.push({
    name: 'stage' + val.sceneId,
  })
}



// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('alarm/alarmData/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}


function listAlarmLive() {
  const postData = {
    params: { type: 'alarm-level-list' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.alarmLiveList = res.result as any[]
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击启动预案
function clickStartPlan(val: any) {
  data.startPlanData.alarmId = val.id
  data.startPlanData.termianlIds = []
  data.startPlanData.contingencyId = ''
  data.startPlanData.sponsor = ''
  dialogStartPlan.value = true
}

function closeStartPlanDialog() {
  dialogStartPlan.value = false
}
// 提交启动预案
function startPlanSubmit(val: any) {
  const postData = val
  postData.termianlIds = postData.termianlIds.toString()
  api.post('/system/contingencyRecord/add', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogStartPlan.value = false
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

// 点击报警确认
function clickConfirm(val: any) {
  data.confirmData = {}
  data.confirmData.id = val.id
  data.confirmData.strategyId = val.strategyId
  dialogConfirm.value = true
  data.confirmType = 'confirm'
}

// 点击批量确认
function batchConfirm() {
  data.confirmData = {}
  const selectArr = []
  const selectStrategyIds = []
  for (const i in data.selectIds) {
    selectArr.push(data.selectIds[i].id)
    selectStrategyIds.push(data.selectIds[i].strategyId)
  }
  data.confirmData.ids = selectArr
  data.confirmData.strategyIds = selectStrategyIds
  dialogConfirm.value = true
  data.confirmType = 'batch'
}

// 关闭报警确认
function closeConfirm() {
  dialogConfirm.value = false
}

// 报警确认提交
function confirmSubmit(val: any) {
  const postData = val
  if (data.confirmType === 'confirm') {
    api.put('/alarm/alarmData/ack', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogConfirm.value = false
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
  else if (data.confirmType === 'batch') {
    api.put('/alarm/alarmData/batchAck', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogConfirm.value = false
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
defineExpose({
  getList,
})
onMounted(() => {
  listAlarmLive()
  getList()
})
</script>

<template>
  <div id="pageBox" class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="当前状态：">
            <el-select v-model="data.form.status" filterable clearable @change="getList()">
              <el-option label="解除报警" value="解除报警" />
              <el-option label="报警中" value="报警中" />
            </el-select>
          </el-form-item>
          <el-form-item label="报警级别：">
            <el-select v-model="data.form.alarmLevel" filterable clearable @change="getList()">
              <el-option v-for="leve in data.alarmLiveList" :key="leve.id" :label="leve.name" :value="leve.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button type="primary" :disabled="data.selectIds.length === 0" @click="batchConfirm()">
            批量确认
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTable :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      max-height="225px" :is-select="true" @size-change="sizeChange" @current-change="currentChange" :is-highlight="true"
      @selection-change="selectionChange" @row-click="rowClick">
      <template #status="{ item }">
        <el-tag v-if="item.row.status === '解除报警'" type="success">
          {{ item.row.status }}
        </el-tag>
        <el-tag v-if="item.row.status === '报警中'" type="danger">
          {{ item.row.status }}
        </el-tag>

      </template>
      <template #alarmLevel="{ item }">
        {{ selectLabel(item.row.alarmLevel, data.alarmLiveList, caseAlarmLeve) }}
      </template>
      <template #operation="{ item }">

        <el-tooltip effect="light" content="报警确认" placement="bottom">
          <el-button type="primary" size="small" :icon="Check" :dark="true" @click="clickConfirm(item.row)" />
        </el-tooltip>

        <el-tooltip v-if="item.row.status === '报警中'" effect="light" content="启动预案" placement="bottom">
          <el-button type="primary" size="small" :icon="VideoPlay" :dark="true" @click="clickStartPlan(item.row)" />
        </el-tooltip>

      </template>
    </CommonTable>
    <StartPlan v-if="dialogStartPlan" :dialog-visible="dialogStartPlan" :info-data="data.startPlanData"
      @close-dialog="closeStartPlanDialog" @submit-dialog="startPlanSubmit" />
    <AlarmConfirm v-if="dialogConfirm" :dialog-visible="dialogConfirm" :info-data="data.confirmData"
      @close-dialog="closeConfirm" @submit-dialog="confirmSubmit" />
  </div>
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
