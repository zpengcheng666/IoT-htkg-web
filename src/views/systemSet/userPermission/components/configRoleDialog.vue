<script setup lang='ts'>
import { ElMessage, ElTree } from 'element-plus'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  allAuthList: {
    type: Array,
    default() {
      return []
    },
  },
  // 标题
  title: {
    type: String,
    default: '配置角色',
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
interface Tree {
  id: string
  name: string
  operationGroups?: Tree[]
}

const defaultProps = {
  children: 'operationGroups',
  label: 'name',
  id: 'id',
}

const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean,
) => {
}
const treeRef = ref<InstanceType<typeof ElTree>>()
// 页数改变的时候触发的事件

const submintDialog = async () => {
  const selectAuth = treeRef.value!.getCheckedKeys(false)
  emits('submintDialog', selectAuth)
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
// 获取当前角色权限
function getRoleAuth(id: any) {
  const postData = {
    userId: id,
  }
  api.get(`system/baseUser/queryUserRole?userId=${id}`).then((res: any) => {
    if (res.code === 200) {
      const newArr = []
      for (const i in res.result) {
        newArr.push(res.result[i].roleId)
      }
      treeRef.value!.setCheckedKeys(newArr, false)
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

onMounted(() => {
  getRoleAuth(props.infoData.id)
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="30%"
    :before-close="closeDialog"
  >
    <div class="treeBox">
      <ElTree
        ref="treeRef"
        :props="defaultProps"
        :data="props.allAuthList"
        node-key="id"
        show-checkbox
        @check-change="handleCheckChange"
      />
    </div>

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
