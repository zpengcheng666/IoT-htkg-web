<!--
 * @Description:特情处置记录
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:07:33
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import specialInfo from './components/specialInfo.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  infoData: {},
  form: {
    startTime: '',
    endTime: '',
    name: '',
    initiator: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogType: 'add',
  dialogTitle: '新增',
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '预案名称',
  },
  {
    prop: 'initiator',
    label: '启动人',
  },
  {
    prop: 'startTime', // prop
    label: '启动时间',
  },
  {
    prop: 'endTime', // prop
    label: '结束时间',
  },
  {
    prop: 'isCompleted_disp', // prop
    slot: 'isCompleted_disp',
    label: '完成状态',
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
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/system/contingencyRecord/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    startTime: '',
    endTime: '',
    name: '',
    initiator: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '详情'
  dialogAdd.value = true
}
// 处理
function editView(row: any) {
  ElMessageBox.confirm(
    '此操作将处理该数据，是否处理?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        id: row.id,
        isCompleted: 1,
      }
      api.post('/system/contingencyRecord/edit', postData).then((res: any) => {
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
function closeDialog() {
  dialogAdd.value = false
}
onMounted(() => {
  getList()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row>
      <el-form :inline="true" :model="data" class="demo-form-inline">
        <el-form-item label="预案名称：">
          <el-input v-model="data.form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="启动人">
          <el-input v-model="data.form.initiator" placeholder="" />
        </el-form-item>
        <el-form-item label="启动时间">
          <el-row class="flex-nowrap">
            <el-col :span="10">
              <el-date-picker
                v-model="data.form.startTime"
                type="date" label="开始日期"
                placeholder="开始日期"
                style="width: 100%;"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-col>
            <el-col class="text-center" :span="1" style="margin: 0 0.5rem;">
              -
            </el-col>
            <el-col :span="10">
              <el-date-picker
                v-model="data.form.endTime"
                type="date" label="结束日期"
                placeholder="结束日期"
                style="width: 100%;"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" small @click="getList()">
            查询
          </el-button>
          <el-button type="info" plain small @click="reset()">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #isCompleted_disp="{ item }">
        <el-tag v-if="item.row.isCompleted === 1" type="success">
          {{ item.row.isCompleted_disp }}
        </el-tag>
        <el-tag v-if="item.row.isCompleted === 0" type="danger">
          {{ item.row.isCompleted_disp }}
        </el-tag>
      </template>
      <template #operate="{ item }">
        <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">
          详情
        </el-button>
        <el-button v-auth="'data:special:dispose'" type="primary" size="small" :disabled="item.row.isCompleted === 1" :dark="true" @click="editView(item.row)">
          处理
        </el-button>
      </template>
    </CommonTable>
    <specialInfo v-if="dialogAdd" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" />
  </PageMain>
</template>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
