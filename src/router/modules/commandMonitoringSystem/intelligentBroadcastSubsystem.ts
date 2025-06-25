import type { Route } from '@/global'
// import api from '@/api'

const Layout = () => import('@/layouts/index.vue')

// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'guangbo',
//       subSystem: 'guangbo',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `intelligentBroadcasting${i}`,
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
  path: '/intelligentBroadcastSubsystem',
  component: Layout,
  redirect: '/intelligentBroadcastSubsystem/broadcastMonitor',
  name: 'intelligentBroadcastSubsystem',
  meta: {
    title: '智能广播子系统',
    icon: 'zh-icon5',
    defaultOpened: true,
  },
  children: [
    {
      path: 'broadcastMonitor',
      name: 'broadcastMonitor',
      meta: {
        title: '广播监控',
        breadcrumb: false,
      },
      children: [],
    },
  ],
}

export default routes

