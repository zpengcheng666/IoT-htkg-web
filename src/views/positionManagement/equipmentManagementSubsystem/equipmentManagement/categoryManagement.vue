<!--
 * @Description:类别管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-12 09:25:43
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addClass from './components/addClass.vue'
import attrDictionaryDialog from './components/attrDictionaryDialog.vue'
import { addAttr,
  addAttrAndClass,
  editAttr,
  getAttrList,
  getTree,
} from './components/api/categoryManagement-api'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
interface Tree {
  id: string
  pid: string
  title: string
  childs?: Tree[]
}

const data = reactive({
  treeData: [],
  ruleForm: {
    id: '',
    title: '',
  },
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogClassType: 'add',
  classInfo: {
    id: '',
    title: '',
  },
  classId: '',
  currentNodeKey: '',
  multipleSelection: [],
  infoData: { attrType: 'TEXT', classId: '' },
  dialogType: 'add',
  dialogTitle: '选择属性',
  addBtnDisabled: true,
  editBtnDisabled: true,
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '属性名称',
  },
  {
    prop: 'attrType',
    label: '属性类型',
  },
  {
    prop: 'unit',
    label: '属性单位',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '160px',
  },
])

const total = ref(0) // 总条数
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getAttrList(data.classId, (res: any) => {
    data.tableData = res
  })
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getAttrList(data.classId, (res: any) => {
    data.tableData = res
  })
}
const dialogAdd = ref(false) // 添加弹窗
const dialogAddClass = ref(false) // 添加弹窗
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 多选事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}

// 树的点击事件
const handleNodeClick = (treeNode: Tree) => {
  data.ruleForm = {
    id: '',
    title: treeNode.title,
  }
  data.classInfo = treeNode
  data.classId = treeNode.id
  if (treeNode.pid) {
    data.editBtnDisabled = false
  }
  else {
    data.editBtnDisabled = true
  }
  data.addBtnDisabled = false
  getAttrList(data.classId, (res: any) => {
    data.tableData = res
  })
}
// 添加扩展属性
function chooseAttrClick() {
  if (!data.classId) {
    ElMessage({
      type: 'error',
      message: '请选择类别',
    })
    return false
  }
  data.infoData = { attrType: 'TEXT', classId: data.classId }
  data.dialogType = 'add'
  data.dialogTitle = '扩展设备属性'
  dialogAdd.value = true
}

// 删除当前节点
const deleteNodeClick = () => {
  ElMessageBox.confirm(
    '删除当前类别吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.delete(`facility/deviceType/delete?id=${data.classId}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getTree((d: any) => {
            data.treeData = d
          })
          getAttrList(data.classId, (res: any) => {
            data.tableData = res
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

const defaultProps = {
  children: 'children',
  label: 'title',
  id: 'id',
}

// 点击编辑设备类型
function clickEditClass() {
  data.classInfo = JSON.parse(JSON.stringify(data.classInfo))
  data.dialogClassType = 'edit'
  data.dialogTitle = '编辑类别'
  dialogAddClass.value = true
}

// 新增设备类型
function clickAddClass() {
  data.classInfo = {
    id: '',
    title: '',
  }
  data.dialogClassType = 'add'
  data.dialogTitle = '新增类别'
  dialogAddClass.value = true
}
// 关闭弹窗
function closeClassDialog() {
  dialogAddClass.value = false
}
// 提交新增类别
function addClassSubmit(val: any) {
  if (data.dialogClassType === 'add') {
    const postData = {
      name: val.title,
      pid: data.classId,
    }
    api.post('facility/deviceType/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddClass.value = false
        getTree((d: any) => {
          data.treeData = d
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
  }
  else if (data.dialogClassType === 'edit') {
    const postData = {
      id: val.id,
      name: val.title,
    }
    api.post('facility/deviceType/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAddClass.value = false
        getTree((d: any) => {
          data.treeData = d
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
  }
}

// 提交新增设备扩展属性
function addSubmit(val: any) {
  const postData = {
    deviceId: val.classId,
    name: val.name,
    attrType: val.attrType,
    unit: val.unit,
    id: '',
  }
  if (data.dialogType === 'add') {
    addAttr(postData, (res: any) => {
      getAttrList(data.classId, (res: any) => {
        data.tableData = res
      })
    })
  }
  else {
    postData.id = val.id
    editAttr(postData, (res: any) => {
      getAttrList(data.classId, (res: any) => {
        data.tableData = res
      })
    })
  }
  dialogAdd.value = false
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑属性字典'
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
      api.delete(`/facility/deviceAttr/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getAttrList(data.classId, (res: any) => {
            data.tableData = res
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
}

onMounted(() => {
  getTree((d: any) => {
    data.treeData = d
  })
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="4">
        <div class="btn-group">
          <el-button v-auth="'fem:cate:add'" type="primary" size="small" :disabled="data.addBtnDisabled" @click="clickAddClass">
            新增类别
          </el-button>
          <el-button v-auth="'fem:cate:edit'" type="primary" size="small" :disabled="data.editBtnDisabled" @click="clickEditClass()">
            编辑类别
          </el-button>
          <el-button v-auth="'fem:cate:del'" type="danger" size="small" :disabled="data.editBtnDisabled" @click="deleteNodeClick()">
            删除类别
          </el-button>
        </div>
        <el-tree
          :data="data.treeData" :props="defaultProps" :check-on-click-node="true" :default-expand-all="true"
          :highlight-current="true" node-key="id" @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20" class="el-col-cont">
        <el-form :inline="true" label-width="140px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备类别属性列表" />
            </el-col>
            <el-col :span="16" class="col-right">
              <el-button :disabled="data.editBtnDisabled" type="primary" @click="chooseAttrClick">
                添加属性
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <CommonTable
          :table-data="data.tableData"
          :table-header="tableHeader"
          :total="total"
          :size="data.form.pageSize"
          :is-select="false"
          :is-page="false"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
        >
          <template #operation="{ item }">
            <el-button v-auth="'fem:attr:edit'" type="primary" size="small" @click="clickEdit(item.row)">
              编辑
            </el-button>
            <el-button v-auth="'fem:attr:del'" type="danger" size="small" @click="del(item.row.id)">
              删除
            </el-button>
          </template>
        </CommonTable>
        <!-- 添加设备扩展属性弹窗 -->
        <attrDictionaryDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
        <!-- 编辑设备类别弹窗 -->
        <addClass v-if="dialogAddClass" :title="data.dialogTitle" :type="data.dialogClassType" :dialog-visible="dialogAddClass" :info-data="data.classInfo" @close-dialog="closeClassDialog" @submit-dialog="addClassSubmit" />
      </el-col>
    </el-row>
  </page-main>
</template>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  justify-content: center;
  padding-top: 10px;

  .btn-group button {
    padding: 5px 8px;
  }
}

.page-main {
  padding: 0;
}

.el-row {
  height: calc(100vh - 294px);
}

.el-row .el-row {
  height: auto;
  padding-top: 16px;
}

.el-row .el-col {
  height: 100%;
}

.el-col-cont {
  padding: 0 16px;
}

.el-row .el-col:first-child {
  background: #e3e5e3;
}

.el-row .el-row .el-col {
  background: none;
  height: auto;
}

.el-tree {
  background: none;
  margin-top: 20px;

  .is-current * {
    background: #fff;
  }
}

.form-pa {
  padding: 1rem 400px 0 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

