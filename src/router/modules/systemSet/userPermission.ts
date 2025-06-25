// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/userPermission',
  component: Layout,
  redirect: '/userPermission/user',
  name: 'userPermission',
  meta: {
    title: '安全管理',
    icon: 'system-sidebar-icon1',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/systemSet/userPermission/user.vue'),
      meta: {
        title: '身份管理',
      },
    },
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/systemSet/userPermission/group.vue'),
      meta: {
        title: '分组管理',
      },
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/systemSet/userPermission/role.vue'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/systemSet/userPermission/menu.vue'),
      meta: {
        title: '菜单管理',
      },
    },

  ],
}

export default routes
