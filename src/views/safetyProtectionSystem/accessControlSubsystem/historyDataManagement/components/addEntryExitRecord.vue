<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import addPerson from './addPerson.vue'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  devDoorOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  // 类型
  dialogType: {
    type: String,
    default: 'add',
  },
  // 标题
  title: {
    type: String,
    default: '新增进出记录',
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
const data = reactive({
  personList: [] as any[], // 内部人员列表
  dialogTitle: '新增',
  dialogType: 'add',
  personInfo: {},
})
const dialogAddPerson = ref(false) // 添加弹窗
// 点击新增人员
function clickAddPerson() {
  data.personInfo = {}
  data.dialogTitle = '新增人员'
  data.dialogType = 'add'
  dialogAddPerson.value = true
}
// 点击编辑人员
function editPerson(val: any) {
  data.personInfo = val
  data.dialogTitle = '编辑人员'
  data.dialogType = 'edit'
  dialogAddPerson.value = true
}
const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  val.perList = data.personList
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (data.personList.length < 1) {
        ElMessage({
          type: 'error',
          message: '请添加进出人员',
        })
        return
      }
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

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const insiderTableHeader = reactive([
  {
    prop: 'perName',
    label: '姓名',
  },
  {
    prop: 'sex',
    slot: 'sex',
    label: '性别',
    width: '80px',
  },

  {
    prop: 'perCareer',
    label: '职位',
  },
  {
    prop: 'perDepart',
    label: '单位',
  },
  {
    prop: 'perDepartType',
    label: '单位类型',
  },
  {
    prop: 'perCardType',
    label: '证件类型',
  },
  {
    prop: 'perCardId',
    label: '证件号码',
    width: '150px',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '180px',
  },
])
// 开门类型
function getOpenType(val: any) {
  infoDataForm.openType = val
}
// 删除内部人员
function delInsider(index: number) {
  // console.log(index)
  data.personList.splice(index, 1)
}

function addPersonSubmint(val: any) {
  // console.log(val)
  if (data.dialogType === 'add') {
    data.personList.push(val)
  }
  else if (data.dialogType === 'edit') {
    data.personInfo = val
  }
  // console.log(data.personList)
  dialogAddPerson.value = false
}
function closePersonDialog() {
  dialogAddPerson.value = false
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  doorId: [{
    required: true,
    message: '请选择门',
    trigger: 'change',
  }],
  perNumRecord: [
    { required: true, message: '请输入人数', trigger: 'blur' },
  ],
  accessType: [{
    required: true,
    message: '请选进出类型',
    trigger: 'change',
  }],
  openTime: [{
    required: true,
    message: '请选择开门时间',
    trigger: 'change',
  }],
  enterReason: [{
    required: true,
    message: '请选输入进出原因',
    trigger: 'blur',
  }],
})
onMounted(() => {
  // console.log(props.infoData)
  if (props.infoData.perList) {
    data.personList = props.infoData.perList
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <h2 class="hr-title">
      进出信息
    </h2>
    <el-form ref="ruleFormRef" :rules="rules" :inline="true" :disabled="props.dialogType === 'info'" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="门名称：" prop="doorId">
        <el-select v-model="infoDataForm.doorId" filterable clearable placeholder="请选择门名称" class="formInput">
          <el-option
            v-for="item in props.devDoorOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="进出人数：" prop="perNumRecord">
        <el-input v-model.number="infoDataForm.perNumRecord" placeholder="请输入" maxlength="2" class="formInput" />
      </el-form-item>
      <el-form-item label="进出类型：" prop="accessType">
        <el-select v-model="infoDataForm.accessType" filterable clearable placeholder="请选择出入类型" class="formInput">
          <el-option label="进门" value="entryCard" />
          <el-option label="出门" value="exitCard" />
        </el-select>
      </el-form-item>
      <el-form-item label="开门时间" prop="openTime">
        <el-date-picker
          v-model="infoDataForm.openTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="进出原因：" prop="enterReason">
        <el-input v-model="infoDataForm.enterReason" class="formInput" />
      </el-form-item>
    </el-form>
    <h2 class="hr-title">
      进出人员信息
    </h2>
    <div>
      <div v-if="props.dialogType !== 'info' " style="overflow: hidden;">
        <el-button type="warning" style="float: right;" @click="clickAddPerson()">
          新增
        </el-button>
      </div>

      <CommonTable
        :table-data="data.personList"
        :table-header="insiderTableHeader"
        :is-select="false"
        :is-page="false"
      >
        <template #sex="{ item }">
          <span>{{ item.row.sex === 0 ? '女' : '男' }}</span>
        </template>

        <template #operation="{ item }">
          <el-button v-if="props.dialogType !== 'info'" type="primary" size="small" @click="editPerson(item.row)">
            编辑
          </el-button>
          <el-button v-if="props.dialogType !== 'info'" type="danger" size="small" @click="delInsider(item.$index)">
            删除
          </el-button>
          <span v-if="props.dialogType === 'info'">--</span>
        </template>
      </CommonTable>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(ruleFormRef, infoDataForm)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <addPerson v-if="dialogAddPerson" :title="data.dialogTitle" :dialog-visible="dialogAddPerson" :info-data="data.personInfo" @close-dialog="closePersonDialog" @submit-dialog="addPersonSubmint" />
</template>

<style lang="scss" scoped>
.hr-title {
  margin: 0;
  padding: 0 0 12px 16px;
  font-size: 16px;
  font-weight: normal;
  background: linear-gradient(#e5e5e5, #e5e5e5) no-repeat calc(16px * 8) calc(100% - 20px);
  background-size: 100% 1px;
}

.formInput {
  width: 200px;
}
</style>
