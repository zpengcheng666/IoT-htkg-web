// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/dictionaryManagement',
  component: Layout,
  redirect: '/dictionaryManagement/dictionaryData',
  name: 'dictionaryManagement',
  meta: {
    title: '字典管理',
    icon: 'data-sidebar-icon6',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'dictionaryData',
      name: 'dictionaryData',
      component: () => import('@/views/dataManagement/dictionaryManagement/dictionaryData.vue'),
      meta: {
        title: '字典数据',
      },
    },
    {
      path: 'paramData',
      name: 'paramData',
      component: () => import('@/views/dataManagement/paramData/paramData.vue'),
      meta: {
        title: '参数数据',
      },
    },

  ],
}

export default routes
