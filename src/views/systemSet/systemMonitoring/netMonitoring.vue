<script lang="ts" setup>
import { ElMessage } from 'element-plus'
// 折线图
import { reactive } from 'vue'
import api from '@/api'
const echarts = inject('echarts') // 主要
const changetype = (echarts: any, id: any, data: any, name: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById(id))
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        min: 0,
        max: 240,
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
        },
        data: [
          {
            value: data,
            name,
          },
        ],
      },
    ],
  }
  // 复制
  machart.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', () => {
    machart.resize()
  })
  machart.resize()
}
const loading = ref(false)
// 获取数据
function getList() {
  loading.value = true
  api.get('/monitor/server').then((res: any) => {
    loading.value = false
    changetype(echarts, 'maychar2', res.data.netWork.txPercent, '网络上行传输速率')
    changetype(echarts, 'maychar3', res.data.netWork.rxPercent, '网络下行传输速率')
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getList()
  const timerID = setInterval(getList, 3000)
})
</script>

<template>
  <PageMain class="pageBox">
    <div class="chart_box">
      <el-row element-loading-text="检测中..." style="height: 100%;min-height: 500px;">
        <el-col :span="12">
          <div id="maychar2" />
        </el-col>
        <el-col :span="12">
          <div id="maychar3" />
        </el-col>
      </el-row>
    </div>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-form--inline .el-form-item {
  width: calc(100%/3 - 40px);
}

.el-select {
  width: 100%;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.chart_box {
  width: 100%;
  min-height: 500px;

  #maychar1 {
    width: 100%;
    min-height: 500px;
  }

  #maychar2 {
    width: 100%;
    min-height: 500px;
  }

  #maychar3 {
    width: 100%;
    min-height: 500px;
  }
}
</style>
