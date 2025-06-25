<!--
 * @Description:
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-01-05 19:24:54
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-05-13 15:39:08
-->
<script setup lang='ts'>
const props = defineProps({
  // 所有属性
  tableData: {
    type: Array,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '保养要求',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
})

const emits = defineEmits(['closeDialog'])
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}
// 合并事件
const spanMethod = (val: any) => {
  if (props.tableData.length > 1) {
    if (val.columnIndex === 0) {
      if (val.rowIndex === 0) {
        return {
          rowspan: props.tableData.length,
          colspan: 1,
        }
      }
      else {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
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
    width="800px"
    :before-close="closeDialog"
  >
    <ElTable
      ref="multipleTableRef"
      :data="props.tableData"
      style="width: 100%;"
      max-height="600px"
      border
      :span-method="spanMethod"
    >
      <el-table-column label="类别/组件" property="deviceClassName" />
      <el-table-column label="序号" property="index1" />
      <el-table-column label="作业流程" property="name" />
      <el-table-column label="技术要求" property="thchRequire" />
    </ElTable>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>


