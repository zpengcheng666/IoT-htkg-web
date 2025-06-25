import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/ventilation',
  component: Layout,
  redirect: '/config/ventilation/planLoop',
  name: 'ventilation',
  meta: {
    title: '控制方案管理',
    icon: 'mode-sidebar-icon4',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'planLoop',
      name: 'planLoop',
      component: () => import('@/views/modeSwitch/ventilation/planLoop.vue'),
      meta: {
        title: '全自动方案',
      },
    },
    {
      path: 'planPresetting',
      name: 'planPresetting',
      component: () => import('@/views/modeSwitch/ventilation/planPresetting.vue'),
      meta: {
        title: '计划-预设方案',
      },
    },
    {
      path: 'planCustom',
      name: 'planCustom',
      component: () => import('@/views/modeSwitch/ventilation/planCustom.vue'),
      meta: {
        title: '计划-自定义方案',
      },
    },

  ],
}

export default routes
