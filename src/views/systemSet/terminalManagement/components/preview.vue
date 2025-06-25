<script lang="ts" setup>
import bigScreenNew from '../../../bigScreen/bigScreenNew.vue'
const props = defineProps({
  // 详情数据
  terminalInfo: {
    type: Object,
    default() {
      return {}
    },
  },
  layoutList: {
    type: Array<any>,
    default() {
      return []
    },
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
// 处理props的数据 重新定义 dialogVisible
const dialogShow = computed({
  get() {
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})

onMounted(() => {

})
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      title="大屏预览"
      width="80%"
      fullscreen
      :before-close="closeDialog"
      class="preDialog"
    >
      <bigScreenNew :terminal-info="props.terminalInfo" :layout-list="props.layoutList" :is-pre="true" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.preDialog .el-dialog__body) {
  padding: 0;
  height: calc(100% - 126px);
}
</style>
