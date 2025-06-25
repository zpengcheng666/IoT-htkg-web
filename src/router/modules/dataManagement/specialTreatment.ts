// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/specialTreatment',
  component: Layout,
  redirect: '/specialTreatment/planManagement',
  name: 'specialTreatment',
  meta: {
    title: '特情处置管理',
    icon: 'data-sidebar-icon4',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'planManagement',
      name: 'planManagement',
      component: () => import('@/views/dataManagement/specialTreatment/planManagement.vue'),
      meta: {
        title: '预案管理',
      },
    }, {
      path: 'specialRecord',
      name: 'specialRecord',
      component: () => import('@/views/dataManagement/specialTreatment/specialRecord.vue'),
      meta: {
        title: '特情处置记录',
      },
    },

  ],
}

export default routes
