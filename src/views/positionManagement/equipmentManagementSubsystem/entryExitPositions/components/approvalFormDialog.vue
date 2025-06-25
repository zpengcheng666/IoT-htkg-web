<script setup lang='ts'>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'

import CommonTable from '@/components/ConmonTable/index.vue'

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  internalOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  idTypeOptions: {
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
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const insiderTableHeader = reactive([
  {
    prop: 'name',
    label: '姓名',
    slot: 'selectInsider',
  },
  {
    prop: 'sex',
    slot: 'sex',
    label: '性别',
  },
  {
    prop: 'workunit',
    label: '单位',
  },
  {
    prop: 'position',
    label: '职位',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])
const outsiderTableHeader = reactive([
  {
    prop: 'name',
    label: '姓名',
    slot: 'name',
  },
  {
    prop: 'sex',
    label: '性别',
    slot: 'sex',
  },
  {
    prop: 'department',
    label: '单位',
    slot: 'department',
  },
  {
    prop: 'position2',
    label: '职位',
    slot: 'position2',
  },
  {
    prop: 'idType',
    label: '证件类型',
    slot: 'idType',
  },
  {
    prop: 'idNum',
    label: '证件号码',
    slot: 'idNum',
  },
  {
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: '260px',
  },
])

const activeNames = ref(['1', '2'])

const data = reactive({
  insiderList: [] as any[], // 内部人员列表
  outsiderList: [] as any[], // 外部人员列表
})

const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      val.outsiderList = data.outsiderList
      val.insiderList = data.insiderList
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

// 添加内部人员
function addInsider() {
  const obj = {
    personId: '',
    position: '',
    sex: '',
    workunit: '',
  }
  data.insiderList.push(obj)
}
// 选择内部人员
function selectInsider(index: number, id: any) {
  for (const i in props.internalOptions) {
    if (props.internalOptions[i].id === id) {
      data.insiderList[index].position = props.internalOptions[i].positions
      data.insiderList[index].sex = props.internalOptions[i].sex
      data.insiderList[index].workunit = props.internalOptions[i].workUnit
      data.insiderList[index].personId = props.internalOptions[i].id
    }
  }
}
// 删除内部人员
function delInsider(index: number) {
  // console.log(index)
  data.insiderList.splice(index, 1)
}
// 添加外部人员
function addOutsider() {
  const obj = {
    name: '',
    sex: '',
    department: '',
    position2: '',
    idType: '',
    idNum: '',
  }
  data.outsiderList.push(obj)
}
// 选择外部人员
function selectOutsider(index: number, id: any) {

}
// 删除外部人员
function delOutsider(index: number) {
  data.outsiderList.splice(index, 1)
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
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  department: [
    { required: true, message: '请输入申请单位', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  leaderId: [
    { required: true, message: '请选择带队人', trigger: 'change' },
  ],
  inTime: [
    {
      required: true,
      message: '请选择入库时间',
      trigger: 'change',
    },
  ],
  outTime: [{
    required: true,
    message: '请选择出库时间',
    trigger: 'change',
  }],
  reason: [
    { required: true, message: '请输入入库事由', trigger: 'blur' },
  ],
  zone: [
    { required: true, message: '请输入活动区域', trigger: 'blur' },
  ],

})

onMounted(() => {
  if (infoDataForm.insiderList) {
    data.insiderList = infoDataForm.insiderList
  }
  if (infoDataForm.outsiderList) {
    data.outsiderList = infoDataForm.outsiderList
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="60%"
    :before-close="closeDialog"
    top="3vh"
  >
    <h2 class="hr-title">
      审批单信息
    </h2>
    <el-form ref="ruleFormRef" :model="infoDataForm" :rules="rules" class="demo-form-inline" label-width="100px" :inline="true">
      <el-form-item label="申请单位：" prop="department">
        <el-input v-model="infoDataForm.department" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="带队人：" prop="leaderId">
        <!-- <el-input v-model="infoDataForm.leader" placeholder="请输入" class="formInput" /> -->
        <el-select v-model="infoDataForm.leaderId" placeholder="" filterable clearable>
          <el-option
            v-for="i in props.internalOptions"
            :key="i.id"
            :label="i.name"
            :value="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位：">
        <el-input v-model="infoDataForm.position1" placeholder="请输入" class="formInput" />
      </el-form-item>

      <el-form-item label="入库时间：" prop="inTime">
        <!-- <el-input v-model="infoDataForm.inTime" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.inTime"
          type="datetime"
          placeholder="请选择日期"
          style="width: 100%;"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="出库时间：" prop="outTime">
        <!-- <el-input v-model="infoDataForm.outTime" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.outTime"
          type="datetime"
          placeholder="请选择日期"
          style="width: 100%;"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="申请状态：">
        <!-- <el-input v-model="infoDataForm.status" placeholder="请输入" class="formInput" /> -->
        <el-select v-model="infoDataForm.status" placeholder="请选择" filterable clearable>
          <el-option label="待审核" :value="0" />
          <el-option label="已审核" :value="1" />
          <el-option label="未通过" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="入库事由：" prop="reason">
        <el-input v-model="infoDataForm.reason" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="活动区域：" prop="zone">
        <el-input v-model="infoDataForm.zone" type="textarea" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="同行人数：">
        <el-input v-model="infoDataForm.count" placeholder="请输入" class="formInput" />
      </el-form-item>
    </el-form>
    <h2 class="hr-title">
      通行人员列表
    </h2>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <!-- slot="title" -->
            <span class="collapse-title">内部人员列表<el-icon color="#ff0000"><Plus @click.stop="addInsider" /></el-icon></span>
          </template>
          <div>
            <CommonTable
              :table-data="data.insiderList"
              :table-header="insiderTableHeader"
              :is-select="false"
              :is-page="false"
            >
              <template #sex="{ item }">
                <span>{{ item.row.sex === 0 ? '女' : '男' }}</span>
              </template>
              <template #selectInsider="{ item }">
                <el-select v-model="item.row.personId" filterable clearable placeholder="" @change="selectInsider(item.$index, item.row.personId)">
                  <el-option
                    v-for="i in props.internalOptions"
                    :key="i.id"
                    :label="i.name"
                    :value="i.id"
                  />
                </el-select>
              </template>
              <template #operation="{ item }">
                <el-button type="danger" size="small" @click="delInsider(item.$index)">
                  删除
                </el-button>
              </template>
            </CommonTable>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <!-- slot="title" -->
            <span class="collapse-title">外部人员列表<el-icon color="#ff0000"><Plus @click.stop="addOutsider" /></el-icon></span>
          </template>
          <div>
            <CommonTable
              :table-data="data.outsiderList"
              :table-header="outsiderTableHeader"
              :is-select="false"
              :is-page="false"
            >
              <template #name="{ item }">
                <el-input v-model="item.row.name" placeholder="请输入" />
              </template>
              <template #sex="{ item }">
                <el-select v-model="item.row.sex" filterable clearable placeholder="请选择">
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="0" />
                </el-select>
              </template>
              <template #department="{ item }">
                <el-input v-model="item.row.department" placeholder="请输入" />
              </template>
              <template #position2="{ item }">
                <el-input v-model="item.row.position2" placeholder="请输入" />
              </template>
              <template #idType="{ item }">
                <el-select v-model="item.row.idType" filterable clearable placeholder="">
                  <el-option
                    v-for="i in props.idTypeOptions"
                    :key="i.id"
                    :label="i.name"
                    :value="i.id"
                  />
                </el-select>
              </template>
              <template #idNum="{ item }">
                <el-input v-model="item.row.idNum" placeholder="请输入" />
              </template>
              <template #operation="{ item }">
                <el-button type="danger" size="small" @click="delOutsider(item.$index)">
                  删除
                </el-button>
              </template>
            </CommonTable>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
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
.hr-title {
  margin: 0;
  padding: 0 0 12px 16px;
  font-size: 16px;
  font-weight: normal;
  background: linear-gradient(#e5e5e5, #e5e5e5) no-repeat calc(16px * 8) calc(100% - 20px);
  background-size: 100% 1px;
}

:deep(.el-collapse-item__arrow) {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  background: linear-gradient(#333, #333) no-repeat center center, linear-gradient(#333, #333) no-repeat center center, linear-gradient(#fff, #fff);
  background-size: 60% 2px, 2px 60%, 100%;
}

:deep(.el-collapse-item__arrow.is-active) {
  background: linear-gradient(#333, #333) no-repeat center center, linear-gradient(#fff, #fff);
  background-size: 2px 60%, 100%;
}

:deep(.el-collapse-item__arrow svg) {
  display: none;
}

.el-form--inline .el-form-item {
  width: calc(100% / 3 - 32px);
}

.collapse-title {
  position: relative;
  flex: 1 0 90%;
  order: 1;

  :deep(.el-icon) {
    position: absolute;
    right: 32px;
    top: calc(50% - 0.5em);
  }
}

:deep(.el-collapse-item__header) {
  background-color: #f9f9f9 !important;
  border: 1px solid #e3e3e3 !important;
  padding-left: 1rem;
}

:deep(.el-collapse-item__content) {
  border: 1px solid #e3e3e3;
  border-top: none;
  margin-bottom: 0.5rem;
  padding: 0;

  .el-row {
    padding-top: 1rem;
    margin-bottom: 0 !important;
  }
}

.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
