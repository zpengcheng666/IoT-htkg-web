<!--
 * @Description:新增供应商弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-12-08 09:55:41
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-16 09:44:13
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
    // 分类下拉
  groudOptions: {
    type: Array,
    default() {
      return []
    },
  },
  // 仓库下拉
  wareOptions: {
    type: Array,
    default() {
      return []
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
  itemName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  itemNo: [
    { required: true, message: '请输入编号', trigger: 'blur' },
  ],
  itemType: [
    { required: true, message: '请输入分类', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请输入数量', trigger: 'blur' },
  ],
  areaId: [
    { required: true, message: '请输入座机号', trigger: 'blur' },
  ],
  quantity: [
    { required: true, message: '请输入安全库存', trigger: 'blur' },
  ],

})
const groupProps = {
  value: 'id',
  label: 'typeName',
  disabled: 'disabled'
}

const wareProps = {
  value: 'id',
  label: 'name',
}

</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules"  :model="infoDataForm" class="demo-form-inline" label-width="100px">

      <el-form-item label="名称" placeholder="请输入"  prop="itemName"  class="formInput">
        <el-input v-model="infoDataForm.itemName" />
      </el-form-item>
      <el-form-item label="编号" placeholder="请输入"  prop="itemNo"  class="formInput">
        <el-input v-model="infoDataForm.itemNo" />
      </el-form-item>
      <el-form-item label="分类" placeholder="请输入" class="formInput" prop="itemType">
        <el-tree-select v-model="infoDataForm.itemType" clearable default-expand-all node-key="id" check-strictly :props="groupProps" :data="props.groudOptions" class="formInput" />
      </el-form-item>
      <el-form-item label="规格" placeholder="请输入" class="formInput" >
        <el-input v-model="infoDataForm.specification" />
      </el-form-item>
      <!-- <el-form-item label="所属库区" placeholder="请输入" class="formInput" prop="areaId">
        <el-tree-select v-model="infoDataForm.areaId" clearable default-expand-all node-key="id"  :props="wareProps" :data="props.wareOptions" class="formInput" />
      </el-form-item> -->
      <el-form-item label="安全库存" placeholder="请输入" class="formInput" prop="quantity">
        <el-input-number  :min="1" v-model="infoDataForm.quantity" />
      </el-form-item>
      <el-form-item label="单位" placeholder="请输入" class="formInput" prop="unit">
        <el-input v-model="infoDataForm.unit" />
      </el-form-item>
      <el-form-item label="有效期" placeholder="请输入" class="formInput">
        <el-date-picker
          v-model="infoDataForm.expiryDate"
          style="width: 100%;"
          type="date"
          value-format="YYYY-MM-DD "
        />
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
  width: 360px;
}
</style>
