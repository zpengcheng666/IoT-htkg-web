<!--
 * @Description:新增报警策略弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-08-11 10:00:22
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:29:49
-->
<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { CascaderProps } from 'element-plus/lib/components/cascader-panel/src/types'
import SelectAttr from '@/views/modeSwitch/strategyManage/components/selectAttr.vue'
import AlarmExpression from '@/views/modeSwitch/strategyManage/components/AlarmExpression.vue'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '新增',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  deviceList: {
    type: Array<any>,
    required: false,
    default: [] as any,
  },
  alarmStrategyType: {
    type: Array<any>,
    required: true,
  },
  listAttrUrl: {
    type: String,
    required: true,
  },
  isConfig: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog'])
const data = reactive({
  rangeStart: '',
  rangeEnd: '',
  originVar: {
    form: {
      value: [] as any[],
    },
    deviceList: [],
    attrList: [] as any,
  },
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (infoDataForm.type === 'interval') {
        val.range = `${data.rangeStart}~${data.rangeEnd}`
      }
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
    return val
  },
})

const validateRange = (rule: any, value: any, callback: any) => {
  if (data.rangeStart === '' || data.rangeEnd === '') {
    callback(new Error('请输入正常值'))
  }
  else {
    callback()
  }
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择报警策略类型', trigger: 'change' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  levelId: [
    { required: true, message: '请选择报警级别', trigger: 'change' },
  ],
  storeCondition: [
    { required: true, message: '请输入储存条件', trigger: 'change' },
  ],
  alarmPushCondition: [
    { required: true, message: '请输入储存条件', trigger: 'change' },
  ],

  isEnable: [
    { required: true, message: '请选择是否启用', trigger: 'change' },
  ],
  statusVarId: [
    { required: true, message: '请输入报警状态关联', trigger: 'blur' },
  ],
  originVarId: [
    { required: true, message: '请输入原始变量', trigger: 'blur' },
  ],
  rangeV: [
    { validator: validateRange, required: true, message: '请输入正常值', trigger: 'blur' },
  ],
  range: [
    { required: true, message: '请输入正常值', trigger: 'blur' },
  ],
  valueExpression: [
    { required: true, message: '请输入报警值', trigger: 'blur' },
  ],
  expression: [
    { required: true, message: '请输入触发条件', trigger: 'blur' },
  ],
  clearExpression: [
    { required: true, message: '请输入解除条件', trigger: 'blur' },
  ],
  frequency: [
    { required: true, message: '请输入采集频率', trigger: 'blur' },
  ],
  period: [
    { required: true, message: '请输入变化周期', trigger: 'blur' },
  ],
})
// 级联选择框
const originVarProps: CascaderProps = {
  value: 'id',
  label: 'name',
  lazy: true,
  lazyLoad(node, resolve) {
    api.get(`${props.listAttrUrl}=${node.value}`).then((res: any) => {
      if (res.code === 200) {
        data.originVar.attrList = res.result.map((a: any) => {
          a.leaf = true
          return a
        })
        resolve(data.originVar.attrList)
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
  },
}
// 报警级别赋值
function getCardType(val: any) {
  infoDataForm.levelId = val
}
// 原始变量变化
function changeOriginVar() {
  infoDataForm.deviceId = data.originVar.form.value[0]
  infoDataForm.originVarId = data.originVar.form.value[1]
}

onMounted(() => {
  if (infoDataForm.range && infoDataForm.type === 'interval') {
    const rangeArr = infoDataForm.range.split('~')
    data.rangeStart = rangeArr[0]
    data.rangeEnd = rangeArr[1]
  }
  if (props.isConfig) {
    api.get(`${props.listAttrUrl}=${props.infoData.typeId}`).then((res: any) => {
      if (res.code === 200) {
        data.originVar.attrList = res.result
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
  else {
    data.originVar.form.value[0] = infoDataForm.deviceId
    data.originVar.form.value[1] = infoDataForm.originVarId
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="140px">
      <el-form-item label="报警策略类型" prop="type">
        <el-select v-model="infoDataForm.type" filterable clearable placeholder="请选择" class="form-input">
          <el-option
            v-for="item in alarmStrategyType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="form-input" />
      </el-form-item>
      <el-form-item label="报警级别：" prop="levelId">
        <CommonSelect post-param="alarm-level-list" :select-value="infoDataForm.levelId" class="form-input" @select-change="getCardType" />
      </el-form-item>
      <el-form-item label="存储条件：" prop="storeCondition">
        <el-select v-model="infoDataForm.storeCondition" filterable clearable placeholder="请选择" class="form-input">
          <el-option label="发生报警" value="true" />
          <el-option label="解除报警" value="false" />
          <el-option label="全部存储" value="all" />
          <el-option label="不存储" value="none" />
        </el-select>
      </el-form-item>
      <el-form-item label="推送条件：" prop="alarmPushCondition">
        <el-select v-model="infoDataForm.alarmPushCondition" filterable clearable placeholder="请选择" class="form-input">
          <el-option label="发生推送" value="true" />
          <el-option label="解除推送" value="false" />
          <el-option label="全部推送" value="all" />
          <el-option label="不推送" value="none" />
        </el-select>
      </el-form-item>

      <el-form-item label="是否启用：" prop="isEnable">
        <el-radio-group v-model="infoDataForm.isEnable" class="form-input">
          <el-radio label="1" size="large">
            启用
          </el-radio>
          <el-radio label="2" size="large">
            不启用
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="延时开始(s)：">
        <el-input v-model="infoDataForm.delayBegin" placeholder="请输入" class="form-input" type="number" />
      </el-form-item>
      <el-form-item label="延时解除(s)：">
        <el-input v-model="infoDataForm.delayRemove" placeholder="请输入" class="form-input" type="number" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'rateOfChange'" label="采集频率(s)：" prop="frequency">
        <el-input v-model="infoDataForm.frequency" placeholder="请输入" class="form-input" type="number" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'rateOfChange'" label="变化周期(ms)：" prop="period">
        <el-input v-model="infoDataForm.period" placeholder="请输入" class="form-input" type="number" />
      </el-form-item>
      <el-form-item label="原始变量：" prop="originVarId">
        <el-cascader v-if="!props.isConfig" v-model="data.originVar.form.value" style="width: 260px;" placeholder="请选择" :options="props.deviceList" :props="originVarProps" class="form-input" @change="changeOriginVar" />
        <el-select v-else v-model="infoDataForm.originVarId" filterable clearable placeholder="请选择" lass="form-input" style="width: 260px;">
          <el-option
            v-for="item in data.originVar.attrList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报警值：" prop="valueExpression">
        <SelectAttr v-model="infoDataForm.valueExpression" :attr-list="data.originVar.attrList" />
      </el-form-item>
      <el-form-item label="报警状态关联：" prop="statusVarId">
        <el-select v-model="infoDataForm.statusVarId" filterable clearable placeholder="请选择" class="form-input">
          <el-option
            v-for="item in data.originVar.attrList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="触发条件：" prop="expression">
        <AlarmExpression v-model="infoDataForm.expression" :attr-list="data.originVar.attrList" size="700px" />
      </el-form-item>
      <el-form-item label="解除条件：" prop="clearExpression">
        <AlarmExpression v-model="infoDataForm.clearExpression" :attr-list="data.originVar.attrList" size="700px" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type === 'interval'" label="正常值(范围)：" prop="rangeV">
        <SelectAttr v-model="data.rangeStart" :attr-list="data.originVar.attrList" />
        ~
        <SelectAttr v-model="data.rangeEnd" :attr-list="data.originVar.attrList" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.type !== 'interval'" label="正常值：" prop="range">
        <SelectAttr v-model="infoDataForm.range" :attr-list="data.originVar.attrList" />
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="infoDataForm.description" placeholder="请输入" style="width: 260px;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-input {
  width: 260px;
}
</style>
