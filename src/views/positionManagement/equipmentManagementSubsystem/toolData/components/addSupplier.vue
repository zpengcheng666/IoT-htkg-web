<!--
 * @Description:新增供应商弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-29 14:53:08
-->
<script setup lang='ts'>

import type { FormInstance, FormRules } from 'element-plus'
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
    // console.log(val)
    return val
  },
})
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  carrierName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  carrierNo: [
    { required: true, message: '请输入编号', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
  ],
  tel: [
    { required: true, message: '请输入座机号', trigger: 'blur' },
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
  ],
  level: [
    { required: true, message: '请输入职位', trigger: 'blur' },
  ],
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules"  :model="infoDataForm" class="demo-form-inline" label-width="100px">

      <el-form-item label="名称" placeholder="请输入" class="formInput" prop="carrierName">
        <el-input v-model="infoDataForm.carrierName" />
      </el-form-item>
      <el-form-item label="编号" placeholder="请输入" class="formInput" prop="carrierNo">
        <el-input v-model="infoDataForm.carrierNo" />
      </el-form-item>
      <el-form-item label="地址" placeholder="请输入" class="formInput" prop="address">
        <el-input v-model="infoDataForm.address" />
      </el-form-item>
      <el-form-item label="手机号" placeholder="请输入" class="formInput" prop="mobile">
        <el-input v-model="infoDataForm.mobile" />
      </el-form-item>
      <el-form-item label="座机号" placeholder="请输入" class="formInput" prop="tel">
        <el-input v-model="infoDataForm.tel" />
      </el-form-item>
      <el-form-item label="联系人" placeholder="请输入" class="formInput" prop="contact">
        <el-input v-model="infoDataForm.contact" />
      </el-form-item>
      <el-form-item label="职位" placeholder="请输入" class="formInput" prop="level">
        <el-input v-model="infoDataForm.level" />
      </el-form-item>
      <el-form-item label="邮箱" placeholder="请输入" class="formInput" >
        <el-input v-model="infoDataForm.email" />
      </el-form-item>
      <el-form-item label="备注" placeholder="请输入" class="formInput" >
        <el-input v-model="infoDataForm.remark" />
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
