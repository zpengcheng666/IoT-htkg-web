<!--
 * @Description:卫星临空
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-09 14:28:22
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import {  Plus } from '@element-plus/icons-vue'
import satellite from './components/satellite.vue'
import publishDialog from './components/publishDialog.vue'
import importDialog from './components/importDialog.vue'
import setThreeColorDialog from './components/setThreeColorDialog.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
import selectLabel from '@/utils/select'
const selectTerminalOption = {
  getKeyFun: (item: any) => item.id,
  getValueFun: (item: any) => item.name,
}
const data = reactive({
  tableData: [],
  form: {
    terminalIds: [],
    pageNo: 1,
    pageSize: 30,
  },
  publishInfoData: {},
  infoData: {} as any,
  selectIds: [] as any,
  dialogType: 'add',
  dialogTitle: '新增',
  terminalOptions: [] as any,
  threeColorOptions: [] as any,
  threeColorData: {
    threeColor: [],
  },
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '卫星名称',
  },
  {
    prop: 'code',
    label: '卫星编号',
  },
  {
    prop: 'nationality', // prop
    label: '卫星国别',
  },
  {
    prop: 'satelliteType', // prop
    label: '卫星类型',
  },
  {
    prop: 'enterTime', // prop
    label: '进入时间',
    width: '180',
  },
  {
    prop: 'leaveTime', // prop
    label: '离开时间',
    width: '180',
  },
  {
    prop: 'period', // prop
    label: '过境时长',
  },
  // {
  //   prop: 'intervalFlag', // prop
  //   label: '是否周期',
  //   slot: 'intervalFlag',
  // },
  // {
  //   prop: 'interval1', // prop
  //   label: '周期（分）',
  //   slot: 'interval1',
  // },
  {
    prop: 'terminalIds', // prop
    label: '已发布终端',
    slot: 'terminalIds',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogPublish = ref(false)
const dialogImport = ref(false)// 导入弹窗
const dialogThreeColor = ref(false)// 导入弹窗
// 获取列表
function getList() {
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.terminalIds = data.form.terminalIds.toString()

  api.get('/message/publishSatellite/list', postData).then((res: any) => {
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

// 获取多选
const selectionChange = (val: any) => {
  data.selectIds = val
}
// 点击新增
function clickAdd() {
  data.infoData = {}
  data.infoData.intervalFlag = 0
  data.dialogType = 'add'
  data.dialogTitle = '临空卫星信息'
  dialogAdd.value = true
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '临空卫星信息'
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
      api.delete(`/message/publishSatellite/delete?id=${id}`).then((res: any) => {
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
// 批量删除
function batchDel() {
  ElMessageBox.confirm(
    '此操作将批量删除选中的数据，是否删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const selectArr = []
      for (const i in data.selectIds) {
        selectArr.push(data.selectIds[i].id)
      }
      const ids = selectArr.toString()
      api.delete(`/message/publishSatellite/deleteBatch?ids=${ids}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          data.selectIds = [] as any
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
      data.selectIds = [] as any
      getList()
    })
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/message/publishSatellite/add', postData).then((res: any) => {
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
    api.post('/message/publishSatellite/edit', postData).then((res: any) => {
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
// 点击发布
function clickPublish(val: any) {
  data.publishInfoData = {
    messageId: val.id,
    terminalIds: [],
  }
  dialogPublish.value = true
}
// 关闭发布弹窗
function closePublishDialog(id: any) {
  dialogPublish.value = false
}

// 关闭导入弹窗
function closeImportDialog() {
  dialogImport.value = false
}
// 打开导入弹窗
function openImportDialog() {
  dialogImport.value = true
}
// 导入提交
function importSubmint(val: any) {
  // console.log(val)
  const postData = val
  api.post('/message/publishSatellite/saveBatch', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogImport.value = false
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
// 提交发布
function publishSubmint(val: any) {
  const postData = val
  api.put('/message/publishSatellite/publish', postData).then((res: any) => {
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
      api.put(`/message/publishSatellite/revocation/${id}`).then((res: any) => {
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
        message: '取消删除',
      })
    })
}
// 获取终端下拉
function getTerminalOptions() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/system/baseTerminal/list', postData).then((res: any) => {
    data.terminalOptions = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取三色声光设备
function getThreeColorOptions() {
  api.get('/scada/conSheBei/list3SGOptions').then((res: any) => {
    data.threeColorOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}


// 关闭三色声光
function closeThreeColor() {
  dialogThreeColor.value = false
}

// 提交三色声光
function threeColorSubmint(val: any) {
  const postData
    = val.threeColor

  api.put('/message/publishSatellite/setup3SG', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogThreeColor.value = false
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

// 重置
function reset() {
  data.form = {
    terminalIds: [] as any,
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 导出
function exportXls() {
  ElMessageBox.confirm(
    '此操作将导出该数据，是否导出?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        params: data.form,
        responseType: 'blob' as any,
      }
      api.get('/message/publishSatellite/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '卫星临空信息.xls'
        const url = window.URL.createObjectURL(new Blob([data], blobOptions))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', name + fileSuffix)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }).catch((error) => {
        window.console.log(error)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消导出',
      })
    })
}

// 设置报警
function setAlarm(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    ids: [val.id],
    alarmState: val.alarmState,
  }
  api.put('/message/publishSatellite/changeAlarmState', postData).then((res: any) => {
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
onMounted(() => {
  getList()
  getTerminalOptions()
  getThreeColorOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="16">
          <el-form :inline="true" :model="data.form" label-width="100px">
            <el-form-item label="终端名称：">
              <el-select
                v-model="data.form.terminalIds"
                placeholder="请选择"
                multiple
                filterable clearable
                style="width: 240px;"
              >
                <el-option
                  v-for="i in data.terminalOptions"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList()">
                查询
              </el-button>
              <el-button @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8" class="col-right">
          <el-button v-auth="'ips:sate:del'" type="danger" :disabled="data.selectIds.length === 0" @click="batchDel">
            批量删除
          </el-button>
          <el-button v-auth="'ips:sate:import'" type="primary" @click="openImportDialog()">
            导入
          </el-button>
          <el-button v-auth="'ips:sate:export'" type="primary" @click="exportXls()">
            导出
          </el-button>
          <el-button v-auth="'ips:sate:add'" type="warning" :icon="Plus" @click="clickAdd()">
            新增
          </el-button>
        </el-col>
      </el-row>

      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="true"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #terminalIds="{ item }">
          <el-tag v-for="(v, i) in item.row.terminalIds" v-show="item.row.terminalIds.length > 0" :key="`ter${i}`" type="success" style="margin-right: 10px;">
            {{ selectLabel(v, data.terminalOptions, selectTerminalOption) }}
          </el-tag>
          <span v-show="item.row.terminalIds.length === 0">暂无</span>
        </template>
        <template #alarmState="{ item }">
          <el-switch v-model="item.row.alarmState" inline-prompt :active-value="1" :inactive-value="0" active-text="报警" inactive-text="不报警" @click="setAlarm(item.row)" />
        </template>
        <template #intervalFlag="{ item }">
          <span>{{ item.row.intervalFlag === 1 ? '是' : '否' }}</span>
        </template>
        <template #interval1="{ item }">
          <span>{{ item.row.intervalFlag === 0 ? '无' : item.row.interval1 }}</span>
        </template>

        <template #operation="{ item }">
          <el-button v-auth="'ips:sate:edit'" type="primary" size="small" :disabled="item.row.state === 1 || item.row.state === 2" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-if="item.row.state === 0" v-auth="'ips:sate:publish'" type="primary" plain size="small" @click="clickPublish(item.row)">
            发布
          </el-button>
          <el-button v-if="item.row.state === 1 || item.row.state === 2"  v-auth="'ips:sate:publish'" size="small" @click="cancelPublish(item.row.id)">
            撤销
          </el-button>
          <el-button v-if="item.row.state === 3" type="primary" size="small" disabled>
            已过期
          </el-button>
          <el-button v-auth="'ips:sate:del'" :disabled="item.row.state === 1 || item.row.state === 2" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <satellite v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmit" />
      <publishDialog v-if="dialogPublish" :terminal-options="data.terminalOptions" :info-data="data.publishInfoData" :dialog-visible="dialogPublish" @close-dialog="closePublishDialog" @submit-dialog="publishSubmint" />

      <!-- 设置三色声光弹窗 -->
      <setThreeColorDialog v-if="dialogThreeColor" :three-color-data="data.threeColorData" :dialog-visible="dialogThreeColor" :three-color-options="data.threeColorOptions" @close-dialog="closeThreeColor" @submit-dialog="threeColorSubmint" />
      <!-- 导入弹窗 -->
      <importDialog v-if="dialogImport" :dialog-visible="dialogImport" @close-dialog="closeImportDialog" @submit-dialog="importSubmint" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
