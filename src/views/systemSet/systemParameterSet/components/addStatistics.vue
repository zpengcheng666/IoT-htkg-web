<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

import { RemoveFilled } from '@element-plus/icons-vue'
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
  devTypeOptions: {
    type: Array<any>,
    default() {
      return []
    },
  },
  type: {
    type: String,
    default: 'add',
  },
  // 标题
  title: {
    type: String,
    default: '新增',
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
  devClass: '',
  deviceAttrOptions: [{
    id: '',
    name: '',
    enName: '',
  }], // 设备属性下拉数据
  qj: [{ min: '-∞', max: '+∞' }],
  attrMap: [] as any,
})

const submitDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  for (let i = 0; i < data.qj.length; i++) {
    if (data.qj[i].min === '' || data.qj[i].max === '') {
      ElMessage({
        type: 'error',
        message: '区间值不能为空，请排查',
      })
      return false
    }

    if (i >= 1 && (parseInt(data.qj[i].max) <= parseInt(data.qj[i - 1].max))) {
      ElMessage({
        type: 'error',
        message: '数值小于上一个区间最大值，请重新输入',
      })
      return false
    }
  }
  val.attrName = data.attrMap[val.attrEnName]
  val.intervalValueList = data.qj.map((item) => {
    return `${item.min},${item.max}`
  })
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
    return props.dialogVisible
  },
  set(val) {
    return val
  },
})

// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)

// 获取设备属性下拉
function getDeviceAttrOptions() {
  infoDataForm.attrEnName = ''
  const postData = {
    params: {
      devClassId: infoDataForm.devClass,
    },
  }
  api.get('scada/deviceTypeAttribyte/devClassIdByAttrFilter', postData).then((res: any) => {
    data.deviceAttrOptions = res.result
    data.deviceAttrOptions.forEach((item, inex) => {
      data.attrMap[item.enName] = item.name
    })
  }).catch((error) => {
    window.console.log(error)
  })
}

// 添加区间
function addQj() {
  const obj = {
    min: '',
    max: '+∞',
  }

  data.qj.push(obj)
  data.qj[data.qj.length - 2].max = ''
}

// 删除区间
function delQj(index: any) {
  data.qj.splice(index, 1)
}

// 输入区间
function handleMaxChange(val: any, index: any) {
  // console.log(val)
  // console.log(data.qj[index + 1].max)
  if (parseInt(val) >= parseInt(data.qj[index + 1].max)) {
    data.qj[index].max = ''
    data.qj[index + 1].min = ''
    ElMessage({
      type: 'error',
      message: '数值大于下一个区间最大值，请重新输入',
    })
    return false
  }
  // if (index >= 1 && (parseInt(val) <= parseInt(data.qj[index - 1].max))) {
  //   data.qj[index].max = ''
  //   data.qj[index + 1].min = ''
  //   ElMessage({
  //     type: 'error',
  //     message: '数值小于上一个区间最大值，请重新输入',
  //   })
  //   return false
  // }
  data.qj[index + 1].min = val
}

const initQj = () => {
  data.qj.length = 0
  props.infoData.intervalValueList.forEach((item: any) => {
    const items = item.split(',')
    const obj = {
      min: items[0],
      max: items[1],
    }
    data.qj.push(obj)
  })
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  attrEnName: [
    { required: true, message: '请选择设备属性', trigger: 'change' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  devClass: [
    { required: true, message: '请选择设备类型', trigger: 'change' },
  ],

})
onMounted (() => {
  infoDataForm.devClass = ''
  if (props.type === 'edit') {
    initQj()
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
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item v-if="props.type === 'add'" prop="devClass" label="设备类型：">
        <el-select v-model="infoDataForm.devClass" filterable clearable placeholder="请选择设备类型" @change="getDeviceAttrOptions">
          <el-option
            v-for="item in props.devTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="attrEnName" label="设备属性：">
        <el-select v-if="props.type === 'add'" v-model="infoDataForm.attrEnName" filterable clearable :disabled="infoDataForm.devClass === ''" placeholder="请选择设备属性">
          <el-option
            v-for="item in data.deviceAttrOptions"
            :key="item.enName"
            :label="item.name"
            :value="item.enName"
          />
        </el-select>

        <span v-if="props.type === 'edit'">{{ infoDataForm.attrName }}</span>
      </el-form-item>

      <el-form-item label="区间值：" prop="sectionDisplay">
        <div v-for="(v, i) in data.qj" :key="i" class="qjInputBox">
          <el-input v-model="v.min" disabled style="width: 100px;margin-right: 10px;" />
          <el-input v-model="v.max" :disabled="i === data.qj.length - 1" style="width: 100px;" @input="handleMaxChange(v.max, i)" />
          <el-icon v-if="i > 0" class="delIcon" @click="delQj(i)">
            <RemoveFilled />
          </el-icon>
        </div>
      </el-form-item>
      <center>
        <el-button type="primary" @click="addQj">
          添加区间
        </el-button>
      </center>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">
          关闭
        </el-button>

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

.qjInputBox {
  width: 240px;
  line-height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;

  .delIcon {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
