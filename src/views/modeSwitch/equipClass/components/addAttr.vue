<!--
 * @Description: 新增属性
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:10:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 13:51:41
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import AddAttrConfig from '@/views/modeSwitch/equipClass/components/addAttrConfig.vue'
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
  typeId: {
    type: String,
    default: '',
  },

})
const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])

const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  val.typeId = props.typeId
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
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  category: [
    { required: true, message: '请输入英文名称', trigger: 'blur' },
  ],
  sortNumber: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
  ],
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="70%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :model="infoDataForm" class="demo-form-inline" label-width="120px" size="small">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="英文名称：" prop="category">
        <el-input v-model="infoDataForm.category" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="数据类型：">
        <el-select v-model="infoDataForm.dataType" filterable clearable placeholder="请选择数据类型">
          <el-option label="整型" value="int" />
          <el-option label="字符串" value="string" />
          <el-option label="浮点型" value="float" />
          <el-option label="布尔型" value="bool" />
        </el-select>
      </el-form-item>
      <el-form-item label="初始值：">
        <el-input v-model="infoDataForm.initValue" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="最小值：">
        <el-input v-model="infoDataForm.minValue" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="最大值：">
        <el-input v-model="infoDataForm.maxValue" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="单位：">
        <el-input v-model="infoDataForm.unit" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="排序号：" prop="sortNumber">
        <el-input v-model="infoDataForm.sortNumber" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="展示区域：">
        <el-select v-model="infoDataForm.displayAreaList" multiple filterable clearable placeholder="请选择展示区域">
          <el-option label="悬浮气泡" value="popover" />
          <el-option label="数据表格" value="dataTable" />
          <el-option label="数据列表" value="dataList" />
        </el-select>
      </el-form-item>
      <el-form-item label="存储：">
        <el-switch v-model="infoDataForm.isSave" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="可控：">
        <el-switch v-model="infoDataForm.isAct" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="配置：">
        <el-switch v-model="infoDataForm.isConfigurable" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="关联：">
        <el-switch v-model="infoDataForm.isAssociate" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="关联变量：">
        <el-switch v-model="infoDataForm.isAssociateVar" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <el-row class="attr_box">
      <AddAttrConfig
        v-model="infoDataForm.valueMapList"
        title="映射值:"
        key-name="名称"
        value-name="映射值"
      />
      <AddAttrConfig
        v-if="infoDataForm.isConfigurable"
        v-model="infoDataForm.configOptionList"
        title="配置项:"
        key-name="名称"
        value-name="值"
      />
      <AddAttrConfig
        v-if="infoDataForm.isAct"
        v-model="infoDataForm.actList"
        title="控制命令:"
        key-name="指令名称"
        value-name="指令值"
      />
    </el-row>
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
.el-form-item {
  width: calc(100% / 3 - 12px);
  margin-right: 12px;
}

.el-form-item.fullWidth {
  width: 100%;
  margin-right: 0;

  :deep(.el-form-item__label) {
    text-align: right;
    width: 120px;
  }
}

.attr_box {
  max-height: 450px;
  overflow-y: auto;
}
</style>
