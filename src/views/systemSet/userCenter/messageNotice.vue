<!--
 * @Description:消息通知
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:50:18
-->
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import addMessageDialog from './components/addMessageDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const data = reactive({
  tableData: [],
  form: {
    detail: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增消息',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'detail',
    label: '消息内容',
  },
  {
    prop: 'type_disp',
    label: '消息类型',
  },
  {
    prop: 'startTime', // prop
    label: '开始时间',
  },
  {
    prop: 'status', // prop
    slot: 'status',
    label: '状态',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '150px',
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

const dialogAdd = ref(false) // 添加弹窗
const total = ref(0) // 总条数

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseMessage/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form.detail = ''
  getList()
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '消息详情'
  dialogAdd.value = true
}

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/baseMessage/add', postData).then((res: any) => {
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
    api.post('system/baseMessage/edit', postData).then((res: any) => {
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

<template>
  <page-main class="pageBox">
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="消息内容：">
            <el-input v-model="data.form.detail" />
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

      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #status="{ item }">
        <span>{{ item.row.status === 0 ? '已读' : '未读' }}</span>
      </template>
      <template #operation="{ item }">

        <el-button type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          查看
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addMessageDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
