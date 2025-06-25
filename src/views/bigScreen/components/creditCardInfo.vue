<script lang="ts" setup name="PersonalSetting">
import type { UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  terminalInfo: {
    type: Array<any>,
    default() {
      return []
    },
  },

})
const data = reactive({
  tableData: [],
  form: {
    terminalId: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  },

  times: '',
  infoData: {},
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'doorName',
    label: '门名称',
  },
  {
    prop: 'doorType',
    label: '门类型',
  },
  {
    prop: 'perName', // prop
    label: '人员名称',
  },
  {
    prop: 'perDept', // prop
    label: '单位',
  },
  {
    prop: 'perTitle', // prop
    label: '职务',
  },
  {
    prop: 'cardCode', // prop
    label: '卡号',
  },
  {
    prop: 'swipeTime', // prop
    label: '刷卡时间',
  },
  {
    prop: 'accessType', // prop
    label: '进出类型',
  },
  {
    prop: 'openType', // prop
    label: '开门类型',
  },
  {
    prop: 'cardResult', // prop
    label: '刷卡结果',
  },

])

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
// 获取列表
function getList() {
  // console.log(params)
  if (data.times !== null && data.times.length > 0) {
    data.form.startTime = data.times[0]
    data.form.endTime = data.times[1]
  }
  else {
    data.form.startTime = ''
    data.form.endTime = ''
  }
  const postData = {
    params: data.form,
  }
  api.get('door/doorData/pageByTerminalId', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  // data.form.terminalId = props.terminalId
  // getList()
})
// 重置
function reset() {
  data.form = {
    terminalId: '',
    startTime: '',
    endTime: '',
    pageNo: 1,
    pageSize: 30,
  }
  data.times = ''
  getList()
}
</script>

<template>
  <div>
    <!-- <el-form :inline="true" :model="data.form" class="demo-form-inline" label-width="100px">
      <el-form-item label="时间范围：">
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
      <el-form-item label=" ">
        <el-button type="primary" @click="getList()">
          查询
        </el-button>
        <el-button type="info" plain @click="reset()">
          重置
        </el-button>
      </el-form-item>
    </el-form> -->
    <CommonTable
      :table-data="props.terminalInfo"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      :is-page="false"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
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

