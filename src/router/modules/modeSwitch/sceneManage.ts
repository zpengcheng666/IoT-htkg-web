// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/sceneManageAll',
  component: Layout,
  redirect: '/config/sceneManageAll/sceneManage',
  name: 'sceneManageAll',
  meta: {
    title: '场景管理',
    icon: 'mode-sidebar-icon3',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'sceneManage',
      name: 'sceneManage',
      component: () => import('@/views/modeSwitch/sceneManage/sceneManage.vue'),
      meta: {
        title: '场景管理',
      },
    },

  ],
}

export default routes
