// 门禁安检子系统路由

import type { Route } from '@/global'
const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/safetyProtectionSystemHome',
  component: Layout,
  redirect: '/safetyProtectionSystemHome/safetyProtectionSystemHomeChile',
  name: 'safetyProtectionSystemHome',
  meta: {
    title: '首页',
    icon: 'aq-icon1',

  },
  children: [
    {
      path: 'safetyProtectionSystemHomeChile',
      name: 'safetyProtectionSystemHomeChile',
      component: () => import('@/views/safetyProtectionSystem/home/index.vue'),
      meta: {
        title: '首页',
        breadcrumb: false,
      },

    },

  ],
}

export default routes

