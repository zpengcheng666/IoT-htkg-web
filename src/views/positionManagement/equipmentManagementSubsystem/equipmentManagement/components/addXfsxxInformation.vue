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
    default: '新增消防栓信息',
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

const groupProps = {
  value: 'id',
  label: 'title',

}
const data = reactive({
  locationOptions: [] as any,
})

const getList = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.locationOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 校验
const ruleFormRef = ref<FormInstance>()
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
onMounted(() => {
  getList()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="120px">
      <el-form-item label="所在位置" prop="szwz">
        <el-tree-select v-model="infoDataForm.szwz" clearable default-expand-all node-key="id" check-strictly :props="groupProps" :data="data.locationOptions" class="formInput" />
      </el-form-item>
      <el-form-item label="设施名称" prop="ssmc">
        <el-input v-model="infoDataForm.ssmc" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="型号规格" prop="xhgg">
        <el-input v-model="infoDataForm.xhgg" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="出厂编号" prop="ccbh">
        <el-input v-model="infoDataForm.ccbh" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="sccj">
        <el-input v-model="infoDataForm.sccj" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="出厂日期" prop="ccrq">
        <el-date-picker
          v-model="infoDataForm.ccrq"
          type="date"
          label="出厂日期"
          placeholder="出厂日期"
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
