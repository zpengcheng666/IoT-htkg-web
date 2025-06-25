// 门禁安检子系统路由

import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')

// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'dianli',
//       subSystem: 'dianli',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `pmsMonitor${i}`,
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
  path: '/powerMonitoringSubsystem',
  component: Layout,
  redirect: '/powerMonitoringSubsystem/historyDataManagement/historyData/:dianli',
  name: 'powerMonitoringSubsystem',
  meta: {
    title: '电力监控子系统',
    icon: 'zd-icon2',
    defaultOpened: true,
  },
  children: [
    {
      path: 'powerMonitoring',
      name: 'powerMonitoring',
      meta: {
        title: '电力监控',
      },
      children: [],

    },
    {
      path: 'historyDataManagement',
      name: 'pmsHistoryDataManagement',
      redirect: '/powerMonitoringSubsystem/historyDataManagement/historyData/:dianli',
      meta: {
        title: '历史数据管理',
        breadcrumb: false,
      },
      children: [{
        path: 'historyData/:dianli',
        name: 'pmsHistoryData',
        component: () => import('@/views/dataManagement/historyDataManagement/historyData.vue'),
        meta: {
          title: '历史数据',
        },
      }, {
        path: 'historyCurve/:dianli',
        name: 'pmsHistoryCurve',
        component: () => import('@/views/dataManagement/historyDataManagement/historyCurve.vue'),
        meta: {
          title: '历史曲线',
        },
      },
      // {
      //   path: 'electricEnergyCount',
      //   name: 'electricEnergyCount',
      //   component: () => import('@/views/positionManagement/powerMonitoringSubsystem/historyDataManagement/electricEnergyCount.vue'),
      //   meta: {
      //     title: '电能统计',
      //   },
      // },
      ],
    },
    {
      path: 'historyAlarmManagement',
      name: 'pmsHistoryAlarmManagement',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmQuery/:dianli',
        name: 'pmsAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmCount/:dianli',
        name: 'pmsAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },

  ],
}

export default routes

