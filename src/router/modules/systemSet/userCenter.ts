// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/userCenter',
  component: Layout,
  redirect: '/userCenter/personSet',
  name: 'userCenter',
  meta: {
    title: '用户中心',
    icon: 'system-sidebar-icon4',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'personSet',
      name: 'personSet',
      component: () => import('@/views/systemSet/userCenter/personSet.vue'),
      meta: {
        title: '个人设置',
      },
    }, {
      path: 'changePassword',
      name: 'changePassword',
      component: () => import('@/views/systemSet/userCenter/changePassword.vue'),
      meta: {
        title: '修改密码',
      },
    }, {
      path: 'messageNotice',
      name: 'messageNotice',
      component: () => import('@/views/systemSet/userCenter/messageNotice.vue'),
      meta: {
        title: '消息通知',
      },
    },

  ],
}

export default routes
