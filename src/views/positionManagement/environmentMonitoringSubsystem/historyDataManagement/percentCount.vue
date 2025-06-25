<!--
 * @Description: 合格率统计
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-03-13 15:33:32
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-20 11:02:47
-->
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api' // 主要
const echarts = inject('echarts')
// 饼图
const changetype = (echarts: any, data: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('maychar'))
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    color: ['#91cc75', '#ee6666'],
    title: {
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data,
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

const data = reactive({
  form: {
    deviceId: '',
    deviceType: '',
    attrId: '',
    subsystem: 'huanjing',
    startTime: '',
    endTime: '',
  },
  times: '',
  devTypeOptions: [] as any,
  devAttrOptions: [] as any,
  devOptions: [] as any,
})

function getCount(echarts: any) {

  const postData = {
    params: JSON.parse(JSON.stringify(data.form)),
  }
  postData.params.deviceId = postData.params.deviceId.toString()
  postData.params.deviceType = postData.params.deviceType.toString()
  postData.params.attrId = postData.params.attrId.toString()
  if (postData.params.attrId === '') {
    ElMessage({
      type: 'error',
      message: '请选择设备属性',
    })
    return false
  }
  if (data.form.startTime === '' || data.form.endTime === '') {
    ElMessage({
      type: 'error',
      message: '请选择时间范围',
    })
    return false
  }
  api.get('alarm/alarmHistory/goodRatio/state', postData).then((res: any) => {
    changetype(echarts, res.result)
  }).catch((error) => {
    window.console.log(error)
  })
}

function reset() {
  data.form = {
    deviceId: '',
    deviceType: '',
    attrId: '',
    subsystem: '',
    startTime: '',
    endTime: '',
  }
  data.times = ''
  getCount(echarts)
}

// 获取设备类型下拉
function getDeviceTypeOptions() {
  const subSystemId = data.form.subsystem
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
onMounted(() => {
  data.form.deviceType = ''
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
        <el-select v-model="data.form.attrId" filterable clearable :disabled="data.form.deviceType === ''" placeholder="请选择设备属性">
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
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="data.form.endTime"
          style="width: 100%;"
          type="datetime"
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
