<!--
 * @Description:服务管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 10:59:30
-->
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import addEagDialog from './components/addEagDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  tagList: [{
    name: '',
    id: '',
  }],
  tagInfo: {
    id: '',
    ip: '',
    port: '',
    lastUpdateTime: '',
    userName: '',
    password: '',
  },
  tableData: [],
  form: {
    wgid: '',
    name: '',
    pageNo: 1,
    pageSize: 30,
  },
  dialogType: 'add',
  dialogTitle: '新增',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '点位名称',
  },
  {
    prop: 'deviceType',
    label: '设备类型',
  },
  {
    prop: 'deviceName', // prop
    label: '设备名称',
  },
  {
    prop: 'dataType', // prop
    label: '数据类型',
  },
  {
    prop: 'note', // prop
    label: '描述信息',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
// 分页改变事件
const sizeChange = (val: number) => {
  data.form.pageSize = val
  getPointList(data.tagInfo)
}
// 当前页改变事件
const currentChange = (val: number) => {
  data.form.pageNo = val
  getPointList(data.tagInfo)
}

// 获取网关列表
function getTagList() {
  api.get('/scada/conWangGuan/list').then((res: any) => {
    data.tagList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取点位
function getPointList(val: any) {
  data.tagInfo = val
  data.form.wgid = val.id
  const postData = {
    params: data.form,
  }
  api.get('api/scada/ConDianWei/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form.name = ''
  getPointList(data.tagInfo)
}

// 加载在线点位
function getNewPointList() {
  ElMessageBox.confirm(
    '此操作将加载在线点位，是否继续?',
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
      }
      api.get('api/scada/ConDianWei/syncdata', postData).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
          data.tableData = res.result.records
          total.value = res.result.total
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

// 点击编辑
function clickEdit(row: any) {
  if (!data.tagInfo.id) {
    ElMessage({
      type: 'error',
      message: '请选择',
    })
    return false
  }
  data.dialogType = 'edit'
  data.dialogTitle = '编辑'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.tagInfo = {
    id: '',
    ip: '',
    port: '',
    lastUpdateTime: '',
    userName: '',
    password: '',
  }
  getCode()
  data.dialogType = 'add'
  data.dialogTitle = '新增'
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 删除EAG
function delEag(id: string) {
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
      api.delete(`scada/conWangGuan/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getTagList()
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
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('scada/conWangGuan/add', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getTagList()
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
    api.post('scada/conWangGuan/edit', postData).then((res: any) => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: res.message,
        })
        dialogAdd.value = false
        getTagList()
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

// 获取id
function getCode() {
  api.get('/scada/conWangGuan/getCode').then((res: any) => {
    if (res.code === 200) {
      data.tagInfo.id = res.result
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

onMounted(() => {
  getTagList()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row class="el-row-wrap">
      <el-col :span="4">
        <div class="btn-group">
          <el-button v-auth="'config:service:add'" type="primary" size="small" @click="clickAdd">
            新增
          </el-button>
          <el-button v-auth="'config:service:edit'" type="primary" :disabled="data.tagList.length === 0" size="small" @click="clickEdit">
            编辑
          </el-button>
          <el-button v-auth="'config:service:del'" type="primary" :disabled="data.tagList.length === 0" size="small" @click="delEag(data.tagInfo.id)">
            删除
          </el-button>
        </div>
        <div class="btn-tag-group">
          <el-check-tag v-for="(v, i) in data.tagList" :key="i" class="btn-tag" :checked="data.tagInfo.id === v.id ? true : false " @change="getPointList(v)">
            {{ v.name }}
          </el-check-tag>
        </div>
      </el-col>
      <el-col :span="20">
        <el-form :inline="true" :model="data.tagInfo" class="demo-form-inline" label-width="90px">
          <el-form-item label="加载时间">
            <el-input v-model="data.tagInfo.lastUpdateTime" />
          </el-form-item>
          <el-form-item label="识别码">
            <el-input v-model="data.tagInfo.id" />
          </el-form-item>
          <el-form-item label="通信地址">
            <el-input v-model="data.tagInfo.ip" />
          </el-form-item>
          <el-form-item label="通信端口">
            <el-input v-model="data.tagInfo.port" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="data.tagInfo.userName" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="data.tagInfo.password" />
          </el-form-item>
        </el-form>

        <el-row class="row-border">
          <el-col :span="10">
            点位数据
            <el-input v-model="data.form.name" style="width: 200px;margin-right: 10px;" placeholder="请输入点位名称" />
            <el-button type="primary" :disabled=" data.form.wgid === ''" @click="getPointList(data.tagInfo)">
              查询
            </el-button>
            <el-button type="info" plain :disabled=" data.form.wgid === ''" @click="reset()">
              重置
            </el-button>
          </el-col>
          <el-col :span="4" :offset="10" class="col-right">
            <el-button v-auth="'config:service:sync'" type="primary" @click="getNewPointList()">
              数据同步
            </el-button>

          </el-col>
        </el-row>

        <CommonTable
          :table-data="data.tableData" max-height="400px" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
          :is-select="false" @size-change="sizeChange" @current-change="currentChange"
        />
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <addEagDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.tagInfo" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  padding: 0;
}

.el-row {
  height: calc(100vh - 294px);

  .el-row .el-row {
    height: auto;
  }
}

.el-row .el-col {
  height: 100%;
}

.el-row-wrap > .el-col:first-child {
  background: #e3e5e3;
}

.el-row > .el-col:last-child {
  padding: 0 10px;
}

.btn-group {
  display: flex;
  justify-content: center;
  padding-top: 10px;

  .btn-group button {
    padding: 5px 8px;
  }
}

.btn-tag-group {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 10px;

  .btn-tag {
    cursor: pointer;
    margin-left: 15px;
    margin-top: 10px;
  }
}

.el-form {
  padding: 10px;
}

.el-form--inline .el-form-item {
  width: calc(100%/3 - 40px);
}

.row-border {
  border: 1px solid #ebeef5;
  border-bottom: none;
  padding: 0.5rem;
  height: auto;
}

:deep(.table) {
  margin-top: 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
