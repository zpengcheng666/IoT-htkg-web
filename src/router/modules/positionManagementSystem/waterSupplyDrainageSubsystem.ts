// 门禁安检子系统路由

import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')

// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'geipaishui',
//       subSystem: 'geipaishui',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `wsdsMonitor${i}`,
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
  path: '/waterSupplyDrainageSubsystem',
  component: Layout,
  redirect: '/waterSupplyDrainageSubsystem/historyDataManagement/historyData/:geipaishui',
  name: 'waterSupplyDrainageSubsystem',
  meta: {
    title: '给排水监控子系统',
    icon: 'zd-icon3',
    defaultOpened: true,
  },
  children: [
    {
      path: 'waterSupplyDrainageMonitoring',
      name: 'waterSupplyDrainageMonitoring',
      meta: {
        title: '给排水监控',
        breadcrumb: false,
      },
      children: [],
    },
    {
      path: 'historyDataManagement',
      name: 'wsdsHistoryDataManagement',
      redirect: '/waterSupplyDrainageSubsystem/historyDataManagement/historyData/:geipaishui', // 重定向到第一个子路由
      meta: {
        title: '历史数据管理',
        breadcrumb: false,
      },
      children: [{
        path: 'historyData/:geipaishui',
        name: 'wsdsHistoryData',
        component: () => import('@/views/dataManagement/historyDataManagement/historyData.vue'),
        meta: {
          title: '历史数据',
        },
      }, {
        path: 'historyCurve/:geipaishui',
        name: 'wsdsHistoryCurve',
        component: () => import('@/views/dataManagement/historyDataManagement/historyCurve.vue'),
        meta: {
          title: '历史曲线',
        },
      }],
    },
    {
      path: 'historyAlarmManagement',
      name: 'wsdsHistoryAlarmManagement',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmQuery/:geipaishui',
        name: 'wsdsAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmCount/:geipaishui',
        name: 'wsdsAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },

  ],
}

export default routes

