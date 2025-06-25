<script setup lang='ts'>
import { ArrowLeft, ArrowRight, Calendar } from '@element-plus/icons-vue'
const props = defineProps({
  // 下拉的数据
  selectValue: {
    type: String,
    default() {
      return ''
    },
  },

})
// 传给父组件
const emits = defineEmits(['getQuarter'])
let selectValue = computed({
  get() {
    // getter
    return props.selectValue
  },
  set(val) {
    return val
  },
}) as any
const getQuarter = (val: any) => {
  emits('getQuarter', val)
}
const data = reactive({
  showSeason: false, // 是否显示选择季度面板
  year: new Date().getFullYear(), // 默认当前年
  seasonValue: '', // input中显示的内容
})

function prev() {
  data.year = +data.year - 1
}
function next() {
  data.year = +data.year + 1
}
function selectSeason(quarter: any) {
  selectValue = `${data.year.toString()}-${quarter.toString()}`
  data.showSeason = false
  switch (quarter) {
    case '第一季度':
      selectValue = `${data.year.toString()}-01-01`
      break
    case '第二季度':
      selectValue = `${data.year.toString()}-04-01`
      break
    case '第三季度':
      selectValue = `${data.year.toString()}-07-01`
      break
    case '第四季度':
      selectValue = `${data.year.toString()}-10-01`
      break
  }
  getQuarter(selectValue) // 传值给父组件
}
</script>

<template>
  <div style="width: 100%;">
    <el-input v-model="selectValue" class="w-50 m-2" placeholder="请选择季度" style="width: 100%;" @focus="data.showSeason = true">
      <template #prefix>
        <el-icon class="el-input__icon">
          <Calendar />
        </el-icon>
      </template>
    </el-input>
    <el-card v-if="data.showSeason" class="box-card" style="height: 180px;margin-left: 60px;margin-top: 10px;width: 300px;z-index: 999;position: fixed;">
      <template #header>
        <div class="card-header">
          <el-button style="border: none;" @click="prev">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span style="text-align: center;">{{ data.year }}</span>
          <el-button style="border: none;" @click="next">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </template>
      <div class="text item" style="text-align: center;">
        <el-button
          type="text"
          size="small"
          style="width: 40%;color: #606266;float: left;"
          @click="selectSeason('第一季度')"
        >
          第一季度
        </el-button>
        <el-button
          type="text"
          size="small"
          style="float: right;width: 40%;color: #606266;"
          @click="selectSeason('第二季度')"
        >
          第二季度
        </el-button>
      </div>
      <div class="text item" style="text-align: center;">
        <el-button
          type="text"
          size="small"
          style="width: 40%;color: #606266;float: left;"
          @click="selectSeason('第三季度')"
        >
          第三季度
        </el-button>
        <el-button
          type="text"
          size="small"
          style="float: right;width: 40%;color: #606266;"
          @click="selectSeason('第四季度')"
        >
          第四季度
        </el-button>
      </div>
    </el-card>
  </div>
</template>
