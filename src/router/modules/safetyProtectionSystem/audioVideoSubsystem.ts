// 音视频监控子系统路由

import type { Route } from '@/global'

// import api from '@/api'
const Layout = () => import('@/layouts/index.vue')
// const menuList: any = []
// function getMj() {
//   const postData = {
//     params: {
//       moduleId: 'yinshipin',
//       subSystem: 'yinshipin',
//     },
//   }
//   // console.log(postData)
//   api.get('/api/scada/listByModel', postData).then((res: any) => {
//     // console.log(res.result)
//     for (let i = 0; i < res.result.length; i++) {
//       const obj = {
//         path: `:${res.result[i].stageId}`,
//         name: `avsVideo${i}`,
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
  path: '/audioVideoSubsystem',
  component: Layout,
  redirect: '/audioVideoSubsystem/audioVideoSurveillance',
  name: 'audioVideoSubsystem',
  meta: {
    title: '音视频监控子系统',
    icon: 'aq-icon2',
  },
  children: [
    {
      path: 'audioVideoSurveillance',
      name: 'audioVideoSurveillance',
      meta: {
        title: '音视频监控',
        breadcrumb: false,
      },
      children: [],
    },

  ],
}

export default routes

