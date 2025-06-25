<!--
 * @Description:站点管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 10:58:32
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Delete,
  Edit,
  Operation,
  Plus,
} from '@element-plus/icons-vue'
import { reactive } from 'vue'
import AddSite from './components/addSite.vue'
import GatewayList from './components/gatewayList.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogType: 'add',
  dialogTitle: '新增',
  id: '',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = [
  {
    prop: 'name',
    label: '站点名称',
  },
  {
    prop: 'siteCode',
    label: '站点编号',
  },
  {
    prop: 'ip',
    label: '站点ip',
  },
  {
    prop: 'port', // prop
    label: '站点端口',
  },
  {
    prop: 'siteState', // prop
    label: '站点状态',
    slot: 'siteState',
  },
  {
    prop: 'gateway', // prop
    label: '网关',
    slot: 'gateway',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
]
const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const sizeChange = (val: number) => {
  data.form.pageSize = val
  list()
}
const currentChange = (val: number) => {
  data.form.pageNo = val
  list()
}

function list() {
  api.get('scada/siteManager/list').then((res: any) => {
    data.tableData = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}


function clickEdit(row: any) {
  data.id = row.id
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

function clickAdd() {
  data.id = ''
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}
// 删除
function clickDel(id: string) {
  if (!id) {
    ElMessage({
      type: 'error',
      message: '请选择',
    })
    return false
  }
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
      api.delete(`/scada/siteManager/delete?id=${id}`).then((res: any) => {
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
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// 新增提交
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/scada/siteManager/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
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
  else if (data.dialogType === 'edit') {
    api.post('scada/siteManager/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
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
}
// 站点状态开关方法
const changeState = (row: any) => {
  const data = {
    siteId: row.id,
    siteState: row.siteState,
  }
  api.put('scada/siteManager/updateState', data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
    }
    list()
  }).catch((error) => {
    window.console.log(error)
    list()
  })
}
const gatewayList = reactive({
  dialog: false,
  list: [],
  id: '',
  gatewayList: [],
})
// 点击配置网关
const clickGatewayList = (row: any) => {
  gatewayList.id = row.id
  gatewayList.list = row.gatewayList.map((i: { id: any }) => i.id)
  gatewayList.dialog = true
}

// 提交配置网关
const submitGatewayList = () => {
  const gList = gatewayList.list.map((i) => {
    return {
      id: i,
    }
  })
  const data = {
    id: gatewayList.id,
    gatewayList: gList,
  }
  api.post('scada/siteManager/saveGatewayList', data).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      gatewayList.dialog = false
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
    list()
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  list()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="22">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="站点名称：">
            <el-input v-model="data.form.name" placeholder="输入站点名称" clearable />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="list">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button type="warning" :icon="Plus" @click="clickAdd">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :current="data.form.pageNo"
      :is-select="false"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #operate="{ item }">
        <el-button type="primary" :icon="Edit" :dark="true" @click="clickEdit(item.row)" />
        <el-button type="primary" :icon="Operation" :dark="true" @click="clickGatewayList(item.row)" />
        <el-button type="danger" :icon="Delete" :dark="true" @click="clickDel(item.row.id)" />
      </template>
      <template #gateway="{ item }">
        <el-tag v-for="g in item.row.gatewayList" :key="g.id" type="success">
          {{ g.name }}
        </el-tag>
      </template>
      <template #siteState="{ item }">
        <el-switch
          v-model="item.row.siteState"
          inline-prompt
          :active-value="1"
          :inactive-value="0"
          active-text="中控"
          inactive-text="站控"
          @click="changeState(item.row)"
        />
      </template>
    </CommonTable>
    <AddSite v-if="dialogAdd" :id="data.id" v-model="dialogAdd" @submit-dialog="addSubmit" />
    <el-dialog
      v-model="gatewayList.dialog"
      title="配置网关"
      destroy-on-close
    >
      <GatewayList v-model="gatewayList.list" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="gatewayList.dialog = false">关闭</el-button>
          <el-button type="primary" @click="submitGatewayList()">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </page-main>
</template>

<style lang="scss" scoped>
.el-form-item__content {
  position: relative;

  .form-ms {
    position: absolute;
    top: 90%;
    color: #999;
  }
}
</style>
