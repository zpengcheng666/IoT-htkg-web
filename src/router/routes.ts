// import { path } from 'node:path'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import accessControlSubsystem from './modules/safetyProtectionSystem/accessControlSubsystem'// 门禁安检子系统
import audioVideoSubsystem from './modules/safetyProtectionSystem/audioVideoSubsystem'
import fireAlarmSubsystem from './modules/safetyProtectionSystem/fireAlarmSubsystem'
import peripheralAlertSubsystem from './modules/safetyProtectionSystem/peripheralAlertSubsystem'

import environmentMonitoringSubsystem from './modules/positionManagementSystem/environmentMonitoringSubsystem'// 阵地管理系统子路由
import powerMonitoringSubsystem from './modules/positionManagementSystem/powerMonitoringSubsystem'
import waterSupplyDrainageSubsystem from './modules/positionManagementSystem/waterSupplyDrainageSubsystem'
import equipmentManagementSubsystem from './modules/positionManagementSystem/equipmentManagementSubsystem'

import equipmentManagementExample from './modules/equipmentManagement.example'// 装备管理系统子路由

import intelligentBroadcastSubsystem from './modules/commandMonitoringSystem/intelligentBroadcastSubsystem'// 指挥监控系统子路由
import infoPublishingSubsystem from './modules/commandMonitoringSystem/infoPublishingSubsystem'

// 系统设置
import userPermission from './modules/systemSet/userPermission'
import systemParameterSet from './modules/systemSet/systemParameterSet'
import terminalManagement from './modules/systemSet/terminalManagement'
import userCenter from './modules/systemSet/userCenter'

// 数据管理
import basicData from './modules/dataManagement/basicData'
import dictionaryManagement from './modules/dataManagement/dictionaryManagement'
import entranceGuard from './modules/dataManagement/entranceGuard'
import historyAlarm from './modules/dataManagement/historyAlarm'
import historyDataManagement from './modules/dataManagement/historyDataManagement'
import logManagement from './modules/dataManagement/logManagement'
import specialTreatment from './modules/dataManagement/specialTreatment'

// 模式切换
import communManage from './modules/modeSwitch/communManage'
import configProcess from './modules/modeSwitch/configProcess'
import controlScheme from './modules/modeSwitch/controlScheme'
import equipClass from './modules/modeSwitch/equipClass'
import equipManage from './modules/modeSwitch/equipManage'
import sceneManage from './modules/modeSwitch/sceneManage'
import strategyManage from './modules/modeSwitch/strategyManage'
import systemMonitoring from '@/router/modules/systemSet/systemMonitoring'

import type { Route } from '@/global'
import useSettingsStore from '@/store/modules/settings'// 系统设置子路由

// 固定路由（默认路由）
const constantRoutes: Route.recordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    title: '',
    meta: {
      title: '',
    },
  },
  {
    path: '/login',
    name: 'login',
    title: '登录',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },

  {
    path: '/home',
    name: 'home',
    title: '首页',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页',
    },
  },

  {
    path: '/subHome',
    name: 'subHome',
    title: '子系统首页',
    component: () => import('@/views/subHome.vue'),
    meta: {
      title: '子系统首页',
    },
  },
  {
    path: '/centerWindow',
    name: 'centerWindow',
    title: '中心窗口',
    component: () => import('@/views/publicPages/centerWindow.vue'),
    meta: {
      title: '中心窗口',
    },
  },
  {
    path: '/bigScreen/:terminalId',
    name: 'bigScreen',
    title: '大屏',
    component: () => import('@/views/bigScreen/bigScreen.vue'),
    meta: {
      title: '大屏',
    },
  },
  {
    path: '/bigScreenNew/:terminalId',
    name: 'bigScreenNew',
    title: '新大屏',
    component: () => import('@/views/bigScreen/bigScreenNew.vue'),
    meta: {
      title: '新大屏',
    },
  },
  {
    path: '/bigScreenStart',
    name: 'bigScreenStart',
    title: '大屏启动页',
    component: () => import('@/views/bigScreen/bigScreenStart.vue'),
    meta: {
      title: '大屏启动页',
    },
  },
  {
    path: '/bigScreenStartNew',
    name: 'bigScreenStartNew',
    title: '大屏启动页',
    component: () => import('@/views/bigScreen/bigScreenStartNew.vue'),
    meta: {
      title: '大屏启动页',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    title: '找不到页面',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: Route.recordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: () => useSettingsStore().dashboard.title,
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/index.vue'),
        meta: {
          title: () => useSettingsStore().dashboard.title,
          breadcrumb: false,
        },
      },
    ],
  },

  {
    path: '/reload',
    component: () => import('@/layouts/index.vue'),
    meta: {
      title: '重新加载',
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航栏路由）
const asyncRoutes: Route.recordMainRaw[] = [
  {
    meta: {
      title: '安全防范分系统',
      icon: 'nav-aqff',
    },
    children: [
      accessControlSubsystem,
      audioVideoSubsystem,
      fireAlarmSubsystem,
      peripheralAlertSubsystem,
    ],
  },
  {
    meta: {
      title: '阵地管理分系统',
      icon: 'nav-zdgl',
    },
    children: [
      environmentMonitoringSubsystem,
      powerMonitoringSubsystem,
      waterSupplyDrainageSubsystem,
      equipmentManagementSubsystem,
    ],
  },
  {
    meta: {
      title: '装备管理分系统',
      icon: 'nav-zbgl',
    },
    children: [
      equipmentManagementExample,
    ],
  },
  {
    meta: {
      title: '指挥监控分系统',
      icon: 'nav-zhjk',
    },
    children: [
      intelligentBroadcastSubsystem,
      infoPublishingSubsystem,
    ],
  },
  {
    meta: {
      title: '系统设置',
      icon: 'menu-xtsz',
      hide: true,
    },
    children: [
      userPermission,
      systemParameterSet,
      terminalManagement,
      userCenter,
      systemMonitoring,
    ],
  },
  {
    meta: {
      title: '数据管理',
      icon: 'menu-sjgl',
      hide: true,
    },
    children: [
      basicData,
      historyDataManagement,
      historyAlarm,
      specialTreatment,
      entranceGuard,
      dictionaryManagement,
      logManagement,
    ],
  },

  {
    meta: {
      title: '模式切换',
      icon: 'menu-sjgl',
      hide: true,
    },
    children: [
      configProcess,
      communManage,
      sceneManage,
      equipManage,
      strategyManage,
      controlScheme,
      equipClass,
    ],
  },

]

const constantRoutesByFilesystem = generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant === true
})

const asyncRoutesByFilesystem = setupLayouts(generatedRoutes.filter((item) => {
  return item.meta?.enabled !== false && item.meta?.constant !== true && item.meta?.layout !== false
})) as Route.recordRaw[]

export {
  constantRoutes,
  systemRoutes,
  asyncRoutes,
  constantRoutesByFilesystem,
  asyncRoutesByFilesystem,
}
