<!--
 * @Description:新增移库单弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-09 16:23:31
-->
<script setup lang='ts'>
import CommonTable from '@/components/ConmonTable/index.vue'
import type { FormInstance, FormRules } from 'element-plus'
import selectItemDialog from './selectItemDialog.vue'
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
    default: 'add'
  },
  // 标题
  title: {
    type: String,
    default: '新增',
  },
  // 类型下拉
  typesOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 供应商下拉
  supplierOptions: {
    type: Array<any>,
    default() {
      return []
    },
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
  wareOptions: [],
  selectIndex: 0
})
const dialogAddItem = ref(false) // 添加弹窗
const wareProps = {
  value: 'id',
  label: 'name',
}
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submitDialog', val)
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}
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
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData) as any

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  orderNo: [
    { required: true, message: '请输入入库单号', trigger: 'blur' },
  ],
  useName: [
    { required: true, message: '请输入负责人', trigger: 'blur' },
  ],
})
const tableHeader = reactive([
  {
    prop: 'itemName',
    label: '物料名称',
  },
  {
    prop: 'itemNo',
    label: '物料编号',
  },
  {
    prop: 'itemTypeName', // prop
    label: '分类',
  },
  {
    prop: 'sourceAreaId', // prop
    slot: 'sourceAreaId',
    label: '原仓库/库区',
  },
  {
    prop: 'targetAreaId', // prop
    slot: 'targetAreaId',
    label: '目标仓库/库区',
  },
  {
    prop: 'quantity', // prop
    slot: 'quantity',
    label: '数量',
  },
  {
    label: '操作',
    slot: 'operate',
  },
])



// 获取仓库列表
function getWareList() {
  api.get('spare/wareHouse/treeList').then((res: any) => {
    data.wareOptions = res
  }).catch((error) => {
    window.console.log(error)
  })
}

// 点击新增物料
function clickAddItem() {
  dialogAddItem.value = true
}

// 获取新增物料
function addSubmitSelectItem(val: any) {
  for (let i = 0; i < val.length; i++) {
    addUser(val[i])
  }
  dialogAddItem.value = false
}

// 添加物料方法
function addUser(user: any) {
  // 检查用户是否已经存在于数组中
  let exists = infoDataForm.items.some((u: { itemId: any,areaId:any }) => u.itemId === user.itemId&& u.areaId === user.areaId);

  // 如果不存在，则添加用户
  if (!exists) {
    infoDataForm.items.push(user);
  }
}

// 关闭新增物料弹窗
function closeSelectItemDialog() {
  dialogAddItem.value = false
}

// 删除物料
function delItem(index: any) {
  infoDataForm.items.splice(index, 1)
}

function clickTree(val: any) {
  setTimeout(() => {
    console.log(data.selectIndex);
    console.log(val);

    infoDataForm.items[data.selectIndex].targetAreaId = val.id
    infoDataForm.items[data.selectIndex].targetWarehouseId = val.warehouseId
  }, 100);

}

function changeTree(index: any) {
  data.selectIndex = index
}

onMounted(() => {
  getWareList()
})
</script>

<template>
  <el-dialog v-model="dialogShow" :title="props.title" width="50%" :before-close="closeDialog">
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="infoDataForm" class="demo-form-inline"
      label-width="100px">
      <el-form-item label="移库单号" placeholder="请输入" prop="orderNo">
        <el-input v-model="infoDataForm.orderNo" disabled class="formInput" />
      </el-form-item>
      <el-form-item label="负责人" placeholder="请输入" prop="useName">
        <el-input v-model="infoDataForm.useName" class="formInput" :disabled="props.dialogType === 'info'"/>
      </el-form-item>
      <el-form-item label="备注" placeholder="请输入" style="width: 80%;">
        <el-input type="textarea" v-model="infoDataForm.remark" resize="none" :disabled="props.dialogType === 'info'"/>
      </el-form-item>

      <h2 class="hr-title">
        物料明细
      </h2>
      <el-row>
        <el-col :span="20">

        </el-col>
        <el-col v-auth="'fem:tool:add'" :span="4" class="col-right">
          <el-button type="warning" @click="clickAddItem()" v-if="props.dialogType === 'add'">
            新增物料
          </el-button>
        </el-col>
      </el-row>
      <CommonTable :table-data="infoDataForm.items" :table-header="tableHeader" :is-select="false" :is-page="false">

        <template #sourceAreaId="{ item }">
          <span v-if="props.dialogType === 'add'">{{  item.row.warehouseName}}</span>
          <span v-if="props.dialogType === 'info'">{{ item.row.source }}</span>
        </template>
        <template #targetAreaId="{ item }">
          <el-tree-select v-if="props.dialogType === 'add'" v-model="item.row.targetAreaId" clearable default-expand-all
            node-key="id" :props="wareProps" :data="data.wareOptions" @change="changeTree(item.$index)"
            @node-click="clickTree" />
          <span v-if="props.dialogType === 'info'">{{ item.row.target }}</span>
        </template>
        <template #quantity="{ item }">
          <el-input-number v-if="props.dialogType === 'add'" :min="1"  v-model="item.row.quantity" style="width: 100%;" />
          <span v-if="props.dialogType === 'info'">{{ item.row.quantity }}</span>
        </template>
        <template #operate="{ item }" >
          <el-button v-if="props.dialogType === 'add'" type="danger" size="small" @click="delItem(item.$index)">
            删除
          </el-button>
          <span v-if="props.dialogType === 'info'">--</span>
        </template>
      </CommonTable>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)" v-if="props.dialogType === 'add'">
          确认
        </el-button>
      </span>
    </template>

    <selectItemDialog v-if="dialogAddItem" :dialog-visible="dialogAddItem" dialog-type="shipment" :info-data="infoDataForm.items"
      @submit-dialog="addSubmitSelectItem" @close-dialog="closeSelectItemDialog" />

  </el-dialog>
</template>


<style lang="scss" scoped>
.formInput {
  width: 200px;
}
</style>
