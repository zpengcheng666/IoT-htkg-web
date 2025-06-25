// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/basicData',
  component: Layout,
  redirect: '/basicData/organizationalManagement',
  name: 'basicData',
  meta: {
    title: '基础数据管理',
    icon: 'data-sidebar-icon1',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'organizationalManagement',
      name: 'organizationalManagement',
      component: () => import('@/views/dataManagement/basicData/organizationalManagement.vue'),
      meta: {
        title: '组织机构管理',
      },
    }, {
      path: 'locationManagement',
      name: 'locationManagement',
      component: () => import('@/views/dataManagement/basicData/locationManagement.vue'),
      meta: {
        title: '位置管理',
      },
    },

  ],
}

export default routes
