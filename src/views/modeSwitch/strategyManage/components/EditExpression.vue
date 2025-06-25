<script setup lang='ts'>
import ExpressionItem from './EditExpressionItem.vue'
const props = defineProps<{
  attrList: any[]
  expression: string
  show: boolean
}>()
const emits = defineEmits(['update:show', 'change'])
const show = computed({
  get() {
    return props.show
  },
  set(newValue: boolean) {
    emits('update:show', newValue)
  },
})

const groups = reactive<any[]>([])
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
        attr: '',
        operation: '',
        value: '',
        afterOperation: itemAfterOperation,
      }
      const opts: Array<string> = ['==', '!=', '>=', '<=', '>', '<']
      if (itemExpression && itemExpression.length > 0) {
        for (const opt of opts) {
          if (itemExpression.search(opt) !== -1) {
            const its = itemExpression.split(opt)
            if (its.length > 1) {
              const attrTemp = its[0]
              item.attr = attrTemp.substring(1, attrTemp.length - 1)
              item.operation = opt
              item.value = its[1]
            }
            break
          }
        }
      }
      items.push(item)
    }
  }
  return items
}
const itemChange = (groupItem: any, itemIndex: number, newItem: any) => {
  const item = groupItem.items[itemIndex]
  item.attr = newItem.attr
  item.operation = newItem.operation
  item.value = newItem.value
  item.afterOperation = newItem.afterOperation
}
const getDefaultItem = () => {
  return {
    attr: '',
    operation: '==',
    value: '',
    afterOperation: '',
  }
}
const getDefaultGroup = () => {
  const its: any[] = []
  its.push(getDefaultItem())
  return {
    items: its,
    option: '',
  }
}
const itemDel = (groupIndex: number, groupItem: any, itemIndex: number) => {
  if (groupItem.items.length !== 1 && groupItem.items.length === itemIndex + 1) {
    groupItem.items[itemIndex - 1].afterOperation = ''
  }
  groupItem.items.splice(itemIndex, 1)
  if (groupItem.items.length === 0) {
    if (groupIndex !== 0) {
      groups[groupIndex - 1].operation = ''
      groups.splice(groupIndex, 1)
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

const add = () => {
  if (groups.length > 0) {
    groups[groups.length - 1].operation = '&&'
  }
  groups.push(getDefaultGroup())
}
const confirm = () => {
  let es = ''
  groups.forEach((g) => {
    let its = ''
    g.items.forEach((i: any) => {
      its = `${its}[${i.attr}]${i.operation}${i.value}`
      if (i.afterOperation) {
        its = `${its}${i.afterOperation}`
      }
    })
    if (groups.length === 1) {
      es = its
    }
    else {
      es = `${es}(${its})`
    }
    if (g.operation) {
      es = `${es}${g.operation}`
    }
  })
  emits('change', es)
  show.value = false
}
onMounted(() => {
  if (!props.expression || props.expression.length === 0) {
    groups.push(getDefaultGroup())
  }
  else {
    const regex = /(?:\(|\))/
    const groupArray = props.expression.split(regex)
    const gs = groupArray
      .filter((s) => {
        return s.length > 0
      }).map((s) => {
        return s.trim()
      }).flatMap((s) => {
        if (s.endsWith('&&') && s.length > 2) {
          return [s.substring(0, s.length - 2), '&&']
        }
        if (s.endsWith('||') && s.length > 2) {
          return [s.substring(0, s.length - 2), '||']
        }
        return [s]
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
})
</script>

<template>
  <div>
    <el-dialog
      v-model="show"
      title="编辑表达式"
      width="900px"
      destroy-on-close
    >
      <div>
        <el-button type="primary" style="margin-bottom: 10px; margin-left: 10px;" @click="add">
          增加分组
        </el-button>
      </div>
      <div style="height: 500px; overflow-y: scroll;">
        <div v-for="(groupItem, groupIndex) in groups" :key="groupItem.items" class="group">
          <el-card style="width: 800px; margin: 10px;">
            <div v-for="(item, index) in groupItem.items" :key="item">
              <span>
                <ExpressionItem
                  :attr-list="props.attrList"
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
  </div>
</template>
