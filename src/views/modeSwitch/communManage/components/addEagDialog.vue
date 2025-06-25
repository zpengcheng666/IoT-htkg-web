<!--
 * @Description:新增网关弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:00:12
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
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  ip: [
    { required: true, message: '请输入通信地址', trigger: 'blur' },
  ],
  port: [
    { required: true, message: '请输入通信端口', trigger: 'blur' },
  ],
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
      <el-form-item label="识别码" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.id" disabled />
      </el-form-item>

      <el-form-item label="名称" placeholder="请输入" class="formInput" prop="name">
        <el-input v-model="infoDataForm.name" />
      </el-form-item>
      <el-form-item label="通信地址" placeholder="请输入" class="formInput" prop="ip">
        <el-input v-model="infoDataForm.ip" />
      </el-form-item>

      <el-form-item label="通信端口" placeholder="请输入" class="formInput" prop="port">
        <el-input v-model="infoDataForm.port" />
      </el-form-item>
      <el-form-item label="用户名" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.userName" />
      </el-form-item>

      <el-form-item label="密码" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.password" />
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
