<!--
 * @Description:储存策略
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:32:02
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddStorage from './components/addStorage.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
import selectLabel from '@/utils/select'
const data = reactive({
  tableData: [],
  form: {
    name: '',
    deviceId: '',
    pageNo: 1,
    pageSize: 30,
  },
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
    label: '存储策略类型',
    slot: 'type',
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
  api.get('/store/storeStrategy/list', postData).then((res: any) => {
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
    deviceId: '',
    pageNo: 1,
    pageSize: 30,
  }
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
  api.put('/store/storeStrategy/enable', postData).then((res: any) => {
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
    api.post('/store/storeStrategy/add', postData).then((res: any) => {
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
    api.post('/store/storeStrategy/edit', postData).then((res: any) => {
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
      api.delete(`/store/storeStrategy/delete?id=${id}`).then((res: any) => {
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
const caseDevice = {
  getKeyFun: (d: any) => d.id,
  getValueFun: (d: any) => d.name,
}
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
onMounted(() => {
  getList()
  getDeviceList()
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
        <el-button v-auth="'config:storage:add'" type="warning" :icon="Plus" @click="clickAdd">
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
        {{ selectLabel(item.row.deviceId, data.deviceOptions, caseDevice) }}
      </template>
      <template #type="{ item }">
        {{ selectLabel(item.row.type, caseType) }}
      </template>
      <template #isEnable="{ item }">
        <el-switch v-model="item.row.isEnable" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" @click="setEnable(item.row)" />
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'config:storage:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button v-auth="'config:storage:del'" type="danger" :icon="Delete" :dark="true" @click="del(item.row.id)" />
      </template>
    </CommonTable>
    <AddStorage v-if="dialogAdd" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" :device-list="data.deviceOptions" :case-type="caseType" list-attr-url="scada/conSheBei/listDeviceAttrByDeviceId?id" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
