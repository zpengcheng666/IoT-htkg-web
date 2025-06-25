<script lang="ts" setup>
import type { ElTable, UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import AddStatistics from './components/addStatistics.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
// import { reactive } from 'vue'
import api from '@/api'

const form = reactive({
  deviceType: '',
  deviceAttribute: '',
})
const data = reactive({
  tableData: [],
  form: {
    devClass: '',
    devAttrId: '',
    pageNo: 1,
    pageSize: 30,
  },

  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  multipleSelection: [],
  devTypeOptions: [{ // 设备类型下拉数据
    id: '',
    name: '',
  }],
  devAttrOptions: [{ // 设备属性下拉数据
    id: '',
    name: '',
  }],
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'attrName',
    label: '设备属性',
  },
  {
    prop: 'sectionDisplay',
    slot: 'sectionDisplay',
    label: '区间值',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])
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
const dialogAdd = ref(false)
const total = ref(0) // 总条数

// 获取用户列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/statisticsSection/list', postData).then((res: any) => {
    data.tableData = res.result
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    devClass: '',
    devAttrId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 提交新增或编辑
function addSubmit(val: any) {
  const postData = val

  if (data.dialogType === 'add') {
    api.post('/system/statisticsSection/add', postData).then((res: any) => {
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
    api.post('/system/statisticsSection/edit', postData).then((res: any) => {
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
// 删除操作
function del(ids: any) {
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
      api.delete(`system/statisticsSection/deleteBatch?ids=${ids}`).then((res: any) => {
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
// 获取设备类型下拉
function getDeviceTypeOptions() {
  api.get('scada/deviceTypeManagement/conSheBeiOptiongs').then((res: any) => {
    data.devTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备属性下拉
function getDeviceAttrOptions() {
  data.form.devAttrId = ''
  const postData = {
    params: {
      devClassId: data.form.devClass,
    },
  }
  api.get('scada/deviceTypeAttribyte/devClassIdByAttrFilter', postData).then((res: any) => {
    data.devAttrOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

onMounted(() => {
  getList()
  getDeviceTypeOptions()
  getDeviceAttrOptions()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="设备类型：">
            <el-select v-model="data.form.devClass" filterable clearable placeholder="请选择设备类型" @change="getDeviceAttrOptions">
              <el-option
                v-for="item in data.devTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="设备属性：">
            <el-select v-model="data.form.devAttrId" filterable clearable :disabled="data.form.devClass === ''" placeholder="请选择设备属性">
              <el-option
                v-for="item in data.devAttrOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList()">
              搜索
            </el-button>

            <el-button @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="col-right">
        <el-button v-auth="'system:statistics:add'" type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>

    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      :is-page="false"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'system:statistics:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:statistics:del'" type="danger" size="small" @click="del(item.row.idList)">
          删除
        </el-button>
      </template>

      <template #sectionDisplay="{ item }">
        <el-tag v-for="(v, i) in item.row.intervalValueList" :key="i" class="tag" type="info">
          {{ v }}
        </el-tag>
      </template>
    </CommonTable>
    <AddStatistics v-if="dialogAdd" :dev-type-options="data.devTypeOptions" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}

.tag {
  margin-right: 10px;
}
</style>
