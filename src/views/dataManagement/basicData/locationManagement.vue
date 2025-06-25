<!--
 * @Description:位置管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-05-31 16:38:31
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:32:14
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import addLocation from './components/addLocation.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增位置',
  form: {
    title: '',
  },
  groudOptions: [{
    id: '0',
    title: '一级位置',
    children: [],
  }],
})

const addDialog = ref(false)

const getList = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.tableData = res.result
    data.groudOptions[0].children = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form.title = ''
  getList()
}
const tableHeader = reactive([
  {
    prop: 'title',
    label: '位置名称',
    align: 'left',
  },
  {
    prop: 'className',
    label: '位置类别',
  },
  {
    prop: 'description', // prop
    label: '描述',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '300px',
  },
])

// 点击新增
function clickAdd(row: any | undefined) {
  data.infoData = {}
  if (row !== '0') {
    data.infoData.pid = row.id
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增位置'
  addDialog.value = true
}
const clickEdit = (row: any) => {
  data.infoData = row
  data.infoData.name = row.title
  data.dialogType = 'edit'
  addDialog.value = true
  data.dialogTitle = '编辑位置'
}

const closeDialog = () => {
  addDialog.value = false
}

// 添加节点
const submit = (val: any) => {
  const param = val

  if (data.dialogType === 'add') {
    api.post('system/baseLocation/add', param).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        addDialog.value = false
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
    api.post('system/baseLocation/edit', param).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        addDialog.value = false
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

// 删除
const del = (id: any) => {
  ElMessageBox.confirm(
    '删除当前位置吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.delete(`system/baseLocation/delete?id=${id}`).then((res: any) => {
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
  getList()
})
</script>

<template>
  <page-main class="pageBox">

    <!-- 分组管理页面 -->
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="位置名称：">
            <el-input v-model="data.form.title" />
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
        <el-button v-auth="'data:location:add'" type="warning" :icon="Plus" @click="clickAdd('0')">
          新增位置
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
    >

      <template #operate="{ item }">
        <el-button v-auth="'data:location:add'" type="primary" size="small" :dark="true" @click="clickAdd(item.row)">
          新增
        </el-button>
        <el-button v-auth="'data:location:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'data:location:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <addLocation v-if="addDialog" :groud-options="data.groudOptions" :title="data.dialogTitle" :dialog-visible="addDialog" :info-data="data.infoData" @submit-dialog="submit" @close-dialog="closeDialog" />
  </page-main>
</template>

<style lang="scss" scoped>
.el-tree {
  background: none;

  .is-current * {
    background: #fff;
  }
}

.form-pa {
  padding: 1rem 400px 0 0;
}

.el-input {
  width: 320px;
}
</style>
