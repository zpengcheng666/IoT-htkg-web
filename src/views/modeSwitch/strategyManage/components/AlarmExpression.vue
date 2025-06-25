<script setup lang="ts">
import EditExpression from './EditExpression.vue'
import { getStr } from '@/components/expression/ExpressionUtil'
const props = defineProps({
  attrList: {
    type: Array,
    required: true,
    default: [] as any[],
  },
  modelValue: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '260px',
  },
})
const emits = defineEmits(['update:modelValue'])
const data = reactive({
  show: false,
  radioData: '',
  data: '' as string,
  dataStr: '',
})
const publishedBooksMessage = computed(
  {
    get: () => {
      const list = props.attrList as any[]
      const attrMap = new Map(list.map(item => [item.id, item.name]))
      return getStr(data.data, attrMap)
    },
    set: (newVar) => {
      data.data = extracted(newVar, getId)
    },
  },
)

function extracted(str: string, getFun: (a: string) => string) {
  if (!str) {
    return ''
  }
  let tag = ''
  let is = false
  let val = ''
  for (let i = 0; i < str.length; i++) {
    const iStr = str.charAt(i)
    if (is) {
      if (iStr !== ']') {
        val = `${val}${iStr}`
      }
      else {
        is = false
        tag = `${tag}${getFun(val)}]`
        val = ''
      }
    }
    else {
      if (iStr === '[') {
        tag = `${tag}[`
        is = true
      }
      else {
        tag = `${tag}${iStr}`
      }
    }
  }
  return tag
}
function getId(name: string) {
  for (const attr of props.attrList as any[]) {
    if (attr.name === name) {
      return attr.id as string
    }
  }
  return ''
}
watch(() => data.data, (newVal) => {
  emits('update:modelValue', newVal)
})
// 打开选择属性对话框
function clickSelectAttrDialogOpen() {
  data.show = true
}
const expressionChange = (es: string) => {
  data.data = es
}
onMounted(() => {
  data.data = props.modelValue
})
</script>

<template>
  <el-input v-model="publishedBooksMessage" disabled placeholder="请输入" :style="{ width: props.size }">
    <template #append>
      <el-button @click="clickSelectAttrDialogOpen">
        ...
      </el-button>
    </template>
  </el-input>
  <EditExpression
    v-if="data.show"
    v-model:show="data.show"
    :attr-list="props.attrList"
    :expression="data.data" @change="expressionChange"
  />
</template>

<style lang="scss" scoped>
.formInput {
  width: 260px;
}
</style>
