<!--
 * @Description:仓库操作记录
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 11:47:33
-->
<script lang="ts" setup name="PersonalSetting">
import { ref } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    optType: '',
    itemId: '',
    areaId: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: [],
  multipleSelection: [],
  wareOptions: [] as any,
  itemOptions:[] as any,
  typesOptions: [] as any,
  infoData: {} as any,
  orderNo: '',
  dialogType: 'add',
  dialogTitle: '新增',

})
const tableHeader = reactive([
  {
    prop: 'itemName',
    label: '物料名称',
  },
  {
    prop: 'itemNo',
    label: '物料编号',
  },
  {
    prop: 'optType', // prop
    label: '操作类型',
  },
  {
    prop: 'optTime', // prop
    label: '操作时间',
  },
  {
    prop: 'quantity', // prop
    label: '变更数量',
  },
  {
    prop: 'warehouse', // prop
    label: '仓库',
  },

])
const total = ref(0) // 总条数
const wareProps = {
  value: 'id',
  label: 'name',
}
const itemProps = {
  value: 'id',
  label: 'itemName',
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
  api.get('spare/inventoryEntity/opt', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    optType: '',
    itemId: '',
    areaId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 获取仓库列表
function getWareList() {
  api.get('spare/wareHouse/treeList').then((res: any) => {
    data.wareOptions = res
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取物料列表
function getItemList() {
  api.get('/spare/item/listOptions').then((res: any) => {
    data.itemOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getList()
  getWareList()
  getItemList()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-row>
          <el-col :span="20">

            <el-form-item label="操作类型：">
              <el-select v-model="data.form.optType" filterable clearable class="formInput">
                <el-option label="采购" :value="11" />
                <el-option label="借出归还" :value="12" />
                <el-option label="使用归还" :value="13" />
                <el-option label="借用" :value="22" />
                <el-option label="使用" :value="21" />
                <el-option label="移库" :value="30" />
                <el-option label="盘库" :value="40" />
              </el-select>
            </el-form-item>
            <el-form-item label="物料：">
              <el-tree-select v-model="data.form.itemId" clearable default-expand-all node-key="id" :props="itemProps"
                :data="data.itemOptions" />
            </el-form-item>
            <el-form-item label="仓库：">
              <el-tree-select c v-model="data.form.areaId" clearable default-expand-all node-key="id"
                :props="wareProps" :data="data.wareOptions" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="getList()">
                查询
              </el-button>
              <el-button type="info" plain @click="reset()">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <CommonTable :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
        :is-select="false" @size-change="sizeChange" @current-change="currentChange">
      </CommonTable>

    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

