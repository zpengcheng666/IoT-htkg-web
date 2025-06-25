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
  dialogType: {
    type: String,
    default: 'add',
  },
  // 标题
  title: {
    type: String,
    default: '新增用户',
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

const data = reactive({
  organOptions: [{
    id: '',
    title: '',
  }],
})

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
const props1 = {
  checkStrictly: true,
  emitPath: false,
  // children: 'childs',
  label: 'title',
  value: 'id',
}

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 证件类型赋值
function getCardType(val: any) {
  infoDataForm.papersId = val
}
// 军衔赋值
function getMilitaryRank(val: any) {
  infoDataForm.militaryId = val
}

// 职称赋值
function getPositionId(val: any) {
  infoDataForm.positionId = val
}

// 获取分组
function getOrganOptions() {
  api.get('system/baseOrgan/queryTreeList').then((res: any) => {
    data.organOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change',
    },
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机', trigger: 'blur' },
  ],
  plane: [
    { required: true, message: '请输入座机', trigger: 'blur' },
  ],
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
  organizationId: [{
    required: true,
    message: '请选择组织机构',
    trigger: 'change',
  }],
  positionId: [{
    required: true,
    message: '请选择职称',
    trigger: 'change',
  }],
})

onMounted(() => {
  getOrganOptions()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <h2 class="hr-title">
        基本信息
      </h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="infoDataForm.username" :disabled="props.dialogType === 'edit'" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="infoDataForm.sex" filterable clearable placeholder="请选择" class="formInput">
          <el-option label="男" :value="0" />
          <el-option label="女" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="infoDataForm.age" placeholder="请输入" maxlength="2" class="formInput" />
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-input v-model.number="infoDataForm.phone" maxlength="11" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="证件类型" prop="papersId">
        <CommonSelect post-param="credentials-type" :select-value="infoDataForm.papersId" class="formInput" @select-change="getCardType" />
      </el-form-item>
      <el-form-item label="证件号码" prop="numberId">
        <el-input v-model="infoDataForm.numberId" placeholder="请输入" class="formInput" />
      </el-form-item>
      <h2 class="hr-title">
        职位信息
      </h2>
      <el-form-item label="军衔" prop="militaryId">
        <el-input v-model="infoDataForm.militaryId" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="分组" prop="organizationId">
        <el-tree-select v-model="infoDataForm.organizationId" clearable default-expand-all node-key="id" check-strictly :props="props1" :data="data.organOptions" class="formInput" />
      </el-form-item>

      <el-form-item label="职称" prop="positionId">
        <el-input v-model="infoDataForm.positionId" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="infoDataForm.remark" placeholder="请输入" class="formInput" />
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
