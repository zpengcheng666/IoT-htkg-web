<!--
 * @Description:物料管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 09:48:11
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import addItemDialog from './components/addItemDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    itemName: '',
    itemNo: '',
    itemType: '',
    expiryDate: '',
    pageNo: 1,
    pageSize: 30,
  },
  groudOptions: [] as any,
  wareOptions: [],
  times: [],
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',

})
const tableHeader = reactive([
  {
    prop: 'itemNo',
    label: '编号',
  },
  {
    prop: 'itemName',
    label: '名称',
  },
  {
    prop: 'specification',
    label: '规格',
  },
  {
    prop: 'itemTypeName', // prop
    label: '分类',
  },
  // {
  //   prop: 'areaId_disp', // prop
  //   label: '所属仓库',
  // },
  // {
  //   prop: 'areaId_disp', // prop
  //   label: '所属库区',
  // },
  {
    prop: 'quantity', // prop
    label: '安全库存',
  },
  {
    prop: 'unit', // prop
    label: '单位',
  },
  {
    prop: 'expiryDate', // prop
    label: '有效期',
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

const groupProps = {
  value: 'id',
  label: 'typeName',
}

const wareProps = {
  value: 'id',
  label: 'name',
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
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
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
  api.get('spare/item/list', postData).then((res: any) => {
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
      api.delete(`spare/item/delete?id=${id}`).then((res: any) => {
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

  const postData = val


  if (data.dialogType === 'add') {
    api.post('spare/item/add', postData).then((res: any) => {
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
    api.post('spare/item/edit', postData).then((res: any) => {
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

// 获取分类列表
function getClassList() {
  const postData = {
    params: data.form,
  }
  api.get('spare/materialClassification/queryTreeList', postData).then((res: any) => {
    data.groudOptions = res.result
    for (const i in data.groudOptions) {
      if (data.groudOptions[i].status === 1) {
        data.groudOptions[i].disabled = false
      } else {
        data.groudOptions[i].disabled = true
      }
      for (const j in data.groudOptions[i].children) {
        if (data.groudOptions[i].children[j].status === 1) {
          data.groudOptions[i].children[j].disabled = false
        } else {
          data.groudOptions[i].children[j].disabled = true
        }
      }
    }
    console.log(data.groudOptions);

  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取仓库列表
function getWareList() {
  api.get('spare/wareHouse/treeList').then((res: any) => {
    data.wareOptions = res
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form = {
    itemName: '',
    itemNo: '',
    itemType: '',
    expiryDate: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
onMounted(() => {
  getList()
  getClassList()
  getWareList()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-row>
          <el-col :span="20">

            <el-form-item label="编号：">
              <el-input v-model="data.form.itemNo" placeholder="" />
            </el-form-item>
            <el-form-item label="名称：">
              <el-input v-model="data.form.itemName" placeholder="" />
            </el-form-item>
            <el-form-item label="分类" placeholder="请输入" prop="itemType">
              <el-tree-select v-model="data.form.itemType" clearable default-expand-all node-key="id" check-strictly
                :props="groupProps" :data="data.groudOptions" />
            </el-form-item>

            <!-- <el-form-item label="所属库区" placeholder="请输入"  prop="areaId">
              <el-tree-select   v-model="data.form.areaId" clearable default-expand-all node-key="id"  :props="wareProps" :data="data.wareOptions"  />
            </el-form-item> -->

            <!-- <el-form-item label="有效期" placeholder="请输入" >
              <el-date-picker
                v-model="data.form.expiryDate"
                style="width: 150px;"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item> -->

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

          <el-button v-auth="'fem:tool:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'fem:tool:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <addItemDialog v-if="dialogAdd" :groud-options="data.groudOptions" :ware-options="data.wareOptions"
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

