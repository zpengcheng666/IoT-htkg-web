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
    default: '新增属性',
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
      <el-form-item label="设备ID" prop="tid">
        <el-input v-model="infoDataForm.tid" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="设备种类" prop="sbzl">
        <el-input v-model="infoDataForm.sbzl" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="运行性质内码" prop="yxxznm">
        <el-input v-model="infoDataForm.yxxznm" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="运行情况" prop="zlzknm">
        <el-input v-model="infoDataForm.zlzknm" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="运行时长" prop="runTime">
        <el-input v-model="infoDataForm.runTime" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="开机时间" prop="startTime">
        <!-- <el-input v-model="infoDataForm.mcdxrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.startTime"
          type="date"
          label="开机时间"
          placeholder="开机时间"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="关机时间" prop="endTime">
        <!-- <el-input v-model="infoDataForm.cyjccrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.endTime"
          type="date"
          label="关机时间"
          placeholder="关机时间"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="开机类型" prop="startType">
        <el-input v-model="infoDataForm.startType" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="关机类型" prop="offType">
        <el-input v-model="infoDataForm.offType" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="开机人" prop="startName">
        <el-input v-model="infoDataForm.startName" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="关机人" prop="endName">
        <el-input v-model="infoDataForm.endName" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="填表日期" prop="recordTime">
        <!-- <el-input v-model="infoDataForm.fdjccrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.recordTime"
          type="date"
          label="填表日期"
          placeholder="填表日期"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="填表人" prop="recordUid">
        <el-input v-model="infoDataForm.recordUid" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="审核时间" prop="checkTime">
        <!-- <el-input v-model="infoDataForm.mchjbyrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.checkTime"
          type="date"
          label="审核时间"
          placeholder="审核时间"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="审核人" prop="checkUid">
        <el-input v-model="infoDataForm.checkUid" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="是否审核" prop="isChecked">
        <el-input v-model="infoDataForm.isChecked" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="出水压力" prop="sumpL">
        <el-input v-model="infoDataForm.sumpL" placeholder="请输入" class="formInput" />
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
