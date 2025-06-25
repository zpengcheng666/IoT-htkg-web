// 门禁安检子系统路由

import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')

// console.log(localStorage.getItem('a'))

// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'huanjing',
//       subSystem: 'huanjing',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `emsMonitor${i}`,
//         component: () => import('@/views/publicPages/ztPage.vue'),
//         meta: {
//           title: res.result[i].stageName,
//           breadcrumb: false,
//         },
//       }
//       menuList.push(obj)
//     }
//     // console.log(menuList)
//   }).catch((error) => {
//     window.console.log(error)
//   })
// }
// getMj()
const routes: Route.recordRaw = {
  path: '/environmentMonitoringSubsystem',
  component: Layout,
  redirect: '/environmentMonitoringSubsystem/historyDataManagement/historyData/:huanjing',
  name: 'environmentMonitoringSubsystem',
  meta: {
    title: '环境监控子系统',
    icon: 'zd-icon1',
    defaultOpened: true,
  },
  children: [
    {
      path: 'environmentMonitoring',
      name: 'environmentMonitoring',
      meta: {
        title: '环境监控',
        breadcrumb: false,
      },

      children: [],

    },
    {
      path: 'environmentMonitoringData',
      name: 'environmentMonitoringData',
      meta: {
        title: '环境监测数据',
        breadcrumb: false,
      },

      children: [],

    },
    {
      path: 'historyDataManagement',
      name: 'emsHistoryDataManagement',
      redirect: '/environmentMonitoringSubsystem/historyDataManagement/historyData/:huanjing',
      meta: {
        title: '历史数据管理',
      },
      children: [{
        path: 'historyData/:huanjing',
        name: 'emsHistoryData',
        component: () => import('@/views/dataManagement/historyDataManagement/historyData.vue'),
        meta: {
          title: '历史数据',
        },
      }, {
        path: 'historyCurve/:huanjing',
        name: 'emsHistoryCurve',
        component: () => import('@/views/dataManagement/historyDataManagement/historyCurve.vue'),
        meta: {
          title: '历史曲线',
        },
      }, {
        path: 'dispersedCount',
        name: 'dispersedCount',
        component: () => import('@/views/positionManagement/environmentMonitoringSubsystem/historyDataManagement/dispersedCount.vue'),
        meta: {
          title: '分布统计',
        },
      }, {
        path: 'percentCount',
        name: 'percentCount',
        component: () => import('@/views/positionManagement/environmentMonitoringSubsystem/historyDataManagement/percentCount.vue'),
        meta: {
          title: '合格率统计',
        },
      }],
    },
    {
      path: 'historyAlarmManagement',
      name: 'emsHistoryAlarmManagement',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmQuery/:huanjing',
        name: 'emsAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmCount/:huanjing',
        name: 'emsAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },
    // {
    //   path: 'reportManagement',
    //   name: 'reportManagement',
    //   meta: {
    //     title: '报表管理',
    //     breadcrumb: false,
    //   },
    //   children: [{
    //     path: 'humitureReport',
    //     name: 'humitureReport',
    //     component: () => import('@/views/positionManagement/environmentMonitoringSubsystem/reportManagement/humitureReport.vue'),
    //     meta: {
    //       title: '温湿度报表',
    //     },
    //   }],
    // },
  ],
}

export default routes

