<script setup lang='ts'>
import { ElTable } from 'element-plus'
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import requirementsListDialog from './requirementsListDialog.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'

const props = defineProps({
  // 所有属性
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 保养类型id
  itemClassId: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '属性关联选择',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  // 弹窗类型
  dialogType: {
    type: String,
    default: 'add',
  },
  // 保养方案下拉
  maintenancePlanOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 人员下拉
  personnelOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
})

const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])

const data = reactive({
  tableData: [] as any,
  multipleSelection: [],
  equTableForm: {
    name: '',
    code: '',
    classId_disp: '',
    unit: '',
    site_disp: '',
  },
  reqTableData: [] as any,
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    label: '名称',
  },
  {
    prop: 'code',
    label: '编码',
  },
  {
    prop: 'classId_disp', // prop
    label: '类别',
  },
  {
    prop: 'unit', // prop
    label: '单位',
  },
  {
    prop: 'site_disp', // prop
    label: '位置',
  },
])
const total = ref(0) // 总条数
const activeName = ref('1')
const reqDialog = ref(false)
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm: any = reactive(props.infoData)

const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (infoDataForm.times !== null && infoDataForm.times.length > 0) {
        val.startTime = infoDataForm.times[0]
        val.endTime = infoDataForm.times[1]
      }
      else {
        val.startTime = ''
        val.endTime = ''
      }
      delete val.times
      emits('submitDialog', val)
    }
    else {
      activeName.value = '1'
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
    return val
  },
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event)
}

// 多选事件
const selectionChange = (val: any) => {
  data.multipleSelection = val
  const deviceList = []
  for (let i = 0; i < val.length; i++) {
    deviceList.push(val[i].id)
  }

  infoDataForm.deviceList = deviceList
}
const shortcuts = [
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const tableRef = ref()
// 根据保养方案查询保养设备
const changeSchema = (schemaId: any) => {
  const postData = {
    params: {
      mtClassId: props.itemClassId,
      mtSchemaId: schemaId,
    },
  }
  api.get('/maintain/maintainRecord/listDevicesByMTClassAndMTSchema', postData).then((res: any) => {
    data.tableData = res.result
    total.value = res.result.total
    if (props.dialogType === 'edit') {
      const hasSelectList = [] as any
      for (const i in infoDataForm.deviceList) {
        const id = infoDataForm.deviceList[i]
        for (const item in data.tableData) {
          if (data.tableData[item].id === id) {
            hasSelectList.push(data.tableData[item])
          }
        }
      }
      // 反显选中
      nextTick(() => {
      // 调用子组件方法
        tableRef.value.toggleSelection(hasSelectList)
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取保养要求列表
function rowClick(val: any) {
  window.console.log(val)

  const postData = {
    params: {
      itemClassId: props.itemClassId,
      deviceId: val.id,
    },
  }
  api.get('/maintain/maintainOperate/listByItemClassIdAndDeviceId', postData).then((res: any) => {
    data.reqTableData = res.result
    reqDialog.value = true
  }).catch((error) => {
    window.console.log(error)
  })
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  schemaId: [
    { required: true, message: '请选择保养方案', trigger: 'change' },
  ],
  times: [
    { required: true, message: '请选择起始时间', trigger: 'change' },
  ],
  principalId: [
    { required: true, message: '请选择负责人', trigger: 'change' },
  ],
  creatorId: [
    { required: true, message: '请选择签发人', trigger: 'change' },
  ],
})
// 合并事件
const spanMethod = (val: any) => {
  if (infoDataForm.operates.length > 1) {
    if (val.columnIndex === 0 || val.columnIndex === 1) {

      if (val.row.counts !== 0) {
        return {
          rowspan: val.row.counts,
          colspan: 1,
        }
      }
      else if (val.row.counts === 0) {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
}
onMounted(() => {
  if (props.dialogType === 'edit') {
    changeSchema(infoDataForm.schemaId)
    // 拿到选中的值，并处理数据
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="900px"
    :before-close="closeDialog"
  >
    <el-tabs v-if="props.dialogType !== 'info'" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="任务信息" name="1">
        <el-form ref="ruleFormRef" :inline="true" :model="infoDataForm" :rules="rules" label-width="100px">
          <el-form-item label="保养方案：" prop="schemaId">
            <el-select v-model="infoDataForm.schemaId" placeholder="" filterable clearable @change="changeSchema">
              <el-option
                v-for="item in props.maintenancePlanOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="起止时间：" prop="times">
            <el-date-picker
              v-model="infoDataForm.times"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="负责人：" prop="principalId">
            <el-select v-model="infoDataForm.principalId" filterable clearable placeholder="">
              <el-option
                v-for="item in props.personnelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="签发人：" prop="creatorId">
            <el-select v-model="infoDataForm.creatorId" filterable clearable placeholder="">
              <el-option
                v-for="item in props.personnelOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="参加人：">
            <el-input v-model="infoDataForm.actor" placeholder="" />
          </el-form-item>
          <el-form-item label="问题处理：">
            <el-input v-model="infoDataForm.crics" placeholder="" />
          </el-form-item>
          <el-form-item label="责任变更：" style="width: calc(100% - 32px);">
            <el-input v-model="infoDataForm.remark" type="textarea" placeholder="" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="保养设备" name="2" class="inline-one">
        <el-form :inline="true" :model="data.equTableForm">
          <el-form-item label="名称：">
            <el-input v-model="data.equTableForm.name" placeholder="" />
          </el-form-item>
          <el-form-item label="编码：">
            <el-input v-model="data.equTableForm.code" placeholder="" />
          </el-form-item>
          <el-form-item label="类别：">
            <el-input v-model="data.equTableForm.classId_disp" placeholder="" />
          </el-form-item>
          <el-form-item label="单位：">
            <el-input v-model="data.equTableForm.unit" placeholder="" />
          </el-form-item>
          <el-form-item label="位置：">
            <el-input v-model="data.equTableForm.site_disp" placeholder="" />
          </el-form-item>
          <el-form-item>
            <el-button type="info" plain>
              清空查询
            </el-button>
          </el-form-item>
        </el-form>
        <CommonTable
          ref="tableRef"
          :table-data="data.tableData"
          :table-header="tableHeader"
          :is-select="true"
          :is-page="false"
          @selection-change="selectionChange"
          @row-click="rowClick"
        />
      </el-tab-pane>
    </el-tabs>
    <div v-if="props.dialogType === 'info'">
      <el-form ref="ruleFormRef" :inline="true" :model="infoDataForm" :rules="rules" label-width="100px">
        <el-form-item label="保养方案：">
          <span>{{ infoDataForm.schemaName }}</span>
        </el-form-item>
        <el-form-item label="起止时间：">
          <span>{{ infoDataForm.startTime }}~{{ infoDataForm.endTime }}</span>
        </el-form-item>
        <el-form-item label="负责人：">
          <span>{{ infoDataForm.principal }}</span>
        </el-form-item>
        <el-form-item label="签发人：">
          <span>{{ infoDataForm.creator }}</span>
        </el-form-item>

        <el-form-item label="参加人：">
          <span>{{ infoDataForm.actor }}</span>
        </el-form-item>
        <el-form-item label="问题处理：">
          <span>{{ infoDataForm.crics }}</span>
        </el-form-item>
        <el-form-item label="责任变更：" style="width: calc(100% - 32px);">
          <span>{{ infoDataForm.remark }}</span>
        </el-form-item>
      </el-form>
      <ElTable
        ref="multipleTableRef"
        :data="infoDataForm.operates"
        style="width: 100%;"
        max-height="600px"
        border
        :span-method="spanMethod"
      >
        <!-- :span-method="spanMethod" -->
        <el-table-column label="设备名称" property="deviceName" />
        <el-table-column label="类别名称" property="deviceClassName" />
        <el-table-column label="序号" property="index1" />
        <el-table-column label="作业流程" property="name" />
        <el-table-column label="技术要求" property="thchRequire" />
        <!-- <el-table-column label="数量" property="counts" /> -->
      </ElTable>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button v-if="activeName === '1' && props.dialogType !== 'info'" type="primary" @click="activeName = '2'">
          下一步
        </el-button>
        <el-button v-if="activeName === '2' && props.dialogType !== 'info'" type="primary" @click="activeName = '1'">
          上一步
        </el-button>
        <el-button v-if="activeName === '2' && props.dialogType !== 'info'" type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <requirementsListDialog v-if="reqDialog" :dialog-visible="reqDialog" :table-data="data.reqTableData" @close-dialog="reqDialog = false" />
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100% / 2 - 32px);
}

.inline-one .el-form-item {
  width: calc(100% / 6 - 4px);
  margin-right: 4px;
}

.formInput {
  width: 100%;
}

.el-select {
  width: 100%;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
