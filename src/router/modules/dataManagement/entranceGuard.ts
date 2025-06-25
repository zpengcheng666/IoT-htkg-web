// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/entranceGuard',
  component: Layout,
  redirect: '/entranceGuard/personInfo',
  name: 'entranceGuard',
  meta: {
    title: '门禁数据同步',
    icon: 'data-sidebar-icon5',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'personInfo',
      name: 'personInfo',
      component: () => import('@/views/dataManagement/entranceGuard/personInfo.vue'),
      meta: {
        title: '人员信息同步',
      },
    },

  ],
}

export default routes
