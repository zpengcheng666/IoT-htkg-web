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
  type: {
    type: String,
    default: 'add',
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
    label: '名称',
  },
  {
    prop: 'dutyPostion',
    label: '职位',
    slot: 'dutyPostion',
  },
  {
    prop: 'dutyPost',
    slot: 'dutyPost',
    label: '岗位',
  },
  {
    prop: 'dutySjd',
    slot: 'dutySjd',
    label: '时间段',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '120px',
  },
])

const data = reactive({
  form: {
    name: '',
    tableData: [] as any,
  },
  dutyPostOptions: [] as any,
  dutySjdOptions: [] as any,
  dutyPostionOptions: [] as any,
  personOptions: [] as any,
})
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 获取列表
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      val.personList = data.form.tableData
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
// 获取人员下拉数据
function getPersonOptions() {
  api.get('system/basePerson/listPerson').then((res: any) => {
    data.personOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取岗位下拉数据
function getDutyPostOptions() {
  const postData = {
    params: { type: 'post-duty' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.dutyPostOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取时间段下拉数据
function getDutySjdOptions() {
  const postData = {
    params: { type: 'time-period' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.dutySjdOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取职位下拉数据
function getDutyPostionOptions() {
  const postData = {
    params: { type: 'postion-duty' },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.dutyPostionOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入小组名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入小组编号', trigger: 'blur' },
  ],
})
// 添加岗位与人员
function addPerson() {
  const obj = {
    name: '',
    dutyPost: '',
    dutySjd: '',
    dutyPostion: '',
  }
  data.form.tableData.push(obj)
}
// 选择人员
function selectPerson(val: any, index: any) {
  for (const i in data.personOptions) {
    if (val === data.personOptions[i].name) {
      data.form.tableData[index].dutyPost = data.personOptions[i].position_disp
      data.form.tableData[index].dutyPostion = data.personOptions[i].military_disp
    }
  }
}
onMounted(() => {
  getDutySjdOptions()
  getDutyPostOptions()
  getDutyPostionOptions()
  getPersonOptions()
  if (props.type === 'edit') {
    data.form.tableData = infoDataForm.personList
  }
  // console.log(data.form.tableData)
})
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
          <el-form-item label="小组名称" prop="name">
            <el-input v-model="infoDataForm.name" placeholder="请输入" class="formInput" />
          </el-form-item>
          <el-form-item label="小组编号" prop="code">
            <el-input-number v-model="infoDataForm.code" placeholder="请输入" class="formInput" :min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="4" class="col-right">
          <el-form-item>
            <el-button type="warning" :icon="Plus" @click="addPerson()">
              新增小组人员
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
        <!-- <el-input v-model="item.row.name" placeholder="请输入" class="formInput" /> -->
        <el-select
          v-model="item.row.name"
          filterable clearable
          placeholder="请选择"
          class="formInput"
          @change="selectPerson(item.row.name, item.$index)"
        >
          <el-option
            v-for="i in data.personOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select>
      </template>
      <template #dutyPost="{ item }">
        <!-- <el-select
          v-model="item.row.dutyPost"
          filterable clearable
          placeholder="请选择"
          class="formInput"
        >
          <el-option
            v-for="i in data.dutyPostOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select> -->
        <el-input v-model="item.row.dutyPost" placeholder="请输入" class="formInput" />
      </template>
      <template #dutySjd="{ item }">
        <!-- <el-select
          v-model="item.row.dutySjd"
          filterable clearable
          placeholder="请选择"
          class="formInput"
        >
          <el-option
            v-for="i in data.dutySjdOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select> -->
        <el-input v-model="item.row.dutySjd" placeholder="请输入" class="formInput" />
      </template>
      <template #dutyPostion="{ item }">
        <!-- <el-select
          v-model="item.row.dutyPostion"
          filterable clearable
          placeholder="请选择"
          class="formInput"
        >
          <el-option
            v-for="i in data.dutyPostionOptions"
            :key="i.id"
            :label="i.name"
            :value="i.name"
          />
        </el-select> -->
        <el-input v-model="item.row.dutyPostion" placeholder="请输入" class="formInput" />
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

.formInput {
  width: 120px;
}
</style>
