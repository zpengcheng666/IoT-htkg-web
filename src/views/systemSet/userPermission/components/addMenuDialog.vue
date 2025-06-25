<script setup lang='ts'>

import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },
  // 标题
  dialogTitle: {
    type: String,
    default: '新增菜单',
  },
  // 菜单下拉
  menuOptions: {
    type: Array,
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
const emits = defineEmits(['submintDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  scnecOptions: [] as any,
  selectScene: {} as any,
})

function getScnecOptions() {

  api.get('api/scada/listMenu').then((res: any) => {
    data.scnecOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

const submintDialog = async (formEl: FormInstance | undefined, val: any) => {
  if (!formEl) { return }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('submintDialog', val)
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
// / 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const infoDataForm = reactive(props.infoData)
// 级联选择框
const menuProps = {
  value: 'id',
  label: 'title',

}

function selectSceneFun(val: any) {
  if (infoDataForm.sceneType === 'stage') {
    infoDataForm.path = `stage/${val}`
    infoDataForm.name = `stage${val}`
    infoDataForm.component = 'publicPages/ztPage.vue'
  }
  else if (infoDataForm.sceneType === 'data') {
    infoDataForm.path = `monitorData/${val}`
    infoDataForm.name = `monitorData${val}`
    infoDataForm.component = 'publicPages/monitorData.vue'
  }

  for (const i in data.scnecOptions) {
    if (val === data.scnecOptions[i].id) {
      infoDataForm.title = data.scnecOptions[i].name
    }
  }
}
// 校验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({

  title: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  menuType: [{
    required: true, message: '请选择菜单类型', trigger: 'change',
  }],
  path: [
    { required: true, message: '请输入路由地址', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入组件名称', trigger: 'blur' },
  ],
  sortNumber: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
  selectScene: [{ required: true, message: '请选择场景', trigger: 'change' },
  ],
  sceneType: [{ required: true, message: '请选择场景类型', trigger: 'change' },
  ],
})

onMounted(() => {
  getScnecOptions()
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.dialogTitle"
    width="30%"
    top="3vh"
    :before-close="closeDialog"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="infoDataForm" class="demo-form-inline" label-width="100px">
      <el-form-item label="上级菜单" placeholder="请输入" class="formInput">
        <el-tree-select v-model="infoDataForm.parent" clearable default-expand-all node-key="id" check-strictly :props="menuProps" :data="props.menuOptions" class="formInput" />
      </el-form-item>
      <el-form-item label="组态场景菜单" placeholder="请输入" class="formInput">
        <el-switch v-model="infoDataForm.isScene" inline-prompt :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.isScene === 1" label="场景类型" placeholder="请输入" class="formInput" prop="sceneType">
        <el-radio-group v-model="infoDataForm.sceneType">
          <el-radio label="stage">
            组态场景
          </el-radio>
          <el-radio label="data">
            数据场景
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="infoDataForm.isScene === 1" label="场景" placeholder="请选择场景" class="formInput" prop="selectScene">
        <el-select
          v-model="infoDataForm.selectScene"
          placeholder="请选择场景"
          class="formInput"
          filterable clearable
          @change="selectSceneFun"
        >
          <el-option
            v-for="i in data.scnecOptions"
            :key="i.id"
            :label="i.name"
            :value="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" placeholder="请输入" class="formInput" prop="title">
        <el-input v-model="infoDataForm.title" />
      </el-form-item>
      <el-form-item label="菜单类型" placeholder="请输入" class="formInput" prop="menuType">
        <el-radio-group v-model="infoDataForm.menuType">
          <el-radio :label="0">
            目录
          </el-radio>
          <el-radio :label="1">
            菜单
          </el-radio>
          <el-radio :label="2">
            内嵌页
          </el-radio>
          <el-radio :label="3">
            按钮
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单图标" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.icon" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.menuType === 1 || infoDataForm.menuType === 2" label="路由地址" placeholder="请输入" class="formInput" prop="path">
        <el-input v-model.trim="infoDataForm.path" placeholder="路由path，例：/user" :disabled="infoDataForm.isScene === 1" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.menuType === 1 || infoDataForm.menuType === 2" label="组件名称" placeholder="请输入" class="formInput" prop="name">
        <el-input v-model.trim="infoDataForm.name" placeholder="路由name，例：user" :disabled="infoDataForm.isScene === 1" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.menuType === 1 || infoDataForm.menuType === 2" label="组件地址" placeholder="请输入" class="formInput">
        <el-input v-model.trim="infoDataForm.component" placeholder="页面地址，例：systemSet/userPermission/user.vue" :disabled="infoDataForm.isScene === 1" />
      </el-form-item>
      <el-form-item v-if="infoDataForm.menuType === 1 " label="重定向页面" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.redirect" placeholder="重定向页面地址，例：/waterSupplyDrainageSubsystem/historyDataManagement/historyData/:geipaishui" />
      </el-form-item>
      <el-form-item label="权限标识" placeholder="请输入" class="formInput">
        <el-input v-model="infoDataForm.auth" placeholder="权限标识，例：system:user:list" />
      </el-form-item>
      <el-form-item label="分系统菜单" placeholder="请输入" class="formInput">
        <el-switch v-model="infoDataForm.hide" inline-prompt :active-value="false" :inactive-value="true" active-text="是" inactive-text="否" />
      </el-form-item>

      <el-form-item label="排序" placeholder="请输入" class="formInput" prop="sortNumber">
        <el-input-number v-model="infoDataForm.sortNumber" :min="1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submintDialog(ruleFormRef, infoDataForm)">
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
