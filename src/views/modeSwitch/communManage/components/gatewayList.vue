<!--
 * @Description:配置网关
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:36:55
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 11:01:17
-->
<script setup lang='ts'>
import api from '@/api'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})
const emits = defineEmits(['update:modelValue'])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
}) as any
const gatewayList = ref([])
const list = () => {
  api.get('/scada/conWangGuan/list').then((res: any) => {
    gatewayList.value = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
onMounted(() => {
  list()
})
</script>

<template>
  <el-transfer
    v-model="value"
    :titles="['网关', '选择']"
    :data="gatewayList"
    :props="{
      key: 'id',
      label: 'name',
    }"
  />
</template>


