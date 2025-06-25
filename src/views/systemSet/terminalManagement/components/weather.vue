<script lang="ts" setup>
import { reactive } from 'vue'
import Sunny from '@/assets/images/tqIcon/qingtian.png'
import Cloudy from '@/assets/images/tqIcon/duoyun.png'
import Snow from '@/assets/images/tqIcon/daxue.png'
import Rain from '@/assets/images/tqIcon/dayu.png'
import AllCloudy from '@/assets/images/tqIcon/yintian.png'
import RainShower from '@/assets/images/tqIcon/zhenyu.png'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Array<any>,
    default() {
      return []
    },
  },

})
let lists = reactive(props.infoData)
const echarts = inject('echarts') // 主要
const weatherIcons = {
  Sunny,
  Cloudy,
  Snow,
  Rain,
  AllCloudy,
  RainShower,
} as const
const data = reactive({
  Xdata: [] as any,
  highArr: [] as any,
  lowArr: [] as any,
  seriesArr: [] as any,
  weatherArr: [] as any,
})
// 折线图
const changetype = (echarts: any, xData: any, series: any, weatherArr: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('maychar'))
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },

    title: {
    },

    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          textBorderColor: '#000',
          textBorderWidth: 2,
        },
        data: xData,
      },
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        inverse: true,
        data: weatherArr,
        axisLabel: {
          formatter(value: string) {
            return `{${value}| }`
          },
          interval: 0,
          margin: 20,
          rich: {
            value: {
              lineHeight: 30,
              align: 'center',
            },
            Sunny: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.Sunny,
              },
            },
            Cloudy: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.Cloudy,
              },
            },
            Snow: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.Snow,
              },
            },
            Rain: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.Rain,
              },
            },
            AllCloudy: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.AllCloudy,
              },
            },
            RainShower: {
              height: 24,
              align: 'center',
              backgroundColor: {
                image: weatherIcons.RainShower,
              },
            },

          },
        },
      },
    ],
    yAxis: {
      show: false,
      type: 'value',
      axisLabel: {
        formatter: '{value} °C',
      },
    },

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
// 处理数据
function processData() {
  if (lists.length > 0) {
    data.Xdata = []
    data.highArr = []
    data.lowArr = []
    data.weatherArr = []
    data.seriesArr = []
    for (let i = 0; i < lists.length; i++) {
      data.Xdata.push(lists[i].weatherTimeStr)
      data.highArr.push(lists[i].highTmp)
      data.lowArr.push(lists[i].lowTmp)
      data.weatherArr.push(lists[i].content)
    }
    const highObj = {
      type: 'line',
      data: data.highArr,
      label: {
        show: true,
        position: 'top',
        formatter: '{c} °C',
      },
      smooth: true,
    }
    const lowObj = {
      type: 'line',
      data: data.lowArr,
      label: {
        show: true,
        position: 'top',
        formatter: '{c} °C',
      },
      smooth: true,
    }
    data.seriesArr.push(lowObj, highObj)
    changetype(echarts, data.Xdata, data.seriesArr, data.weatherArr)
  }
}
// 刷新图表
function resizeChart() {
  changetype(echarts, data.Xdata, data.seriesArr, data.weatherArr)
}
defineExpose({
  resizeChart,
})
watch(
  () => props.infoData,
  (newVal, oldVal) => {
    lists = newVal
    processData()
  },
)
onMounted(() => {
  setTimeout(() => {
    processData()
  }, 200)
})
</script>

<template>
  <div class="common-layout">
    <el-card class="box-card">
      <template #header>
        <div class="card-header bs-tit">
          <span>气象信息</span>
        </div>
      </template>
    </el-card>
    <div class="chart_box">
      <div id="maychar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
}

.box-card {
  border: none;
  border-radius: 0;
}

.bs-tit {
  $bs-tit-bgcolor: #51b893; /* #0d619b */

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  font-size: 18px;
  text-shadow: 0 0 3px #333;
  background: linear-gradient(135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat 10px calc(50% + 10px)/10px 10px, repeating-linear-gradient(45deg, $bs-tit-bgcolor, $bs-tit-bgcolor 3px, transparent 3px, transparent 6px) no-repeat 2em calc(50% + 10px)/calc(100% - 2.625em) 10px;
  color: #fff;

  span {
    display: block;
    line-height: 48px;
    padding: 0 1em 0 calc(1em + 10px);
    background: linear-gradient(-135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat right calc(50% + 10px)/10px 10px, linear-gradient($bs-tit-bgcolor, $bs-tit-bgcolor) no-repeat 20px calc(50% + 10px)/calc(100% - 30px) 10px;
  }

  span em {
    font-style: normal;
    padding: 0 0.5em;
    font-size: 20px;
    font-weight: bold;
  }

  span em.badge {
    font-style: normal;
    padding: 0 0.5em;
    background: #f05a65;
    border-radius: 14px;
    font-size: 14px;
    font-weight: normal;
    margin: 0 0.5em;
  }
}

:deep(.el-card__header) {
  border-bottom: none;
  color: #fff;
  padding: 0;
}

:deep(.box-card .el-card__body) {
  height: calc(100% - 62px);
  margin: 0 5px;
  padding: 0 5px;
  overflow: hidden;
  overflow-y: auto;
}

.chart_box {
  width: 100%;
  height: calc(100% - 48px);

  #maychar {
    width: 100%;
    height: 100%;
  }
}

:deep(.el-card) {
  background: none;
}
</style>
