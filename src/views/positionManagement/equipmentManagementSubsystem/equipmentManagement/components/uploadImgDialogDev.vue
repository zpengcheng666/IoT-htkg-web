<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import api from '@/api'
import ImagesUpload from '@/components/ImagesUpload/index.vue'

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
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
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
const data = reactive({
  imgUrls: [] as any,
})

const submitDialog = async (val: any) => {
  // console.log(val)
  if (val.length < 1) {
    ElMessage({
      type: 'error',
      message: '请上传图片！',
    })
    return false
  }
  emits('submitDialog', val)
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

// 获取图片
function onSuccess(val: any) {
  data.imgUrls.push(val.result)
  // console.log(infoDataForm)
}
function update(val: any) {
  data.imgUrls = val
  // console.log(val)
}
onMounted(() => {
  // console.log(infoDataForm.imgUrls)
  if (infoDataForm.imgUrls) {
    data.imgUrls = infoDataForm.imgUrls.split(',')
  }
  else {
    data.imgUrls = [] as any
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    title="上传图片"
    width="50%"
    :before-close="closeDialog"
  >
    <div>
      <ImagesUpload action="/system/filesUtil/upload" :img-urls="data.imgUrls" @update:img-urls="update" @on-success="onSuccess" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(data.imgUrls)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
