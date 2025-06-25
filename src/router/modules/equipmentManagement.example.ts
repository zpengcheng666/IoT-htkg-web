// 安全防范系统路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/equipmentManagement',
  component: Layout,
  redirect: '/equipmentManagement/index',
  name: 'equipmentManagement',
  meta: {
    title: '装备管理分系统',
    icon: 'menu-xtsz',
    defaultOpened: true,
  },
  children: [
    // {
    //   path: 'index',
    //   name: 'equipmentManagementIndex',
    //   component: () => import('@/views/equipmentManagement/index.vue'),
    //   meta: {
    //     title: '装备管理分系统菜单',
    //     breadcrumb: false,
    //   },
    // },

  ],
}

export default routes
