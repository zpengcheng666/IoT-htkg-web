<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
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
    default: '报警确认',
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

// 页数改变的时候触发的事件
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
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择报警类型', trigger: 'change' },
  ],
  actOperateName: [
    { required: true, message: '请输入确认人', trigger: 'blur' },
  ],
  handler: [
    { required: true, message: '请输入处理人', trigger: 'blur' },
  ],
  handlerContents: [
    { required: true, message: '请输入处理方法', trigger: 'blur' },
  ],
})
infoDataForm.linkageStrategyList = []
function getAlarmType(val: any) {
  infoDataForm.type = val
}
const listLinkageStrategyById = (strategyId: string) => {
  const postData = {
    params: {
      alarmStrategyId: strategyId,
    },
  }
  api.get('/scada/linkageStrategy/listByAlarmStrategyId', postData).then((res: any) => {
    for (const resultElement of res.result) {
      const linkage = {
        id: resultElement.id,
        name: resultElement.name,
        act: true,
      }
      infoDataForm.linkageStrategyList.push(linkage)
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
const listLinkageStrategyByIds = (strategyIds: string[]) => {
  const postData = {
    ids: strategyIds,
  }
  api.post('/scada/linkageStrategy/listByAlarmStrategyIds', postData).then((res: any) => {
    for (const resultElement of res.result) {
      const linkage = {
        id: resultElement.id,
        name: resultElement.name,
        act: true,
      }
      infoDataForm.linkageStrategyList.push(linkage)
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  if (infoDataForm.strategyId && infoDataForm.strategyId.length > 0) {
    listLinkageStrategyById(infoDataForm.strategyId)
  }
  if (infoDataForm.strategyIds && infoDataForm.strategyIds.length > 0) {
    listLinkageStrategyByIds(infoDataForm.strategyIds)
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="40%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :inline="true"  :model="infoDataForm" class="demo-form-inline" :rules="rules" label-width="100px">
      <el-card style="max-width: 100%;">
        <template #header>
          <div class="card-header">
            <span>报警确认</span>
          </div>
        </template>
      <el-form-item label="报警类型" placeholder="请输入" class="formInput" prop="type">
        <CommonSelect post-param="alarm-type-list" style="width: 200px;" :select-value="infoDataForm.type" @select-change="getAlarmType" />
      </el-form-item>
      <el-form-item label="确认人" placeholder="请输入" class="formInput" prop="actOperateName">
        <el-input v-model="infoDataForm.actOperateName" style="width: 200px;"/>
      </el-form-item>
      <el-form-item label="立即处理" placeholder="请输入" class="formInput">
        <el-switch v-model="infoDataForm.isHandle" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.isHandle === '1'" label="处理人" placeholder="请输入" class="formInput" prop="handler">
        <el-input v-model="infoDataForm.handler" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.isHandle === '1'" label="处理方法" placeholder="请输入" class="formInput" prop="handlerContents">
        <el-input v-model="infoDataForm.handlerContents" />
      </el-form-item>
      <!-- <el-form-item v-if="infoDataForm.linkageStrategyList.length>0" label="联动策略："  class="formInput" >
      </el-form-item> -->
      <!-- <h2 class="hr-title">
        联动策略
      </h2> -->
    </el-card>
    <el-card style="max-width: 100%;margin-top: 20px;" v-if="infoDataForm.linkageStrategyList.length>0">
      <template #header>
        <div class="card-header">
          <span>联动策略</span>
        </div>
      </template>
      <el-form-item v-for="linkage in infoDataForm.linkageStrategyList" :key="linkage.id" :label="linkage.name" placeholder="请输入" class="formInput">
        <el-switch v-model="linkage.act" inline-prompt  active-text="是" inactive-text="否" />
      </el-form-item>
    </el-card>

    </el-form>
    <!-- <el-form ref="ruleFormRef" :model="infoDataForm" class="demo-form-inline" :rules="rules" label-width="180px">
      <h2 class="hr-title">
        联动策略
      </h2>
      <el-form-item v-for="linkage in infoDataForm.linkageStrategyList" :key="linkage.id" :label="linkage.name" placeholder="请输入" class="formInput">
        <el-switch v-model="linkage.act" inline-prompt  active-text="是" inactive-text="否" />
      </el-form-item>
    </el-form> -->
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
.formInput {
  width: 260px;
}
</style>
