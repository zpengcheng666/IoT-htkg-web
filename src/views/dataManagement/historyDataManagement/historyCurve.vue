<!--
 * @Description:历史曲线
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-18 14:35:33
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 09:15:14
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'
const echarts = inject('echarts') // 主要

// 折线图
const changetype = (echarts: any, xData: any, series: any, legend: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('maychar'))
  // 当x轴的数量大于30时，滑动框显示前35%的标签，否则显示108%
  const dataZoomEnd = xData.length > 30 ? 35 : 100
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    title: {
    },
    legend: {
      data: legend,
    },
    xAxis: {

      data: xData,
      axisLabel: {
        rotate: 45,
        show: false   // 将show属性设为false即可隐藏x轴上的文字
      },
    },
    yAxis: { type: 'value' },
    dataZoom: [
      {
        type: 'slider', // 在底部
        show: dataZoomEnd !== 100, // 当标签100%显示时，不显示滑块,
        start: xData.length > 30 ? 50 : 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
        end: 100, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
        bottom: 25, // 控制滚动条距离底部的位置;
        /**
            不指定时，当 dataZoom-slider.orient 为 'horizontal'时，
            默认控制和 dataZoom 平行的第一个 xAxis。但是不建议使用默认值，建议显式指定。
            如果是 number 表示控制一个轴，如果是 Array 表示控制多个轴。
            */
        xAxisIndex: [0],
      },
    ],
    series,
  }
  // 复制
  machart.setOption(option)
  // 根据页面大小自动响应图表大小
  window.addEventListener('resize', () => {
    machart.resize()
  })
  machart.resize()
}

const data = reactive({
  form: {
    deviceId: '',
    deviceType: '',
    attrIds: '',
    subsystem: '',
    startTime: '',
    endTime: '',
  },
  times: [] as any,
  subsystemName: '',
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
})

// 获取数据
function getCount(echarts: any) {
  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }

  postData.params.deviceId = postData.params.deviceId.toString()
  postData.params.deviceType = postData.params.deviceType.toString()
  postData.params.attrIds = postData.params.attrIds.toString()
  if (postData.params.attrIds === '') {
    ElMessage({
      type: 'error',
      message: '请选择设备属性',
    })
    return false
  }
  if (data.form.startTime === '') {
    ElMessage({
      type: 'error',
      message: '请选择时间范围',
    })
    return false
  }
  api.get('store/storeHistory/historyLineStatistics', postData).then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          name: res.result.legend[i],
          type: 'line',
          smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }
    changetype(echarts, res.result.xaxis, seriesArr, res.result.legend)
  }).catch((error) => {
    window.console.log(error)
  })
}

function reset() {
  data.form = {
    deviceId: '',
    deviceType: '',
    attrIds: '',
    subsystem: '',
    startTime: '',
    endTime: '',
  }
  data.times = [] as any
  getData()
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.subsystemName
  api.get(`api/scada/listStoreDeviceTypeBySubSystem?subSystemId=${subSystemId}`).then((res: any) => {
    data.devTypeOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 选择设备类型
function selectdevType(val: any) {
  data.form.deviceId = ''
  getDeviceOptions(val)
}

// 选择设备
function selectDev(val: any) {
  data.form.attrIds = ''
  getDeviceAttrOptions(val)
}

// 获取设备属性下拉
function getDeviceAttrOptions(id: any) {
  const postData = {
    params: {
      devIds: id.toString(),
    },
  }
  api.get('scada/conSheBei/listStoreAttrByDeviceIds', postData).then((res: any) => {
    data.devAttrOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取设备下拉
function getDeviceOptions(id: any) {
  const postData = {
    params: {
      devTypeIds: id.toString(),
    },
  }
  api.get('scada/deviceTypeManagement/devTypeIdBydevs', postData).then((res: any) => {
    data.devOptions = res.result
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取当前日期和30天前
function getData() {
  const date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  //  当前日期
  const nowDate = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}` + ' 00:00:00'
  if (m === 1) {
    y--
    m = 12
  }
  else if (m === 3 && d > 28) {
    // 三月要考虑是否为闰年
    m--
    if (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) {
      d = 29
    }
    else {
      d = 28
    }
  }
  else {
    m--
  }
  // 一个月前的日期
  const pastDate = `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}` + ' 00:00:00'
  data.times.push(pastDate)
  data.times.push(nowDate)
}

// 页面初始化方法
onMounted(() => {
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const str = route.path.substring(index + 1, route.path.length)
  if (str !== 'historyCurve') {
    data.form.subsystem = str
    data.subsystemName = str
  }
  else {
    data.form.subsystem = ''
    data.subsystemName = ''
  }
  data.form.deviceType = ''
  getData()
  getDeviceTypeOptions()
})
</script>

<template>
  <PageMain class="pageBox">
    <el-form :inline="true" :model="data.form" class="demo-form-inline">
      <el-form-item label="设备类型">
        <el-select v-model="data.form.deviceType" multiple filterable clearable placeholder="请选择设备类型" @change="selectdevType">
          <el-option
            v-for="item in data.devTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-select v-model="data.form.deviceId" multiple filterable clearable :disabled="!data.form.deviceType" placeholder="请选择设备" @change="selectDev">
          <el-option
            v-for="item in data.devOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备属性">
        <el-select v-model="data.form.attrIds" multiple filterable clearable :disabled="!data.form.deviceType" placeholder="请选择设备属性">
          <el-option
            v-for="item in data.devAttrOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="data.form.startTime"
          style="width: 100%;"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="data.form.endTime"
          style="width: 100%;"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="getCount(echarts)">
          统计
        </el-button>
        <el-button type="info" plain @click="reset()">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div class="chart-box">
      <div id="maychar" />
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

.chart-box {
  width: 100%;
  min-height: 500px;

  #maychar {
    width: 100%;
    min-height: 500px;
  }
}
</style>
