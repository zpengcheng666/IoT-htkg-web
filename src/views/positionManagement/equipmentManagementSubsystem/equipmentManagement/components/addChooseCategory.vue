<script setup lang='ts'>
import { ElMessage, ElTable } from 'element-plus'
import api from '@/api'
const props = defineProps({
  // 所有属性
  allAttrList: {
    type: Array,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '属性关联选择',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },

  // 通过点击树获取的属性id
  classId: {
    type: String,
    default: '',
  },

})

const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const submintDialog = async () => {
  const rows = multipleTableRef.value!.getSelectionRows()
  let ret = ''
  for (const item of rows) {
    ret += ','
    ret += item.id
  }
  if (ret!) {
    ret = ret.slice(1, ret.length)
  }

  const retData = {
    classId: props.classId,
    attrId: ret,
  }
  emits('submintDialog', retData)
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
// 显示选中
const toggleSelection = (rows?: any[]) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, true)
    })
  }
  else {
    multipleTableRef.value!.clearSelection()
  }
}
// 像下面这样做就使 prop 和后续更新无关了
const allAttrList: any = reactive(props.allAttrList)
// 选择属性后，回显之前的属性
function getAttrList(id: any) {
  api.get(`facility/deviceAttr/listByClassId?classId=${id}`).then((res: any) => {
    // 拿到选中的值，并处理数据
    const hasSelectList = []
    for (const i in res.result) {
      const id = res.result[i].id
      for (const item in allAttrList) {
        if (allAttrList[item].id === id) {
          hasSelectList.push(allAttrList[item])
        }
      }
    }
    toggleSelection(hasSelectList)
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getAttrList(props.classId)
})

const multipleSelection = ref<any[]>([])

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <ElTable
      ref="multipleTableRef"
      :data="props.allAttrList"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="属性名称" property="name" width="200" />
      <el-table-column label="属性类型" property="attrType" width="160" />
      <el-table-column label="属性单位" property="unit" width="140" />
    </ElTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog()">
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
