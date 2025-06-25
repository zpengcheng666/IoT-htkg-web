// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/systemParameterSet',
  component: Layout,
  redirect: '/systemParameterSet/reminderSet',
  name: 'systemParameterSet',
  meta: {
    title: '系统参数设置',
    icon: 'system-sidebar-icon2',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'reminderSet',
      name: 'reminderSet',
      component: () => import('@/views/systemSet/systemParameterSet/reminderSet.vue'),
      meta: {
        title: '提醒设置',
      },
    },
    {
      path: 'statisticsSet',
      name: 'statisticsSet',
      component: () => import('@/views/systemSet/systemParameterSet/statisticsSet.vue'),
      meta: {
        title: '分布统计区间设置',
      },
    },
    // {
    //   path: 'equipmentValue',
    //   name: 'equipmentValue',
    //   component: () => import('@/views/systemSet/systemParameterSet/equipmentValue.vue'),
    //   meta: {
    //     title: '设备标定值设置',
    //   },
    // },

  ],
}

export default routes
