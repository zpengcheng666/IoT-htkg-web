<!--
 * @Description:保养要求
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:09:16
-->

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addItemClass from './components/addItemClass.vue'
import addMaintenanceRequirements from './components/addMaintenanceRequirements.vue'
import CommonTable from '@/components/ConmonTable/index.vue'

import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    itemClass: '',
    deviceClassId: '',
    pageNo: 1,
    pageSize: 30,
  },
  isShow: false,
  treeData: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增流程项',
  tabList: [] as any,
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'index1',
    label: '序号',
  },
  {
    prop: 'name',
    label: '作业流程',
  },
  {
    prop: 'thchRequire',
    label: '技术要求',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogAddItemClass = ref(false) // 添加弹窗
const dialogAdd = ref(false) // 添加弹窗
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

// 关闭弹窗
function closeDialog() {
  dialogAddItemClass.value = false
}
function closeDialog2() {
  dialogAdd.value = false
}
interface Tree {
  id: string
  pid: string
  title: string
  childs?: Tree[]
}

const defaultProps = {
  children: 'children',
  label: 'title',
  id: 'id',
}

// 提交新增保养类别
function addItemClassSubmit(val: any) {
// 提交新增
  const postData = val
  api.post('system/baseDictData/addDictData', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogAddItemClass.value = false
      getTabsList()
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
// 点击新增保养类别
function clickAddItemClass() {
  dialogAddItemClass.value = true
}
// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增流程项'
  dialogAdd.value = true
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑流程项'
  dialogAdd.value = true
}

function addSubmit(val: any) {
  const postData = val
  postData.itemClass = data.form.itemClass
  postData.deviceClassId = data.form.deviceClassId
  if (data.dialogType === 'add') {
    api.post('/maintain/maintainOperate/add', postData).then((res: any) => {
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
    api.post('/maintain/maintainOperate/edit', postData).then((res: any) => {
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
function clickTab() {
  getList()
}
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/maintain/maintainOperate/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取树状列表
const getTree = () => {
  const param = {}
  api.get('facility/deviceType/queryTreeList', param).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 树的点击事件
const handleNodeClick = (treeNode: Tree) => {
  data.form.deviceClassId = treeNode.id
  data.isShow = true
  getList()
}

// 获取tab数据
function getTabsList() {
  const postData = {
    params: { type: 'maintain-item-class' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.tabList = res.result
    data.form.itemClass = res.result[0].id
  }).catch((error) => {
    window.console.log(error)
  })
}
// 删除保养类别
function removeTab(id: any) {
  ElMessageBox.confirm(
    '此操作将删除该保养类别，是否删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.delete(`/system/baseDictData/deleteDictData?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getTabsList()
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
// 删除
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
      api.delete(`/maintain/maintainOperate/delete?id=${id}`).then((res: any) => {
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
  getTree()
  getTabsList()
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
      api.get('/maintain/maintainOperate/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '保养要求.xls'
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
  <page-main class="pageBox">
    <el-row class="el-row-wrap">
      <el-col :span="4">
        <el-tree
          :data="data.treeData" :props="defaultProps" :check-on-click-node="true" default-expand-all
          :highlight-current="true" node-key="id" @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20">
        <el-tabs v-model="data.form.itemClass" class="demo-tabs" closable @tab-change="clickTab" @tab-remove="removeTab">
          <el-tab-pane
            v-for="(v, i) in data.tabList" :key="i" :label="v.name" :name="v.id"
          />
        </el-tabs>
        <el-form v-show="data.isShow" :inline="true" :model="data.form" label-width="100px" class="col-right">
          <el-button v-auth="'fem:mrmClass:add'" type="warning" @click="clickAddItemClass">
            新增保养类别
          </el-button>
          <el-button v-auth="'fem:mrmProcess:add'" type="warning" @click="clickAdd()">
            新增流程项
          </el-button>
          <el-button v-auth="'fem:mrmProcess:export'" type="primary" @click="exportXls()">
            导出
          </el-button>
        </el-form>
        <CommonTable
          v-show="data.isShow"
          :table-data="data.tableData" :max-height="400" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
          :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        >
          <template #operation="{ item }">
            <el-button v-auth="'fem:mrmProcess:edit'" type="primary" size="small" @click="clickEdit(item.row)">
              编辑
            </el-button>
            <el-button v-auth="'fem:mrmProcess:del'" type="danger" size="small" @click="del(item.row.id)">
              删除
            </el-button>
          </template>
        </CommonTable>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <addItemClass v-if="dialogAddItemClass" :dialog-visible="dialogAddItemClass" @close-dialog="closeDialog" @submit-dialog="addItemClassSubmit" />
    <addMaintenanceRequirements v-if="dialogAdd" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog2" @submit-dialog="addSubmit" />
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

.el-tree {
  background: none;

  .is-current * {
    background: #fff;
  }
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
  width: calc(100% / 3 - 40px);
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

