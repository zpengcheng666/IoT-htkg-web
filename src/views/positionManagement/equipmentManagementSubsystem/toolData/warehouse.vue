<!--
 * @Description:仓库管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-26 13:44:24
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addWarehouse from './components/addWarehouse.vue'
import addAreaDialog from './components/addAreaDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tagList: [{
    id:'',
    name:''
  }],
  tagInfo: {
    id:'',
    name: '',
    num: '',
    remark: '',
  },
  areaInfo:{},
  tableData: [],
  form: {
    warehouseId: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogType: 'add',
  dialogTitle: '新增',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'num',
    label: '编号',
  },
  {
    prop: 'name',
    label: '名称',
  },
  {
    prop: 'remark', // prop
    label: '备注',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '230px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogAddArea = ref(false) // 添加弹窗

// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getAreaList(data.tagInfo)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getAreaList(data.tagInfo)
}

// 获取仓库列表
function getWareHouseList() {
  api.get('spare/wareHouse/list').then((res: any) => {
    data.tagList = res.result.records
    if (res.result.records.length>0) {
      data.tagInfo.id = res.result.records[0].id
      getAreaList(res.result.records[0])
    }
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取库区
function getAreaList(val: any) {
  data.tagInfo = val
  data.form.warehouseId = val.id
  const postData = {
    params: data.form,
  }
  api.get('spare/area/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form.name = ''
  getAreaList(data.tagInfo)
}

// 新增库区
function clickAddArea() {
  data.areaInfo = {
    id:'',
    name: '',
    num: '',
    remark: '',
    warehouseId:data.tagInfo.id
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增库区'
  dialogAddArea.value = true
}

// 编辑库区
function clickEditArea(row: any) {
  data.areaInfo = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑库区'
  dialogAddArea.value = true
}
// 点击编辑
function clickEdit(row: any) {
  if (!data.tagInfo.id) {
    ElMessage({
      type: 'error',
      message: '请选择',
    })
    return false
  }
  data.dialogType = 'edit'
  data.dialogTitle = '编辑仓库'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.tagInfo = {
    id:'',
    name: '',
    num: '',
    remark: '',
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增仓库'
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 关闭库区弹窗
function closeAreaDialog() {
  dialogAddArea.value = false
}

// 删除仓库
function delEag(id: string) {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择',
    })
    return false
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
      api.delete(`spare/wareHouse/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getWareHouseList()
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

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('spare/wareHouse/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getWareHouseList()
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
    api.post('spare/wareHouse/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getWareHouseList()
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

// 提交新增库区
function addAreaSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('spare/area/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddArea.value = false
        getAreaList(data.tagInfo)
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
    api.post('spare/area/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddArea.value = false
        getAreaList(data.tagInfo)
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

// 删除库区
function delArea(id: string) {
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
      api.delete(`spare/area/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getAreaList(data.tagInfo)
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
  getWareHouseList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row class="el-row-wrap">
      <el-col :span="4">
        <div class="btn-group">
          <el-button v-auth="'config:service:add'" type="primary" size="small" @click="clickAdd">
            新增
          </el-button>
          <el-button v-auth="'config:service:edit'" type="primary" :disabled="data.tagList.length === 0" size="small" @click="clickEdit">
            编辑
          </el-button>
          <el-button v-auth="'config:service:del'" type="danger" :disabled="data.tagList.length === 0" size="small" @click="delEag(data.tagInfo.id)">
            删除
          </el-button>
        </div>
        <div class="btn-tag-group">
          <el-check-tag v-for="(v, i) in data.tagList" :key="i" class="btn-tag" :checked="data.tagInfo.id === v.id ? true : false " @change="getAreaList(v)">
            {{ v.name }}
          </el-check-tag>
        </div>
      </el-col>
      <el-col :span="20">
        <el-form :inline="true" :model="data.tagInfo" class="demo-form-inline" label-width="90px">
          <el-form-item label="名称">
            <span>{{data.tagInfo.name  }}</span>
          </el-form-item>
          <el-form-item label="编号">
            <span>{{data.tagInfo.num  }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{data.tagInfo.remark  }}</span>
          </el-form-item>
        </el-form>

        <el-row class="row-border">
          <el-col :span="10">
            库区名称
            <el-input v-model="data.form.name" style="width: 200px;margin-right: 10px;" placeholder="请输入库区名称" />
            <el-button type="primary" :disabled=" data.form.warehouseId === ''" @click="getAreaList(data.tagInfo)">
              查询
            </el-button>
            <el-button type="info" plain :disabled=" data.form.warehouseId === ''" @click="reset()">
              重置
            </el-button>
          </el-col>
          <el-col :span="4" :offset="10" class="col-right">
            <el-button v-auth="'config:service:sync'" type="primary" @click="clickAddArea()">
              新增库区
            </el-button>

          </el-col>
        </el-row>

        <CommonTable
          :table-data="data.tableData" max-height="400px" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
          :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        >
        <template #operate="{ item }">
          <el-button v-auth="'fem:tool:edit'" type="primary" size="small" :dark="true" @click="clickEditArea(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'fem:tool:del'" type="danger" size="small" @click="delArea(item.row.id)">
            删除
          </el-button>
        </template>
        </CommonTable>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <addWarehouse v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.tagInfo" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
    <!-- 新增库区弹窗 -->
    <addAreaDialog v-if="dialogAddArea" :ware-house-name='data.tagInfo.name' :dialog-visible="dialogAddArea" :type="data.dialogType" :info-data="data.areaInfo" @close-dialog="closeAreaDialog" @submint-dialog="addAreaSubmint"></addAreaDialog>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  padding: 0;
}

.el-row {
  height: calc(100vh - 294px);

  .el-row .el-row {
    height: auto;
  }
}

.el-row .el-col {
  height: 100%;
}

.el-row-wrap > .el-col:first-child {
  background: #e3e5e3;
}

.el-row > .el-col:last-child {
  padding: 0 10px;
}

.btn-group {
  display: flex;
  justify-content: center;
  padding-top: 10px;

  .btn-group button {
    padding: 5px 8px;
  }
}

.btn-tag-group {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 10px;

  .btn-tag {
    cursor: pointer;
    margin-left: 15px;
    margin-top: 10px;
  }
}

.el-form {
  padding: 10px;
}

.el-form--inline .el-form-item {
  width: calc(100%/3 - 40px);
}

.row-border {
  border: 1px solid #ebeef5;
  border-bottom: none;
  padding: 0.5rem;
  height: auto;
}

:deep(.table) {
  margin-top: 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
