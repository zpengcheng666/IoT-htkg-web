<!--
 * @Description:设备列表
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:11:12
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete,Edit,Plus} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import AddDevice from '@/views/modeSwitch/equipManage/components/addDevice.vue'
import importDialog from './components/importDialog.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  deviceTypeList: [] as any,
  form: {
    deviceTypeId: '',
    name: '',
    code: '',
    sceneId: '',
    pageNo: 1,
    pageSize: 30,
  },
  sceneOptions: [] as any,
  deviceId: '',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '设备名称',
  },
  {
    prop: 'type',
    label: '设备类型',
  },
  {
    prop: 'code', // prop
    label: '编号',
  },
  {
    prop: 'locationId', // prop
    label: '所在位置',
  },
  {
    slot: 'scene', // prop
    prop: 'scene', // prop
    label: '场景',
  },
  {
    slot: 'subsystem', // prop
    prop: 'subsystem', // prop
    label: '子系统',
  },
  {
    prop: 'otherName', // prop
    label: '设备别名',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
const varDialog = ref(false)
const dialogImport = ref(false)// 导入弹窗
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
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/scada/conSheBei/deviceList', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取场景下拉
function getSceneList() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/api/scada/list', postData).then((res: any) => {
    data.sceneOptions = res.result.records
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
  api.get('/scada/deviceTypeManagement/list', postData).then((res: any) => {
    data.deviceTypeList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
function clickAdd() {
  data.deviceId = ''
  varDialog.value = true
}
function edit(row: any) {
  data.deviceId = row.id
  varDialog.value = true
}
function del(row: any) {
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
      api.delete(`scada/conSheBei/delete?id=${row.id}`).then((res: any) => {
        if (res.code === 200) {
          data.form.pageNo = 1
          data.form.pageSize = 10
          getList()
          ElMessage({
            type: 'success',
            message: res.message,
          })
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
function closeDialog(val: any) {
  data.deviceId = ''
  varDialog.value = false
}
// 关闭导入弹窗
function closeImportDialog() {
  dialogImport.value = false
}
// 打开导入弹窗
function openImportDialog() {
  dialogImport.value = true
}
// 导入提交
function importSubmint(val: any) {
  // console.log(val)
  const postData = val
  api.post('/scada/conSheBei/importExcel', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogImport.value = false
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
function submitDialog(val: any, isEdit: boolean) {
  if (isEdit) {
    api.put('/scada/conSheBei/edit', val).then((res: any) => {
      data.deviceId = ''
      ElMessage({
        type: 'success',
        message: res.message,
      })
      varDialog.value = false
      getList()
    }).catch((error) => {
      window.console.log(error)
    })
  }
  else {
    api.post('/scada/conSheBei/add', val).then((res: any) => {
      data.deviceId = ''
      ElMessage({
        type: 'success',
        message: res.message,
      })
      varDialog.value = false
      getList()
    }).catch((error) => {
      window.console.log(error)
    })
  }
}
onMounted(() => {
  getSceneList()
  getList()
  getDeviceTypeList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="场景：">
            <el-select v-model="data.form.sceneId" filterable clearable placeholder="请选择场景" @change="getList">
              <el-option v-for="(v, i) in data.sceneOptions" :key="i" :label="v.name" :value="v.id" />
            </el-select>
            <div class="form-ms">
              可选择或输入场景名称进行筛选
            </div>
          </el-form-item>
          <el-form-item label="设备类型：">
            <el-select v-model="data.form.deviceTypeId" filterable clearable placeholder="请选择设备类型" @change="getList">
              <el-option v-for="v in data.deviceTypeList" :key="v.id" :label="v.name" :value="v.id" />
            </el-select>
            <div class="form-ms">
              可选择或输入设备类型名称进行筛选
            </div>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="data.form.name" placeholder="输入搜索设备名称" clearable />
          </el-form-item>
          <el-form-item label="编号：">
            <el-input v-model="data.form.code" placeholder="输入搜索设备编码" clearable />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button v-auth="'ips:sate:import'" type="primary" @click="openImportDialog()">
            导入
        </el-button>
        <el-button v-auth="'config:device:add'" type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize" :current="data.form.pageNo"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #scene="{ item }">
        <el-tag v-for="v in item.row.sceneList" :key="v" type="success">
          {{ v }}
        </el-tag>
      </template>
      <template #subsystem="{ item }">
        <el-tag v-for="v in item.row.subsystemList" :key="v" type="success">
          {{ v }}
        </el-tag>
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'config:device:edit'" type="primary" :icon="Edit" :dark="true" @click="edit(item.row)" />
        <el-button v-auth="'config:device:del'" type="danger" :icon="Delete" :dark="true" @click="del(item.row)" />
      </template>
    </CommonTable>
    <AddDevice
      v-if="varDialog"
      :id="data.deviceId"
      :dialog-visible="varDialog"
      :device-type-list=" data.deviceTypeList"
      @close-dialog="closeDialog"
      @submit-dialog="submitDialog"
    />
      <!-- 导入弹窗 -->
      <importDialog v-if="dialogImport" :dialog-visible="dialogImport" @close-dialog="closeImportDialog" @submit-dialog="importSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.el-form-item__content {
  position: relative;

  .form-ms {
    position: absolute;
    top: 90%;
    color: #999;
  }
}
</style>
