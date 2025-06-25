<script lang="ts" setup>
import entryExitInfo from './entryExitInfo.vue'
import creditCardInfo from './creditCardInfo.vue'
const props = defineProps({
  // 详情数据
  terminalInfo: {
    type: Array<any>,
    default() {
      return []
    },
  },
  doorInfo: {
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
const activeName = ref('0')

onMounted(() => {
  // console.log(props.terminalInfo)
})
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      title="出入门禁"
      fullscreen
      :before-close="closeDialog"
      class="preDialog"
    >
      <div class="dialogBox">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="进出人员信息" name="0">
            <entryExitInfo :door-info="props.doorInfo" />
          </el-tab-pane>
          <el-tab-pane label="刷卡信息" name="1">
            <creditCardInfo :terminal-info="props.terminalInfo" />
          </el-tab-pane>
        </el-tabs>
      </div>
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

.dialogBox {
  padding: 20px;
  box-sizing: border-box;
}
</style>
