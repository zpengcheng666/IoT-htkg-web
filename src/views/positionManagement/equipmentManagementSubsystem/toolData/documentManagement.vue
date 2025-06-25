<!--
 * @Description:资料管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:24:21
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addDocClassDialog from './components/addDocClassDialog.vue'
import addDocDialog from './components/addDocDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

interface Tree {
  id: string
  pid: string
  title: string
  childs?: Tree[]
}

const data = reactive({
  locationTreeData: [],
  treeData: [],
  infoData: {},
  tableData: [],
  isShow: false,
  addBtnDisabled: true,
  editBtnDisabled: true,
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogClassType: 'add',
  dialogType: 'add',
  dialogTitle: '新增',
  classInfo: {
    id: '',
    title: '',
  },
  classId: '',
  allDatumList: [], // 所有资料类别
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'code', // prop
    label: '编号',
  },
  {
    prop: 'name',
    label: '资料名称',
  },
  {
    prop: 'model_disp', // prop
    label: '资料类型',
  },
  {
    slot: 'operation',
    label: '操作',
    fixed: 'right',
    width: '240px',
  },
])

const dialogAddClass = ref(false) // 添加弹窗
const dialogAdd = ref(false) // 添加弹窗
// 获取树状列表
const getTree = () => {
  const param = {}
  api.get('/tool/datumClass/datumQueryTreeList', param).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 树的点击事件
const handleNodeClick = (treeNode: Tree) => {
  data.classInfo = treeNode
  data.classId = treeNode.id
  if (treeNode.pid != null && treeNode.pid !== '') {
    data.isShow = true
    data.editBtnDisabled = false
    getDatumList()
  }
  else {
    data.isShow = false
    data.editBtnDisabled = true
  }
  data.addBtnDisabled = false
}
const defaultProps = {
  children: 'children',
  label: 'title',
  id: 'id',
}
// 点击编辑类别
function clickEditClass() {
  data.classInfo = JSON.parse(JSON.stringify(data.classInfo))
  data.dialogClassType = 'edit'
  data.dialogTitle = '编辑资料类别'
  dialogAddClass.value = true
}

// 点击新增资料类别
function clickAddClass() {
  data.classInfo = {
    id: '',
    title: '',
  }
  data.dialogClassType = 'add'
  data.dialogTitle = '新增资料类别'
  dialogAddClass.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑资料'
  dialogAdd.value = true
}
// 点击新增
function clickAdd() {
  data.infoData = {
    model: data.classInfo.id,
    model_disp: data.classInfo.title,
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增资料'
  dialogAdd.value = true
}

// 关闭弹窗
function closeClassDialog() {
  dialogAddClass.value = false
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '详情'
  dialogAdd.value = true
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
      api.delete(`/tool/datum/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getDatumList()
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
// 删除类别
function delClass(id: string) {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择类别',
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
      api.delete(`tool/datumClass/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getTree()
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

// 提交新增资料类别
function addClassSubmit(val: any) {
  const postData = {
    id: val.id,
    name: val.title,
    pid: data.classId,
  }

  if (data.dialogClassType === 'add') {
    api.post('tool/datumClass/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddClass.value = false
        getTree()
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
  else if (data.dialogClassType === 'edit') {
    api.post('tool/datumClass/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddClass.value = false
        getTree()
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

// 提交新增资料
function addSubmit(val: any) {
  const postData = val
  postData.model = data.classId
  if (data.dialogType === 'add') {
    api.post('tool/datum/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getDatumList()
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
    api.post('tool/datum/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getDatumList()
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

// 获取当前资料
function getDatumList() {
  const postData = {
    params: {
      datumId: data.classId,
      name: data.form.name,
    },
  }
  api.get('/tool/datumClass/listById', postData).then((res: any) => {
    if (res.code === 200) {
      data.tableData = res.result
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
// 获取位置信息树状列表
const getLocationTree = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.locationTreeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    name: '',
    pageNo: 1,
    pageSize: 30,
  }
  getDatumList()
}
onMounted(() => {
  getTree()
  getLocationTree()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row class="el-row-wrap">
      <el-col :span="4">
        <div class="btn-group">
          <el-button v-auth="'fem:doc:addclass'" type="primary" size="small" :disabled="data.addBtnDisabled" @click="clickAddClass">
            新增类别
          </el-button>
          <el-button v-auth="'fem:doc:editclass'" type="primary" size="small" :disabled="data.editBtnDisabled" @click="clickEditClass()">
            编辑类别
          </el-button>
          <el-button v-auth="'fem:doc:delclass'" type="danger" size="small" :disabled="data.editBtnDisabled" @click="delClass(data.classId)">
            删除类别
          </el-button>
        </div>
        <el-tree
          :data="data.treeData" :props="defaultProps" :check-on-click-node="true" default-expand-all
          :highlight-current="true" node-key="id" @node-click="handleNodeClick"
        />
      </el-col>
      <el-col v-show="data.isShow" :span="20">
        <el-form :inline="true" :model="data.form" class="demo-form-inline" label-width="90px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="资料名称">
                <el-input v-model="data.form.name" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" small @click="getDatumList()">
                  查询
                </el-button>
                <el-button type="info" plain small @click="reset()">
                  重置
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="col-right">
              <el-button v-auth="'fem:doc:add'" type="warning" @click="clickAdd()">
                新增资料
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <CommonTable
          :table-data="data.tableData" max-height="400px" :table-header="tableHeader" :is-page="false"
          :is-select="false"
        >
          <template #operation="{ item }">
            <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">
              详情
            </el-button>
            <el-button v-auth="'fem:doc:edit'" type="primary" size="small" @click="clickEdit(item.row)">
              编辑
            </el-button>
            <el-button v-auth="'fem:doc:del'" type="danger" size="small" @click="del(item.row.id)">
              删除
            </el-button>
          </template>
        </CommonTable>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <addDocDialog v-if="dialogAdd" :location-tree-data="data.locationTreeData" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
    <addDocClassDialog v-if="dialogAddClass" :title="data.dialogTitle" :type="data.dialogClassType" :dialog-visible="dialogAddClass" :info-data="data.classInfo" @close-dialog="closeClassDialog" @submit-dialog="addClassSubmit" />
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  padding: 0;
}

.el-tree {
  background: none;
  margin-top: 20px;

  .is-current * {
    background: #fff;
  }
}

.el-row-wrap {
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
