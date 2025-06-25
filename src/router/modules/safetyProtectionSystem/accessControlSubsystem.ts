// 门禁安检子系统路由

import type { Route } from '@/global'
const Layout = () => import('@/layouts/index.vue')
// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'menjin',
//       subSystem: 'menjin',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `acsEntranceGuard${i}`,
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
  path: '/accessControlSubsystem',
  component: Layout,
  redirect: '/accessControlSubsystem/historyDataManagement/entryExitRecord',
  name: 'accessControlSubsystem',
  meta: {
    title: '门禁安检子系统',
    icon: 'aq-icon1',

  },
  children: [
    {
      path: 'accessControl',
      name: 'accessControl',
      meta: {
        title: '门禁监控',
        breadcrumb: false,

      },
      children: [],
    },
    {
      path: 'historyDataManagement',
      name: 'acsHistoryDataManagement',
      redirect: '/accessControlSubsystem/historyDataManagement/entryExitRecord',
      meta: {
        title: '历史数据管理',
        breadcrumb: false,
      },
      children: [{
        path: 'entryExitRecord',
        name: 'entryExitRecord',
        component: () => import('@/views/safetyProtectionSystem/accessControlSubsystem/historyDataManagement/entryExitRecord.vue'),
        meta: {
          title: '进出记录',
        },
      }, {
        path: 'creditCardRecord',
        name: 'creditCardRecord',
        component: () => import('@/views/safetyProtectionSystem/accessControlSubsystem/historyDataManagement/creditCardRecord.vue'),
        meta: {
          title: '刷卡记录',
        },
      }, {
        path: 'remoteOpendoorRecord',
        name: 'remoteOpendoorRecord',
        component: () => import('@/views/safetyProtectionSystem/accessControlSubsystem/historyDataManagement/remoteOpendoorRecord.vue'),
        meta: {
          title: '远程开门记录',
        },
      }],
    },
    {
      path: 'historyAlarmManagement',
      name: 'acsHistoryAlarmManagement',
      meta: {
        title: '历史报警管理',
        breadcrumb: false,
      },
      children: [{
        path: 'alarmQuery/:menjin',
        name: 'acsAlarmQuery',
        component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
        meta: {
          title: '报警查询',
        },
      }, {
        path: 'alarmCount/:menjin',
        name: 'acsAlarmCount',
        component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
        meta: {
          title: '报警统计',
        },
      }],
    },
  ],
}

export default routes

