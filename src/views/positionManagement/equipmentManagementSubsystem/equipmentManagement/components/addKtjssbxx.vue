<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  title: {
    type: String,
    default: '新增属性',
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
const groupProps = {
  value: 'id',
  label: 'title',

}
const data = reactive({
  locationOptions: [] as any,
})

const getList = () => {
  const param = {}
  api.get('system/baseLocation/queryTreeList', param).then((res: any) => {
    data.locationOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

// 校验
const ruleFormRef = ref<FormInstance>()
const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submitDialog', val)
    }
    else {
      window.console.log('error submit!', fields)
    }
  })
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

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
onMounted(() => {
  getList()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :model="infoDataForm" :inline="true" class="demo-form-inline" label-width="120px">
      <el-form-item label="所在位置" prop="szwz">
        <el-tree-select v-model="infoDataForm.szwz" clearable default-expand-all node-key="id" check-strictly :props="groupProps" :data="data.locationOptions" class="formInput" />
      </el-form-item>
      <el-form-item label="设备编号" prop="sbbh">
        <el-input v-model="infoDataForm.sbbh" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="末次大修日期" prop="mcdxrq">
        <!-- <el-input v-model="infoDataForm.mcdxrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.mcdxrq"
          type="date"
          label="末次大修日期"
          placeholder="末次大修日期"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="大修次数" prop="dxcs">
        <el-input v-model="infoDataForm.dxcs" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="末次换季保养日期" prop="mchjbyrq">
        <!-- <el-input v-model="infoDataForm.mchjbyrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.mchjbyrq"
          type="date"
          label="发电机出厂日期"
          placeholder="发电机出厂日期"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="sbmc">
        <el-input v-model="infoDataForm.sbmc" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="规格型号" prop="ggxh">
        <el-input v-model="infoDataForm.ggxh" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="出厂编号" prop="ccbh">
        <el-input v-model="infoDataForm.ccbh" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="sccj">
        <el-input v-model="infoDataForm.sccj" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="出厂日期" prop="ccrq">
        <!-- <el-input v-model="infoDataForm.cyjccrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.ccrq"
          type="date"
          label="出厂日期"
          placeholder="出厂日期"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="额定功率(KW)" prop="edgl">
        <el-input v-model="infoDataForm.edgl" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="质量状况" prop="zlzk">
        <el-input v-model="infoDataForm.zlzk" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="运行时间" prop="yxsj">
        <!-- <el-input v-model="infoDataForm.cyjccrq" placeholder="请输入" class="formInput" /> -->
        <el-date-picker
          v-model="infoDataForm.yxsj"
          type="date"
          label="运行时间"
          placeholder="运行时间"
          style="width: 260px;"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="管理分队" prop="glfd">
        <el-input v-model="infoDataForm.glfd" placeholder="请输入" class="formInput" />
      </el-form-item>
      <el-form-item label="部署地点" prop="bsdd">
        <el-input v-model="infoDataForm.bsdd" placeholder="请输入" class="formInput" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
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

.formInput {
  width: 260px;
}
</style>
