<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'

import addDictChildDialog from './addDictChildDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Array,
    default() {
      return []
    },
  },
  dutyPersonId: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '字典数据',
  },
  dictId: {
    type: String,
    default: '',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})
const emits = defineEmits(['submitDialog', 'closeDialog'])
const dialogAdd = ref(false)
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'id',
    label: 'id',
  },
  {
    prop: 'orderNum',
    label: '字典排序',
  },
  {
    prop: 'name',
    label: '字典标签',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },

])

const data = reactive({
  clickListData: [] as any,
  dictTypeOptions: [] as any,
  dialogType: 'add',
  dialogTitle: '新增字典',
  infoData: {},
})

// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
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

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

// 点击新增
function clickAddChild() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}

// 关闭弹窗
function closeAddDialog() {
  dialogAdd.value = false
}

// 获取字典内容
function getChildList() {
  // console.log(params)
  const postData = {
    params: { dictTypeId: props.dictId },
  }
  api.get('system/baseDictData/selectByIdDictData', postData).then((res: any) => {
    data.clickListData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 提交新增
function addSubmint(val: any) {
  const postData = val
  postData.dictTypeId = props.dictId
  if (data.dialogType === 'add') {
    api.post('system/baseDictData/addDict', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getChildList()
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
    api.post('system/baseDictData/editDictNameAndCode', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getChildList()
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

  // console.log(val)
}

// 删除角色
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
      api.delete(`system/baseDictData/removeDictData?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getChildList()
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
  getChildList()
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
      <el-col :span="24">
        <el-button type="warning" :icon="Plus" @click="clickAddChild">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.clickListData"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
    >
      <template #operate="{ item }">
        <el-button v-auth="'data:dict:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'data:dict:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>

    <addDictChildDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeAddDialog" @submint-dialog="addSubmint" />
  </el-dialog>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}

.formInput {
  width: 100px;
}
// .dialog-footer {
//   text-align: center;
// }
</style>
