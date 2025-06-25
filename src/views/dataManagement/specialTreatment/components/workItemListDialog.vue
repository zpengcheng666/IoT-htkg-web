<script lang="ts" setup>
import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addWorkItem from './addWorkItem.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '工作项',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['closeDialog'])

const data = reactive({
  tableData: [],
  form: {
    stageId: '',
    pageNo: 1,
    pageSize: 30,
  },
  workItemInfoData: {} as any,
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
    prop: 'content',
    label: '内容',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/system/contingencyPlanWorkitem/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
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

// 点击新增
function clickAdd() {
  data.workItemInfoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增工作项'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  // data.infoData = JSON.parse(JSON.stringify(row))
  data.workItemInfoData = row
  data.dialogType = 'edit'
  data.dialogTitle = '编辑工作项'
  dialogAdd.value = true
}

// 提交新增
function addSubmit(val: any) {
  const postData = val
  postData.stageId = data.form.stageId
  if (data.dialogType === 'add') {
    api.post('/system/contingencyPlanStage/addWork', postData).then((res: any) => {
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
    api.post('/system/contingencyPlanWorkitem/edit', postData).then((res: any) => {
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
// 删除
function del(id: string) {
  // return false
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
      api.delete(`/system/contingencyPlanWorkitem/delete?id=${id}`).then((res: any) => {
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
// 关闭新增弹窗
function closeAddDialog() {
  dialogAdd.value = false
}
// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}
onMounted(() => {
  data.form.stageId = props.infoData.id
  getList()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-row>
      <el-col :span="20" />
      <el-col :span="4" class="col-right">
        <el-button v-auth="'data:work:add'" type="warning" :icon="Plus" @click="clickAdd()">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :is-index="true" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button v-auth="'data:work:edit'" type="primary" size="small" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'data:work:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <addWorkItem v-if="dialogAdd" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.workItemInfoData" @close-dialog="closeAddDialog" @submit-dialog="addSubmit" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
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
