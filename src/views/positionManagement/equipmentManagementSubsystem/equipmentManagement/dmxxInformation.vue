tool management<route lang="yaml">
name: personalSetting
meta:
title: 地面信息
cache: personal-edit.password
</route>

<script lang="ts" setup name="PersonalSetting">
import AddDmxxInformation
  from "@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/components/addDmxxInformation.vue";
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addDieselGenerator from './components/addDieselGenerator.vue'
import uploadImgDialogDev from './components/uploadImgDialogDev.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'

const defaultProps = {
  children: 'childs',
  label: 'title',
  id: 'id',
  value: 'id',
}

const data = reactive({
  tableData: [],
  treeData: [],
  locationTreeData: [],
  form: {
    szwz: '',
    ssmc: '',
    name: '',
    zgCode: '',
    devModel: '',
    classId: '',
    site: '',
    pageNo: 1,
    pageSize: 30,

  },
  infoData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增属性字典',

})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'id',
    label: '序号',
  },
  {
    prop: 'szwz_disp',
    label: '所在位置',
  },
  {
    prop: 'ssmc',
    label: '设施名称',
  },
  {
    prop: 'mj',
    label: '面积（m2）',
  },
  {
    prop: 'zxfs',
    label: '装修方式',
  },
  {
    prop: 'zlzk',
    label: '质量状况',
  },

  {
    prop: 'glfd',
    label: '管理分队',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '300px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗
const dialogUpload = ref(false)// 上传图片

// 获取设备类别树状列表
const getTree = () => {
  const param = {}
  api.get('facility/deviceType/queryTreeList', param).then((res: any) => {
    data.treeData = res.result
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

onMounted(() => {
  getList()
  getTree()
  getLocationTree()
})
// 位置类别
function getAlarmType(val: any) {
  data.form.site = val
}

// 获取列表
function getList() {
  // console.log(params)
  const postData = {
    params: data.form,
  }
  api.get('/deviceManager/dmxx/list', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}
// 重置
function reset() {
  data.form = {
    szwz: '',
    ssmc: '',
    name: '',
    zgCode: '',
    devModel: '',
    classId: '',
    site: '',
    pageNo: 1,
    pageSize: 30,
  }
  getList()
}
// 点击上传图片
function uploadImg(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  dialogUpload.value = true
}
// 删除
function del(id: string) {
  // return false
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
      api.delete(`/deviceManager/dmxx//delete?id=${id}`).then((res: any) => {
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
// 点击查看
function clickView(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'info'
  data.dialogTitle = '详情'
  dialogAdd.value = true
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
  data.dialogTitle = '新增地面信息'
  dialogAdd.value = true
}
// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  // console.log(row)
  // data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑地面信息'
  dialogAdd.value = true
}
function closeUploadImgDialog() {
  dialogUpload.value = false
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}
// 导出
function exportXls() {
  ElMessageBox.confirm(
    '此操作将导出该数据，是否导出?',
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
        responseType: 'blob' as any,
      }
      api.get('/deviceManager/dmxx/exportXls', postData).then((data: any) => {
        const blobOptions = { type: 'application/vnd.ms-excel' }
        const fileSuffix = '地面信息.xls'
        const url = window.URL.createObjectURL(new Blob([data], blobOptions))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', name + fileSuffix)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }).catch((error) => {
        window.console.log(error)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消导出',
      })
    })
}
// 上传图片提交
function addUploadImgSubmit(val: any) {
  const postData = {
    id: data.infoData.id,
    imgUrls: val.join(','),
  }
  api.post('/system/filesUtil/saveImgDevice', postData).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      dialogUpload.value = false
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
// 提交新增
function addSubmit(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('/deviceManager/dmxx/add', postData).then((res: any) => {
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
    api.post('/deviceManager/dmxx//edit', postData).then((res: any) => {
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
</script>

<template>
  <div>
    <page-main class="pageBox">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="data.form">
            <el-form-item label="设施名称：">
              <el-input v-model="data.form.ssmc" placeholder="" small />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" small @click="getList()">
                查询
              </el-button>
              <el-button type="info" plain small @click="reset()">
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="col-right">
          <!-- <el-button type="primary" small>
            导入
          </el-button> -->
          <el-button type="primary" @click="exportXls()">
            导出
          </el-button>
          <el-button v-auth="'dmxx:equipment:add'" type="warning" small @click="clickAdd()">
            新增
          </el-button>
        </el-col>
      </el-row>

      <CommonTable
        :table-data="data.tableData"
        :table-header="tableHeader"
        :total="total"
        :size="data.form.pageSize"
        :is-select="false"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template #operation="{ item }">
<!--          <el-button type="primary" size="small" :dark="true" @click="clickView(item.row)">-->
<!--            详情-->
<!--          </el-button>-->
          <!-- <el-button v-auth="'fem:equipment:edit'" type="primary" size="small" @click="uploadImg(item.row)">
            上传图片
          </el-button> -->
          <el-button v-auth="'dmxx:equipment:edit'" type="primary" size="small" @click="clickEdit(item.row)">
            编辑
          </el-button>
          <el-button v-auth="'dmxx:equipment:del'" type="danger" size="small" @click="del(item.row.id)">
            删除
          </el-button>
        </template>
      </CommonTable>
      <!-- 新增弹窗 -->
      <add-dmxx-information v-if="dialogAdd" :location-tree-data="data.locationTreeData" :tree-data="data.treeData" :title="data.dialogTitle" :dialog-type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submit-dialog="addSubmit" />
      <!-- <uploadImgDialogDev v-if="dialogUpload" :dialog-visible="dialogUpload" :info-data="data.infoData" @close-dialog="closeUploadImgDialog" @submit-dialog="addUploadImgSubmit" /> -->
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.el-input__inner) {
//   // width: 96px;
// }

.el-form--inline .el-form-item {
  margin-right: 16px;
}

:deep(.el-form-item__label) {
  padding: 0 6px 0 0;
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

