<!--
 * @Description: 添加属性值弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-08 16:05:50
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:55:23
-->
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, Edit,  Plus } from '@element-plus/icons-vue'
const props = defineProps<{
  title: string
  keyName: string
  valueName: string
  modelValue: any[]
}>()
const emit = defineEmits(['update:modelValue'])
const data = reactive({
  addShow: false,
  isAdd: false,
  addData: {
    name: '',
    value: '',
  },
  dataList: [] as any[],
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: `请填写${props.keyName}`, trigger: 'blur' },
  ],
  value: [
    { required: true, message: `请填写${props.valueName}`, trigger: 'blur' },
  ],

})
function add() {
  data.addData = {
    name: '',
    value: '',
  }
  data.isAdd = true
  data.addShow = true
}
function del(index: number) {
  ElMessageBox.confirm(
    '此操作将删除该数据，是否删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      data.dataList.splice(index, 1)
      setModel()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
function closeDialog() {
  data.addShow = false
}
const submitDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (data.isAdd) {
        data.dataList.push({
          name: data.addData.name,
          value: data.addData.value,
        })
      }
      setModel()
      closeDialog()
    }
  })
}
function setModel() {
  emit('update:modelValue', data.dataList)
}
function clickEdit(row: any) {
  data.isAdd = false
  data.addData = row
  data.addShow = true
}
onMounted(() => {
  if (props.modelValue) {
    data.dataList = props.modelValue
  }
  else {
    data.dataList = []
  }
})
</script>

<template>
  <el-col :span="8">
    <el-form-item :label="props.title" class="fullWidth">
      <el-table :data=" data.dataList" border>
        <el-table-column align="center" :label="props.keyName" prop="name" />
        <el-table-column align="center" :label="props.valueName" prop="value" />
        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template #header>
            操作
            <el-button :icon="Plus" size="small" circle @click="add" />
          </template>
          <template #default="scope">
            <el-button type="primary" :icon="Edit" :dark="true" @click="clickEdit(scope.row)" />
            <el-button type="primary" :icon="Delete" @click="del(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-col>
  <el-dialog v-model="data.addShow" :title="`添加${props.title}`" width="30%">
    <el-form ref="ruleFormRef" :model="data.addData" :rules="rules" label-position="right" label-width="100px">
      <el-form-item :label="`${props.keyName}:`" prop="name">
        <el-input v-model="data.addData.name" style="width: 260px;" />
      </el-form-item>
      <el-form-item :label="`${props.valueName}:`" prop="value">
        <el-input v-model="data.addData.value" style="width: 260px;" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

