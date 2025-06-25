import type { Settings } from './global'

const globalSettings: Settings.all
  = {
    app: {
      colorScheme: 'light',
      elementSize: 'default',
      iconifyOfflineUse: false,
      enablePermission: true, // 是否开启权限
      enableProgress: true,
      enableDynamicTitle: true,
      routeBaseOn: 'backend', // frontend：本地菜单  backend：后端获取菜单
    },
    dashboard: {
      enable: false,
      title: '控制台',
    },
    layout: {
      enableMobileAdaptation: false,
    },
    menu: {
      baseOn: 'backend',
      menuMode: 'head',
      switchMainMenuAndPageJump: false, // 切换主导航是否跳转页面
      subMenuUniqueOpened: true,
      subMenuCollapse: false,
      enableSubMenuCollapseButton: true,
      enableHotkeys: true,
    },
    topbar: {
      fixed: true,
    },
    toolbar: {
      enableFullscreen: true,
      enablePageReload: true,
      enableColorScheme: true,
      enableAppSetting: true,
    },
    breadcrumb: {
      enable: false,
    },
    navSearch: {
      enable: true,
      enableHotkeys: true,
    },
    copyright: {
      enable: true,
      dates: '辽宁航天仿真科技有限公司 版权所有 V1.2.0',
      company: '',
      website: 'https://hooray.gitee.io/fantastic-admin/',
      beian: '',
    },
  }

export default globalSettings
