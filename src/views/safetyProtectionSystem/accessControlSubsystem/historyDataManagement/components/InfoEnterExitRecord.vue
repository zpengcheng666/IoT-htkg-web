<script setup lang='ts'>
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
})
const emits = defineEmits(['closeDialog'])
const dialogShow = computed({
  get() {
    // getter
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})
const closeDialog = () => {
  emits('closeDialog')
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    title="进出记录详情"
    width="50%"
    :before-close="closeDialog"
  >
    <el-descriptions title="进出信息" :column="2" border>
      <el-descriptions-item label="门名称:" label-align="right">
        {{ props.infoData.doorName }}
      </el-descriptions-item>
      <el-descriptions-item label="门类型:" label-align="right">
        {{ props.infoData.doorType }}
      </el-descriptions-item>
      <el-descriptions-item label="开门时间：" label-align="right">
        {{ props.infoData.openTime }}
      </el-descriptions-item>
      <el-descriptions-item label="进出类型：" label-align="right">
        {{ props.infoData.accessType }}
      </el-descriptions-item>
      <el-descriptions-item label="开门类型：" label-align="right">
        {{ props.infoData.openType }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
