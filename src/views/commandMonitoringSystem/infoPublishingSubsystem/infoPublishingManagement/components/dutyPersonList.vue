<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'

import CommonTable from '@/components/ConmonTable/index.vue'
import api from '@/api'
const props = defineProps({
  // 详情数据
  dutyPersonList: {
    type: Array,
    default() {
      return []
    },
  },
  dutyPersonId: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '值班人员',
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
    label: '值班人员',
    slot: 'name',
  },
  {
    prop: 'dutyPostion',
    label: '职位',
    slot: 'dutyPostion',
  },
  {
    prop: 'dutyPost',
    label: '岗位',
    slot: 'dutyPost',
  },
  {
    prop: 'dutySjd',
    label: '时间段',
    slot: 'dutySjd',
  },

])

const data = reactive({
  dutyPostOptions: [] as any,
  dutySjdOptions: [] as any,
  dutyPostionOptions: [] as any,
  personOptions: [] as any,
  isEdit: false,
})

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
// 像下面这样做就使 prop 和后续更新无关了
const dutyPersonListForm = reactive(props.dutyPersonList) as any
// 选择人员
function selectPerson(val: any, index: any) {
  for (const i in data.personOptions) {
    if (val === data.personOptions[i].name) {
      dutyPersonListForm[index].dutyPost = data.personOptions[i].position_disp
      dutyPersonListForm[index].dutyPostion = data.personOptions[i].military_disp
    }
  }
}

// 点击编辑
function clickEdit() {
  data.isEdit = true
}
// 取消编辑
function cancelEdit() {
  data.isEdit = false
}
// 保存
function save() {
  const postData = {
    id: props.dutyPersonId,
    shifts: dutyPersonListForm,
  }
  api.post('/message/dutyShifts/edit', postData).then((res: any) => {
    // console.log(res)
    ElMessage({
      type: 'success',
      message: res.message,
    })
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  getDutyPostOptions()
  getDutyPostionOptions()
  getDutySjdOptions()
  getPersonOptions()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-row>
      <el-col :span="24">
        <el-button v-if="!data.isEdit" type="primary" :icon="Edit" @click="clickEdit()">
          编辑
        </el-button>
      </el-col>
    </el-row>
    <CommonTable
      :table-data="dutyPersonListForm"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
    >
      <template #name="{ item }">
        <!-- <el-input v-if="data.isEdit" v-model="item.row.name" placeholder="请输入" class="formInput" /> -->
        <el-select
          v-if="data.isEdit"
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
        <span v-if="!data.isEdit">{{ item.row.name }}</span>
      </template>
      <template #dutyPost="{ item }">
        <!-- <el-select
          v-if="data.isEdit"
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
        <el-input v-if="data.isEdit" v-model="item.row.dutyPost" placeholder="请输入" class="formInput" />
        <span v-if="!data.isEdit">{{ item.row.dutyPost }}</span>
      </template>
      <template #dutySjd="{ item }">
        <!-- <el-select
          v-if="data.isEdit"
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
        <el-input v-if="data.isEdit" v-model="item.row.dutySjd" placeholder="请输入" class="formInput" />
        <span v-if="!data.isEdit">{{ item.row.dutySjd }}</span>
      </template>
      <template #dutyPostion="{ item }">
        <!-- <el-select
          v-if="data.isEdit"
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
        <el-input v-if="data.isEdit" v-model="item.row.dutyPostion" placeholder="请输入" class="formInput" />
        <span v-if="!data.isEdit">{{ item.row.dutyPostion }}</span>
      </template>
    </CommonTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="data.isEdit" type="primary" @click="save">保存</el-button>
        <el-button v-if="data.isEdit" type="info" @click="cancelEdit()">
          取消编辑
        </el-button>
        <el-button @click="closeDialog">关闭</el-button>
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
  width: 100px;
}
// .dialog-footer {
//   text-align: center;
// }
</style>
