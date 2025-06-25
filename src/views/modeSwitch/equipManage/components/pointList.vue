<!--
 * @Description:点位关联弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:47:01
-->
<script setup lang='ts'>
import SelectPoint from './selectPoint.vue'
import ExpressionPoint from './expressionPoint.vue'
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
    default: '点位关联',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
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
    attrId: '',
    attrName: '',
    gatewayId: '',
    deviceId: '',
    pointId: '',
    expression: '',
    expressionStr: '',
  },
})
// 表头数据
const tableHeader = reactive([
  {
    prop: 'attrName',
    label: '变量名称',
  },
  {
    slot: 'expressionStr',
    label: '点位',
  },

  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])
// 提交
const submitDialog = async () => {
  const retData = {
    deviceAttrRelationList: data.tableData,
  }
  emits('submitDialog', retData)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

const total = ref(0) // 总条数
const selectPointDialog = ref(false)
const expressionDialog = ref(false)

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
  const Url = '/scada/conSheBei/listDeviceAttrRelation'
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
// 点击点位按钮
function clickSelectPoint(val: any) {
  const gatewayId = data.pointInfo.gatewayId
  const deviceId = data.pointInfo.deviceId
  data.pointInfo = val
  if (!data.pointInfo.gatewayId) {
    data.pointInfo.gatewayId = gatewayId
  }
  if (!data.pointInfo.deviceId) {
    data.pointInfo.deviceId = deviceId
  }
  selectPointDialog.value = true
}
// 点击表达式按钮
function clickExpression(val: any) {
  data.pointInfo = val
  expressionDialog.value = true
}
// 点击清空按钮
function clearSelectPoint(val: any) {
  val.pointId = ''
  val.expression = ''
  val.expressionStr = ''
}
// 关闭点位选择
function closePointSelect() {
  selectPointDialog.value = false
}
// 确认点位选择
function submitSavePoint(val: any) {
  data.pointInfo.pointId = val.id
  data.pointInfo.gatewayId = val.wgid
  data.pointInfo.deviceId = val.deviceId
  data.pointInfo.expressionStr = `${val.deviceName}:${val.name}`
  data.pointInfo.expression = ''
  selectPointDialog.value = false
}
// 关闭表达式弹窗
function closeExpressionDialog() {
  expressionDialog.value = false
}
// 确认表达式镗床
function submitExpression(val: string, ch: string) {
  data.pointInfo.pointId = ''
  data.pointInfo.gatewayId = ''
  data.pointInfo.deviceId = ''
  data.pointInfo.expressionStr = ch
  data.pointInfo.expression = val
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
      max-height="600px"
    >
      <template #expressionStr="{ item }">
        {{ item.row.expressionStr }}
      </template>
      <template #operate="{ item }">
        <el-button type="primary" size="small" :dark="true" @click="clickSelectPoint(item.row)">
          点位
        </el-button>
        <el-button type="primary" size="small" :dark="true" @click="clickExpression(item.row)">
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
  <SelectPoint v-if="selectPointDialog" :dialog-visible="selectPointDialog" :point-info="data.pointInfo" @submit-dialog="submitSavePoint" @close-dialog="closePointSelect" />
  <ExpressionPoint v-if="expressionDialog" :dialog-visible="expressionDialog" :point-info="data.pointInfo" @submit-dialog="submitExpression" @close-dialog="closeExpressionDialog" />
</template>

<style lang="scss" scoped>
</style>
