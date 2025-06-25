<!--
 * @Description:气象信息
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 14:17:23
-->

<script lang="ts" setup name="PersonalSetting">
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import meteorological from './components/meteorological.vue'
import publishDialog from './components/publishDialog.vue'
import selectLabel from '@/utils/select'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const selectTerminalOption = {
  getKeyFun: (item: any) => item.id,
  getValueFun: (item: any) => item.name,
}
const formInline = reactive({
  publishingTerminal: '',
})
const data = reactive({
  tableData: [],
  form: {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  },
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  terminalOptions: [] as any,
  publishInfoData: {},
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'weatherTime',
    label: '气象时间',
  },
  {
    prop: 'content',
    slot: 'content',
    label: '气象信息',
  },
  {
    prop: 'lowTmp',
    label: '最低气温（℃）',
  },
  {
    prop: 'highTmp',
    label: '最高气温（℃）',
  },
  {
    prop: 'terminalIds', // prop
    slot: 'terminalIds',
    label: '已发布终端',
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

// 获取列表
function getList() {
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.terminalIds = data.form.terminalIds.toString()
  api.get('/message/publishWeather/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.delete(`/message/publishWeather/delete?id=${id}`).then((res: any) => {
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
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '气象信息'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '气象信息'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/message/publishWeather/add', postData).then((res: any) => {
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
    api.post('/message/publishWeather/edit', postData).then((res: any) => {
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
// 提交发布
function publishSubmint(val: any) {
  const postData = val
  api.put('/message/publishWeather/publish', postData).then((res: any) => {
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
      api.put(`/message/publishWeather/revocation/${id}`).then((res: any) => {
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
// 重置
function reset() {
  data.form = {
    terminalIds: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

function weatherText(item: any) {
  if (item === 'Sunny') {
    return '晴'
  }
  else if (item === 'AllCloudy') {
    return '阴'
  }
  else if (item === 'Rain') {
    return '雨'
  }
  else if (item === 'Snow') {
    return '雪'
  }
  else if (item === 'Cloudy') {
    return '多云'
  }
  else if (item === 'RainShower') {
    return '阵雨'
  }
}
onMounted(() => {
  getList()
  getTerminalOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="formInline" label-width="100px">
            <el-form-item label="发布终端：">
              <el-select
                v-model="data.form.terminalIds"
                placeholder="请选择"
                multiple
                filterable
                clearable
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
        <el-col :span="4" class="col-right">
          <el-button v-auth="'ips:aero:add'" type="warning" @click="clickAdd()">
            新增
          </el-button>
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
        <template #terminalIds="{ item }">
          <el-tag v-for="(v, i) in item.row.terminalIds" v-show="item.row.terminalIds" :key="`ter${i}`" type="success" style="margin-right: 10px;">
            {{ selectLabel(v, data.terminalOptions, selectTerminalOption) }}
          </el-tag>
          <span v-show="!item.row.terminalIds">暂无</span>
        </template>

        <template #content="{ item }">
          <span>{{ weatherText(item.row.content) }}</span>
        </template>

        <template #operation="{ item }">
          <el-button v-auth="'ips:aero:edit'" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-if="item.row.state === 0" v-auth="'ips:aero:publish'" type="primary" plain size="small" @click="clickPublish(item.row)">
            发布
          </el-button>
          <el-button v-if="item.row.state === 1 || item.row.state === 2" v-auth="'ips:aero:publish'" size="small" @click="cancelPublish(item.row.id)">
            撤销
          </el-button>
          <el-button v-if="item.row.state === 3" type="primary" size="small" disabled>
            已过期
          </el-button>
          <el-button v-auth="'ips:aero:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <meteorological v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
      <publishDialog v-if="dialogPublish" :terminal-options="data.terminalOptions" :info-data="data.publishInfoData" :dialog-visible="dialogPublish" @close-dialog="closePublishDialog" @submit-dialog="publishSubmint" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

