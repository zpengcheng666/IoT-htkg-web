<script lang="ts" setup>
// import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    operateContent: '',
    username: '',
    stateTime: '',
    beginTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: '',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'username',
    label: '用户名',
  },
  {
    prop: 'stateTime',
    label: '操作时间',
  },
  {
    prop: 'operateContent',
    label: '操作',
  },
  // {
  //   label: '操作',
  //   slot: 'operation',
  //   fixed: 'right',
  //   width: '200px',
  // },
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
const shortcuts = [
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
// 重置
function reset() {
  data.form = {
    operateContent: '',
    username: '',
    stateTime: '',
    beginTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
  getList()
}
// 获取列表
function getList() {
  // console.log(params)
  if (data.times !== null && data.times.length > 0) {
    data.form.beginTime = data.times[0]
    data.form.endTime = data.times[1]
  }
  else {
    data.form.beginTime = ''
    data.form.endTime = ''
  }
  const postData = {
    params: data.form,
  }
  api.get('system/baseLog/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
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
      api.delete(`system/baseLog/delete?id=${id}`).then((res: any) => {
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
      api.get('/system/baseLog/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '业务日志.xls'
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
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row>
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-form-item label="用户名：">
          <el-input v-model="data.form.username" placeholder="" />
        </el-form-item>
        <el-form-item label="操作内容：">
          <el-input v-model="data.form.operateContent" placeholder="" />
        </el-form-item>

        <el-form-item label="操作时间：">
          <el-date-picker
            v-model="data.times"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()">
            查询
          </el-button>
          <el-button type="primary" plain @click="reset()">
            重置
          </el-button>
          <el-button type="primary" @click="exportXls()">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <!-- <template #operation="{ item }"> -->
      <!-- <el-button type="primary" size="small" :dark="true">
          编辑
        </el-button> -->
      <!-- <el-button type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button> -->
      <!-- </template> -->
    </CommonTable>
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
