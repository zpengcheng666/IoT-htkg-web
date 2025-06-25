<!--
 * @Description:联动策略
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:30:40
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { Delete, Edit, Plus, Finished } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddLinkage from './components/addLinkage.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '名称',
  },

  {
    prop: 'isEnable', // prop
    label: '是否启用',
    slot: 'isEnable',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false)
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

function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/scada/linkageStrategy/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
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
  getList()
}

// 设置启用
function setEnable(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    enable: val.isEnable,
  }
  api.put('/scada/linkageStrategy/enable', postData).then((res: any) => {
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
// 打开新增弹窗
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/scada/linkageStrategy/add', postData).then((res: any) => {
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
    api.post('/scada/linkageStrategy/edit', postData).then((res: any) => {
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
      api.delete(`/scada/linkageStrategy/delete?id=${id}`).then((res: any) => {
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
function test(id: string) {
  ElMessageBox.confirm(
    '此操作将执行联动事件,是否执行?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.put(`/scada/linkageStrategy/test?id=${id}`).then((res: any) => {
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
    <el-row>
      <el-col :span="22">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="策略名称：">
            <el-input v-model="data.form.name" placeholder="" />
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>

            <el-button @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" class="col-right">
        <el-button v-auth="'config:linkage:add'" type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #isEnable="{ item }">
        <el-switch v-model="item.row.isEnable" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" @click="setEnable(item.row)" />
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'config:linkage:edit'" type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button v-auth="'config:linkage:del'" type="primary" :icon="Finished" :dark="true" @click="test(item.row.id)" />
        <el-button v-auth="'config:linkage:edit'" type="danger" :icon="Delete" :dark="true" @click="del(item.row.id)" />
      </template>
    </CommonTable>
    <AddLinkage v-if="dialogAdd" :title="data.dialogTitle" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
