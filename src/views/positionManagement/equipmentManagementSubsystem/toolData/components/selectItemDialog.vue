<!--
 * @Description:新增供应商弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 10:06:02
-->
<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  dialogType: {
    type: String,
    default: 'receipt',
  },
  // 标题
  title: {
    type: String,
    default: '添加物料',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const data = reactive({
  itemList: [],
  form: {
    itemName: '',
    itemNo: '',
    itemType: '',
    expiryDate: '',
    pageNo: 1,
    pageSize: 30,
  },
  groudOptions: [],
  times: [],
  selectItemArr: [],
  infoData: {},
  dialogType: 'add',
  dialogTitle: '新增',

})

const total = ref(0) // 总条数

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

// 多选事件
const selectionChange = (val: []) => {
  data.selectItemArr = val
  window.console.log(data.selectItemArr)
}

const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])


const submitDialog = async (val: any) => {
  emits('submitDialog', val)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

const tableHeader = reactive([
  {
    prop: 'warehouseName',
    label: '仓库/库区',
    slot:'warehouseName',
  },
  {
    prop: 'itemName',
    label: '物料名称',
  },
  {
    prop: 'itemNo',
    label: '物料编号',
  },
  {
    prop: 'quantity',
    label: '数量',

  }
])

// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    // console.log(val)
    return val
  },
})

// 校验
const groupProps = {
  value: 'id',
  label: 'typeName',
}

// 获取列表
function getList() {
  const postData = {
    params: data.form,
  }
  if (props.dialogType === 'receipt') {
    // 入库获取物料
    api.get('spare/item/list', postData).then((res: any) => {
      data.itemList = res.result.records
      total.value = res.result.total
    }).catch((error) => {
      window.console.log(error)
    })
  } else if (props.dialogType === 'shipment') {
    // 出库获取物料
    api.get('spare/inventoryEntity/pageItem', postData).then((res: any) => {
      data.itemList = res.result.records
      total.value = res.result.total
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
})

</script>

<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="40%" :before-close="closeDialog">
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

          <el-form-item>
            <el-button type="primary" @click="getList()">
              查询
            </el-button>
            <el-button type="info" plain @click="reset()">
              重置
            </el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <CommonTable :table-data="data.itemList" :table-header="tableHeader" :total="total" :size="data.form.pageSize"
      :is-select="true" @selection-change="selectionChange" @size-change="sizeChange" @current-change="currentChange">
      <template #warehouseName="{ item }">
        <span v-if="props.dialogType === 'shipment'">{{ item.row.warehouseName }}</span>
        <span v-if="props.dialogType === 'receipt'">--</span>
      </template>
    </CommonTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(data.selectItemArr)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.formInput {
  width: 360px;
}
</style>
