<!--
 * @Description:点位关联
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-02 15:09:50
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Grid, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BatchRelation from './components/BatchRelation.vue'
import PointList from '@/views/modeSwitch/equipManage/components/pointList.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    sceneId: '',
    deviceTypeId:'',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  sceneOptions: [] as any,
  deviceTypeList:[] as any,
  varDialogTitle: '',
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
    prop: 'locationName', // prop
    label: '所在位置',
  },
  {
    prop: 'countStr', // prop
    label: '关联变量数',
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
const batchDialog = ref(false)
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
  api.get('/scada/conSheBei/listPoint', postData).then((res: any) => {
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

function editVar(val: any) {
  data.deviceId = val.id
  data.varDialogTitle = val.name
  varDialog.value = true
}
function batch(val: any) {
  data.deviceId = val.id
  data.varDialogTitle = val.name
  batchDialog.value = true
}
function closeVarDialog() {
  varDialog.value = false
  batchDialog.value = false
}
// 保存点位
function savePoint(val: any) {
  const postData = {
    attrList: val.deviceAttrRelationList,
    deviceId: data.deviceId,
  }
  api.post('/scada/conSheBei/saveDeviceAttrPointRelation', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      varDialog.value = false
      batchDialog.value = false
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

onMounted(() => {
  getDeviceTypeList()
  getSceneList()
  getList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col>
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
          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-tooltip
          effect="light"
          content="点位关联"
          placement="bottom"
        >
          <el-button v-auth="'config:point:edit'" type="primary" :icon="Share" :dark="true" @click="editVar(item.row)" />
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="批量关联"
          placement="bottom"
        >
          <el-button v-auth="'config:point:edit'" type="primary" :icon="Grid" :dark="true" @click="batch(item.row)" />
        </el-tooltip>
      </template>
    </CommonTable>
    <PointList
      v-if="varDialog"
      :dialog-visible="varDialog"
      :title="data.varDialogTitle"
      :device-id="data.deviceId"
      @close-dialog="closeVarDialog"
      @submit-dialog="savePoint"
    />
    <el-dialog
      v-model="batchDialog"
      :title="`批量关联-${data.varDialogTitle}`"
      width="1000px"
      top="2vh"
      destroy-on-close
    >
      <BatchRelation
        :device-id="data.deviceId"
        @close-dialog="closeVarDialog"
        @submit-dialog="savePoint"
      />
    </el-dialog>
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
