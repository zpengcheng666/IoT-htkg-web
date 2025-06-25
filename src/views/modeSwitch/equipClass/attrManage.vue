<!--
 * @Description:属性管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:46:22
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CloseBold, Delete, DocumentCopy, Edit, Memo, Plus, Select, SetUp } from '@element-plus/icons-vue'
import AddAttrEquip from './components/addAttrEquip.vue'
import AttrPage from './components/attrPage.vue'
import TacticsPage from './components/tacticsPage.vue'
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
  dialogType: 'edit',
  dialogTitle: '编辑',

})
const dialogAdd = ref(false) // 添加弹窗
const isAttr = ref(false)
const isTactics = ref(false)
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '设备类型名称',
  },
  {
    prop: 'type',
    label: '设备类型编码',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
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

const activeName = ref('0')

const handleClick = (val: any) => {
  if (val === '0') {
    isAttr.value = false
    isTactics.value = false
    return
  }
  if (val === '1') {
    isAttr.value = true
    isTactics.value = false
    return
  }
  if (val === '2') {
    isAttr.value = false
    isTactics.value = true
  }
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
function clickCopy(val: any) {
  data.infoData = val
  data.dialogType = 'copy'
  data.dialogTitle = '复制'
  dialogAdd.value = true
}
// 点击新增
function clickEdit(val: any) {
  data.infoData = val
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}
// 新增提交
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/scada/deviceTypeManagement/add', postData).then((res: any) => {
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
    api.post('/scada/deviceTypeManagement/edit', postData).then((res: any) => {
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
  else if (data.dialogType === 'copy') {
    api.post('/scada/deviceTypeManagement/copy', postData).then((res: any) => {
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
// 获取设备列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('/scada/deviceTypeManagement/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.delete(`/scada/deviceTypeManagement/delete?id=${id}`).then((res: any) => {
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
// 点击编辑属性
function clickEditAttr(val: any) {
  activeName.value = '1'
  data.infoData = val
  isAttr.value = true
}

// 点击编辑策略
function clickEditTactics(val: any) {
  activeName.value = '2'
  data.infoData = val
  isTactics.value = true
}
onMounted(() => {
  getList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="设备" name="0">
        <el-row>
          <el-col :span="22">
            <el-form :inline="true" :model="data.form" class="demo-form-inline">
              <el-form-item label="">
                <el-input v-model="data.form.name" placeholder="请输入名称搜索" />
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" @click="getList">
                  查询
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2" class="col-right">
            <el-button v-auth="'config:attr:add'" type="warning" :icon="Plus" @click="clickAdd();">
              新增
            </el-button>
          </el-col>
        </el-row>
        <CommonTable
          :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
          :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        >
          <template #operate="{ item }">
            <el-tooltip
              effect="light"
              content="编辑属性"
              placement="bottom"
            >
              <el-button v-auth="'config:attr:editattr'" type="primary" size="small" :icon="Memo" :dark="true" @click="clickEditAttr(item.row)" />
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="编辑策略"
              placement="bottom"
            >
              <el-button v-auth="'config:attr:editstrategy'" type="primary" size="small" :icon="SetUp" :dark="true" @click="clickEditTactics(item.row)" />
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="复制"
              placement="bottom"
            >
              <el-button v-auth="'config:attr:copy'" type="primary" size="small" :icon="DocumentCopy" :dark="true" @click="clickCopy(item.row)" />
            </el-tooltip>

            <el-tooltip

              effect="light"
              content="编辑"
              placement="bottom"
            >
              <el-button v-auth="'config:attr:edit'" type="primary" size="small" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
            </el-tooltip>
            <el-tooltip
              effect="light"
              content="删除"
              placement="bottom"
            >
              <el-button v-auth="'config:attr:del'" type="danger" size="small" :icon="Delete" :dark="true" @click="del(item.row.id)" />
            </el-tooltip>

          </template>

          <template #isCameraLinked="{ item }">
            <el-icon>
              <Select v-if="item.row.isCameraLinked === 1" style="color: green;" />
              <CloseBold v-if="item.row.isCameraLinked === 0" style="color: red;" />
            </el-icon>
          </template>
          <template #isShowInScene="{ item }">
            <el-icon>
              <Select v-if="item.row.isShowInScene === 1" style="color: green;" />
              <CloseBold v-if="item.row.isShowInScene === 0" style="color: red;" />
            </el-icon>
          </template>
          <template #isShowDataTable="{ item }">
            <el-icon>
              <Select v-if="item.row.isShowDataTable === 1" style="color: green;" />
              <CloseBold v-if="item.row.isShowDataTable === 0" style="color: red;" />
            </el-icon>
          </template>
          <template #stateNames="{ item }">
            <el-tag v-for="(v, i) in item.row.stateNames" :key="i" type="success">
              {{ v }}
            </el-tag>
          </template>
        </CommonTable>
      </el-tab-pane>
      <el-tab-pane label="属性" name="1" :disabled="Object.keys(data.infoData).length === 0">
        <AttrPage v-if="isAttr" :info-data="data.infoData" />
      </el-tab-pane>
      <el-tab-pane label="策略" name="2" :disabled="Object.keys(data.infoData).length === 0">
        <TacticsPage v-if="isTactics" :info-data="data.infoData" />
      </el-tab-pane>
    </el-tabs>
    <!-- 弹出编辑窗口 -->
    <AddAttrEquip v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}

.pageBox {
  margin: 20px 20px 0;
}

:deep(.el-tabs--card > .el-tabs__header) {
  border: none;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border-bottom: 1px solid #e4e7ed;
  background: #e0e0e0;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid #e4e7ed;
}

.fullHeight {
  height: calc(100vh - 370px);

  > .el-col {
    padding: 5px;
    border: 1px solid #e3e3e3;
    max-width: calc(50% - 10px);
  }

  > .el-col:nth-child(1) {
    margin-right: 10px;
    max-width: calc(50% - 20px);
  }
}

.scrollHeight {
  overflow-y: scroll;
  overflow-x: hidden;
}

.col-span-two .el-form-item {
  width: calc(100% / 2 - 12px);
  margin-right: 12px;
}

.col-span-two .el-form-item.fullWidth {
  width: 100%;
  margin-right: 0;

  button {
    margin: 0 auto;
  }
}

.fullWidth {
  width: 100%;

  button {
    margin: 0 auto;
  }
}

.el-select {
  width: 100%;
}

:deep(.el-overlay-dialog) {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-dialog {
    margin: 0;
  }
}
</style>
