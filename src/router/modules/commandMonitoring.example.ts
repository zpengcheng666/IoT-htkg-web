// 安全防范系统路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/commandMonitoring',
  component: Layout,
  redirect: '/commandMonitoring/index',
  name: 'commandMonitoring',
  meta: {
    title: '指挥监控分系统',
    icon: 'menu-xtsz',
    defaultOpened: true,
  },
  children: [
    {
      path: 'index',
      name: 'commandMonitoringIndex',
      component: () => import('@/views/commandMonitoring/index.vue'),
      meta: {
        title: '指挥监控分系统菜单',
        breadcrumb: false,
      },
    },

  ],
}

export default routes
