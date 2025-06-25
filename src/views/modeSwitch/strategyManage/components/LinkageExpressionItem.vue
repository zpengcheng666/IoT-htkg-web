<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import api from '@/api'

const props = defineProps<{
  deviceList: any[]
  expressionItem: any
  groupIndex: number
  itemIndex: number
}>()
const emits = defineEmits(['change', 'del', 'add'])
const attrList = ref<any[]>([])
const item = reactive({
  inDeviceId: '',
  inAttrId: props.expressionItem.inAttrId,
  operation: props.expressionItem.operation,
  value: props.expressionItem.value,
  afterOperation: props.expressionItem.afterOperation,
})
const operations = ['==', '!=', '>', '<', '>=', '<=']
const valueSelect = ref('')
const valueShow = ref(false)
const attrMap = reactive(new Map<string, any>())
const change = () => {
  emits('change', item)
}

watch(() => props.expressionItem.afterOperation, (newX) => {
  item.afterOperation = newX
})
watch(() => item.inDeviceId, (newDeviceId: string) => {
  if (newDeviceId) {
    api.get(`scada/conSheBei/listDeviceAttrByDeviceId?id=${newDeviceId}`).then((res: any) => {
      if (res.code === 200) {
        attrList.value = res.result
        attrList.value.forEach((a) => {
          attrMap.set(a.id, a.name)
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
  }
})
const valueInput = computed({
  get() {
    if (item.value.startsWith('[')) {
      const reg = /(\[)(\w+)(\])/
      const match = item.value.match(reg)
      if (match) {
        return attrMap.get(match[2])
      }
    }
    return item.value
  },
  set(newValue: string) {
    item.value = newValue
    change()
  },
})
const valueConfirm = () => {
  item.value = `[${valueSelect.value}]`
  change()
  valueShow.value = false
}

const del = () => {
  emits('del')
}
const add = () => {
  emits('add')
}
const valueCancel = () => {
  valueShow.value = false
}
const getAttr = (attrId: string) => {
  api.get(`scada/conSheBei/getAttrById?id=${attrId}`).then((res: any) => {
    if (res.code === 200) {
      item.inDeviceId = res.result.deviceId
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
  if (item.inAttrId) {
    getAttr(item.inAttrId)
  }
})
</script>

<template>
  <div>
    <span class="device" style="margin-right: 15px;">
      <el-select v-model="item.inDeviceId" placeholder="选择设备" :filterable="true">
        <el-option
          v-for="d in props.deviceList"
          :key="d.id"
          :label="d.name"
          :value="d.id"
        />
      </el-select>
    </span>
    <span class="device" style="margin-right: 15px;">
      <el-select v-model="item.inAttrId" placeholder="选择属性" :filterable="true" @change="change">
        <el-option
          v-for="a in attrList"
          :key="a.id"
          :label="a.name"
          :value="a.id"
        />
      </el-select>
    </span>
    <span class="operation">
      <el-select v-model="item.operation" style="width: 40px;" suffix-icon="" @change="change">
        <el-option
          v-for="o in operations"
          :key="o"
          :label="o"
          :value="o"
        />
      </el-select>
    </span>
    <span class="value" style="margin-left: 15px;">
      <el-form-item :required="false">
        <el-input v-model="valueInput" placeholder="值" size="default" style="width: 300px; height: 40px;">
          <template #append>
            <el-button @click="valueShow = true">
              ...
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-dialog
        v-model="valueShow"
        title="选择属性"
        width="30%"
      >
        <el-select v-model="valueSelect" placeholder="选择设备属性" :filterable="true">
          <el-option
            v-for="a in attrList"
            :key="a.id"
            :label="a.name"
            :value="a.id"
          />
        </el-select>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="valueCancel">取 消</el-button>
            <el-button type="primary" @click="valueConfirm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </span>
    <span>
      <el-button @click="del">-</el-button>
      <el-button @click="add">+</el-button>
    </span>
    <span v-if="item.afterOperation" class="operation">
      <el-select v-model="item.afterOperation" style="width: 50px; margin-right: 15px;" suffix-icon="" @change="change">
        <el-option
          label="&&"
          value="&&"
        />
        <el-option
          label="||"
          value="||"
        />
      </el-select>
    </span>

  </div>
</template>


