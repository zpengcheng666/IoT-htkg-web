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
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <CommonTable
      :table-data="props.dutyPersonList"
      :table-header="tableHeader"
      :is-select="false"
      :is-page="false"
    >
      <template #name="{ item }">
        <span>{{ item.row.name }}</span>
      </template>
      <template #dutyPost="{ item }">
        <span>{{ item.row.dutyPost }}</span>
      </template>
      <template #dutySjd="{ item }">
        <span>{{ item.row.dutySjd }}</span>
      </template>
      <template #dutyPostion="{ item }">
        <span>{{ item.row.dutyPostion }}</span>
      </template>
    </CommonTable>
    <template #footer>
      <span class="dialog-footer">

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
