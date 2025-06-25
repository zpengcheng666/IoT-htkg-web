<script setup lang='ts'>

const props = defineProps({

  // 标题
  title: {
    type: String,
    default: '新增保养类别',
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
const data = reactive({
  form: {
    name: '',

  },
})
const submitDialog = async () => {
  const retData = {
    dictTypeId: '9A63EAFA3F89453C8A03B43591B3EE3D',
    name: data.form.name,
  }
  emits('submitDialog', retData)
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

onMounted(() => {

})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <el-form :model="data.form" label-width="90px">
      <el-form-item label="名称：">
        <el-input v-model="data.form.name" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 100%;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
