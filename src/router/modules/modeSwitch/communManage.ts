// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/communManage',
  component: Layout,
  redirect: '/config/communManage/communManage/serviceManage',
  name: 'communManage',
  meta: {
    title: '通信管理',
    icon: 'mode-sidebar-icon2',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'serviceManage',
      name: 'serviceManage',
      component: () => import('@/views/modeSwitch/communManage/serviceManage.vue'),
      meta: {
        title: '服务管理',
      },
    },

  ],
}

export default routes
