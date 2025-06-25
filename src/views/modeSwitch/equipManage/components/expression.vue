<!--
 * @Description:表达式弹窗
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-02-15 15:03:26
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:55:24
-->
<script setup lang="ts">
import api from '@/api'

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
  deviceId: String,
  pointInfo: {
    type: Object,
    default() {
      return {}
    },
  },
})
const emits = defineEmits(['submitDialog', 'closeDialog', 'fatherFun'])
const data = reactive({
  expressionStr: '',
  expressionCh: '',
  content: {
    dialog: false,
    form: {
      value: '',
    },
  },
  deviceAttrPointList: [] as any,
  deviceList: [] as any,
  attrList: [] as any,
  variable: {
    dialog: false,
    deviceName: '',
    deviceId: '',
    attrName: '',
    attrId: '',
    form: {
      value: '',
    },
  },
})
const submitDialog = async () => {
  emits('submitDialog', data.expressionStr, data.expressionCh)
}
// 关闭弹窗事件
const closeDialog = (val: any) => {
  emits('closeDialog', val)
}

function appendStr(str: String) {
  data.expressionStr = data.expressionStr + str
  data.expressionCh = data.expressionCh + str
}

// 输入常量
function appendContent() {
  data.content.dialog = false
  data.expressionStr = data.expressionStr + data.content.form.value
  data.expressionCh = data.expressionCh + data.content.form.value
  data.content.form.value = ''
}
function appendVariable() {
  data.variable.dialog = false
  data.expressionStr = `${data.expressionStr}[${data.variable.attrId}]`
  data.expressionCh = `${data.expressionCh}[${data.variable.deviceName}:${data.variable.attrName}]`
  data.variable.attrId = ''
  data.variable.deviceId = ''
}
function listDevice() {
  const postData = {
    params: {
      pageSize: -1,
    },
  }
  api.get('/scada/conSheBei/list', postData).then((res: any) => {
    data.deviceList = res.result.records
  }).catch((error) => {
    window.console.log(error)
  })
}
function changeDevice(val: any) {
  for (const device of data.deviceList) {
    if (device.id === data.variable.deviceId) {
      data.variable.deviceName = device.name
      break
    }
  }
  listDeviceAttr(data.variable.deviceId)
}
function listDeviceAttr(deviceId: string) {
  const postData = {
    params: {
      id: deviceId,
    },
  }
  api.get('/scada/conSheBei/listDeviceAttrByDeviceId', postData).then((res: any) => {
    data.attrList = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
function changeAttr() {
  for (const attr of data.attrList) {
    if (attr.id === data.variable.attrId) {
      data.variable.attrName = attr.name
      break
    }
  }
}
function clickClear() {
  data.expressionStr = ''
  data.expressionCh = ''
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

onMounted(() => {
  if (props.pointInfo.varExpression) {
    data.expressionStr = props.pointInfo.varExpression
    data.expressionCh = props.pointInfo.varExpressionCh
  }
  listDevice()
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
        <el-dialog
          v-model="data.variable.dialog"
          title="输入常量"
          width="30%"
        >
          <el-form :model="data.variable.form">
            <el-form-item label="设备:">
              <el-select v-model="data.variable.deviceId" filterable clearable placeholder="选择变量" size="large" @change="changeDevice">
                <el-option
                  v-for="item in data.deviceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="属性:">
              <el-select v-model="data.variable.attrId" filterable clearable placeholder="选择变量" size="large" @change="changeAttr">
                <el-option
                  v-for="item in data.attrList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="data.variable.dialog = false">
                取消
              </el-button>
              <el-button @click="appendVariable">确定</el-button>
            </span>
          </template>
        </el-dialog>
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
