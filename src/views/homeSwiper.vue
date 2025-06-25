<script lang="ts" setup>
import ToolsNew from '../layouts/components/ToolsNew/index.vue'
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'
import useSettingsStore from '@/store/modules/settings'
import api from '@/api'

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()
const userStore = useUserStore()
const router = useRouter()
const data = reactive({
  selectNav: 0,
  alarmCnt: 0,
  sysFilesData: { usage: 0, total: 0, used: 0 } as any,
  navList: [{
    name: '安全防范系统',
    children: [{
      name: '门禁安检',
      path: 'accessControlSubsystem',
      active: 0,
    }, {
      name: '音视频监控',
      path: 'audioVideoSubsystem',
      active: 1,
    }, {
      name: '火灾报警',
      path: 'fireAlarmSubsystem',
      active: 2,
    }, {
      name: '周边警戒',
      path: 'peripheralAlertSubsystem',
      active: 3,
    }],
  }, {
    name: '阵地管理分系统',
    children: [{
      name: '环境监控',
      path: 'environmentMonitoringSubsystem',
      active: 0,
    }, {
      name: '电力监控',
      path: 'powerMonitoringSubsystem',
      active: 1,
    }, {
      name: '给排水监控',
      path: 'waterSupplyDrainageSubsystem',
      active: 2,
    }, {
      name: '实施设备管理',
      path: 'equipmentManagementSubsystem',
      active: 3,
    }],
  }, {
    name: '装备管理分系统',
    children: [],
  }, {
    name: '指挥监控分系统',
    children: [{
      name: '智能广播',
      path: 'intelligentBroadcastSubsystem',
      active: 0,
    }, {
      name: '信息发布',
      path: 'infoPublishingSubsystem',
      active: 1,
    }],
  }],
  sysNavData: [] as any, // 系统导航菜单数据
  isAnimate: false,
})
const time = ref('---')
function clickNav(index: any) {
  if (index === 2) {
    return false
  }
  data.isAnimate = false
  setTimeout(() => {
    data.isAnimate = true
  }, 1)
  data.selectNav = index
}
function getNowTime() {
  const id = setInterval(() => {
    const now = new Date()
    time.value = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }, 1000)
}

// 获取报警数量
function getAlarmCount() {
  api.get('/alarm/alarmData/findNoAckAlarmCount').then((res: any) => {
    data.alarmCnt = res.result[0].alarmCnt
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取服务器信息
function getSysData() {
  api.get('/monitor/server').then((res: any) => {
    data.sysFilesData.usage = res.data.sysFiles[0].usage
    data.sysFilesData.total = parseInt(res.data.sysFiles[0].total)
    data.sysFilesData.used = parseInt(res.data.sysFiles[0].used)
  }).catch((error) => {
    window.console.log(error)
  })
}

// 跳转页面
function toPage(path: string | undefined, active: any | undefined) {
  router.push({
    name: path,
  })
  setTimeout(() => {
    menuStore.setTabActive(active)
    sessionStorage.setItem('tabActive', active)
  }, 50)
}

function toChildPage(path: string | undefined) {
  for (let i = 0; i < data.sysNavData.length; i++) {
    // 跳转安全管理
    if (path === data.sysNavData[i].name) {
      router.push({
        name: data.sysNavData[i].children[0].name,
      })
      setTimeout(() => {
        menuStore.setTabActive(i)
        sessionStorage.setItem('tabActive', i.toString())
      }, 50)
    }
    for (let j = 0; j < data.sysNavData[i].children.length; j++) {
      if (path === data.sysNavData[i].children[j].name) {
        router.push({
          name: path,
        })
        setTimeout(() => {
          menuStore.setTabActive(i)
          sessionStorage.setItem('tabActive', i.toString())
        }, 50)
      }
    }
  }
}
const echarts = inject('echarts') // 主要
const changetype = (echarts: any, xData: any, series: any, id: any, title: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById(id))
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    // color: ['#34ED68', '#ED493E'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    title: {
      text: title,
      left: 'center',
      top: 5,
      textStyle: { // 标题美化
        color: '#fff', // 标题颜色
      },
    },
    // legend: {
    //   data: legend,
    // },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: xData,
      axisLabel: {
        // interval: 0, // 横轴信息全部显示
        // rotate: 30, // 倾斜度 -90 至 90 默认为0
        margin: 5, // 刻度标签与轴线之间的距离
        textStyle: {
          fontSize: 9, // 横轴字体大小
          color: '#fff', // 颜色
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { // y轴文字的配置
        textStyle: {
          color: '#fff',
        },
        // formatter: '{value} %'//y轴的每一个刻度值后面加上‘%’号
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

const pieChart = (echarts: any, data: any) => {
  // 获取组件实例
  const machart = echarts.init(document.getElementById('homeChar3'))
  machart.clear()
  // 设置配置项
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: {
        // fontSize: 18, // 字体大小
        color: '#ffffff', // 字体颜色
      },
    },
    color: ['#2d8cc8', '#8c8c8c'],
    title: {
      text: '设备在线数量',
      textStyle: { // 标题美化
        color: '#fff', // 标题颜色--红
      },
      left: 'center',
      top: 5,
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '60%',
        itemStyle: {
          // borderRadius: 10,
          // borderColor: '#fff',
          // borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 20,
        //     fontWeight: 'bold',
        //     color: '#fff',
        //   },
        // },
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

// 获取设备类型数量
function getDeviceTypeCount() {
  api.get('/scada/conSheBei/statByDeviceType').then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          // name: res.result.legend[i],
          type: 'bar',
          // stack: 'Total',
          // smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }

    changetype(echarts, res.result.xaxis, seriesArr, 'homeChar1', '设备数量')
  }).catch((error) => {
    window.console.log(error)
  })
}
// 获取设备类型数量
function getAlarmLastMonthCount() {
  api.get('/alarm/alarmHistory/stateCountLastMonth').then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          // name: res.result.legend[i],
          type: 'line',
          // stack: 'Total',
          // smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }

    changetype(echarts, res.result.xaxis, seriesArr, 'homeChar2', '报警数量')
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备类型数量
function getDeviceTypeCount1() {
  api.get('/scada/conSheBei/statByDeviceType').then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          // name: res.result.legend[i],
          type: 'bar',
          // stack: 'Total',
          // smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }

    changetype(echarts, res.result.xaxis, seriesArr, 'homeChar4', '设备数量')
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备类型数量
function getDeviceTypeCount2() {
  api.get('/scada/conSheBei/statByDeviceType').then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          // name: res.result.legend[i],
          type: 'bar',
          // stack: 'Total',
          // smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }

    changetype(echarts, res.result.xaxis, seriesArr, 'homeChar5', '设备数量')
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备类型数量
function getDeviceTypeCount3() {
  api.get('/scada/conSheBei/statByDeviceType').then((res: any) => {
    const seriesArr = []
    if (res.result.legend.length > 0) {
      for (let i = 0; i < res.result.legend.length; i++) {
        const obj = {
          // name: res.result.legend[i],
          type: 'bar',
          // stack: 'Total',
          // smooth: true,
          data: res.result.series[i],
        }
        seriesArr.push(obj)
      }
    }

    changetype(echarts, res.result.xaxis, seriesArr, 'homeChar6', '设备数量')
  }).catch((error) => {
    window.console.log(error)
  })
}

// 获取设备状态数量
function getDeviceStateCount() {
  api.get('/scada/conSheBei/statByDeviceState').then((res: any) => {
    pieChart(echarts, res.result)
  }).catch((error) => {
    window.console.log(error)
  })
}

onMounted(() => {
  getSysData()
  getNowTime()
  getAlarmCount()
  getDeviceTypeCount()
  getDeviceStateCount()
  getAlarmLastMonthCount()
  getDeviceTypeCount1()
  getDeviceTypeCount2()
  getDeviceTypeCount3()
  for (const i in menuStore.allMenus) {
    if (menuStore.allMenus[i].title === '系统设置') {
      data.sysNavData = menuStore.allMenus[i].children
    }
  }
})
</script>

<template>
  <div class="home-box">
    <div class="header">
      <div class="tit">
        <h2>综合信息管理系统</h2>
      </div>
      <div class="menu">
        <!-- <a href="#">数据管理</a>
        <a href="#">系统设置</a>
        <a href="#">模式切换</a>
        <a href="#">退出系统</a> -->
        <ToolsNew />
      </div>
      <div class="mask-animate" />
    </div>
    <div class="mainBody">
      <div class="leftSidebar animated fadeInLeft">
        <!-- <div class="leftSidebarCont"> -->
        <!-- <div class="user-info">
            <h2>欢迎您，{{ userStore.username }}</h2>
            <div class="time">
              {{ time }}
            </div>
          </div>
          <div class="menu">
            <div v-for="(item, index) in data.navList" :key="index" :class="index === data.selectNav ? 'active' : ''" @click="clickNav(index)">
              {{ item.name }}
            </div>
          </div> -->
        <div id="homeChar4" class="echarts-item" />
        <div id="homeChar5" class="echarts-item" />
        <div id="homeChar6" class="echarts-item" />
        <!-- </div> -->
      </div>
      <div class="middleContent animated zoomIn">
        <div class="home-basic-data ">
          <div class="hbd-item">
            <i class="icon-state state01" />
            <div class="num-txt">
              {{ data.sysFilesData.total }}
              <h3>服务器容量(GB)</h3>
            </div>
          </div>
          <div class="hbd-item">
            <i class="icon-state state02" />
            <div class="num-txt">
              {{ data.sysFilesData.used }}
              <h3>服务器已用(GB)</h3>
            </div>
          </div>
          <div class="hbd-item">
            <i class="icon-state state04" />
            <div class="num-txt">
              {{ data.sysFilesData.usage }}%
              <h3>服务器使用率</h3>
            </div>
          </div>
          <div class="hbd-item">
            <i class="icon-state state03" />
            <div class="num-txt">
              {{ data.alarmCnt }}<span>个</span>
              <h3>报警信息</h3>
            </div>
          </div>
        </div>
        <div class="home-middle-nav-tit">
          <span class="ani-01" />
          <span class="ani-02" />
          <span class="ani-03" />
          <h2>{{ data.navList[data.selectNav].name }}</h2>
        </div>
        <div :class="data.isAnimate ? 'home-middle-nav-menu nav-menu01' : 'home-middle-nav-menu nav-menu01' " class="">
          <ul :class="data.isAnimate ? 'animated fadeInUp slow-2s nav-icon-box' : 'nav-icon-box' ">
            <div v-for="(item, index) in data.navList[data.selectNav].children" :key="index" class="nav-icon" @click="toPage(item.path, item.active)">
              {{ item.name }}
            </div>
          </ul>
        </div>

        <div class="online-device">
          <div class="online-device-list">
            <div class="device-item" @click="toPage('bigScreenStartNew', 0)">
              <img src="@/assets/images/big-screen.png">
              <h3>信息发布</h3>
            </div>
            <div class="device-item" @click="toChildPage('userPermission')">
              <img src="@/assets/images/safety-management.png">
              <h3>安全管理</h3>
            </div>
            <div class="device-item" @click="toChildPage('netMonitoring')">
              <img src="@/assets/images/network-detection.png">
              <h3>网络健康</h3>
            </div>
            <div class="device-item" @click="toChildPage('systemProcessMonitoring')">
              <img src="@/assets/images/system-processes.png">
              <h3>系统进程</h3>
            </div>
            <div class="device-item" @click="toChildPage('computerStatusMonitoring')">
              <img src="@/assets/images/host-status.png">
              <h3>主机状态</h3>
            </div>
          </div>
          <h2>在线设备</h2>
        </div>
      </div>
      <div class="rightSidebar animated fadeInRight">
        <div id="homeChar1" class="echarts-item" />
        <div id="homeChar2" class="echarts-item" />
        <div id="homeChar3" class="echarts-item" />
      </div>
    </div>

    <div class="Copyright">
      <span>Copyright©{{ settingsStore.copyright.dates }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-box {
  background: radial-gradient(#172976, #050c2e 80%, #050c2e);
  width: 100%;
  height: 100%;
  overflow: hidden;

  .Copyright {
    width: 100%;
    text-align: center;
    position: absolute;
    color: #fff;
    bottom: 10px;
    font-size: 12px;
  }

  .header {
    position: relative;
    height: 107px;
    background: linear-gradient(to right, #2d1e9e, #3d61ce) no-repeat, linear-gradient(to right, #3d61ce, #2d1e9e) no-repeat, linear-gradient(#3d61ce, #3d61ce) no-repeat, linear-gradient(#3d61ce, #3d61ce) no-repeat, linear-gradient(45deg, transparent, transparent calc(50% - 1px), #3d61ce calc(50% - 1px), #3d61ce calc(50% + 2px), transparent calc(50% + 2px), transparent) no-repeat, linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #3d61ce calc(50% - 1px), #3d61ce calc(50% + 2px), transparent calc(50% + 2px), transparent) no-repeat, linear-gradient(45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 1px), transparent calc(50% + 1px), transparent) no-repeat, linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 1px), transparent calc(50% + 1px), transparent) no-repeat, linear-gradient(45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 2px), transparent calc(50% + 2px), transparent) no-repeat, linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 2px), transparent calc(50% + 2px), transparent) no-repeat, linear-gradient(to right, #277bd1, #50d9fb) no-repeat, linear-gradient(to right, #50d9fb, #277bd1) no-repeat, linear-gradient(to right, #3e61ce, #50d9fb) no-repeat, linear-gradient(to right, #50d9fb, #3e61ce) no-repeat, linear-gradient(#50d9fb, #50d9fb) no-repeat, linear-gradient(#50d9fb, #50d9fb) no-repeat, linear-gradient(#50d9fb, #50d9fb) no-repeat, linear-gradient(#50d9fb, #50d9fb) no-repeat, linear-gradient(#3fb1d6, #3fb1d6) no-repeat;
    background-position: left calc(100% - 41px), right calc(100% - 41px), calc(50% - 720px) calc(100% - 43px), calc(50% + 720px) calc(100% - 43px), calc(50% - 706px) calc(100% - 24px), calc(50% + 706px) calc(100% - 24px), calc(50% - 152px) calc(100% - 2px), calc(50% + 154px) calc(100% - 2px), calc(50% - 171px) calc(100% - 11px), calc(50% + 171px) calc(100% - 11px), calc(50% - 299px) calc(100% - 22px), calc(50% + 299px) calc(100% - 22px), calc(50% - 436px) calc(100% - 24px), calc(50% + 436px) calc(100% - 24px), calc(50% - 160px) calc(100% - 11px), calc(50% + 162px) calc(100% - 11px), calc(50% - 86px) calc(100% - 2px), calc(50% + 86px) calc(100% - 2px), center bottom;
    background-size: calc(100% / 2 - 724px) 6px, calc(100% / 2 - 724px) 6px, 14px 2px, 14px 2px, 32px 21px, 32px 21px, 11px 11px, 11px 11px, 16px 15px, 16px 15px, 128px 6px, 128px 6px, 520px 2px, 520px 2px, 6px 2px, 6px 2px, 126px 2px, 126px 2px, 150px 6px;

    .mask-animate {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 107px;
      z-index: 1;
      background-image: linear-gradient(45deg, transparent, transparent, rgb(255 255 255 / 50%), transparent, transparent);
      background-size: 100px 100%;
      background-repeat: no-repeat;
      mask-image: linear-gradient(to right, #2d1e9e, #3d61ce), linear-gradient(to right, #3d61ce, #2d1e9e), linear-gradient(#3d61ce, #3d61ce), linear-gradient(#3d61ce, #3d61ce), linear-gradient(45deg, transparent, transparent calc(50% - 1px), #3d61ce calc(50% - 1px), #3d61ce calc(50% + 2px), transparent calc(50% + 2px), transparent), linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #3d61ce calc(50% - 1px), #3d61ce calc(50% + 2px), transparent calc(50% + 2px), transparent), linear-gradient(45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 1px), transparent calc(50% + 1px), transparent), linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 1px), transparent calc(50% + 1px), transparent), linear-gradient(45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 2px), transparent calc(50% + 2px), transparent), linear-gradient(-45deg, transparent, transparent calc(50% - 1px), #50d9fb calc(50% - 1px), #50d9fb calc(50% + 2px), transparent calc(50% + 2px), transparent), linear-gradient(to right, #277bd1, #50d9fb), linear-gradient(to right, #50d9fb, #277bd1), linear-gradient(to right, #3e61ce, #50d9fb), linear-gradient(to right, #50d9fb, #3e61ce), linear-gradient(#50d9fb, #50d9fb), linear-gradient(#50d9fb, #50d9fb), linear-gradient(#50d9fb, #50d9fb), linear-gradient(#50d9fb, #50d9fb), linear-gradient(#3fb1d6, #3fb1d6);
      mask-repeat: no-repeat;
      mask-position: left calc(100% - 41px), right calc(100% - 41px), calc(50% - 720px) calc(100% - 43px), calc(50% + 720px) calc(100% - 43px), calc(50% - 706px) calc(100% - 24px), calc(50% + 706px) calc(100% - 24px), calc(50% - 152px) calc(100% - 2px), calc(50% + 154px) calc(100% - 2px), calc(50% - 171px) calc(100% - 11px), calc(50% + 171px) calc(100% - 11px), calc(50% - 299px) calc(100% - 22px), calc(50% + 299px) calc(100% - 22px), calc(50% - 436px) calc(100% - 24px), calc(50% + 436px) calc(100% - 24px), calc(50% - 160px) calc(100% - 11px), calc(50% + 162px) calc(100% - 11px), calc(50% - 86px) calc(100% - 2px), calc(50% + 86px) calc(100% - 2px), center bottom;
      mask-size: calc(100% / 2 - 724px) 6px, calc(100% / 2 - 724px) 6px, 14px 2px, 14px 2px, 32px 21px, 32px 21px, 11px 11px, 11px 11px, 16px 15px, 16px 15px, 128px 6px, 128px 6px, 520px 2px, 520px 2px, 6px 2px, 6px 2px, 126px 2px, 126px 2px, 150px 6px;
      animation: hs 5s linear 3s infinite both;
    }

    @keyframes hs {
      0% {
        background-position: -1000px bottom;
      }

      100% {
        background-position: calc(100% + 1000px) bottom;
      }
    }

    .tit {
      position: absolute;
      top: 0;
      left: calc(50% - 437px);
      width: 874px;
      height: 107px;
      background: url(@/assets/images/head-h2-bg.png) no-repeat;

      h2 {
        background: linear-gradient(to top, #8bdef0, #fff) no-repeat;
        background-clip: text;
        color: transparent;
        font-size: 40px;
        font-weight: bold;
        line-height: 80px;
        margin: 0;
        text-align: center;
      }
    }

    .menu {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 999;
      padding-right: 1rem;

      a {
        white-space: nowrap;
        color: #01c4f9;
        font-size: 1rem;
        padding-top: 1.25rem;
        text-decoration: none;
      }
    }
  }
}

.mainBody {
  height: calc(100vh - 107px);
  padding-top: 40px;
  display: flex;
  gap: 60px;
  background: url(@/assets/images/new-home-body.png) no-repeat center bottom;

  .leftSidebar {
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0 20px 40px 0;
    // background: url(@/assets/images/new-home-left-sidebar.png) no-repeat left top;
    .echarts-item {
      flex: 1;
      background: linear-gradient(45deg, transparent, transparent 70%, #162e9433 60%, #162e9411) no-repeat left top/100% 100%, linear-gradient(#162e9422, #162e9422) no-repeat top left/100% 100%;
      backdrop-filter: blur(4px);
      border: 1px solid #075780;

      h2 {
        line-height: 1;
        color: #fff;
        font-size: 1.125rem;
        margin: 1rem;
        padding-left: 1.5rem;
        background: linear-gradient(#fff6, #fff6) no-repeat 2px bottom/18px 2px, linear-gradient(#66f4ffcc, #66f4ffcc) no-repeat 4px calc(100% - 2px)/2px 40%, linear-gradient(#66f4ffaa, #66f4ffaa) no-repeat 8px calc(100% - 2px)/2px 60%, linear-gradient(#f80, #f80) no-repeat 12px calc(100% - 2px)/2px 80%, linear-gradient(#fff6, #fff6) no-repeat left bottom/2px 100%;
      }
    }

    .leftSidebarCont {
      padding: 54px 0 0 72px;

      .user-info h2 {
        color: #01c4f9;
        font-size: 1rem;
        line-height: 1.75;
        margin: 0;
      }

      .time {
        color: #fff;
        font-size: 1rem;
        // margin-left: -20px;
      }

      .menu {
        display: flex;
        flex-direction: column;
        // gap: 62px;
        padding-top: 54px;

        div {
          display: block;
          width: 182px;
          height: 48px;
          margin-bottom: 62px;
          line-height: 48px;
          text-align: center;
          color: #77daff;
          background: url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat center bottom/0 200%, url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat left top;
          text-decoration: none;
          transition: 0.3s;
          font-weight: 1000;

          &:hover {
            background: url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat center bottom/100% 200%, url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat left top;
            color: #fff;
            transition: 0.5s;
            cursor: pointer;
          }
        }

        div:nth-child(3) {
          filter: grayscale(1);

          &:hover {
            background: url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat center bottom/0 200%, url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat left top;
            color: #77daff;
          }
        }

        .active {
          color: #fff;
          background: url(@/assets/images/new-home-left-sidebar-menu.png) no-repeat left bottom;
        }
      }
    }
  }

  .middleContent {
    flex: 1;
    min-width: 1080px;

    .home-basic-data {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 36px;

      .hbd-item {
        width: 194px;
        height: 88px;
        display: flex;
        align-items: center;
        background: linear-gradient(#0dccfc, #0dccfc) no-repeat left top/11px 3px, linear-gradient(#0dccfc, #0dccfc) no-repeat right top/11px 3px, linear-gradient(#0c6ee2, #0c6ee2) no-repeat left 1px/100% 1px, linear-gradient(to top, rgb(3 83 203 / 10%), rgb(3 83 203 / 60%), rgb(3 83 203 / 10%)) no-repeat center bottom/calc(100% - 2px) 10px, linear-gradient(to top, transparent, #0a609166) no-repeat center bottom/calc(100% - 2px) calc(100% - 2px);

        i.icon-state {
          display: block;
          width: 64px;
          height: 64px;
          background: url(@/assets/images/home-state-nav.png) no-repeat;
          margin: 0 0.75rem;
        }
        i.icon-state.state02 { background-position: -64px 0; }
        i.icon-state.state03 { background-position: -128px 0; }
        i.icon-state.state04 { background-position: -196px 0; }

        .num-txt {
          font-size: 1.5rem;
          color: #01c4f9;
          font-weight: 1000;

          span {
            font-size: 0.85rem;
          }

          h3 {
            margin: 0;
            font-size: 0.85rem;
            color: #e3e3e3;
          }
        }
      }
    }

    .home-middle-nav-tit {
      position: relative;
      height: 277px;
      background: url(@/assets/images/home-middle-nav-bg.png) no-repeat center top;
      margin-top: -20px;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        background: #fff6;
        border-radius: 4px;
        transform: translateX(-45.5px) translateY(-38.5px);
        animation: dian 7s linear infinite;
      }

      span.ani-01 {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        mask: url(@/assets/images/animate-01.png) no-repeat center top;
        animation: aniLine01 2.5s linear infinite;
      }

      span.ani-02 {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        mask: url(@/assets/images/animate-02.png) no-repeat center top;
        animation: aniLine02 3s linear infinite;
        animation-delay: 2s;
      }

      span.ani-03 {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        mask: url(@/assets/images/animate-03.png) no-repeat center top;
        animation: aniLine03 3.5s linear infinite;
        animation-delay: 4s;
      }

      h2 {
        position: absolute;
        margin: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 52px;
        line-height: 52px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: 750;
        z-index: 999;
      }
    }

    @keyframes dian {
      0%,
      50%,
      100% {
        background: #fff0;
        box-shadow: -38px 3px 0 0 #fff3, 60px 0 0 0 #fff3, 62px 22px 0 0 #fff6, 62px 38px 0 0 #fff3, 126px -8px 0 1px #fff6, 30px 30px 0 3px #fff3;
      }

      25% {
        background: #f00b;
        box-shadow: -38px -7px 0 0 #fff, 60px 0 0 0 #fffb, 62px 22px 0 0 #48d1f3, 62px 38px 0 0 #48d1f3, 126px -8px 0 2px #ff0, 30px -15px 0 1px #48d1f3;
      }

      75% {
        background: #fff;
        box-shadow: -38px 8px 0 0 #fff, 60px 0 0 0 #fff, 62px 22px 0 0 #48d1f3, 62px 38px 0 0 #48d1f3, 126px -8px 0 1px #48d1f3, 30px 35px 0 2px #fff;
      }
    }

    @keyframes aniLine01 {
      0% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 80px) calc(50% - 20px)/30px 30px;
      }

      10% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 160px) calc(50% - 16px)/30px 30px;
      }

      20% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 170px) 50%/20px 20px;
      }

      30% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 150px) 58%/30px 30px;
      }

      40% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 110px) 68%/30px 30px;
      }

      50% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 110px) 68%/30px 30px;
      }

      55% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 100px) 100%/30px 277px;
      }

      100% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 180px) bottom/30px 277px;
      }
    }

    @keyframes aniLine02 {
      0% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 90px) calc(50% - 50px)/40px 40px;
      }

      10% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 155px) calc(50% - 60px)/30px 30px;
      }

      20% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 160px) calc(50% - 50px)/30px 30px;
      }

      30% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 160px) calc(50% - 40px)/30px 30px;
      }

      40% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 155px) calc(50% - 35px)/30px 30px;
      }

      50% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 155px) calc(50% - 25px)/100% 25px;
      }

      100% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 155px) 100%/100% 25px;
      }
    }

    @keyframes aniLine03 {
      0% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 110px) center/30px 30px;
      }

      10% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 170px) calc(50% + 6px)/30px 30px;
      }

      20% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 185px) calc(50% + 10px)/30px 30px;
      }

      30% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% + 110px) calc(50% + 60px)/30px 30px;
      }

      70% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 135px) calc(50% + 60px)/30px 100%;
      }

      80% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 140px) calc(50% + 85px)/30px 30px;
      }

      90% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 176px) calc(50% + 70px)/30px 30px;
      }

      100% {
        background: radial-gradient(#fffb, #fff6 50%, transparent 60%, transparent) no-repeat calc(50% - 136px) calc(50% + 45px)/30px 30px;
      }
    }

    .home-middle-nav-menu {
      height: 210px;
      display: flex;
      align-items: flex-end;
      justify-content: space-evenly;
      padding-bottom: 16px;

      /* gap: 20px; */
      background: url(@/assets/images/home-middle-nav-menu-bg.png) no-repeat center bottom;

      div {
        display: block;
        width: 135px;
        height: 135px;
        background: url(@/assets/images/home-middle-menu-bg.png) no-repeat top center;
        padding-top: 102px;
        text-align: center;
        color: #fff;
        font-weight: 750;
        font-size: 15px;
        text-shadow: 1px 1px 5px #3339;
        cursor: pointer;
      }
    }

    .nav-icon-box {
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-evenly;
    }

    .nav-menu01 .nav-icon {
      &:first-child {
        transform: translateY(-40px);
      }

      &:nth-child(2) {
        transform: translateY(-20px) !important;
      }

      &:nth-last-child(2) {
        transform: translateY(-20px) !important;
      }

      &:last-child {
        transform: translateY(-40px);
      }
    }

    .online-device {
      position: relative;
      height: 200px;
      background: url(@/assets/images/online-device.png) no-repeat center bottom;

      h2 {
        position: absolute;
        margin: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 52px;
        line-height: 52px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        font-weight: 750;
      }

      .online-device-list {
        height: 146px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        // gap: 54px;

        .device-item {
          position: relative;
          width: 90px;
          height: 117px;
          background: url(@/assets/images/online-device-list.png) no-repeat center bottom;
          cursor: pointer;
          margin-right: 54px;

          &:nth-child(1) {
            transform: translateY(-20px);
          }

          &:nth-child(2) {
            transform: translateY(-8px);
          }

          &:nth-child(4) {
            transform: translateY(-8px);
          }

          &:nth-child(5) {
            transform: translateY(-20px);
          }

          img {
            display: block;
            width: 72px;
            height: 72px;
            object-fit: contain;
            object-position: center center;
            margin: 0 auto;
          }

          h3 {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 28px;
            line-height: 22px;
            padding: 0;
            margin: 0;
            text-align: center;
            color: #00f1ff;
            font-weight: normal;
            font-size: 0.85rem;
            background: linear-gradient(#17329099, #17329099) no-repeat 1px 1px/calc(100% - 2px) calc(100% - 2px), linear-gradient(to right, #0178f8, #0178f8, #11f4ff, #0178f8, #0178f8) no-repeat left top/100% 100%;
            border-radius: 4px;
            border: 1px solid transparent;
            background-clip: border-box;
          }
        }
      }
    }
  }

  .rightSidebar {
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0 20px 40px 0;

    .echarts-item {
      flex: 1;
      background: linear-gradient(45deg, transparent, transparent 70%, #162e9433 60%, #162e9411) no-repeat left top/100% 100%, linear-gradient(#162e9422, #162e9422) no-repeat top left/100% 100%;
      backdrop-filter: blur(4px);
      border: 1px solid #075780;

      h2 {
        line-height: 1;
        color: #fff;
        font-size: 1.125rem;
        margin: 1rem;
        padding-left: 1.5rem;
        background: linear-gradient(#fff6, #fff6) no-repeat 2px bottom/18px 2px, linear-gradient(#66f4ffcc, #66f4ffcc) no-repeat 4px calc(100% - 2px)/2px 40%, linear-gradient(#66f4ffaa, #66f4ffaa) no-repeat 8px calc(100% - 2px)/2px 60%, linear-gradient(#f80, #f80) no-repeat 12px calc(100% - 2px)/2px 80%, linear-gradient(#fff6, #fff6) no-repeat left bottom/2px 100%;
      }
    }
  }
}

.swiper {
  width: 500px;
  height: 100px;
  margin-top: 100px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 18px;
  text-align: center;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
