<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { Delete, Edit, FolderChecked, Plus, Search } from '@element-plus/icons-vue'
import runningRecord from './runningRecord.vue'
import maintenanceRecord from './maintenanceRecord.vue'
import api from '@/api'
import CommonSelect from '@/components/CommonSelect/index.vue'
import CommonTable from '@/components/ConmonTable/index.vue'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  locationTreeData: {
    type: Array,
    default() {
      return []
    },
  },
  deviceOptions: {
    type: Array<any>,
    default() {
      return []
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
    default: '新增设备',
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
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const activeName = ref('0')
const defaultProps = {
  children: 'children',
  label: 'title',
  value: 'id',
}
const data = reactive({
  attrData:[] as any,
})
const submitDialog = async (formEl: FormInstance | undefined, val: any) => { // submit-dialog
  // console.log(val)
  // console.log(data.attrData)
  // return
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 调用保存就可以了吧，然后再调用父组件的函数
      emits('submitDialog', val, data.attrData)
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

const ruleFormRef = ref<FormInstance>()
const infoDataForm = reactive(props.infoData)

// 质量状况
function qualityType(val: any) {
  infoDataForm.quality = val
}

// 根据设备类别获取设备属性
function getAttr(id: any) {
  api.get(`facility/deviceAttr/listByClassId?classId=${id}`).then((res: any) => {
    data.attrData = res.result
    getAttrVal(infoDataForm.id)
  }).catch((error) => {
    window.console.log(error)
  })
}

function getAttrVal(id: any) {
  api.get(`facility/deviceBI/queryDeviceAttr?deviceId=${id}`).then((res: any) => {
    const list = res.result
    if (list) {
      list.forEach((item: any) => {
        data.attrData.forEach((attr: any) => {
          if (attr.id === item.id) {
            attr.value = item.value
          }
        })
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}

// 设备属性表头
const tableHeader = reactive([
  {
    prop: 'name',
    label: '属性名称',
  },
  {
    prop: 'attrType',
    label: '属性类型',
  },
  {
    prop: 'unit',
    label: '属性单位',
  },
])
onMounted(() => {
  getAttr(infoDataForm.classId)
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="50%"
    :before-close="closeDialog"
    top="5vh"
  >
    <el-tabs v-if="dialogType === 'info'" v-model="activeName" class="tabsBox">
      <el-tab-pane label="设备信息" name="0" />
      <el-tab-pane label="运行记录" name="1" />
      <el-tab-pane label="保养记录" name="2" />
    </el-tabs>
    <!-- 设备信息页 -->
    <el-form v-show="activeName === '0'" ref="ruleFormRef" :inline="true" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-card style="max-width: 100%;">
        <template #header>
          <div class="card-header">
            <span>基础信息</span>
          </div>
        </template>
        <el-form-item label="设备类别" prop="classId">
          <el-tree-select @change="getAttr(infoDataForm.classId)" v-model="infoDataForm.classId" default-expand-all node-key="id" :disabled="props.dialogType === 'info'" check-strictly :props="defaultProps" :data="props.treeData" />
        </el-form-item>
        <el-form-item label="阵管编码" prop="zgCode">
          <el-input v-model="infoDataForm.zgCode" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>
        <el-form-item label="隶属单位" prop="unit">
          <el-input v-model="infoDataForm.unit" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="阵地代号" prop="zdCode">
          <el-input v-model="infoDataForm.zdCode" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="设备名称" prop="name">
          <el-input v-model="infoDataForm.name" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>
        <el-form-item label="质量状况" prop="quality">
          <CommonSelect :disabled="props.dialogType === 'info'" post-param="quality-condition" :select-value="infoDataForm.quality" class="formInput" @select-change="qualityType" />
        </el-form-item>

        <el-form-item label="安装部位" prop="site">
          <el-input v-model="infoDataForm.site" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="型号规格" prop="devModel">
          <el-input v-model="infoDataForm.devModel" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="infoDataForm.manufacturer" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="出厂时间" prop="productionTime">
          <el-date-picker
            v-model="infoDataForm.productionTime"
            :disabled="props.dialogType === 'info'"
            type="date"
            label="出厂时间"
            placeholder="出厂时间"
            style="width: 100%;"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="安装时间" prop="installationTime">
          <el-date-picker
            v-model="infoDataForm.installationTime"
            :disabled="props.dialogType === 'info'"
            type="date"
            label="安装时间"
            placeholder="安装时间"
            style="width: 100%;"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="责任人" prop="owner">
          <el-input v-model="infoDataForm.owner" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>

        <el-form-item label="关联设备" >
          <el-select v-model="infoDataForm.deviceContext" :disabled="props.dialogType === 'info'" filterable clearable placeholder="请选择设备" class="formInput">
            <el-option v-for="(v, i) in props.deviceOptions" :key="i" :label="v.name" :value="v.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="infoDataForm.note" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
        </el-form-item>
      </el-card>
      <el-card v-if="data.attrData.length > 0" style="max-width: 100%;margin-top: 20px;">
        <template #header>
          <div class="card-header">
            <span>拓展属性</span>
          </div>
        </template>
        <el-form-item v-for="(v, i) in data.attrData" :key="v.id" :label="v.name" :prop="v.code">
          <el-input v-if="v.attrType === 'TEXT'" v-model:model-value="data.attrData[i].value" :disabled="props.dialogType === 'info'" placeholder="请输入" class="formInput" />
          <el-date-picker
            v-else-if="v.attrType === 'DATE'"
            v-model:model-value="data.attrData[i].value"
            :disabled="props.dialogType === 'info'"
            type="date"
            :label="v.name"
            :placeholder="v.name"
            style="width: 100%;"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-card>
    </el-form>
    <!-- 运行记录页 -->
    <runningRecord v-if="activeName === '1'" :dev-id="props.infoData.id" />
    <!-- 保养记录页 -->
    <maintenanceRecord v-if="activeName === '2'" :dev-id="props.infoData.id" />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button v-if="props.dialogType !== 'info'" type="primary" @click="submitDialog(ruleFormRef, infoDataForm)">
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

.el-form--inline .el-form-item {
  width: calc(100% / 3 - 40px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}
</style>
