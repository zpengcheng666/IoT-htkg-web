<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import addOrganization from './components/addOrganization.vue'
import api from '@/api'
interface Tree {
  id: string
  title: string
  childs?: Tree[]
}

const data = reactive({
  treeData: [],
  infoData: {} as any,
  currentNode: {
    id: '',
  },
  dialogType: 'add',
  dialogTitle: '新增组织机构',
})

const addDialog = ref(false)

// 获取用户列表
const getTree = () => {
  const param = {}
  api.get('system/baseOrgan/queryTreeList', param).then((res: any) => {
    data.treeData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 树的点击事件
const handleNodeClick = (treeNode: Tree) => {
  data.infoData.name = treeNode.title
  data.currentNode = treeNode
}

const clickAdd = () => {
  data.infoData = {}
  addDialog.value = true
  data.dialogType = 'add'
  data.dialogTitle = '新增组织机构'
}
const clickEdit = (row: any) => {
  data.infoData.name = row.title
  data.infoData.id = row.id
  data.dialogType = 'edit'
  addDialog.value = true
  data.dialogTitle = '编辑组织机构'
}

const closeDialog = () => {
  addDialog.value = false
}

// 添加节点
const submit = () => {
  if (data.dialogType === 'add') {
    const param = {
      pid: data.currentNode.id,
      name: data.infoData.name,
    }
    api.post('system/baseOrgan/add', param).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        addDialog.value = false
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
  else if (data.dialogType === 'edit') {
    const param = {
      id: data.currentNode.id,
      name: data.infoData.name,
    }
    api.post('system/baseOrgan/edit', param).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        addDialog.value = false

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

// 删除当前节点
const deleteNodeClick = () => {
  ElMessageBox.confirm(
    '删除当前组织架构吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.delete(`system/baseOrgan/delete?id=${data.currentNode.id}`).then((res: any) => {
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

const defaultProps = {
  children: 'childs',
  label: 'title',
  id: 'id',
}
const ruleFormRef = ref<FormInstance>()

// callback methods
onMounted(() => {
  getTree()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="4">
        <el-tree
          :data="data.treeData" :props="defaultProps" :check-on-click-node="true"
          :highlight-current="true" node-key="id" @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="20">
        <el-form ref="ruleFormRef" :model="data.infoData" class="form-pa">
          <el-form-item label="" label-width="50px">
            <el-button type="primary" size="small" @click="clickAdd">
              新增组织机构
            </el-button>
            <el-button type="primary" size="small" :disabled="data.currentNode.id === ''" @click="clickEdit(data.currentNode)">
              编辑
            </el-button>
            <el-button type="danger" size="small" :disabled="data.currentNode.id === ''" @click="deleteNodeClick">
              删除
            </el-button>
          </el-form-item>
          <el-form-item label="组织机构" label-width="120px">
            <span>{{ data.infoData.name }}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <addOrganization v-if="addDialog" :title="data.dialogTitle" :dialog-visible="addDialog" :info-data="data.infoData" @submit-dialog="submit" @close-dialog="closeDialog" />
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  padding: 0;
}

.el-row {
  height: calc(100vh - 294px);
}

.el-row .el-col {
  height: 100%;
}

.el-row .el-col:first-child {
  background: #e3e5e3;
}

.el-tree {
  background: none;

  .is-current * {
    background: #fff;
  }
}

.form-pa {
  padding: 1rem 400px 0 0;
}
</style>
