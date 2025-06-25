<!--
 * @Description:值班信息
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:25:38
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import {  Plus } from '@element-plus/icons-vue'
import AddDuty from './components/addDuty.vue'
import PublishDialog from './components/publishDialog.vue'
import DutyShifts from './components/dutyShifts.vue'
import DutyGroup from './components/dutyGroup.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
import selectLabel from '@/utils/select'
const selectTerminalOption = {
  getKeyFun: (item: any) => item.id,
  getValueFun: (item: any) => item.name,
}

const pageData = reactive({
  terminalList: [] as any,
  tableData: [] as any,
  form: {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  publishInfoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
})
const dutyInfoData = reactive(
  {
    show: false,
    dutyId: '',
    showGroup: false,
  })

const publishDate = reactive({
  messageId: '',
  terminalIds: [],
})
const tableHeader = [
  {
    prop: 'name',
    label: '值班安排',
  },
  {
    prop: 'terminalIds',
    label: '已发布终端',
    slot: 'terminalIds',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '350px',
  },
]
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogPublish = ref(false) // 发布弹窗
function getList() {
  const postData = {
    params: JSON.parse(JSON.stringify(pageData.form)),
  }
  postData.params.terminalIds = pageData.form.terminalIds.toString()
  api.get('/message/publishDuty/list', postData).then((res: any) => {
    pageData.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
function reset() {
  pageData.form = {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
const sizeChange = (val: number) => {
  pageData.form.pageSize = val
  getList()
}
const currentChange = (val: number) => {
  pageData.form.pageNo = val
  getList()
}
function clickAdd() {
  pageData.infoData = { }
  pageData.dialogType = 'add'
  pageData.dialogTitle = '新增'
  dialogAdd.value = true
}
function clickEdit(row: any) {
  pageData.infoData = JSON.parse(JSON.stringify(row))
  pageData.dialogType = 'edit'
  pageData.dialogTitle = '编辑'
  dialogAdd.value = true
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
      api.delete(`message/publishDuty/delete?id=${id}`).then((res: any) => {
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
function clickPublish(data: any) {
  dialogPublish.value = true
  publishDate.messageId = data
}
function closePublishDialog() {
  dialogPublish.value = false
}
function publishSubmit(val: any) {
  publishDate.terminalIds = val.terminalIds
  api.put('/message/publishDuty/publish', publishDate).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogPublish.value = false
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
// 撤销发布
function cancelPublish(id: any) {
  ElMessageBox.confirm(
    '此操作将撤销发布，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      api.put(`/message/publishDuty/revocation/${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          dialogPublish.value = false
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
        message: '取消发布',
      })
    })
}
// 提交新增
function submit(val: any) {
  const postData = val
  if (pageData.dialogType === 'add') {
    api.post('/message/publishDuty/add', postData).then((res: any) => {
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
  else if (pageData.dialogType === 'edit') {
    api.post('/message/publishDuty/edit', postData).then((res: any) => {
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
// 获取终端下拉
function listTerminal() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/system/baseTerminal/list', postData).then((res: any) => {
    pageData.terminalList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
function showInfo(id: string) {
  dutyInfoData.dutyId = id
  dutyInfoData.show = true
}
function showGroup(id: string) {
  dutyInfoData.dutyId = id
  dutyInfoData.showGroup = true
}
onMounted(() => {
  listTerminal()
  getList()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="22">
          <el-form :inline="true" :model="pageData.form" label-width="100px">
            <el-form-item label="发布终端：">
              <el-select
                v-model="pageData.form.terminalIds"
                placeholder="请选择"
                :multiple="true"
                :filterable="true"
                :clearable="true"
                style="width: 240px;"
              >
                <el-option
                  v-for="i in pageData.terminalList"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">
                查询
              </el-button>
              <el-button @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button v-auth="'ips:duty:add'" type="warning" :icon="Plus" @click="clickAdd()">
            新增
          </el-button>
        </el-col>
      </el-row>
      <CommonTable
        :table-data="pageData.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="pageData.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #terminalIds="{ item }">
          <el-tag v-for="(v, i) in item.row.terminalIds" v-show="item.row.terminalIds.length > 0" :key="`ter${i}`" type="success" style="margin-right: 10px;">
            {{ selectLabel(v, pageData.terminalList, selectTerminalOption) }}
          </el-tag>
          <span v-show="item.row.terminalIds.length === 0">暂无</span>
        </template>

        <template #operation="{ item }">
          <el-button type="primary" size="small" @click="showInfo(item.row.id)">
            排班
          </el-button>
          <el-button type="primary" size="small" @click="showGroup(item.row.id)">
            人员
          </el-button>
          <el-button v-auth="'ips:duty:edit'" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-if="item.row.state === 0" v-auth="'ips:duty:publish'" type="primary" plain size="small" @click="clickPublish(item.row.id)">
            发布
          </el-button>
          <el-button v-if="item.row.state === 2" v-auth="'ips:duty:publish'" size="small" @click="cancelPublish(item.row.id)">
            撤销
          </el-button>
          <el-button v-auth="'ips:duty:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
    </page-main>
    <AddDuty
      v-if="dialogAdd"
      :dialog-visible="dialogAdd"
      :title="pageData.dialogTitle"
      :info-data="pageData.infoData"
      @submit-dialog="submit"
      @close-dialog="closeDialog"
    />
    <PublishDialog
      v-if="dialogPublish"
      :dialog-visible="dialogPublish"
      :terminal-options="pageData.terminalList"
      @submit-dialog="publishSubmit"
      @close-dialog="closePublishDialog"
    />
    <el-dialog
      v-model="dutyInfoData.show"
      title="排班信息"
      width="50%"
      destroy-on-close
      top="2vh"
    >
      <DutyShifts :duty-id="dutyInfoData.dutyId" />
    </el-dialog>
    <el-dialog
      v-model="dutyInfoData.showGroup"
      title="值班分组"
      destroy-on-close
      top="2vh"
      width="50%"
    >
      <DutyGroup :duty-id="dutyInfoData.dutyId" />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

