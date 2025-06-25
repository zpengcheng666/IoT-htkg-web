<!--
 * @Description: 属性tab页
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:48:58
-->
<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import { CloseBold, Delete, Edit, Plus, Select } from '@element-plus/icons-vue'
import AddAttr from './addAttr.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
})
const data = reactive({
  tableData: [],
  form: {
    typeId: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  dialogType: 'edit',
  dialogTitle: '编辑',
})

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
const tableHeader = reactive([
  {
    prop: 'name',
    label: '属性名称',
  },
  {
    prop: 'category',
    label: '英文名称',
  },
  {
    prop: 'dataType', // prop
    label: '数据类型',
  },
  {
    prop: 'initValue', // prop
    label: '初始值',
    width: '76px',
  },
  {
    prop: 'maxValue', // prop
    label: '最大值',
    width: '76px',
  },
  {
    prop: 'minValue', // prop
    label: '最小值',
    width: '76px',
  },
  {
    prop: 'unit', // prop
    label: '单位',
    width: '76px',
  },
  {
    prop: 'isSave', // prop
    slot: 'isSave',
    label: '存储',
    width: '76px',
  },
  {
    prop: 'isAssociate', // prop
    slot: 'isAssociate',
    label: '关联',
    width: '76px',
  },
  {
    prop: 'isAssociateVar', // prop
    slot: 'isAssociateVar',
    label: '关联变量',
    width: '90px',
  },
  {
    prop: 'isConfigurable', // prop
    slot: 'isConfigurable',
    label: '配置',
    width: '76px',
  },
  {
    prop: 'isAct', // prop
    slot: 'isAct',
    label: '可控',
    width: '76px',
  },
  {
    prop: 'displayAreaList', // prop
    slot: 'displayAreaList',
    label: '展示区域',
  },
  {
    prop: 'sortNumber', // prop
    label: '排序号',
    sortable: true,
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
])
// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
function closeDialog() {
  dialogAdd.value = false
}
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/scada/deviceTypeAttribyte/add', postData).then((res: any) => {
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
    api.post('/scada/deviceTypeAttribyte/edit', postData).then((res: any) => {
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
// 获取属性列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/scada/deviceTypeAttribyte/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
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
      api.delete(`/scada/deviceTypeAttribyte/delete?id=${id}`).then((res: any) => {
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
function search() {
  data.form.pageNo = 1
  getList()
}
// 点击编辑属性
function clickEdit(val: any) {
  data.infoData = val
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
function displayArea(enName: any){
  if (enName === 'popover') {
    return '悬浮气泡'
  }
  if (enName === 'dataTable') {
    return '数据表格'
  }
  if (enName === 'dataList') {
    return '数据列表'
  }
}
onMounted(() => {
  data.form.typeId = props.infoData.id
  getList()
})
</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-form :inline="true" :model="data.form">
        <el-form-item label="">
          <el-input v-model="data.form.name" placeholder="请输入名称搜索" />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" @click="search">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="10">
      <span>{{ props.infoData.name }}</span>
    </el-col>
    <el-col :span="2" class="col-right">
      <el-button type="warning" :icon="Plus" @click="clickAdd();">
        新增
      </el-button>
    </el-col>
  </el-row>
  <CommonTable
    :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
    :is-select="false" @size-change="sizeChange" @current-change="currentChange"
  >
    <template #isSave="{ item }">
      <el-icon>
        <Select v-if="item.row.isSave === 1" style="color: green;" />
        <CloseBold v-if="item.row.isSave === 0" style="color: red;" />
      </el-icon>
    </template>
    <template #isAssociate="{ item }">
      <el-icon>
        <Select v-if="item.row.isAssociate === 1" style="color: green;" />
        <CloseBold v-else style="color: red;" />
      </el-icon>
    </template>
    <template #isAssociateVar="{ item }">
      <el-icon>
        <Select v-if="item.row.isAssociateVar === 1" style="color: green;" />
        <CloseBold v-else style="color: red;" />
      </el-icon>
    </template>
    <template #isConfigurable="{ item }">
      <el-icon>
        <Select v-if="item.row.isConfigurable === 1" style="color: green;" />
        <CloseBold v-if="item.row.isConfigurable === 0" style="color: red;" />
      </el-icon>
    </template>
    <template #isAct="{ item }">
      <el-icon>
        <Select v-if="item.row.isAct === 1" style="color: green;" />
        <CloseBold v-if="item.row.isAct === 0" style="color: red;" />
      </el-icon>
    </template>
    <template #operate="{ item }">
      <el-button type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
      <el-button type="danger" :icon="Delete" @click="del(item.row.id)" />
    </template>
    <template #displayAreaList="{ item }">
      <el-tag v-for="i in item.row.displayAreaList" :key="i">
        {{ displayArea(i) }}
      </el-tag>
    </template>
  </CommonTable>
  <AddAttr v-if="dialogAdd" :type-id="data.form.typeId" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
</template>

<style lang="scss" scoped>
.el-form-item {
  width: calc(100% / 3 - 12px);
  margin-right: 12px;
}

.el-form-item.fullWidth {
  width: 100%;
  margin-right: 0;

  :deep(.el-form-item__label) {
    text-align: right;
    width: 120px;
  }
}
</style>
