// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/logManagement',
  component: Layout,
  redirect: '/logManagement/businessLog',
  name: 'logManagement',
  meta: {
    title: '日志管理',
    icon: 'data-sidebar-icon7',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'businessLog',
      name: 'businessLog',
      component: () => import('@/views/dataManagement/logManagement/businessLog.vue'),
      meta: {
        title: '业务日志',
      },
    },

  ],
}

export default routes
