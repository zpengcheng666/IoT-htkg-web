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
  devDoorOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '编辑刷卡记录',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])

const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submintDialog', val)
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

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 开门类型
function getOpenType(val: any) {
  infoDataForm.openType = val
}
// 刷卡结果
function getCardResult(val: any) {
  infoDataForm.cardResult = val
}

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  papersId: [{
    required: true,
    message: '请选择证件类型',
    trigger: 'change',
  }],
  numberId: [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
  ],
  militaryId: [{
    required: true,
    message: '请选择军衔',
    trigger: 'change',
  }],
  positionId: [{
    required: true,
    message: '请选择职称',
    trigger: 'change',
  }],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="40%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="门名称：">
        <el-select v-model="infoDataForm.doorId" filterable clearable placeholder="请选择门名称">
          <el-option
            v-for="item in props.devDoorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="门类型" prop="doorType">
        <el-select v-model="infoDataForm.doorType" filterable clearable placeholder="请选择门类型" class="formInput">
          <el-option label="单向门" value="one" />
          <el-option label="双向门" value="two" />
        </el-select>
      </el-form-item>

      <el-form-item label="人员名称" prop="perName">
        <el-input v-model.number="infoDataForm.perName" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="单位" prop="perDept">
        <el-input v-model.number="infoDataForm.perDept" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="职务" prop="perTitle">
        <el-input v-model.number="infoDataForm.perTitle" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="卡号" prop="cardCode">
        <el-input v-model.number="infoDataForm.cardCode" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="进出类型" prop="accessType">
        <el-select v-model="infoDataForm.accessType" filterable clearable placeholder="请选择出入类型">
          <el-option label="进门" value="entryCard" />
          <el-option label="出门" value="exitCard" />
        </el-select>
      </el-form-item>

      <el-form-item label="开门类型" prop="openType">
        <CommonSelect post-param="openType" :select-value="infoDataForm.openType" class="formInput" @select-change="getOpenType" />
      </el-form-item>

      <el-form-item label="刷卡结果" prop="cardResult">
        <CommonSelect post-param="cardResult" :select-value="infoDataForm.cardResult" class="formInput" @select-change="getCardResult" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 200px;
}
</style>
