<script setup lang='ts'>

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  treeData: {
    type: Array,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '新增终端信息',
  },
  dialogType: {
    type: String,
    default: 'add',
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
const defaultProps = {
  children: 'childs',
  label: 'title',
  value: 'id',
}
// 页数改变的时候触发的事件
const submintDialog = (val: any) => {
  emits('submintDialog', val)
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
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="终端名称" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.name" />
      </el-form-item>
      <el-form-item label="终端编码" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.code" />
      </el-form-item>
      <el-form-item label="位置" placeholder="请输入" class="formInput">
        <el-tree-select v-model="infoDataForm.locationId" default-expand-all node-key="id" :disabled="props.dialogType === 'info'" check-strictly :props="defaultProps" :data="props.treeData" />
      </el-form-item>
      <el-form-item label="描述" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(infoDataForm)">
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
</style>
