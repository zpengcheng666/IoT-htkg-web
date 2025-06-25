<!--
 * @Description:报警统计
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-03-13 13:50:21
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-18 14:38:07
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import api from '@/api'
import Quarter from '@/components/Quarter/index.vue'
const echarts = inject('echarts') // 主要
const data = reactive({
  tableData: [],
  form: {
    deviceType: '',
    deviceId: '',
    attrId: '',
    statisticsWay: 'alarmLevel',
    statisticsResult: 'total',
    statisticsMethod: 'day',
    subsystem: '',
    startTime: '',
    endTime: '',
  },
  times: '',
  subsystemName: '',
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
  dateType: 'date' as any,
})
// 折线图
const changetype = (echarts: any, xData: any, series: any, legend: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('maychar'))
  // 当x轴的数量大于30时，滑动框显示前35%的标签，否则显示108%
  const dataZoomEnd = xData.length > 32 ? 35 : 100
  const unitText = data.form.statisticsResult === 'total' ? '次' : '秒'
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        return `${params.name}<br>${params.marker + params.seriesName}${'<span style="margin-right:10px;"></span>'}${params.value}${unitText}`
      },
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
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      name: data.form.statisticsResult === 'total' ? '单位：次' : '单位：秒',
    },
    dataZoom: [
      {
        type: 'slider', // 在底部
        show: dataZoomEnd !== 100, // 当标签100%显示时，不显示滑块,
        start: xData.length > 32 ? 50 : 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
        end: 100, // 数据窗口范围的结束百分比。范围是：0 ~ 100。
        bottom: 0, // 控制滚动条距离底部的位置;
        showDetail: false,
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
// 获取数据
function getCount(echarts: any) {

  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }

  postData.params.deviceId = postData.params.deviceId.toString()
  postData.params.deviceType = postData.params.deviceType.toString()
  postData.params.attrId = postData.params.attrId.toString()
  api.get('alarm/alarmHistory/stat', postData).then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          name: res.result.legend[i],
          type: 'bar',
          barWidth: 25,
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
    deviceType: '',
    deviceId: '',
    attrId: '',
    statisticsWay: 'alarmLevel',
    statisticsResult: 'total',
    statisticsMethod: 'day',
    subsystem: data.subsystemName,
    startTime: '',
    endTime: '',
  }
  data.times = ''
  data.dateType = 'date'
  getTime()
}
// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.form.subsystem
  api.get(`api/scada/listAlarmDeviceTypeBySubSystem?subSystemId=${subSystemId}`).then((res: any) => {
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
  data.form.attrId = ''
  getDeviceAttrOptions(val)
}

// 获取设备属性下拉
function getDeviceAttrOptions(id: any) {
  const postData = {
    params: {
      devIds: id.toString(),
    },
  }
  api.get('scada/conSheBei/listAlarmAttrByDeviceIds', postData).then((res: any) => {
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

// 获取时间
function getTime() {
  const getNowDate = new Date()
  // 获取当前日期时间
  const nowYear = getNowDate.getFullYear()
  let nowMonth = getNowDate.getMonth() + 1 as any
  let nowDay = getNowDate.getDate() as any
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = `0${nowMonth}`
  }
  if (nowDay >= 1 && nowDay <= 9) {
    nowDay = `0${nowDay}`
  }
  else if (nowDay === 1) {
    nowDay = 30
    nowMonth -= 1
  }
  if (data.form.statisticsMethod === 'day') {
    // 获取一个月前时间
    getNowDate.setMonth(getNowDate.getMonth() - 1)
    const thirtyYear = getNowDate.getFullYear()
    let thirtyMonth = getNowDate.getMonth() + 1 as any
    let thirtyDay = getNowDate.getDate() as any
    if (thirtyMonth >= 1 && thirtyMonth <= 9) {
      thirtyMonth = `0${thirtyMonth}`
    }
    if (thirtyDay >= 1 && thirtyDay <= 9) {
      thirtyDay = `0${thirtyDay}`
    }
    data.form.startTime = `${thirtyYear}-${thirtyMonth}-${thirtyDay}`
    data.form.endTime = `${nowYear}-${nowMonth}-${nowDay}`
  }
  else if (data.form.statisticsMethod === 'month') {
    // // 获取一年时间
    const date = new Date()
    const y = date.getFullYear() - 1 // 减一是算去年时间，+ 1 是明年时间
    data.form.startTime = `${y}-${nowMonth}-${0}${1}`
    data.form.endTime = `${nowYear}-${nowMonth}-${0}${1}`
  }
  else if (data.form.statisticsMethod === 'year') {
    // // 获取四年时间
    const date = new Date()
    const y = date.getFullYear() - 3 // 减一是算去年时间，+ 1 是明年时间
    data.form.startTime = `${y}-${0}${1}-${0}${1}`
    data.form.endTime = `${nowYear}-${0}${1}-${0}${1}`
  }
  else if (data.form.statisticsMethod === 'quarter') {
    // // 获取四年时间
    const date = new Date()
    const y = date.getFullYear() - 1 // 减一是算去年时间，+ 1 是明年时间
    data.form.startTime = `${y}-${0}${1}-${0}${1}`
    data.form.endTime = `${nowYear}-${nowMonth}-${nowDay}`
  }

  getCount(echarts)
}

function selectMethod(val: any) {
  if (val === 'day') {
    data.dateType = 'date'
    getTime()
  }
  else if (val === 'month') {
    data.dateType = 'month'
    getTime()
  }
  else if (val === 'year') {
    data.dateType = 'year'
    getTime()
  }
  else if (val === 'quarter') {
    data.dateType = 'quarter'
    getTime()
  }
}

function getQuarterStart(val: any) {
  data.form.startTime = val
}
function getQuarterEnd(val: any) {
  const newArr = val.split('-') as any
  if (newArr[1] === '01') {
    data.form.endTime = `${newArr[0]}-03-31`
  }
  else if (newArr[1] === '04') {
    data.form.endTime = `${newArr[0]}-06-30`
  }
  else if (newArr[1] === '07') {
    data.form.endTime = `${newArr[0]}-09-30`
  }
  else if (newArr[1] === '10') {
    data.form.endTime = `${newArr[0]}-12-31`
  }
}
onMounted(() => {
  const route = useRoute()
  const index = route.path.lastIndexOf('/')
  const str = route.path.substring(index + 1, route.path.length)
  if (str !== 'alarmCount') {
    data.form.subsystem = str
    data.subsystemName = str
  }
  else {
    data.form.subsystem = ''
  }
  getDeviceTypeOptions()
  reset()
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
        <el-select v-model="data.form.deviceId" multiple filterable clearable :disabled="data.form.deviceType === ''" placeholder="请选择设备" @change="selectDev">
          <el-option
            v-for="item in data.devOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备属性">
        <el-select v-model="data.form.attrId" multiple filterable clearable :disabled="data.form.deviceType === ''" placeholder="请选择设备属性">
          <el-option
            v-for="item in data.devAttrOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="显示结果">
        <el-select v-model="data.form.statisticsResult" filterable clearable placeholder="显示结果">
          <el-option label="次数" value="total" />
          <el-option label="时长" value="duration" />
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期">
        <el-select v-model="data.form.statisticsMethod" filterable clearable placeholder="统计周期" @change="selectMethod">
          <el-option label="日" value="day" />
          <el-option label="月" value="month" />
          <el-option label="季度" value="quarter" />
          <el-option label="年" value="year" />
        </el-select>
      </el-form-item>
      <el-form-item label="统计方式">
        <el-select v-model="data.form.statisticsWay" filterable clearable placeholder="统计方式">
          <el-option label="报警级别" value="alarmLevel" />
          <el-option label="报警类型" value="alarmType" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="data.form.statisticsMethod !== 'quarter'" label="开始时间">
        <el-date-picker
          v-model="data.form.startTime"
          style="width: 100%;"
          :type="data.dateType"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="data.form.statisticsMethod !== 'quarter'" label="结束时间">
        <el-date-picker
          v-model="data.form.endTime"
          style="width: 100%;"
          :type="data.dateType"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="data.form.statisticsMethod === 'quarter'" label="开始时间">
        <Quarter :select-value="data.form.startTime" @get-quarter="getQuarterStart" />
      </el-form-item>
      <el-form-item v-if="data.form.statisticsMethod === 'quarter'" label="结束时间">
        <Quarter :select-value="data.form.endTime" @get-quarter="getQuarterEnd" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="getCount(echarts)">
          查询
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
