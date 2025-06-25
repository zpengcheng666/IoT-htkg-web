<!--
 * @Description:人员管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:23:58
-->


<script lang="ts" setup name="PersonalSetting">
import {  Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addPerson from './components/addPerson.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    username: '',
    pageNo: 1,
    pageSize: 30,
  },
  userId: '',
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增人员',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'code',
    label: '编号',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'sex',
    label: '性别',
  },

  {
    prop: 'age', // prop
    label: '年龄',
  },
  {
    prop: 'origin', // prop
    label: '籍贯',
  },
  {
    prop: 'address', // prop
    label: '家庭住址',
  },
  {
    prop: 'birthday', // prop
    label: '出生日期',
  },
  {
    prop: 'idNumber', // prop
    label: '身份证号',
  },

  {
    prop: 'military_disp',
    label: '职位',
  },
  {
    prop: 'position_disp',
    label: '岗位',
  },

  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])

const total = ref(0) // 总条数
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

// 多选事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
}

// 获取人员列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/basePerson/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 删除人员
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
      api.delete(`system/basePerson/delete?id=${id}`).then((res: any) => {
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

// 重置
function reset() {
  data.form.username = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑人员'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增人员'
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/basePerson/add', postData).then((res: any) => {
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
    api.post('system/basePerson/edit', postData).then((res: any) => {
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

onMounted(() => {
  getList()
})
</script>

<script>
</script>

<template>
  <page-main class="pageBox">
    <!-- 人员管理页面 -->
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="姓名：">
            <el-input v-model="data.form.username" />
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
        <el-button v-auth="'system:person:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增人员
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="selectionChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'system:person:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:person:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增弹窗 -->
    <addPerson v-if="dialogAdd" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

