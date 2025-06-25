<!--
 * @Description:工具管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:22:30
-->
<script lang="ts" setup name="PersonalSetting">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import toolManagementDialog from './components/toolManagementDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  locationTreeData: [],
  form: {
    goodsSort: '',
    goodsModel: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  times: [],
  multipleSelection: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',
  personnelOptions: [{
    id: '1',
    name: '人员1',
  }, {
    id: '2',
    name: '人员2',
  }, {
    id: '3',
    name: '人员3',
  }],
})
const tableHeader = reactive([
  {
    prop: 'name',
    label: '名称',
  },
  {
    prop: 'goodsNum',
    label: '工具编号',
  },
  {
    prop: 'goodsModel', // prop
    label: '工具型号',
  },
  {
    prop: 'goodsSort', // prop
    label: '配套类型',
  },
  {
    prop: 'inDate', // prop
    label: '配套时间',
  },
  {
    prop: 'position_disp', // prop
    label: '存放位置',
  },
  {
    prop: 'unit', // prop
    label: '计数单位',
  },
  {
    prop: 'standard', // prop
    label: '标准数量',
  },
  {
    prop: 'count', // prop
    label: '实际数量',
  },
  {
    prop: 'inUseCount', // prop
    label: '可用数量',
  },
  {
    prop: 'creatorId', // prop
    label: '责任人',
  },
  {
    prop: 'note', // prop
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
// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '详情'
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
  api.get('/tool/tool/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取位置信息树状列表
const getLocationTree = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.locationTreeData = res.result
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
      api.delete(`/tool/tool/delete?id=${id}`).then((res: any) => {
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
    api.post('/tool/tool/add', postData).then((res: any) => {
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
    api.post('/tool/tool/edit', postData).then((res: any) => {
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
    goodsSort: '',
    goodsModel: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
onMounted(() => {
  getList()
  getLocationTree()
})
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-form :inline="true" :model="data.form" class="demo-form-inline">
        <el-row>
          <el-col :span="20">
            <el-form-item label="配置类型：">
              <el-select v-model="data.form.goodsSort" filterable clearable placeholder="请选择">
                <el-option label="按阵地配套" value="1" />
                <el-option label="按工位配套" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="名称：">
              <el-input v-model="data.form.name" placeholder="" />
            </el-form-item>
            <el-form-item label="工具型号：">
              <el-input v-model="data.form.goodsModel" placeholder="" />
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
      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #operate="{ item }">
          <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">
            详情
          </el-button>
          <el-button v-auth="'fem:tool:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'fem:tool:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <toolManagementDialog v-if="dialogAdd" :location-tree-data="data.locationTreeData" :personnel-options="data.personnelOptions" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @submit-dialog="addSubmit" @close-dialog="closeDialog" />
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

