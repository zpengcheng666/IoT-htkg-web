<!--
 * @Description: 新增/编辑卫星临空弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-04-26 16:37:30
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-17 10:47:44
-->
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
    default: '临空卫星信息',
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

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入卫星名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入卫星编号', trigger: 'blur' },
  ],
  enterTime: [
    { required: true, message: '请选择进入时间', trigger: 'change' },
  ],
  leaveTime: [
    { required: true, message: '请选择离开时间', trigger: 'change' },
  ],
  satelliteType: [
    { required: true, message: '请选择卫星类型', trigger: 'change' },
  ],
  interval1: [
    { required: true, message: '请输入卫星周期', trigger: 'blur' },
  ],
  period: [
    { required: true, message: '请输入过境时长', trigger: 'blur' },
  ],
})
function getNationality(val: any) {
  infoDataForm.nationality = val
}
function getSatelliteType(val: any) {
  infoDataForm.satelliteType = val
}
const disabledDateFn = (time: any) => {
  return time.getTime() < Date.now() - 24 * 3600 * 1000
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="25%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="卫星名称" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="卫星编号" prop="code">
        <el-input v-model="infoDataForm.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="卫星国别" prop="nationality">
        <!-- <CommonSelect post-param="nationality-list" :select-value="infoDataForm.nationality" class="formInput" @select-change="getNationality" /> -->
        <el-input v-model="infoDataForm.nationality" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="卫星类型" prop="satelliteType">
        <!-- <CommonSelect post-param="satellite-type-list" :select-value="infoDataForm.satelliteType" class="formInput" @select-change="getSatelliteType" /> -->
        <el-input v-model="infoDataForm.satelliteType" placeholder="请输入" />
      </el-form-item>
      <!-- <el-form-item label="是否周期">
        <el-switch v-model="infoDataForm.intervalFlag" inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.intervalFlag === 1" label="卫星周期" prop="interval1">
        <el-input v-model.number="infoDataForm.interval1" placeholder="请输入">
          <template #append>
            分
          </template>
        </el-input>
      </el-form-item> -->
      <!-- <el-form-item label="过境时长" >
        <el-input v-model.number="infoDataForm.period" placeholder="请输入">
        </el-input>
      </el-form-item> -->
      <el-form-item label="进入时间" prop="enterTime">
        <el-date-picker
          v-model="infoDataForm.enterTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期"
          style="width: 100%;"
          :disabled-date="disabledDateFn"
        />
      </el-form-item>
      <el-form-item label="离开时间" prop="leaveTime">
        <el-date-picker
          v-model="infoDataForm.leaveTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期"
          style="width: 100%;"
          :disabled-date="disabledDateFn"
        />
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
  width: 100%;
}
</style>
