// 系统设置路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/config/equipManage',
  component: Layout,
  redirect: '/config/equipManage/equipSort',
  name: 'equipManage',
  meta: {
    title: '设备管理',
    icon: 'mode-sidebar-icon4',
    // defaultOpened: true,
  },
  children: [
    {
      path: 'deviceList',
      name: 'deviceList',
      component: () => import('@/views/modeSwitch/equipManage/deviceList.vue'),
      meta: {
        title: '设备列表',
      },
    },
    {
      path: 'equipSort',
      name: 'equipSort',
      component: () => import('@/views/modeSwitch/equipManage/equipSort.vue'),
      meta: {
        title: '设备排序',
      },
    },
    {
      path: 'pointRelation',
      name: 'pointRelation',
      component: () => import('@/views/modeSwitch/equipManage/pointRelation.vue'),
      meta: {
        title: '点位关联',
      },
    },
    {
      path: 'variableRelation',
      name: 'variableRelation',
      component: () => import('@/views/modeSwitch/equipManage/variableRelation.vue'),
      meta: {
        title: '变量关联',
      },
    },
    // {
    //   path: 'variableRelation',
    //   name: 'variableRelation',
    //   component: () => import('@/views/modeSwitch/equipManage/variableRelation.vue'),
    //   meta: {
    //     title: '设备列表',
    //   },
    // },

  ],
}

export default routes
