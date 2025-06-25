<script setup lang="ts">
import SelectPoint from './selectPoint.vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '编辑表达式',
  },
  // 弹窗
  dialogVisible: {
    type: Boolean,
    // 类型
    required: true,
    default: false,
  },
  pointInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  pointInfo: {
    attrId: '',
    attrName: '',
    gatewayId: '',
    deviceId: '',
    pointId: '',
    expression: '',
    expressionStr: '',
  },
  expressionStr: '',
  expressionCh: '',
  content: {
    dialog: false,
    form: {
      value: '',
    },
  },
  variable: {
    dialog: false,
  },
})
const submitDialog = async () => {
  emits('submitDialog', data.expressionStr, data.expressionCh)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}
// 添加运算符
function appendStr(str: String) {
  data.expressionStr = data.expressionStr + str
  data.expressionCh = data.expressionCh + str
}
// 添加常量
function appendContent() {
  data.content.dialog = false
  data.expressionStr = data.expressionStr + data.content.form.value
  data.expressionCh = data.expressionCh + data.content.form.value
  data.content.form.value = ''
}
// 清空按钮
function clickClear() {
  data.expressionStr = ''
  data.expressionCh = ''
}
// 确认点位选择
function submitSavePoint(val: any) {
  data.pointInfo.gatewayId = val.wgid
  data.pointInfo.deviceId = val.deviceId
  data.expressionStr = `${data.expressionStr}[${val.id}]`
  data.expressionCh = `${data.expressionCh}[${val.deviceName}:${val.name}]`
  data.pointInfo.pointId = ''
  data.variable.dialog = false
}
// 点位选择
function closePointSelect(val: any) {
  data.variable.dialog = false
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

// 初始化
onMounted(() => {
  if (props.pointInfo.expression) {
    data.expressionStr = props.pointInfo.expression
    data.expressionCh = props.pointInfo.expressionStr
  }
  else {
    data.expressionStr = ''
    data.expressionCh = ''
  }
})
</script>

<template>
  <el-dialog
    v-model="dialogShow"
    :title="props.title"
    width="600px"
    :before-close="closeDialog"
  >
    <el-row>
      <el-col :span="3">
        表达式：
      </el-col>
      <el-col :span="21">
        {{ data.expressionCh }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        操作数:
      </el-col>
      <el-col :span="21">
        <el-button class="buttonWidth" @click="data.variable.dialog = true">
          变量
        </el-button>
        <SelectPoint :dialog-visible="data.variable.dialog" :point-info="data.pointInfo" @submit-dialog="submitSavePoint" @close-dialog="closePointSelect" />
        <el-button class="buttonWidth" @click="data.content.dialog = true">
          常量
        </el-button>
        <el-dialog
          v-model="data.content.dialog"
          title="输入常量"
          width="30%"
        >
          <el-form :model="data.content.form">
            <el-form-item label="值:">
              <el-input v-model="data.content.form.value" style="width: 260px;" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="data.content.dialog = false">
                取消
              </el-button>
              <el-button @click="appendContent">确定</el-button>
            </span>
          </template>
        </el-dialog>
        <el-button class="buttonWidth" @click="clickClear">
          清空
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        运算符：
      </el-col>
      <el-col :span="21">
        <el-button class="buttonWidth" @click="appendStr('+')">
          +
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('-')">
          -
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('*')">
          *
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('/')">
          ÷
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" />
      <el-col :span="21">
        <el-button class="buttonWidth" @click="appendStr('%')">
          %
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('&&')">
          &&
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('||')">
          ||
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('!')">
          !
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" />
      <el-col :span="21">
        <el-button class="buttonWidth" @click="appendStr('<')">
          &lt;
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('>')">
          &gt;
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('<=')">
          &lt;=
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('>=')">
          &gt;=
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" />
      <el-col :span="21">
        <el-button class="buttonWidth" @click="appendStr('==')">
          ==
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('!=')">
          !=
        </el-button>
        <el-button class="buttonWidth" @click="appendStr('(')">
          (
        </el-button>
        <el-button class="buttonWidth" @click="appendStr(')')">
          )
        </el-button>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitDialog()">
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

.buttonWidth {
  width: 50px;
}

.treeBox {
  width: 100%;
  height: 500px;
  overflow-y: auto;
}
</style>
