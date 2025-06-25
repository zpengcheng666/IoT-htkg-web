<script setup lang='ts'>
import { getStr, logicOpt } from '@/components/expression/ExpressionUtil'
const props = defineProps<{
  attrList: any[]
  expressionItem: any
  groupIndex: number
  itemIndex: number
}>()
const emits = defineEmits(['change', 'del', 'add'])
const item = reactive({
  attr: props.expressionItem.attr,
  operation: props.expressionItem.operation,
  value: props.expressionItem.value,
  afterOperation: props.expressionItem.afterOperation,
})
const attrMap = new Map()
props.attrList.forEach((a) => {
  attrMap.set(a.id, a.name)
})
const change = () => {
  emits('change', item)
}
const itemValue = computed({
  get() {
    return getStr(item.value, attrMap)
  },
  set(newValue: string) {
  },
})
watch(props.expressionItem, (newX) => {
  item.afterOperation = newX.afterOperation
})

const editData = reactive({
  isShow: false,
  value: '',
  input: '',
  select: '',
})
const clean = () => {
  editData.value = ''
  editData.input = ''
  editData.select = ''
}
const changeInput = (value: string | null) => {
  editData.select = ''
  editData.value = `${editData.value}${editData.input}`
  editData.input = ''
}
const changeSelect = () => {
  editData.input = ''
  editData.value = `${editData.value}[${editData.select}]`
}
const edit = () => {
  clean()
  editData.value = item.value
  editData.isShow = true
}
const valueConfirm = () => {
  item.value = editData.value
  change()
  editData.isShow = false
}
const valueCancel = () => {
  editData.isShow = false
}
const editValue = computed(() => {
  return getStr(editData.value, attrMap)
})
const del = () => {
  emits('del')
}
const add = () => {
  emits('add')
}

onMounted(() => {
  props.attrList.forEach((a) => {
    attrMap.set(a.id, a.name)
  })
})
</script>

<template>
  <div>
    <span class="device" style="margin-right: 15px;">
      <el-select v-model="item.attr" placeholder="选择设备属性" :filterable="true" @change="change">
        <el-option
          v-for="a in props.attrList"
          :key="a.id"
          :label="a.name"
          :value="a.id"
        />
      </el-select>
    </span>
    <span class="operation">
      <el-select v-model="item.operation" style="width: 40px;" suffix-icon="" @change="change">
        <el-option
          v-for="o in logicOpt"
          :key="o"
          :label="o"
          :value="o"
        />
      </el-select>
    </span>
    <span class="value" style="margin-left: 15px;">
      <el-form-item :required="false">
        <el-input v-model="itemValue" placeholder="值" size="default" style="width: 300px; height: 40px;" disabled>
          <template #append>
            <el-button @click="edit">
              ...
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-dialog
        v-model="editData.isShow"
        title="表达式设置"
        width="30%"
      >
        <div>
          <div style="margin-bottom: 10px;">
            {{ editValue }}
          </div>
          <div>
            <el-input v-model="editData.input" placeholder="输入值，按回车确定" size="default" style="width: 300px; height: 30px;" @change="changeInput" />
            <el-select v-model="editData.select" placeholder="选择设备属性" :filterable="true" style="width: 300px; height: 30px;" @change="changeSelect">
              <el-option
                v-for="a in props.attrList"
                :key="a.id"
                :label="a.name"
                :value="a.id"
              />
            </el-select>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="clean">清空</el-button>
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
      <el-select v-model="item.afterOperation" style="width: 50px;" suffix-icon="" @change="change">
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
