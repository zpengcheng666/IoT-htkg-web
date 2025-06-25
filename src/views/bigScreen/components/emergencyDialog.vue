<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
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

const data = reactive({
  tableData: [],
})
// 表头数据  辅助tableData的数据 tableData是自己定义
const tableHeader = reactive([
  {
    prop: 'doorName',
    label: '名称',
  },
  {
    slot: 'doorType',
    prop: 'doorType',
    label: '内容',
  },
  {
    label: '操作',
    slot: 'operate',
    fixed: 'right',
    width: '260px',
  },
])
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
// 点击处理
function clickHandle(row: any) {
  ElMessageBox.confirm(
    '此操作将处理该工作，是否继续?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      const postData = {
        workId: row.id,
      }
      api.put('system/contingencyRecord/processWork', postData).then((res: any) => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: res.message,
          })
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
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消处理',
      })
    })
}
let lists = reactive(props.infoData)
watch(
  () => props.infoData,
  (newVal, oldVal) => {
    // console.log(props.infoData)
    lists = newVal
  },
)
onMounted(() => {

})
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogShow"
      title="应急处置"
      fullscreen
      :before-close="closeDialog"
      class="preDialog"
    >
      <div class="dialogBox">
        <div class="info_box">
          <div>预案名称:{{ props.infoData.name }}</div>
          <div>开始时间:{{ props.infoData.startTime }}</div>
          <div>发起人:{{ props.infoData.initiator }}</div>
          <!-- <div>发起原因:{{ 11 }}</div> -->
        </div>
        <div class="step_box">
          <div class="step_item">
            <el-steps :active="props.infoData.stepIndex" finish-status="success">
              <el-step v-for="(item, index) in props.infoData.stageList" :key="index" :title="item.name">
                <template #description>
                  <el-steps :space="10" :active="item.stepIndex" finish-status="success" direction="vertical">
                    <el-step v-for="(v, i) in item.workList" :key="i" :title="v.name" />
                  </el-steps>
                </template>
              </el-step>
            </el-steps>
          </div>
        </div>
        <div class="list_box">
          <el-table
            :data="props.infoData.stageList"
            border
            style="width: 100%; margin-top: 0;"
            default-expand-all
          >
            <el-table-column type="expand">
              <template #default="item">
                <el-table :data="item.row.workList" border>
                  <el-table-column label="工作项名称" prop="name" />
                  <el-table-column label="内容" prop="content" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template #default="val">
                      <el-button type="primary" :disabled="val.row.isCompleted !== 0" size="small" @click="clickHandle(val.row)">
                        处理
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
            />
          </el-table>
        </div>
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

.info_box {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: solid 1px #e9e9e9;
}

.step_box {
  min-height: 200px;
  border-bottom: solid 1px #e9e9e9;
  margin-bottom: 30px;
  padding-bottom: 30px;

  .step_item {
    width: 80%;
    padding-top: 60px;
    margin: 0 auto;
  }
}
</style>
