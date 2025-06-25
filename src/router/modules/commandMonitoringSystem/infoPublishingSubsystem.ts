import type { Route } from '@/global'

const Layout = () => import('@/layouts/index.vue')

const routes: Route.recordRaw = {
  path: '/infoPublishingSubsystem',
  component: Layout,
  redirect: '/infoPublishingSubsystem/infoPublishing/aerographyInfo',
  name: 'infoPublishingSubsystem',
  meta: {
    title: '信息发布子系统',
    icon: 'zh-icon6',
    defaultOpened: true,
  },
  children: [

    {
      path: 'infoPublishing',
      name: 'infoPublishing',
      redirect: '/infoPublishingSubsystem/infoPublishing/aerographyInfo',
      meta: {
        title: '信息发布管理',
        breadcrumb: false,
      },
      children: [{
        path: 'aerographyInfo',
        name: 'aerographyInfo',
        component: () => import('@/views/commandMonitoringSystem/infoPublishingSubsystem/infoPublishingManagement/aerographyInfo.vue'),
        meta: {
          title: '气象信息',
          breadcrumb: false,
        },
      }, {
        path: 'satelliteAirportInfo',
        name: 'satelliteAirportInfo',
        component: () => import('@/views/commandMonitoringSystem/infoPublishingSubsystem/infoPublishingManagement/satelliteAirportInfo.vue'),
        meta: {
          title: '卫星临空信息',
          breadcrumb: false,
        },
      }, {
        path: 'dutyInfo',
        name: 'dutyInfo',
        component: () => import('@/views/commandMonitoringSystem/infoPublishingSubsystem/infoPublishingManagement/dutyInfo.vue'),
        meta: {
          title: '值班信息',
          breadcrumb: false,
        },
      }, {
        path: 'dutyPerson',
        name: 'dutyPerson',
        component: () => import('@/views/commandMonitoringSystem/infoPublishingSubsystem/infoPublishingManagement/dutyPerson.vue'),
        meta: {
          title: '值班人员',
          sidebar: false,
          activeMenu: '/infoPublishingSubsystem/infoPublishing/dutyInfo',
        },
      }, {
        path: 'announcement',
        name: 'announcement',
        component: () => import('@/views/commandMonitoringSystem/infoPublishingSubsystem/infoPublishingManagement/announcement.vue'),
        meta: {
          title: '通知公告',
          breadcrumb: false,
        },
      }],
    },

  ],
}

export default routes

