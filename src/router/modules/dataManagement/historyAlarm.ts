// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/historyAlarm',
  component: Layout,
  redirect: '/historyAlarm/alarmQuery',
  name: 'historyAlarm',
  meta: {
    title: '历史报警管理',
    icon: 'data-sidebar-icon3',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'alarmQuery',
      name: 'alarmQuery',
      component: () => import('@/views/dataManagement/historyAlarm/alarmQuery.vue'),
      meta: {
        title: '报警查询',
      },
    }, {
      path: 'alarmCount',
      name: 'alarmCount',
      component: () => import('@/views/dataManagement/historyAlarm/alarmCount.vue'),
      meta: {
        title: '报警统计',
      },
    },

  ],
}

export default routes
