<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'mainCard',
    label: '正常卡卡号',
  },
  // {
  //   prop: 'coercionCardNo', // prop
  //   label: '胁迫卡卡号',
  // },
  {
    prop: 'attacheCard', // prop
    label: '附加卡卡号',
  },
  {
    prop: 'title', // prop
    label: '职位',
  },
  {
    prop: 'department', // prop
    label: '单位',
  },
  {
    prop: 'sex', // prop
    label: '性别',
  },
  // {
  //   prop: 'certificateNo', // prop
  //   label: '证件号',
  // },
  // {
  //   prop: 'headPortrait', // prop
  //   label: '头像',
  // },
])
const total = ref(0) // 总条数
function list() {
  const postData = {
    params: data.form,
  }
  api.get('/door/doorPerson/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
function sync() {
  api.post('/door/doorPerson/sync').then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      list()
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
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
}
onMounted(() => {
  list()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-row>
      <el-col :span="12">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="姓名：">
            <el-input v-model="data.form.name" placeholder="" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="col-right">
        <el-form-item>
          <el-button type="primary" @click="list">
            查询
          </el-button>
          <!--          <el-button type="primary"> -->
          <!--            导出 -->
          <!--          </el-button> -->
          <el-button type="primary" @click="sync">
            同步
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    />
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
