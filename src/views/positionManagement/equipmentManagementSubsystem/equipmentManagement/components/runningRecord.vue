<script setup lang='ts'>
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({

  // 通过点击树获取的属性id
  devId: {
    type: String,
    default: '',
  },

})
const data = reactive({
  tableData: [],
  form: {
    devId: props.devId,
    pageNo: 1,
    pageSize: 30,
  },

})
const total = ref(0) // 总条数
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'devId_disp',
    label: '设备名称',
  },
  {
    prop: 'startTime',
    label: '启动时间',
  },
  {
    prop: 'stopTime', // prop
    label: '停止时间',
  },
  {
    prop: 'duration', // prop
    label: '本次运行时长',
  },
  {
    prop: 'totalDuration', // prop
    label: '累计运行时长',
  },
  // {
  //   label: '操作',
  //   slot: 'operate',
  //   fixed: 'right',
  //   width: '160px',
  // },
])
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
  api.get('/facility/deviceBI/runLogList', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
})
</script>

<template>
  <CommonTable
    :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
    :is-select="false" @size-change="sizeChange" @current-change="currentChange"
  >
    <!-- <template #operate="{ item }">
      <el-button type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
        编辑
      </el-button>
      <el-button type="danger" size="small" @click="del(item.row.id)">
        删除
      </el-button>
    </template> -->
  </CommonTable>
</template>

<style lang="scss" scoped>
.formInput {
  width: 100%;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
