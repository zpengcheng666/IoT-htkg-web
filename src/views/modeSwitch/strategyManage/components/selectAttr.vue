<script setup lang="ts">
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
      return extracted(data.data, getName)
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

function getName(id: string) {
  for (const attr of props.attrList as any[]) {
    if (attr.id === id) {
      return attr.name as string
    }
  }
  return ''
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

// 取消选择属性对话框
function clickSelectAttrDialogCancel() {
  data.show = false
  data.radioData = ''
}

// 确认选择属性对话黄
function clickSelectAttrDialogConfirm() {
  data.show = false
  if (!data.data) {
    data.data = ''
  }
  data.data = `${data.data}[${data.radioData}]`
  data.radioData = ''
}
const ddd = ref('')
onMounted(() => {
  data.data = props.modelValue
})
</script>

<template>
  <el-input v-model="publishedBooksMessage" placeholder="请输入" :style="{ width: props.size }">
    <template #append>
      <el-button @click="clickSelectAttrDialogOpen">
        ...
      </el-button>
    </template>
  </el-input>
  <el-dialog
    v-model="data.show"
    title="选择属性"
    width="30%"
  >
    <el-table
      ref="multipleTableRef"
      :data="props.attrList"
      style="width: 100%;"
      height="300"
      highlight-current-row
    >
      <el-table-column align="center" width="55" label="选择">
        <template #default="scope">
          <el-radio v-model="data.radioData" class="radio" :label="scope.row.id">
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column property="name" label="属性名称" width="200"/>
      <el-table-column property="enName" label="英文名" width="200"/>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickSelectAttrDialogCancel">取 消</el-button>
        <el-button type="primary" @click="clickSelectAttrDialogConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.formInput {
  width: 260px;
}
</style>
