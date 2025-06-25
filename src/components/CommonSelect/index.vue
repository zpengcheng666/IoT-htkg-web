<script setup lang='ts'>
import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue'
import api from '@/api'
const props = defineProps({
  // 下拉的数据
  selectValue: {
    type: String,
    default() {
      return ''
    },
  },
  // 请求传参
  postParam: {
    type: String,
    required: true,
    default() {
      return []
    },
  },
  // 是否绑定名称
  isName: {
    type: Boolean,
    default() {
      return false
    },
  },

})
const emits = defineEmits(['selectChange'])
const data = reactive({
  selectOptions: [{
    id: '',
    name: '',
  }],
})

const selectValue = computed({
  get() {
    // getter
    return props.selectValue
  },
  set(val) {
    return val
  },
})

// 当前页改变的时候触发的事件
const selectChange = (val: any) => {
  emits('selectChange', val)
}

// 获取下拉数据
function getSelectOptions() {
  const postData = {
    params: { type: props.postParam },
  }
  api.get('system/baseDictData/queryOptions', postData).then((res: any) => {
    data.selectOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  // console.log(selectValue)
  getSelectOptions()
})
</script>

<template>
  <el-select v-model="selectValue" filterable clearable class="m-2" placeholder="请选择" @change="selectChange">
    <el-option
      v-for="item in data.selectOptions"
      :key="item.id"
      :label="item.name"
      :value="props.isName ? item.name : item.id"
    />
  </el-select>
</template>

