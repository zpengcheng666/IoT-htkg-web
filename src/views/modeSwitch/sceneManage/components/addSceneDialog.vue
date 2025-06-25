<!--
 * @Description:新增场景
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-04-03 14:21:20
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:04:22
-->
<script setup lang='ts'>

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  url: {
    type: String,
    default: '',
  },
  // 标题
  title: {
    type: String,
    default: '新增EAG',
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
    fullscreen
    :before-close="closeDialog"
    class="addDialog"
  >
    <div class="if_box">
      <iframe class="if" :src="props.url" />
    </div>

  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.addDialog .el-dialog__body) {
  height: 100%;
}

.if_box {
  width: 100%;
  height: calc(100vh - 124px);

  .if {
    width: 100%;
    height: 100%;
  }
}
</style>
