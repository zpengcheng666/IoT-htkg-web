// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/terminalManagement',
  component: Layout,
  redirect: '/terminalManagement/InformationIssue',
  name: 'terminalManagement',
  meta: {
    title: '终端管理',
    icon: 'system-sidebar-icon3',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'informationIssue',
      name: 'informationIssue',
      component: () => import('@/views/systemSet/terminalManagement/informationIssue.vue'),
      meta: {
        title: '信息发布终端',
      },
    },
    {
      path: 'bigScreenConfig',
      name: 'bigScreenConfig',
      component: () => import('@/views/systemSet/terminalManagement/bigScreenConfig.vue'),
      meta: {
        title: '大屏设置',
        sidebar: false,
        activeMenu: '/terminalManagement/InformationIssue',
      },
    },
    {
      path: 'terminalTemplate',
      name: 'terminalTemplate',
      component: () => import('@/views/systemSet/terminalManagement/terminalTemplate.vue'),
      meta: {
        title: '终端模板管理',
      },
    },
    {
      path: 'templateConfig',
      name: 'templateConfig',
      component: () => import('@/views/systemSet/terminalManagement/templateConfig.vue'),
      meta: {
        title: '模板设置',
        sidebar: false,
        activeMenu: '/terminalManagement/terminalTemplate',
      },
    },

  ],
}

export default routes
