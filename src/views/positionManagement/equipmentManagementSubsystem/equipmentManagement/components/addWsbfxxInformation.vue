<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
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
    default: '新增外水泵房信息',
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
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="120px">
      <el-form-item label="最近距离（m）" prop="zjjl">
        <el-input v-model="infoDataForm.zjjl" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="设施名称" prop="ssmc">
        <el-input v-model="infoDataForm.ssmc" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="取水方式" prop="qsfs">
        <el-input v-model="infoDataForm.qsfs" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="建筑面积" prop="jzmj">
        <el-input v-model="infoDataForm.jzmj" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="交付时间" prop="jfsj">
        <el-date-picker
          v-model="infoDataForm.jfsj"
          type="date"
          label="交付时间"
          placeholder="交付时间"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="质量状况" prop="zlzk">
        <el-input v-model="infoDataForm.zlzk" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="管理分队" prop="glfd">
        <el-input v-model="infoDataForm.glfd" placeholder="请输入" class="formInput" />
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
.col-right {
  display: flex;
  justify-content: flex-end;
}

.formInput {
  width: 260px;
}
</style>
