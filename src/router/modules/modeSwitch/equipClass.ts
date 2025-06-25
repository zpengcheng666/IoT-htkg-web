// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/equipClass',
  component: Layout,
  redirect: '/config/equipClass/equipClass/attrManage',
  name: 'equipClass',
  meta: {
    title: '设备类别管理',
    icon: 'mode-sidebar-icon7',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'attrManage',
      name: 'attrManage',
      component: () => import('@/views/modeSwitch/equipClass/attrManage.vue'),
      meta: {
        title: '属性管理',
      },
    },

  ],
}

export default routes
