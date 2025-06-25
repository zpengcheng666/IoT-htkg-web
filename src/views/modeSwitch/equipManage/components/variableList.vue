<!--
 * @Description:变量关联弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:52:53
-->
<script setup lang='ts'>
import selectPoint from './selectPoint.vue'
import expression from './expression.vue'
import api from '@/api'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({
  // 所有属性
  deviceId: {
    type: String,
    default() {
      return ''
    },
  },
  // 标题
  title: {
    type: String,
    default: '变量列表',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  pageType: {
    type: String,
    default: 'point',
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  tableData: [],
  form: {
    pageNo: 1,
    pageSize: 30,
  },
  pointInfo: {
    variableId: '',
    gatewayAttrName: '',
    varExpression: '',
    varExpressionCh: '',
  },
})
const submitDialog = async () => {
  const retData = {
    deviceAttrRelationList: data.tableData,
  }
  emits('submitDialog', retData)
}
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'sceneAttrName',
    label: '变量名称',
  },
  {
    slot: 'relation',
    label: '关联',
  },

  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])
const total = ref(0) // 总条数
const selectPointDialog = ref(false)
const expressionDialog = ref(false)
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
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
// 获取列表
function getList() {
  let Url = ''
  if (props.pageType === 'point') {
    Url = '/scada/conSheBei/listDeviceAttrRelation'
  }
  else if (props.pageType === 'variable') {
    Url = '/scada/conSheBei/listDeviceAttrVariable'
  }
  const postData = {
    params: {
      deviceId: props.deviceId,
    },
  }
  api.get(Url, postData).then((res: any) => {
    data.tableData = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
function clickSelectPoint(val: any) {
  data.pointInfo = val
  selectPointDialog.value = true
}
function clickexpression(val: any) {
  data.pointInfo = val
  expressionDialog.value = true
}
function clearSelectPoint(val: any) {
  val.variableId = ''
  val.gatewayAttrName = ''
  val.varExpression = ''
  val.varExpressionCh = ''
}
function closeVarDialog(val: any) {
  selectPointDialog.value = false
}
function closeexpressionDialog(val: any) {
  expressionDialog.value = false
}
function submitSavePoint(val: any) {
  data.pointInfo.variableId = val.id
  data.pointInfo.gatewayAttrName = val.name
  selectPointDialog.value = false
}
function submitSaveexpression(val: string, ch: string) {
  data.pointInfo.varExpression = val
  data.pointInfo.varExpressionCh = ch
  expressionDialog.value = false
}
onMounted(() => {
  getList ()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="800px"
    :before-close="closeDialog"
  >
    <CommonTable
      :table-data="data.tableData"
      :table-header="tableHeader"
      :total="total"
      :size="data.form.pageSize"
      :is-select="false"
      :is-page="false"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template #relation="{ item }">
        {{ item.row.relationType === 'var' ? item.row.varExpressionCh : item.row.gatewayAttrName }}
      </template>
      <template #operate="{ item }">
        <el-button v-if="item.row.relationType === 'point'" type="primary" size="small" :dark="true" @click="clickSelectPoint(item.row)">
          关联点位
        </el-button>
        <el-button v-if="item.row.relationType === 'var'" type="primary" size="small" :dark="true" @click="clickexpression(item.row)">
          表达式
        </el-button>
        <el-button type="danger" size="small" @click="clearSelectPoint(item.row)">
          清空
        </el-button>
      </template>
    </CommonTable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <selectPoint v-if="selectPointDialog" :dialog-visible="selectPointDialog" :point-info="data.pointInfo" @submit-dialog="submitSavePoint" @close-dialog="closeVarDialog" />
  <expression v-if="expressionDialog" :dialog-visible="expressionDialog" :device-id="props.deviceId" :point-info="data.pointInfo" @submit-dialog="submitSaveexpression" @close-dialog="closeexpressionDialog" />
</template>


