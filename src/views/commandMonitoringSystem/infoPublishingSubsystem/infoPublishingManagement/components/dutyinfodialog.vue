<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import api from '@/api'

import CommonTable from '@/components/ConmonTable/index.vue'

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  personOptions: {
    type: Array<any>,
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
const emits = defineEmits(['submitDialog', 'closeDialog'])

// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'name',
    slot: 'name',
    label: '值班岗位',
  },
  {
    prop: 'dutyInfo',
    slot: 'dutyInfo',
    label: '值班人员（空格分隔）',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '150px',
  },
])

const data = reactive({
  form: {
    name: '',
    tableData: [] as any,
  },
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
onMounted(() => {
  // return false
  for (const i in infoDataForm.types) {
    const arr = []
    for (const j in infoDataForm.types[i].watchkeepers) {
      arr.push(infoDataForm.types[i].watchkeepers[j].name)
    }
    infoDataForm.types[i].watchkeepers = arr
  }
  data.form.tableData = infoDataForm.types
  // console.log(data.form.tableData)
})
// 获取列表
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      val.types = data.form.tableData
      // console.log(val)
      // return false
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

// 删除
function del(index: number) {
// 删除内部人员
  data.form.tableData.splice(index, 1)
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
    { required: true, message: '请输入值班安排', trigger: 'blur' },
  ],
})
// 添加岗位与人员
function addPerson() {
  const obj = {
    name: '',
    watchkeepers: '',
  }
  data.form.tableData.push(obj)
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="40%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :inline="true" :model="infoDataForm" :rules="rules" class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="值班安排" prop="name">
            <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="col-right">
          <el-form-item>
            <el-button type="warning" :icon="Plus" @click="addPerson()">
              新增岗位与人员
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <CommonTable
      :table-data="data.form.tableData"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
    >
      <template #name="{ item }">
        <el-input v-model="item.row.name" placeholder="请输入" class="formInput" />
      </template>
      <template #dutyInfo="{ item }">
        <el-select
          v-model="item.row.watchkeepers"
          multiple
          filterable clearable
          placeholder="请选择"
          style="width: 240px;"
        >
          <el-option
            v-for="i in props.personOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select>
      </template>
      <template #operation="{ item }">
        <el-button type="danger" size="small" @click="del(item.$index)">
          删除
        </el-button>
      </template>
    </CommonTable>
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
</style>
