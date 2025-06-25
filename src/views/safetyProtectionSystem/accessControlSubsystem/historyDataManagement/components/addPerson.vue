<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
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

})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  insiderList: [] as any[], // 内部人员列表
})
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
    return val
  },
})

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 开门类型
function getCardType(val: any) {
  infoDataForm.perCardType = val
}

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  perName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  perCareer: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perDepart: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perDepartType: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perCardType: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perCardId: [{ required: true, message: '请输入名称', trigger: 'blur' }],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="姓名：" prop="perName">
        <el-input v-model="infoDataForm.perName" placeholder="请输入" maxlength="2" class="formInput" />
      </el-form-item>

      <el-form-item label="性别：" prop="perSex">
        <el-select v-model="infoDataForm.perSex" filterable clearable placeholder="请选择性别" class="formInput">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="职务：" prop="perCareer">
        <el-input v-model="infoDataForm.perCareer" placeholder="请输入" maxlength="2" class="formInput" />
      </el-form-item>

      <el-form-item label="单位：" prop="perDepart">
        <el-input v-model="infoDataForm.perDepart" maxlength="11" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="单位类型：" prop="perDepartType">
        <el-input v-model="infoDataForm.perDepartType" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="证件类型：" prop="perCardType">
        <CommonSelect post-param="credentials-type" :is-name="true" :select-value="infoDataForm.perCardType" class="formInput" @select-change="getCardType" />
      </el-form-item>

      <el-form-item label="证件号码：" prop="perCardId">
        <el-input v-model="infoDataForm.perCardId" placeholder="请输入" class="formInput" />
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
.formInput {
  width: 100%;
}
</style>
