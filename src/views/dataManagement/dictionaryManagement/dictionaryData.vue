<script lang="ts" setup>
import type { ElTable, UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus, Search, Share, Upload } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import addDictDialog from './components/addDictDialog.vue'
import dictChildList from './components/dictChildList.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
// import { reactive } from 'vue'
import api from '@/api'

const data = reactive({
  tableData: [],
  form: {
    name: '',
    id: '',
    pageNo: 1,
    pageSize: 30,
  },
  multipleSelection: [],
  dictTypeOptions: [{
    id: '',
    name: '',
  }],
  infoData: {} as any,
  clickListData: {} as any,
  dialogType: 'add',
  dialogTitle: '新增字典',
  dictId: '',
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'name',
    label: '字典类型',
  },
  {
    prop: 'enName',
    label: '字典码值',
    slot: 'enName',
  },
  // {
  //   prop: 'code',
  //   label: '字典码值',
  // },
  // {
  //   prop: 'isEnable',
  //   slot: 'isEnable',
  //   label: '是否可用',
  // },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
  },
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
const dialogAdd = ref(false)
const dialogList = ref(false)
const total = ref(0) // 总条数

// 获取字典列表
function getList() {
  // console.log(params)
  const postData = {
    params: data.form,
  }
  api.get('system/baseDictType/listDict', postData).then((res: any) => {
    data.tableData = res.result.records
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取字典内容
function getChildList(id: any) {
  // console.log(params)
  // const postData = {
  //   params: { dictTypeId: id },
  // }
  // api.get('system/baseDictData/selectByIdDictData', postData).then((res: any) => {
  //   data.clickListData = res.result
  //   dialogList.value = true
  // }).catch((error) => {
  //   window.console.log(error)
  // })
  data.dictId = id
  dialogList.value = true
}
// 重置
function reset() {
  data.form.name = ''
  data.form.id = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑字典'
  dialogAdd.value = true
}

// 点击新增
function clickAdd() {
  data.infoData = {}
  data.dialogType = 'add'
  data.dialogTitle = '新增字典'
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 打开内容弹窗
// function clickOpenChildDialog() {
// }

// 关闭内容弹窗
function closeChildDialog() {
  dialogList.value = false
}

// 提交新增
function addSubmint(val: any) {
  const postData = val
  if (data.dialogType === 'add') {
    api.post('system/baseDictType/addDictTypeAndCode', postData).then((res: any) => {
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
    api.post('system/baseDictType/editDictTypeAndCode', postData).then((res: any) => {
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

  // console.log(val)
}

// 获取字典类型下拉
function getDictType() {
  api.get('system/baseDictType/listOptions').then((res: any) => {
    data.dictTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 删除角色
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
      api.delete(`system/baseDictType/deleteDict?id=${id}`).then((res: any) => {
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

onMounted(() => {
  getList()
  getDictType()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="字典类型：">
            <el-select v-model="data.form.id" placeholder="" filterable clearable>
              <el-option
                v-for="item in data.dictTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="字典名称：">
            <el-input v-model="data.form.name" />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="getList()">
              搜索
            </el-button>
            <el-button @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" class="col-right">
        <el-button v-auth="'data:dict:add'" type="warning" :icon="Plus" @click="clickAdd">
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
      <template #enName="{ item }">
        <el-button type="primary" text @click="getChildList(item.row.id)">
          {{ item.row.enName }}
        </el-button>
      </template>
      <template #operate="{ item }">
        <el-button v-auth="'data:dict:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'data:dict:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>

      <template #isEnable="{ item }">
        <span>{{ item.row.isEnable === 0 ? '是' : '否' }}</span>
      </template>
    </CommonTable>
    <addDictDialog v-if="dialogAdd" :dict-type-options="data.dictTypeOptions" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />

    <dictChildList v-if="dialogList" :dict-id="data.dictId" :dict-type-options="data.dictTypeOptions" :dialog-visible="dialogList" @close-dialog="closeChildDialog" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
