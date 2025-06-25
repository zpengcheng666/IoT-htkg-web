<!--
 * @Description:报警策略
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:56:25
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addAlarm from './components/addAlarm.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
import selectLabel from '@/utils/select'
const data = reactive({
  tableData: [],
  form: {
    name: '',
    levelId: '',
    deviceId: '',
    pageNo: 1,
    pageSize: 30,
  },
  alarmLive: [] as any[],
  deviceOptions: [] as any,
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '策略名称',
    slot: 'name',
    align: 'left',
  },
  {
    prop: 'deviceId',
    label: '所属设备',
    slot: 'deviceId',
  },
  {
    prop: 'type', // prop
    label: '报警策略类型',
    slot: 'type',
  },
  {
    prop: 'levelId', // prop
    label: '报警级别',
    slot: 'levelId',
  },
  {
    prop: 'isEnable', // prop
    label: '是否启用',
    slot: 'isEnable',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false)
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
const idNameFun = {
  getKeyFun: (item: any) => item.id,
  getValueFun: (item: any) => item.name,
}
// 获取设备列表
function getDeviceList() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/scada/conSheBei/list', postData).then((res: any) => {
    data.deviceOptions = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/alarm/alarmStrategy/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    name: '',
    levelId: '',
    deviceId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
// 报警级别赋值
function getCardType(val: any) {
  data.form.levelId = val
  getList()
}
// 设置启用
function setEnable(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    enable: val.isEnable,
  }
  api.put('/alarm/alarmStrategy/enable', postData).then((res: any) => {
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
}
// 打开新增弹窗
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/alarm/alarmStrategy/add', postData).then((res: any) => {
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
    api.post('/alarm/alarmStrategy/edit', postData).then((res: any) => {
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
      api.delete(`/alarm/alarmStrategy/delete?id=${id}`).then((res: any) => {
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
function listAlarmLive() {
  const postData = {
    params: { type: 'alarm-level-list' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.alarmLive = res.result as any[]
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  getDeviceList()
  listAlarmLive()
  setTimeout(() => {
    getList()
  }, 100)
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="22">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="策略名称：">
            <el-input v-model="data.form.name" placeholder="" />
          </el-form-item>
          <el-form-item label="所属设备：">
            <el-select v-model="data.form.deviceId" filterable clearable placeholder="请选择设备" @change="getList">
              <el-option v-for="(v, i) in data.deviceOptions" :key="i" :label="v.name" :value="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="报警级别：">
            <CommonSelect post-param="alarm-level-list" :select-value="data.form.levelId" class="formInput" @select-change="getCardType" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>

            <el-button @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" class="col-right">
        <el-button v-auth="'config:alarm:add'" type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #name="{ item }">
        <el-tag v-if="item.row.strategyId && item.row.strategyId.length > 0" type="success">
          默认
        </el-tag>
        <el-tag v-else type="success">
          自定义
        </el-tag>
        {{ item.row.name }}
      </template>
      <template #deviceId="{ item }">
        {{ selectLabel(item.row.deviceId, data.deviceOptions, idNameFun) }}
      </template>
      <template #type="{ item }">
        {{ selectLabel(item.row.type, alarmStrategyType) }}
      </template>
      <template #levelId="{ item }">
        {{ selectLabel(item.row.levelId, data.alarmLive, idNameFun) }}
      </template>
      <template #isEnable="{ item }">
        <el-switch v-model="item.row.isEnable" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" @click="setEnable(item.row)" />
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'config:alarm:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button v-auth="'config:alarm:del'" type="danger" :icon="Delete" :dark="true" @click="del(item.row.id)" />
      </template>
    </CommonTable>
    <addAlarm v-if="dialogAdd" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" :device-list="data.deviceOptions" :alarm-strategy-type="alarmStrategyType" list-attr-url="scada/conSheBei/listDeviceAttrByDeviceId?id" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
