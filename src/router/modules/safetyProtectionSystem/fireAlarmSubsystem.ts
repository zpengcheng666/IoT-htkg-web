// 火灾报警子系统路由

import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')
// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'huozai',
//       subSystem: 'huozai',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `fasMonitor${i}`,
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
  path: '/fireAlarmSubsystem',
  component: Layout,
  redirect: '/fireAlarmSubsystem/historyAlarmManagement/alarmInfoQuery/:huozai',
  name: 'fireAlarmSubsystem',
  meta: {
    title: '火灾报警子系统',
    icon: 'aq-icon3',
  },
  children: [
    {
      path: 'fireMonitoring',
      name: 'fireMonitoring',
      meta: {
        title: '火灾监控',
        breadcrumb: false,
      },
      children: [],

    },
    {
      path: 'historyAlarmManagement',
      name: 'fasHistoryAlarmManagement',
      redirect: '/fireAlarmSubsystem/historyAlarmManagement/alarmInfoQuery/:huozai',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmInfoQuery/:huozai',
        name: 'fasAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmInfoCount/:huozai',
        name: 'fasAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },
  ],
}

export default routes

