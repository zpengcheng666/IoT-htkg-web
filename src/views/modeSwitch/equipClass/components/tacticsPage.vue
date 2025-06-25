<!--
 * @Description:策略tab页
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-05-19 09:20:23
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:50:17
-->
<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import selectLabel from '@/utils/select'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
import AddAlarm from '@/views/modeSwitch/strategyManage/components/addAlarm.vue'
import AddStorage from '@/views/modeSwitch/strategyManage/components/addStorage.vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
})
const data = reactive({
  alarmShow: false,
  storeShow: false,
  tableData: [],
  form: {
    name: '',
    typeId: '',

  },
  rangeStart: '',
  rangeEnd: '',
  infoData: {},
  dialogType: 'edit',
  addType: '', // 添加类型alarm报警store储存
  alarmInfo: {} as any,
  storeInfo: {} as any,
})

const tableHeader = reactive([
  {
    prop: 'strategy',
    label: '分类',
  },
  {
    prop: 'name',
    label: '名称',
  },
  {
    prop: 'typeName', // prop
    slot: 'typeName',
    label: '类型',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])
const alarmStrategyType = [
  {
    label: '特定值报警策略',
    value: 'specificValue',
  },
  {
    label: '区间报警策略',
    value: 'interval',
  },
  {
    label: '变化率报警策略',
    value: 'rateOfChange',
  },
]
const caseType = [
  {
    label: '定时存储策略',
    value: 'timing',
  },
  {
    label: '周期存储策略',
    value: 'cycle',
  },
]
const STRATEGY_ALARM = '报警策略'
const STRATEGY_STORE = '存储策略'
// 获取策略列表
function getList() {
  api.get(`/scada/deviceTypeManagement/listStrategy/${data.form.typeId}`).then((res: any) => {
    data.tableData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

function getTypename(row: any) {
  if (row.strategy === STRATEGY_ALARM) {
    return selectLabel(row.typeName, alarmStrategyType)
  }
  if (row.strategy === STRATEGY_STORE) {
    return selectLabel(row.typeName, caseType)
  }
}

// 点击新增存储策略
function clickAddStore() {
  data.storeInfo = {}
  data.storeInfo.typeId = props.infoData.id
  data.storeShow = true
}
// 点击新增报警策略
function clickAddAlarm() {
  data.alarmInfo = {}
  data.alarmInfo.typeId = props.infoData.id
  data.alarmShow = true
}
function initAlarmById(param: any) {
  api.get('/scada/deviceTypeAlarmStrategy/queryById', param).then((res: any) => {
    data.alarmInfo = res.result
    data.alarmShow = true
  }).catch((error) => {
    window.console.log(error)
  })
}
function initStoreById(param: any) {
  api.get('/scada/deviceTypeStoreStrategy/queryById', param).then((res: any) => {
    data.storeInfo = res.result
    data.storeShow = true
  }).catch((error) => {
    window.console.log(error)
  })
}
// 点击编辑
function clickEdit(val: any) {
  const postData = {
    params: {
      id: val.id,
    },
  }

  if (val.strategy === STRATEGY_ALARM) {
    initAlarmById(postData)
  }
  else if (val.strategy === STRATEGY_STORE) {
    initStoreById(postData)
  }
  getList()
}
function submitAddAlarmConfig(info: any) {
  let url: string
  if (info.id) {
    url = '/scada/deviceTypeAlarmStrategy/edit'
  }
  else {
    url = '/scada/deviceTypeAlarmStrategy/add'
  }
  api.post(url, info).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      data.alarmShow = false
      data.addType = ''
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
function submitAddStoreConfig(info: any) {
  let url: string
  if (info.id) {
    url = '/scada/deviceTypeStoreStrategy/edit'
  }
  else {
    url = '/scada/deviceTypeStoreStrategy/add'
  }
  api.post(url, info).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      data.storeShow = false
      data.addType = ''
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
// 删除存储策略
function del(val: any) {
  let url = ''
  if (val.strategy === STRATEGY_ALARM) {
    url = '/scada/deviceTypeAlarmStrategy/delete?id='
  }
  else if (val.strategy === STRATEGY_STORE) {
    url = '/scada/deviceTypeStoreStrategy/delete?id='
  }
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
      api.delete(`${url}${val.id}`).then((res: any) => {
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

onMounted(() => {
  data.form.typeId = props.infoData.id
  data.alarmInfo.typeId = props.infoData.id
  data.storeInfo.typeId = props.infoData.id
  getList()
})
</script>

<template>
  <el-row class="fullHeight">
    <el-col :span="12" class="fullHeight scrollHeight">
      <el-row>
        <el-col :span="22">
          <el-form :inline="true" :model="data.form" class="demo-form-inline">
            <el-form-item label="">
              <el-input v-model="data.form.name" placeholder="请输入名称搜索" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2" class="col-right">
          <el-button type="warning" :icon="Plus" @click="clickAddAlarm">
            新增报警策略
          </el-button>
          <el-button type="warning" :icon="Plus" @click="clickAddStore">
            新增储存策略
          </el-button>
        </el-col>
      </el-row>
      <CommonTable
        :table-data="data.tableData" :table-header="tableHeader" :is-select="false" :is-page="false"
      >
        <template #typeName="{ item }">
          {{ getTypename(item.row) }}
        </template>
        <template #operate="{ item }">
          <el-button type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
          <el-button type="danger" :icon="Delete" @click="del(item.row)" />
        </template>
      </CommonTable>
    </el-col>
  </el-row>
  <AddAlarm
    v-if="data.alarmShow "
    :dialog-visible="data.alarmShow"
    :info-data="data.alarmInfo"
    :alarm-strategy-type="alarmStrategyType"
    list-attr-url="scada/deviceTypeAttribyte/devClassIdBydevAttr?devClassId"
    is-config
    @close-dialog="data.alarmShow = false"
    @submit-dialog="submitAddAlarmConfig"
  />
  <AddStorage
    v-if="data.storeShow"
    :dialog-visible="data.storeShow"
    :info-data="data.storeInfo"
    list-attr-url="scada/deviceTypeAttribyte/devClassIdBydevAttr?devClassId"
    :case-type="caseType"
    is-config
    @close-dialog="data.storeShow = false"
    @submit-dialog="submitAddStoreConfig"
  />
</template>

<style lang="scss" scoped>
.el-form-item {
  width: calc(100% / 3 - 12px);
  margin-right: 12px;
}

.formInput {
  width: 100%;
}

.el-form-item.fullWidth {
  width: 100%;
  margin-right: 0;

  :deep(.el-form-item__label) {
    text-align: right;
    width: 120px;
  }
}
</style>
