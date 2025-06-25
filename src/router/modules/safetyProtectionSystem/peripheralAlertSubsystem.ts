// 周边警戒子系统路由

import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')

// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'zhoujie',
//       subSystem: 'zhoujie',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `realtimeMonitor${i}`,
//         component: () => import('@/views/publicPages/ztPage.vue'),
//         meta: {
//           title: res.result[i].stageName,
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
  path: '/peripheralAlertSubsystem',
  component: Layout,
  redirect: '/peripheralAlertSubsystem/historyDataManagement/historyData/:zhoujie',
  name: 'peripheralAlertSubsystem',
  meta: {
    title: '周边警戒子系统',
    icon: 'aq-icon4',
  },
  children: [
    {
      path: 'intrusionMonitor',
      name: 'intrusionMonitor',
      meta: {
        title: '入侵监控',
      },
      children: [],
    },
    {
      path: 'historyDataManagement',
      name: 'pasHistoryDataManagement',
      redirect: '/peripheralAlertSubsystem/historyDataManagement/historyData/:zhoujie',
      meta: {
        title: '历史数据管理',
        breadcrumb: false,
      },
      children: [{
        path: 'historyData/:zhoujie',
        name: 'pasHistoryData',
        component: () => import('@/views/dataManagement/historyDataManagement/historyData.vue'),
        meta: {
          title: '历史数据',
        },
      }, {
        path: 'historyCurve/:zhoujie',
        name: 'pasHistoryCurve',
        component: () => import('@/views/dataManagement/historyDataManagement/historyCurve.vue'),
        meta: {
          title: '历史曲线',
        },
      }],
    },
    {
      path: 'historyAlarmManagement',
      name: 'pasHistoryAlarmManagement',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmQuery/:zhoujie',
        name: 'pasAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmCount/:zhoujie',
        name: 'pasAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },
  ],
}

export default routes

