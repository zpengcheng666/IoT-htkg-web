<!--
 * @Description:库存看板
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-17 09:28:02
-->
<script lang="ts" setup name="PersonalSetting">
import { ref } from 'vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    areaId: '',
    itemId: '',
    warehouseId: '',
    pageNo: 1,
    pageSize: 30,
  },
  maintenancePlanOptions: [],
  wareOptions: [] as any,
  itemOptions: [] as any,
  infoData: {},
  dialogType: 'add',
  dialogTitle: '保养任务',
})
// 表头数据  辅助tableData的数据 tableData是自己定义


const total = ref(0) // 总条数

const activeName = ref('1')

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
  if (activeName.value === '1') {
    // 根据仓库查询
    api.get('/spare/inventoryEntity/pageByWarehouse', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  } else if (activeName.value === '2') {
    // 根据库区查询
    api.get('/spare/inventoryEntity/pageByArea', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  } else if (activeName.value === '3') {
    // 根据物料查询
    api.get('/spare/inventoryEntity/pageByItem', postData).then((res: any) => {
      data.tableData = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  }

}

function reset() {
  data.form = {
    areaId: '',
    itemId: '',
    warehouseId: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}

// 点击tab
function clcikTab(val: any) {
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
// 合并事件
const spanMethod = (val: any) => {
  if (activeName.value === '1') {
    // 仓库合并

    if (data.tableData.length > 1) {
      if (val.columnIndex === 0) {
        if (val.row.warehouseCount > 0) {
          //通过行属性rowspan判断
          return {
            //自定义行列排列 （意在第一列、行中属性rowspan>=1的行往下合并一行一列）
            rowspan: val.row.warehouseCount, //自定义行数，
            colspan: 1            //自定义列数
          };
        } else {
          //没有满足条件的判断
          return {
            //不做操作
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  } else if (activeName.value === '2') {
    // 库区合并

    if (data.tableData.length > 1) {
      if (val.columnIndex === 0) {
        if (val.row.warehouseCount > 0) {
          //通过行属性rowspan判断
          return {
            //自定义行列排列 （意在第一列、行中属性rowspan>=1的行往下合并一行一列）
            rowspan: val.row.warehouseCount, //自定义行数，
            colspan: 1            //自定义列数
          };
        } else {
          //没有满足条件的判断
          return {
            //不做操作
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (val.columnIndex === 1) {
        if (val.row.areaCount > 0) {
          return {
            //自定义行列排列 （意在第一列、行中属性rowspan>=1的行往下合并一行一列）
            rowspan: val.row.areaCount, //自定义行数，
            colspan: 1            //自定义列数
          };
        } else {
          //没有满足条件的判断
          return {
            //不做操作
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  } else if (activeName.value === '3') {
    // 物料合并
    if (data.tableData.length > 1) {
      if (val.columnIndex === 0 || val.columnIndex === 1 || val.columnIndex === 2) {
        if (val.row.itemCount > 0) {
          //通过行属性rowspan判断
          return {
            //自定义行列排列 （意在第一列、行中属性rowspan>=1的行往下合并一行一列）
            rowspan: val.row.itemCount, //自定义行数，
            colspan: 1            //自定义列数
          };
        } else {
          //没有满足条件的判断
          return {
            //不做操作
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }


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
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="clcikTab">
        <el-tab-pane label="仓库" name="1"></el-tab-pane>
        <el-tab-pane label="库区" name="2"></el-tab-pane>
        <el-tab-pane label="物料" name="3"></el-tab-pane>
      </el-tabs>
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="data.form" class="demo-form-inline">
            <el-form-item label="库区">
              <el-tree-select v-model="data.form.areaId" clearable default-expand-all node-key="id" :props="wareProps"
                :data="data.wareOptions" />
            </el-form-item>
            <el-form-item label="物料">
              <el-tree-select v-model="data.form.itemId" clearable default-expand-all node-key="id" :props="itemProps"
                :data="data.itemOptions" />
            </el-form-item>

            <el-form-item label="">
              <el-button type="primary" @click="getList()">
                查询
              </el-button>
              <el-button type="info" plain @click="reset()">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <CommonTable v-if="activeName === '1'" :table-data="data.tableData" :table-header="tableHeader1" :total="total"
        :size="data.form.pageSize" :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        @selection-change="selectionChange">
      </CommonTable> -->
      <el-table v-if="activeName === '1'" :data="data.tableData" :span-method="spanMethod" border style="width: 100%;">
        <el-table-column prop="warehouseName" label="仓库">
          <template #default="scope">
            <span>{{ scope.row.warehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemType" label="物料类型" />
        <el-table-column prop="itemNo" label="物料编码" />
        <el-table-column prop="itemName" label="物料名称" />
        <el-table-column prop="quantity" label="库存" />
      </el-table>
      <!-- <CommonTable v-if="activeName === '2'" :table-data="data.tableData" :table-header="tableHeader2" :total="total"
        :size="data.form.pageSize" :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        @selection-change="selectionChange">
      </CommonTable> -->
      <el-table v-if="activeName === '2'" :data="data.tableData" :span-method="spanMethod" border style="width: 100%;">
        <el-table-column prop="warehouseName" label="仓库" />
        <el-table-column prop="areaName" label="库区" />
        <el-table-column prop="itemType" label="物料类型" />
        <el-table-column prop="itemNo" label="物料编码" />
        <el-table-column prop="itemName" label="物料名称" />
        <el-table-column prop="quantity" label="库存" />
      </el-table>
      <!-- <CommonTable v-if="activeName === '3'" :table-data="data.tableData" :table-header="tableHeader3" :total="total"
        :size="data.form.pageSize" :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        @selection-change="selectionChange">
      </CommonTable> -->
      <el-table v-if="activeName === '3'" :data="data.tableData" :span-method="spanMethod" border style="width: 100%;">
        <el-table-column prop="itemType" label="物料类型" />
        <el-table-column prop="itemNo" label="物料编码" />
        <el-table-column prop="itemName" label="物料名称" />
        <el-table-column prop="quantity" label="库存" />
        <el-table-column prop="warehouseName" label="仓库/库区">
          <template #default="scope">
            <span>{{ scope.row.warehouseName }}/{{ scope.row.areaName }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :background="true" class="pagination" small :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="data.form.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChange" @current-change="currentChange" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}

.pagination {
  float: right;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.table_box {
  overflow-y: auto;
}
</style>

