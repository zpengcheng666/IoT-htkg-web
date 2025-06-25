<route lang="yaml">
name: personalSetting
meta:
  title: 进出记录
  cache: personal-edit.password
            </route>

<script lang="ts" setup name="PersonalSetting">
import type { UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据

  doorInfo: {
    type: Array<any>,
    default() {
      return []
    },
  },

})
const data = reactive({
  tableData: [],
  form: {
    detail: '',
    doorName: '',
    doorId: '',
    perName1: '',
    cardCode1: '',
    recordType: '',
    accessType: '',
    doorType: '',
    openTyoe: '',
    region: '',
    openTime: '',
    begin_openTime: '',
    end_openTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  devDoorOptions: [{ // 门名称下拉数据
    id: '',
    name: '',
  }],
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增进出记录',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'leaderId_disp',
    label: '带队人姓名',
  },
  {
    prop: 'department',
    label: '申请单位',
  },
  {
    prop: 'reason', // prop
    label: '入库事由',
  },

  {
    prop: 'inTime', // prop
    label: '入库时间',
  },
  {
    prop: 'outTime', // prop
    label: '出库时间',
  },
  {
    prop: 'count', // prop
    label: '人数',
  },
  // {
  //   label: '操作',
  //   slot: 'operate',
  //   fixed: 'right',
  //   width: '260px',
  // },
])
const dialogAdd = ref(false) // 添加弹窗

// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '进出记录详情'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑进出记录'
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
      api.delete(`door/doorHistory/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
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

onMounted(() => {
})
</script>

<template>
  <div>
    <CommonTable
      :table-data="props.doorInfo"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
      :is-index="true"
    >
      <template #recordType="{ item }">
        <span>{{ item.row.recordType === 0 ? '自动' : '手动' }}</span>
      </template>

      <template #accessType="{ item }">
        <span>{{ item.row.accessType === 'entryCard' ? '进门' : '出门' }}</span>
      </template>

      <template #doorType="{ item }">
        <span>{{ item.row.doorType === 'one' ? '单向门' : '双向门' }}</span>
      </template>

      <template #operate="{ item }">
        <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">
          查看
        </el-button>
        <el-button type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
        <!-- <el-button type="primary" :icon="FolderChecked" plain /> -->
      </template>
    </CommonTable>
  </div>
</template>

  <style lang="scss" scoped>
  .el-form--inline .el-form-item {
    width: calc(100% / 3 - 60px);
  }

  .el-select {
    width: 100%;
  }

  .flex-nowrap {
    flex-wrap: nowrap;
  }
  </style>

