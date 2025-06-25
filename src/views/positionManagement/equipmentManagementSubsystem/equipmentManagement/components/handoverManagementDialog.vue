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
  deviceNameOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '新增记录',
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

const dialogAdd = ref(false) // 添加弹窗

const data = reactive({
  organOptions: [{
    id: '',
    title: '',
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
// 页数改变的时候触发的事件
// const submintDialog = (val: any) => {
//   emits('submintDialog', val)
// }
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
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="100px">
      <el-form-item label="设备名称：">
        <el-select v-model="infoDataForm.devId" placeholder="" filterable clearable class="formInput">
          <el-option
            v-for="item in props.deviceNameOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="交接时间：" prop="handoverTime">
        <el-date-picker
          v-model="infoDataForm.handoverTime"
          type="date"
          placeholder="请选择日期"
          style="width: 260px;"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="交付单位：" prop="deliverer">
        <el-input v-model="infoDataForm.deliverer" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="交付人：" prop="deliverMan">
        <el-input v-model="infoDataForm.deliverMan" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="接收单位：" prop="receiver">
        <el-input v-model="infoDataForm.receiver" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="接收人：" prop="receiveMan">
        <el-input v-model="infoDataForm.receiveMan" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="监交人：" prop="monitor">
        <el-input v-model="infoDataForm.monitor" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="备注：" prop="note">
        <el-input v-model="infoDataForm.note" type="textarea" placeholder="请输入" class="formInput" />
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
