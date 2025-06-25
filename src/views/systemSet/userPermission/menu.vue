<!--
 * @Description:菜单管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-05-12 14:28:52
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-24 09:17:36
-->

<script lang="ts" setup name="PersonalSetting">
import { Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addMenuDialog from './components/addMenuDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const data = reactive({
  menuList: [] as any,
  menuOptions: [{
    id: '0',
    title: '主菜单',
    children: [],
  },
  ] as any,
  form: {
    title: '',
  },
  multipleSelection: [],
  infoData: {} as any,
  roleId: '',
  dialogType: 'add',
  dialogTitle: '新增菜单',
})

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([

  {
    prop: 'title',
    label: '菜单名称',
    align: 'left',
  },
  {
    prop: 'menuType',
    label: '菜单类型',
    slot: 'menuType',
  },
  {
    prop: 'name',
    label: '组件名称',
  },
  {
    prop: 'component',
    label: '组件路径',
  },
  {
    prop: 'auth',
    label: '权限标识',
  },
  {
    prop: 'sortNumber', // prop
    label: '排序',
    width: '100px',
  },
  {
    prop: 'status', // prop
    label: '状态',
    slot: 'status',
    width: '100px',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])

const total = ref(0) // 总条数
const dialogAdd = ref(false) // 添加弹窗

// 事件
const selectionChange = (val: []) => {
  data.multipleSelection = val
  window.console.log(data.multipleSelection)
  window.console.log(data.menuList)
}

// 获取菜单列表
function getList() {
  const postData = {
    params: data.form,
  }
  api.get('system/baseMenu/list', postData).then((res: any) => {
    data.menuList = res.result
    data.menuOptions[0].children = res.result
    total.value = res.result.total
  }).catch((error) => {
    window.console.log(error)
  })
}

// 重置
function reset() {
  data.form.title = ''
  getList()
}

// 点击编辑
function clickEdit(row: any) {
  data.infoData = JSON.parse(JSON.stringify(row))
  data.dialogType = 'edit'
  data.dialogTitle = '编辑菜单'
  dialogAdd.value = true
}

// 点击新增
function clickAdd(row: any | undefined) {
  data.infoData = {}
  data.infoData.menuType = 0
  data.infoData.hide = false
  data.infoData.isScene = 0
  data.infoData.sceneType = ''
  data.infoData.selectScene = ''
  if (row !== '0') {
    data.infoData.parent = row.id
    data.infoData.hide = row.hide
  }
  data.dialogType = 'add'
  data.dialogTitle = '新增菜单'
  dialogAdd.value = true
}
// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
}

// 刷新菜单缓存
function clickRefresh() {
  ElMessageBox.confirm(
    '此操作将更新缓存刷新浏览器！，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      location.reload()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消刷新',
      })
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
      api.delete(`system/baseMenu/delete?id=${id}`).then((res: any) => {
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
function addSubmint(val: any) {
  const postData = val
  if (postData.menuType === 0 || postData.menuType === 1) {
    postData.sidebar = true
  }
  else {
    postData.sidebar = false
  }

  if (data.dialogType === 'add') {
    api.post('system/baseMenu/add', postData).then((res: any) => {
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
    api.post('system/baseMenu/edit', postData).then((res: any) => {
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
// 设置状态
function setMenuStates(val: any) {
  if (!val.id) {
    return false
  }
  const postData = {
    id: val.id,
    status: val.status,
  }
  api.post('system/baseMenu/editStatus', postData).then((res: any) => {
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
}

onMounted(() => {
  getList()
})
</script>

<script>
</script>

<template>
  <page-main class="pageBox">
    <!-- 分组管理页面 -->
    <el-row justify="space-between">
      <el-col :span="20">
        <el-form :model="data.form" label-position="left" :inline="true">
          <el-form-item label="菜单名称：">
            <el-input v-model="data.form.title" />
          </el-form-item>
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
        <el-button type="" :icon="Refresh" @click="clickRefresh()">
          刷新菜单缓存
        </el-button>
        <el-button v-auth="'system:menu:add'" type="warning" :icon="Plus" @click="clickAdd('0')">
          新增菜单
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格展示 -->
    <CommonTable
      :table-data="data.menuList"
      :table-header="tableHeader"
      :total="total"
      :is-select="false"
      :is-page="false"
      @selection-change="selectionChange"
    >
      <template #menuType="{ item }">
        <span v-if="item.row.menuType === 0">目录</span>
        <span v-if="item.row.menuType === 1">菜单</span>
        <span v-if="item.row.menuType === 2">内嵌页</span>
        <span v-if="item.row.menuType === 3">按钮</span>
      </template>

      <template #status="{ item }">
        <el-switch v-model="item.row.status" inline-prompt :active-value="0" :inactive-value="1" active-text="开启" inactive-text="关闭" @click="setMenuStates(item.row)" />
      </template>

      <template #operate="{ item }">
        <el-button v-auth="'system:menu:add'" type="primary" size="small" :dark="true" @click="clickAdd(item.row)">
          新增
        </el-button>
        <el-button v-auth="'system:menu:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'system:menu:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addMenuDialog v-if="dialogAdd" :menu-options="data.menuOptions" :dialog-title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :info-data="data.infoData" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>

