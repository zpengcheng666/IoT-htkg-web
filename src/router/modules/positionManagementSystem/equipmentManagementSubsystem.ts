// 门禁安检子系统路由

import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/equipmentManagementSubsystem',
  component: Layout,
  redirect: '/equipmentManagementSubsystem/facilitiesEquipmentManagement/attrDictionary',
  name: 'equipmentManagementSubsystem',
  meta: {
    title: '设施设备管理子系统',
    icon: 'zd-icon4',
    defaultOpened: true,
  },
  children: [
    {
      path: 'facilitiesEquipmentManagement',
      name: 'facilitiesEquipmentManagement',
      redirect: '/equipmentManagementSubsystem/facilitiesEquipmentManagement/attrDictionary',
      meta: {
        title: '设施设备管理',
        breadcrumb: false,
      },
      children: [{
        path: 'categoryManagement',
        name: 'categoryManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/categoryManagement.vue'),
        meta: {
          title: '类别管理',
          breadcrumb: false,
        },
      }, {
        path: 'facilityEquipment',
        name: 'facilityEquipment',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/facilityEquipment.vue'),
        meta: {
          title: '设施设备',
          breadcrumb: false,
        },
      }, {
        path: 'qualityCount',
        name: 'qualityCount',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/qualityCount.vue'),
        meta: {
          title: '质量统计',
          breadcrumb: false,
        },
      }, {
        path: 'use',
        name: 'use',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/use.vue'),
        meta: {
          title: '动用使用',
          breadcrumb: false,
        },
      }, {
        path: 'handoverManagement',
        name: 'handoverManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/equipmentManagement/handoverManagement.vue'),
        meta: {
          title: '交接管理',
          breadcrumb: false,
        },
      }],
    },
    {
      path: 'entryExitPositions',
      name: 'entryExitPositions',
      meta: {
        title: '进出阵地',
        breadcrumb: false,
      },
      children: [{
        path: 'approvalForm',
        name: 'approvalForm',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/entryExitPositions/approvalForm.vue'),
        meta: {
          title: '审批单管理',
          breadcrumb: false,
        },
      }],
    },

    {
      path: 'maintenanceManagement',
      name: 'maintenanceManagement',
      meta: {
        title: '维护保养管理',
        breadcrumb: false,
      },
      children: [{
        path: 'maintenanceRequirementsManagement',
        name: 'maintenanceRequirementsManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/maintenanceManagement/maintenanceRequirementsManagement.vue'),
        meta: {
          title: '保养要求管理',
          breadcrumb: false,
        },
      }, {
        path: 'maintenancePlanManagement',
        name: 'maintenancePlanManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/maintenanceManagement/maintenancePlanManagement.vue'),
        meta: {
          title: '保养方案管理',
          breadcrumb: false,
        },
      }, {
        path: 'maintenanceTaskManagement',
        name: 'maintenanceTaskManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/maintenanceManagement/maintenanceTaskManagement.vue'),
        meta: {
          title: '保养任务管理',
          breadcrumb: false,
        },
      }],
    },

    {
      path: 'toolData',
      name: 'toolData',
      meta: {
        title: '工具资料',
        breadcrumb: false,
      },
      // redirect: '/equipmentManagementSubsystem/toolData/toolManagement',
      children: [{
        path: 'toolManagement',
        name: 'toolManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/toolData/toolManagement.vue'),
        meta: {
          title: '工具管理',
          breadcrumb: false,
        },
      }, {
        path: 'documentManagement',
        name: 'documentManagement',
        component: () => import('@/views/positionManagement/equipmentManagementSubsystem/toolData/documentManagement.vue'),
        meta: {
          title: '资料管理',
          breadcrumb: false,
        },
      }],
    },

  ],
}

export default routes

