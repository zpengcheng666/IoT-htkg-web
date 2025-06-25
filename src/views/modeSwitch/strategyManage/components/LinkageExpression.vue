<script setup lang="ts">
import { ElMessage } from 'element-plus'
import LinkageExpressionItem from './LinkageExpressionItem.vue'
import api from '@/api'
const props = defineProps<{
  modelValue: string
  deviceList: any[]
  size: string
}>()
const emits = defineEmits(['update:modelValue'])
const expressionStr = ref('')
const groups = ref<any[]>([])
const show = ref(false)
const getDefaultItem = () => {
  return {
    inAttrId: '',
    operation: '==',
    value: '',
    afterOperation: '',
  }
}
const getDefaultGroup = (): any => {
  const its: any[] = []
  its.push(getDefaultItem())
  return {
    items: its,
    option: '',
  }
}
const getItems = (str: string): any[] => {
  const items = [] as any
  const regex = /(&&|\|\|)/
  const sp = str.split(regex)
  for (let i = 0; i < sp.length; i++) {
    if (i % 2 === 0) {
      const itemExpression = sp[i]
      let itemAfterOperation = ''
      if (i !== sp.length - 1) {
        itemAfterOperation = sp[i + 1]
      }
      const item = {
        inAttrId: '',
        operation: '',
        value: '',
        afterOperation: itemAfterOperation,
      }
      if (itemExpression && itemExpression.length > 0) {
        const regex = /(\[)(\w+)(\])(==|!=|>=|<=|>|<)(\[?\w+\]?)/
        const match = itemExpression.match(regex)
        if (match !== null) {
          item.inAttrId = match[2]
          item.operation = match[4]
          item.value = match[5]
        }
      }
      items.push(item)
    }
  }
  return items
}
const expressionToGroups = (expression: string): any[] => {
  const groups: any[] = []
  if (expression) {
    const regex = /(?:\(|\))/
    const groupArray = expression.split(regex)
    const gs = groupArray.filter((s) => {
      return s.length > 0
    })
    for (let i = 0; i < gs.length; i++) {
      if (i % 2 === 0) {
        let opt = ''
        if (i !== gs.length - 1) {
          opt = gs[i + 1]
        }
        const group = {
          items: getItems(gs[i]),
          operation: opt,
        }
        groups.push(group)
      }
    }
  }
  else {
    groups.push(getDefaultGroup())
  }
  return groups
}
const groupsToExpression = (): string => {
  let es = ''
  groups.value.forEach((g) => {
    let its = ''
    g.items.forEach((i: any) => {
      its = `${its}[${i.inAttrId}]${i.operation}${i.value}`
      if (i.afterOperation) {
        its = `${its}${i.afterOperation}`
      }
    })
    if (groups.value.length === 1) {
      es = its
    }
    else {
      es = `${es}(${its})`
    }
    if (g.operation) {
      es = `${es}${g.operation}`
    }
  })
  return es
}

const add = () => {
  if (groups.value.length > 0) {
    groups.value[groups.value.length - 1].operation = '&&'
  }
  groups.value.push(getDefaultGroup())
}
const itemDel = (groupIndex: number, groupItem: any, itemIndex: number) => {
  if (groupItem.items.length !== 1 && groupItem.items.length === itemIndex + 1) {
    groupItem.items[itemIndex - 1].afterOperation = ''
  }
  groupItem.items.splice(itemIndex, 1)
  if (groupItem.items.length === 0) {
    if (groupIndex !== 0) {
      groups.value[groupIndex - 1].operation = ''
      groups.value.splice(groupIndex, 1)
    }
    else {
      groupItem.items.push(getDefaultItem())
    }
  }
}
const itemAdd = (groupItem: any, itemIndex: number) => {
  const defaultItem = getDefaultItem()
  if (groupItem.items.length === itemIndex + 1) {
    groupItem.items[itemIndex].afterOperation = '&&'
  }
  if (groupItem.items.length !== itemIndex + 1) {
    defaultItem.afterOperation = '&&'
  }
  groupItem.items.splice(itemIndex + 1, 0, defaultItem)
}
const itemChange = (groupItem: any, itemIndex: number, newItem: any) => {
  const item = groupItem.items[itemIndex]
  item.inDeviceId = newItem.inDeviceId
  item.inAttrId = newItem.inAttrId
  item.operation = newItem.operation
  item.value = newItem.value
  item.afterOperation = newItem.afterOperation
}

const getExpressionStr = (expression: string) => {
  api.post('scada/linkageStrategy/getExpressionStr', { expression }).then((res: any) => {
    if (res.code === 200) {
      expressionStr.value = res.result
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
const confirm = () => {
  const expression = groupsToExpression()
  emits('update:modelValue', expression)
  getExpressionStr(expression)
  show.value = false
}
const open = () => {
  groups.value = expressionToGroups(props.modelValue)
  show.value = true
}

onMounted(() => {
  getExpressionStr(props.modelValue)
})
</script>

<template>
  <el-input v-model="expressionStr" disabled placeholder="请编辑表达式" :style="{ width: props.size }">
    <template #append>
      <el-button @click="open">
        ...
      </el-button>
    </template>
  </el-input>
  <el-dialog
    v-model="show"
    title="编辑表达式"
    width="1200px"
    destroy-on-close
  >
    <div>
      <el-button type="primary" style="margin-bottom: 10px; margin-left: 10px;" @click="add">
        增加分组
      </el-button>
    </div>
    <div style="height: 500px; overflow-y: scroll;">
      <div v-for="(groupItem, groupIndex) in groups" :key="groupItem.items" class="group">
        <el-card style="width: 1000px; margin: 10px;">
          <div v-for="(item, index) in groupItem.items" :key="item">
            <span>
              <LinkageExpressionItem
                :device-list="props.deviceList"
                :group-index="groupIndex"
                :item-index="index"
                :expression-item="item"
                @change="(newItem) => { itemChange(groupItem, index, newItem) }"
                @del="itemDel(groupIndex, groupItem, index)"
                @add="itemAdd(groupItem, index)"
              />
            </span>
          </div>
        </el-card>
        <div v-if="groupItem.operation" class="operation">
          <el-select v-model="groupItem.operation" style="width: 50px; margin-left: 10px;" suffix-icon="">
            <el-option
              label="&&"
              value="&&"
            />
            <el-option
              label="||"
              value="||"
            />
          </el-select>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 260px;
}
</style>
