// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/systemMonitoring',
  component: Layout,
  redirect: '/systemMonitoring/netMonitoring',
  name: 'systemMonitoring',
  meta: {
    title: '运维监控',
    icon: 'system-sidebar-icon2',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'netMonitoring',
      name: 'netMonitoring',
      component: () => import('@/views/systemSet/systemMonitoring/netMonitoring.vue'),
      meta: {
        title: '网络健康监测',
      },
    },
    {
      path: 'systemProcessMonitoring',
      name: 'systemProcessMonitoring',
      component: () => import('@/views/systemSet/systemMonitoring/systemProcessMonitoring.vue'),
      meta: {
        title: '系统进程监测',
      },
    },
    {
      path: 'computerStatusMonitoring',
      name: 'computerStatusMonitoring',
      component: () => import('@/views/systemSet/systemMonitoring/computerStatusMonitoring.vue'),
      meta: {
        title: '主机状态监测',
      },
    },
    {
      path: 'systemBackRecover',
      name: 'systemBackRecover',
      component: () => import('@/views/systemSet/systemMonitoring/systemBackRecover.vue'),
      meta: {
        title: '系统备份恢复',
      },
    },
    {
      path: 'systemLogManager',
      name: 'systemLogManager',
      component: () => import('@/views/systemSet/systemMonitoring/systemLogManager.vue'),
      meta: {
        title: '系统日志管理',
      },
    },
  ],
}

export default routes
