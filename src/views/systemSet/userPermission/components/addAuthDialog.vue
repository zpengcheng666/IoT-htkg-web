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
  type: {
    type: String,
    default: 'role',
  },
  // 标题
  title: {
    type: String,
    default: '配置权限',
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
  label: 'title',
  id: 'id',
}

const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean,
) => {
  // console.log(data, checked, indeterminate)
}
const treeRef = ref<InstanceType<typeof ElTree>>()
// 页数改变的时候触发的事件

const submintDialog = async () => {
  const selectAuth = treeRef.value!.getCheckedKeys(false)
  const selectHalfAuth = treeRef.value!.getHalfCheckedKeys()

  const allAuth = selectAuth.concat(selectHalfAuth)
  const obj = {
    resIds: allAuth,
    childrenIds: selectAuth,
  }

  emits('submintDialog', obj)
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
  api.get(`system/baseRole/listRolePermissions?roleId=${id}`).then((res: any) => {
    if (res.code === 200) {
      treeRef.value!.setCheckedKeys(res.result, false)
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

// 获取当前分组权限
function getGroupAuth(id: any) {
  api.get(`system/baseGroup/getGroupRoles?orgId=${id}`).then((res: any) => {
    if (res.code === 200) {
      treeRef.value!.setCheckedKeys(res.result, false)
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

onMounted(() => {
  if (props.type === 'group') {
    getGroupAuth(props.infoData.id)
  }
  else {
    getRoleAuth(props.infoData.id)
  }
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
        :default-expand-all="true"
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
