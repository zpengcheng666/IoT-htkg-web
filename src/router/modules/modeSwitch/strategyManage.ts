// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/strategyManage',
  component: Layout,
  redirect: '/config/strategyManage/alarmStrategy',
  name: 'strategyManage',
  meta: {
    title: '策略管理',
    icon: 'mode-sidebar-icon5',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'alarmStrategy',
      name: 'alarmStrategy',
      component: () => import('@/views/modeSwitch/strategyManage/alarmStrategy.vue'),
      meta: {
        title: '报警策略',
      },
    }, {
      path: 'eventManage',
      name: 'eventManage',
      component: () => import('@/views/modeSwitch/strategyManage/eventManage.vue'),
      meta: {
        title: '事件管理',
      },
    }, {
      path: 'linkageStrategy',
      name: 'linkageStrategy',
      component: () => import('@/views/modeSwitch/strategyManage/linkageStrategy.vue'),
      meta: {
        title: '联动策略',
      },
    }, {
      path: 'storageStrategy',
      name: 'storageStrategy',
      component: () => import('@/views/modeSwitch/strategyManage/storageStrategy.vue'),
      meta: {
        title: '储存策略',
      },
    },

  ],
}

export default routes
