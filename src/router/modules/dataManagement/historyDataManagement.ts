// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/historyDataManagement',
  component: Layout,
  redirect: '/historyDataManagement/historyData',
  name: 'historyDataManagement',
  meta: {
    title: '历史数据管理',
    icon: 'data-sidebar-icon2',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'historyData',
      name: 'historyData',
      component: () => import('@/views/dataManagement/historyDataManagement/historyData.vue'),
      meta: {
        title: '历史数据',
      },
    }, {
      path: 'historyCurve',
      name: 'historyCurve',
      component: () => import('@/views/dataManagement/historyDataManagement/historyCurve.vue'),
      meta: {
        title: '历史曲线',
      },
    },

  ],
}

export default routes
