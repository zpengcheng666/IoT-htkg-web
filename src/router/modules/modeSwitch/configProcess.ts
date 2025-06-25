// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/configProcessAll',
  component: Layout,
  redirect: '/config/configProcessAll/configProcess',
  name: 'configProcessAll',
  meta: {
    title: '系统总体配置流程',
    icon: 'mode-sidebar-icon1',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'configProcess',
      name: 'configProcess',
      component: () => import('@/views/modeSwitch/configProcess/configProcess.vue'),
      meta: {
        title: '系统总体配置流程',
      },
    },

  ],
}

export default routes
