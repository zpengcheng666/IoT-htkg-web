<!--
 * @Description:入库管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 09:51:39
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import addReceiptDialog from './components/addReceiptDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    orderType: '',
    orderNo: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: [],
  multipleSelection: [],
  typesOptions: [] as any,
  supplierOptions: [] as any,
  infoData: {} as any,
  orderNo: '',
  dialogType: 'add',
  dialogTitle: '新增',

})
const tableHeader = reactive([
  {
    prop: 'orderNo',
    label: '入库单号',
  },
  {
    prop: 'orderTypeName',
    label: '入库类型',
  },
  {
    prop: 'supplierId', // prop
    label: '供应商',
  },
  {
    prop: 'receiptDate', // prop
    label: '入库日期',
  },
  {
    prop: 'useName', // prop
    label: '负责人',
  },
  {
    prop: 'remark', // prop
    label: '备注',
  },

  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '230px',
  },
])
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
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
  data.infoData = { items: [] }
  getNo()
  data.infoData.orderNo = data.orderNo
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  getInfo(row.id)
  // data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('spare/receipt/page', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 查看详情
function getInfo(id: any) {
  api.get('spare/receipt/getById/' + id).then((res: any) => {
    data.infoData = res.result
    data.dialogType = 'info'
    dialogAdd.value = true
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
      api.delete(`spare/receipt/delete?id=${id}`).then((res: any) => {
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
// 提交新增
function addSubmit(val: any) {
  console.log(val);
  const postData = JSON.parse(JSON.stringify(val))

  postData.items = postData.items.map((v: any) => {
    return {
      areaId: v.areaId,
      itemId: v.id,
      quantity: v.quantity,
      warehouseId: v.warehouseId,
    }
  })


  if (data.dialogType === 'add') {
    api.post('spare/receipt/add', postData).then((res: any) => {
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
    api.post('spare/receipt/edit', postData).then((res: any) => {
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
// 重置
function reset() {
  data.form = {
    orderType: '',
    orderNo: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}


// 获取类型
function getTypes() {
  const postData = {
    params: data.form,
  }
  api.get('spare/receipt/getTypes', postData).then((res: any) => {
    data.typesOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取供应商下拉
function getSupplierOptions() {
  const postData = {
    params: data.form,
  }
  api.get('spare/carrier/listOptions', postData).then((res: any) => {
    data.supplierOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取入库编号
function getNo() {
  const postData = {
    params: data.form,
  }
  api.get('spare/receipt/getNo', postData).then((res: any) => {
    data.orderNo = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getList()
  getTypes()
  getSupplierOptions()
  getNo()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-row>
          <el-col :span="20">

            <el-form-item label="单号：">
              <el-input v-model="data.form.orderNo" placeholder="" />
            </el-form-item>
            <el-form-item label="入库类型：">
              <el-select v-model="data.form.orderType" filterable clearable class="formInput">
                <el-option v-for="item in data.typesOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
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
          <el-col v-auth="'fem:tool:add'" :span="4" class="col-right">
            <el-button type="warning" @click="clickAdd()">
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <CommonTable :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
        :is-select="false" @size-change="sizeChange" @current-change="currentChange">
        <template #operate="{ item }">

          <el-button v-auth="'fem:tool:edit'" type="primary" size="small" :dark="true" @click="getInfo(item.row.id)">
            查看详情
          </el-button>
          <!-- <el-button v-auth="'fem:tool:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button> -->
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addReceiptDialog v-if="dialogAdd" :supplier-options="data.supplierOptions" :types-options="data.typesOptions"
        :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData"
        @submit-dialog="addSubmit" @close-dialog="closeDialog" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

