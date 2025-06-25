<!--
 * @Description:场景管理
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-26 16:23:48
-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import addSceneDialog from './components/addSceneDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

// 定义组件的响应式数据
const data = reactive({
  tableData: [], // 表格数据
  form: {
    name: '', // 名称
    subSystem: '', // 子系统
    pageNo: 1, // 页码
    pageSize: 30, // 每页数量
  },
  systemList: [] as any, // 系统列表
  infoData: {}, // 详细信息数据
  url: '', // 请求URL
  dialogType: 'add', // 对话框类型：添加、编辑等
  dialogTitle: '新增EAG', // 对话框标题
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '名称',
  },
  {
    prop: 'subSystemName',
    label: '所属子系统',
  },
  {
    prop: 'moduleName', // prop
    label: '所属功能模块',
  },
  {
    prop: 'updatedTime', // prop
    label: '修改时间',
  },

  {
    prop: 'sceneBaseMap', // prop
    slot: 'sceneBaseMap',
    label: '场景底图',
  },
  {
    slot: 'isPublish', // prop
    label: '是否发布',
  },

  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '200px',
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

/**
 * 获取列表数据的函数
 * 该函数无参数
 * 无显式返回值，但会更新data中的tableData和total的值
 */
function getList() {
  // 准备请求的参数
  const postData = {
    params: data.form,
  }
  // 发起GET请求获取列表数据
  api.get('/api/scada/list', postData).then((res: any) => {
    // 更新表格数据
    data.tableData = res.result.records
    // 更新总记录数
    total.value = res.result.total
  }).catch((error) => {
    // 在控制台打印错误信息
    window.console.log(error)
  })
}

// 删除
/**
 * 删除指定ID的数据
 * @param {string} id - 需要删除的数据的ID
 *
 * 此函数首先会弹出一个确认框，询问用户是否确定要删除数据。
 * 如果用户确认删除，将调用后台API进行删除操作，并根据删除结果给出相应的提示。
 * 如果删除成功，则刷新数据列表；如果删除失败，则显示错误信息。
 * 如果用户取消删除操作，则不会进行任何后台操作，并显示一条取消删除的信息。
 */
function del(id: string) {
  // 弹出确认框，询问用户是否确定删除
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
      // 用户确认删除，调用后台API进行删除操作
      api.delete(`api/scada/delete?id=${id}`).then((res: any) => {
        if (res.code === 200) {
          // 删除成功，显示成功信息并刷新数据列表
          ElMessage({
            type: 'success',
            message: res.message,
          })
          getList()
        }
        else {
          // 删除失败，显示错误信息
          ElMessage({
            type: 'error',
            message: res.message,
          })
        }
      }).catch((error) => {
        // 捕获并记录删除操作中的错误
        window.console.log(error)
      })
    })
    .catch(() => {
      // 用户取消删除操作，显示取消信息
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}


/**
 * 设置发布状态
 * @param val 任意类型，预期包含id和isPublished属性
 * @returns {boolean} 如果val没有id属性，返回false，否则不返回值
 */
function setPublish(val: any) {
  // 检查val是否包含id属性
  if (!val.id) {
    return false
  }
  // 准备发送到后端的数据
  const postData = {
    id: val.id,
    status: val.isPublished,
  }
  // 调用API接口，更新发布状态
  api.post('api/scada/publish', postData).then((res: any) => {
    // 请求成功，根据返回码展示消息并刷新列表
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
      getList()
    }
    else {
      // 请求成功但操作失败，展示错误消息
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error) => {
    // 请求失败，打印错误信息
    window.console.log(error)
  })
}

/**
 * 点击编辑按钮时触发的函数。
 * @param row 任意类型，通常为表格中被点击的行数据。
 * 该函数不返回任何内容。
 */
function clickEdit(row: any) {
  let url = window.location.origin // 获取当前窗口的原始URL

  // 判断URL是否为本地开发环境的地址，如果是，则替换为指定的IP地址
  if (url === 'http://127.0.0.1:9000'|| url === 'http://localhost:9000') {
    url = 'http://192.168.0.10:8090'
  }

  // 复制行数据到infoData，为编辑对话框准备数据
  data.infoData = JSON.parse(JSON.stringify(row))
  // 构造编辑页面的完整URL
  data.url = `${url}/byzt/index_edit.html?stageId=${row.id}`
  // 设置对话框类型为编辑
  data.dialogType = 'edit'
  // 设置对话框标题
  data.dialogTitle = '编辑场景'
  // 打开对话框
  dialogAdd.value = true
}

// 点击新增
/**
 * 点击添加按钮时执行的函数。
 * 该函数不接受任何参数，也不直接返回任何内容。
 * 它主要做以下操作：
 * 1. 根据当前窗口的地址判断是否在本地开发环境，并据此设置最终的URL。
 * 2. 重置相关数据，包括URL路径、信息数据对象、对话框类型和标题。
 * 3. 打开添加场景的对话框。
 */
function clickAdd() {
  let url = window.location.origin
  // 判断是否在本地开发环境，如果是则将URL指向指定的IP地址和端口
  if (url === 'http://127.0.0.1:9000'|| url === 'http://localhost:9000') {
    url = 'http://192.168.0.10:8090'
  }
  // 设置最终的URL路径
  data.url = `${url}/byzt/index_edit.html`
  // 重置信息数据对象
  data.infoData = {}
  // 设置对话框类型为添加
  data.dialogType = 'add'
  // 设置对话框标题
  data.dialogTitle = '新增场景'
  // 打开对话框
  dialogAdd.value = true
}

// 关闭弹窗
function closeDialog() {
  dialogAdd.value = false
  getList()
}
function addSubmint(val: any) {}
/**
 * 获取系统列表数据
 * 该函数无参数
 * 该函数无显式返回值，但会将获取到的数据更新到全局数据变量data.systemList中
 */
const listSystem = () => {
  // 通过api.get方法请求系统列表数据
  api.get('api/scada/config/subsystems').then((res: any) => {
    // 请求成功后，将返回的结果更新到data.systemList中
    data.systemList = res.result
  }).catch((error) => {
    // 请求失败时，将错误信息输出到控制台
    window.console.log(error)
  })
}
onMounted(() => {
  getList()
  listSystem()
})
</script>

<template>
  <page-main class="pageBox">
    <el-row>
      <el-col :span="22">
        <el-form :inline="true" :model="data.form" class="demo-form-inline">
          <el-form-item label="场景：">
            <el-input v-model="data.form.name" placeholder="输入搜索场景名称" clearable />
          </el-form-item>
          <el-form-item label="子系统：">
            <el-select v-model="data.form.subSystem" filterable clearable placeholder="请选择子系统">
              <el-option v-for="v in data.systemList" :key="v.id" :label="v.name" :value="v.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getList">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <el-button v-auth="'config:scene:add'" type="warning" @click="clickAdd()">
          新增
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="data.tableData" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="false" @size-change="sizeChange" @current-change="currentChange"
    >
      <template #isPublish="{ item }">
        <el-switch v-model="item.row.isPublished" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" @click="setPublish(item.row)" />
      </template>
      <template #sceneBaseMap="{ item }">
        <el-image style="width: 100px; height: 100px;" :src="item.row.base64" fit="fill" :preview-src-list="[item.row.base64]" :hide-on-click-modal="true" :preview-teleported="true" />
      </template>

      <template #operate="{ item }">
        <el-button v-auth="'config:scene:edit'" type="primary" size="small" :dark="true" @click="clickEdit(item.row)">
          编辑
        </el-button>
        <el-button v-auth="'config:scene:del'" type="danger" size="small" @click="del(item.row.id)">
          删除
        </el-button>
      </template>
    </CommonTable>
    <!-- 新增弹窗 -->
    <addSceneDialog v-if="dialogAdd" :title="data.dialogTitle" :type="data.dialogType" :dialog-visible="dialogAdd" :url="data.url" @close-dialog="closeDialog" @submint-dialog="addSubmint" />
  </page-main>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tabs--card > .el-tabs__header) {
  border: none;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border-bottom: 1px solid #e4e7ed;
  background: #e0e0e0;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: 1px solid #e4e7ed;
}

.el-select {
  width: 100%;
}

.el-tab-pane {
  border: 1px dashed #e4e7ed;
  min-height: 5rem;
  margin-right: 3rem;
  padding: 0.5rem;
}
</style>
