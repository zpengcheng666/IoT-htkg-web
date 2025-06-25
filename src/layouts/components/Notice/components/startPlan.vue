<!--
 * @Description: 启动预案弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-28 13:20:30
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 14:14:38
-->
<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'
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
    default: '启动预案',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

})

const emits = defineEmits(['submitDialog', 'closeDialog'])

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
const data = reactive({
  terminalOptiongs: [] as any,
  contingencyOptiongs: [] as any,
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  sponsor: [
    { required: true, message: '请输入启动人', trigger: 'blur' },
  ],
  termianlIds: [
    { required: true, message: '请选择终端', trigger: 'change' },
  ],
  contingencyId: [
    { required: true, message: '请选择预案', trigger: 'change' },
  ],
})
// 获取终端列表
function getTerminalOptiongs() {
  api.get('/alarm/alarmData/terminalOptiongs').then((res: any) => {
    // console.log(res)
    data.terminalOptiongs = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取预案列表
function getContingencyOptiongs() {
  api.get('/alarm/alarmData/contingencyOptiongs').then((res: any) => {
    data.contingencyOptiongs = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getTerminalOptiongs()
  getContingencyOptiongs()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :rules="rules" class="demo-form-inline" label-width="100px">
      <el-form-item label="启动人：" prop="sponsor">
        <el-input v-model="infoDataForm.sponsor" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="终端：" prop="termianlIds">
        <el-select v-model="infoDataForm.termianlIds" filterable clearable placeholder="请选择终端" class="formInput" multiple>
          <el-option
            v-for="item in data.terminalOptiongs"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预案：" prop="contingencyId">
        <el-select v-model="infoDataForm.contingencyId" filterable clearable placeholder="请选择预案" class="formInput">
          <el-option
            v-for="item in data.contingencyOptiongs"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
          启动
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
  width: 100%;
}
</style>
