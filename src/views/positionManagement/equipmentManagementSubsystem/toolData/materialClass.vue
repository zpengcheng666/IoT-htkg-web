<!--
 * @Description:物料分类管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-29 11:09:35
-->
<script lang="ts" setup name="PersonalSetting">
import {  Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addMaterialClassDialog from './components/addMaterialClassDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
  infoData: {
    // id:''
  } as any,
  groudOptions: [],
  orgId: '',
  dialogType: 'add',
  dialogTitle: '新增分类',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'typeName',
    label: '分类名称',
    align: 'left',
  },
  {
    prop: 'orderNum', // prop
    label: '排序',
  },
  {
    prop: 'status', // prop
    label: '状态',
    slot: 'status',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '300px',
  },
])

const dialogAdd = ref(false) // 添加弹窗

// 事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('spare/materialClassification/queryTreeList', postData).then((res: any) => {
    data.tableData = res.result
    data.groudOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}


// 重置
function reset() {
  data.form.name = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogType = 'edit'
  data.dialogTitle = '编辑分类'
  dialogAdd.value = true
}

// 点击新增
function clickAdd(row: any | undefined) {
  data.infoData = {}
  if (row !== '0') {
    data.infoData.parentId = row.id
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增分类'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
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
      api.delete(`spare/materialClassification/delete?id=${id}`).then((res: any) => {
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

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('spare/materialClassification/add', postData).then((res: any) => {
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
    api.post('spare/materialClassification/edit', postData).then((res: any) => {
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
// 设置状态
function setFrozenState(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    status: val.status,
  }
  api.post('spare/materialClassification/editStatus', postData).then((res: any) => {
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


onMounted(() => {
  getList()
})
</script>

<script>
</script>

<template>
  <page-main class="pageBox">
    <!-- 分类管理页面 -->
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="分类名称：">
            <el-input v-model="data.form.name" />
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
        <el-button v-auth="'system:group:add'" type="warning" :icon="Plus" @click="clickAdd('0')">
          新增分类
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
      :size="data.form.pageSize"
      @selection-change="selectionChange"
    >
      <template #status="{ item }">
        <el-switch v-model="item.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" @click="setFrozenState(item.row)" />
      </template>
      <template #operate="{ item }">

        <el-button v-auth="'system:menu:add'" type="primary" size="small" :dark="true" @click="clickAdd(item.row)">
          新增
        </el-button>
        <el-button v-auth="'system:group:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:group:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addMaterialClassDialog v-if="dialogAdd" :groud-options="data.groudOptions" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />

  </page-main>
</template>

<style lang="scss" scoped>
  .col-right {
    display: flex;
    justify-content: flex-end;
  }
</style>

