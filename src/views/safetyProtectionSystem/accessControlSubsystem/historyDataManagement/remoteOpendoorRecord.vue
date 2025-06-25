<!--
 * @Description:远程开门
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-13 08:58:16
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-18 14:28:10
-->

<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    doorIds: [] as Array<string>,
    perName: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  devDoorOptions: [{ // 门名称下拉数据
    id: '',
    name: '',
  }],
  times: '',
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '远程开门记录',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'doorName',
    label: '门名称',
  },
  {
    slot: 'doorType',
    prop: 'doorType',
    label: '门类型',
  },
  {
    prop: 'perName', // prop
    label: '操作人员',
  },
  {
    prop: 'swipeTime', // prop
    label: '操作时间',
  },
  {
    prop: 'openType', // prop
    label: '开门类型',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '140px',
  },
])

const total = ref(0) // 总条数

// 多选事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.tableData)
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

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('door/doorData/remoteOpen', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    doorIds: [] as Array<string>,
    perName: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
  getList()
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
      api.delete(`door/doorData/delete?id=${id}`).then((res: any) => {
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

// 获取门名称下拉
function getDoorOptions() {
  api.get('scada/conSheBei/conSheBeiDoorOptiongs').then((res: any) => {
    data.devDoorOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.get('/door/doorData/openDoor/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '远程开门记录.xls'
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
onMounted(() => {
  getList()
  getDoorOptions()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline" label-width="100px">
        <el-form-item label="门名称：">
          <el-select v-model="data.form.doorIds" :filterable="true" :clearable="true" :multiple="true" placeholder="请选择门名称">
            <el-option
              v-for="item in data.devDoorOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="人员姓名：">
          <el-input v-model="data.form.perName" placeholder="" />
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker
            v-model="data.form.startTime"
            style="width: 100%;"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="data.form.endTime"
            style="width: 100%;"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" @click="getList()">
            查询
          </el-button>
          <el-button type="info" plain @click="reset()">
            重置
          </el-button>
          <el-button v-auth="'access:open:export'" type="primary" @click="exportXls()">
            导出
          </el-button>
        </el-form-item>
      </el-form>
      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
      >
        <template #doorType="{ item }">
          <span>{{ item.row.doorType === 'one' ? '单向门' : '双向门' }}</span>
        </template>

        <template #operate="{ item }">
          <el-button v-auth="'access:open:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗或编辑 -->
    </page-main>
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
