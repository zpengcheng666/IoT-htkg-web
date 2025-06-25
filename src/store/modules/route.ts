/* eslint-disable prefer-const */
import { cloneDeep } from 'lodash-es'
import useSettingsStore from './settings'
import useUserStore from './user'
import api from '@/api'
import { resolveRoutePath } from '@/utils'
import { systemRoutes } from '@/router/routes'
import type { Route } from '@/global'

// 权限
function hasPermission(permissions: string[], route: Route.recordMainRaw | Route.recordRaw) {
  let isAuth = false
  if (route.auth) {
    isAuth = permissions.some((auth) => {
      return typeof route.auth === 'string'
        ? route.auth === auth
        : typeof route.auth === 'object'
          ? route.auth.includes(auth)
          : false
    })
  }
  else {
    isAuth = true
  }
  return isAuth
}

function filterAsyncRoutes<T extends Route.recordMainRaw[] | Route.recordRaw[]>(routes: T, permissions: string[]): T {
  const res: any = []
  routes.forEach((route) => {
    if (hasPermission(permissions, route)) {
      const tmpRoute = cloneDeep(route)
      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, permissions)
        tmpRoute.children.length && res.push(tmpRoute)
      }
      else {
        res.push(tmpRoute)
      }
    }
  })
  return res
}

function formatBackRoutes(routes: any, views = import.meta.glob('../../views/**/*.vue')): Route.recordMainRaw[] {
  return routes.map((route: any) => {
    switch (route.component) {
      case 'Layout':
        route.component = () => import('@/layouts/index.vue')
        break
      default:
        // console.log(route.component)

        if (route.component) {
          route.component = views[`../../views/${route.component}`]
        }
        // console.log(route)
        route.meta = {} as any
        if (route.title) {
          route.meta.title = route.title
          route.meta.icon = route.icon
          route.meta.auth = route.auth
          route.meta.hide = route.hide
          route.meta.sidebar = route.sidebar
        }
    }
    if (route.children) {
      route.children = formatBackRoutes(route.children, views)
      route.meta = {} as any
      if (route.title) {
        route.meta.title = route.title
        route.meta.icon = route.icon
        route.meta.auth = route.auth
        route.meta.hide = route.hide
        route.meta.sidebar = route.sidebar
      }
    }

    if (route.path === null) {
      route.path = ''
    }
    // console.log(route)
    return route
  })
}

// 将多层嵌套路由处理成两层，保留顶层和最子层路由，中间层级将被拍平
function flatAsyncRoutes<T extends Route.recordRaw>(routes: T): T {
  if (routes.children) {
    routes.children = flatAsyncRoutesRecursive(routes.children, [{
      path: routes.path,
      title: routes.title,
      hide: !routes.breadcrumb && routes.breadcrumb === false,
    }], routes.path)
  }
  return routes
}
function flatAsyncRoutesRecursive(routes: Route.recordRaw[], breadcrumb: Route.breadcrumb[] = [], baseUrl = ''): Route.recordRaw[] {
  const res: Route.recordRaw[] = []
  routes.forEach((route) => {
    if (route.children) {
      const childrenBaseUrl = resolveRoutePath(baseUrl, route.path)
      const tmpBreadcrumb = cloneDeep(breadcrumb)
      if (route.breadcrumb !== false) {
        tmpBreadcrumb.push({
          path: childrenBaseUrl,
          title: route.title,
          hide: !route.breadcrumb && route.breadcrumb === false,
        })
      }
      const tmpRoute = cloneDeep(route)
      tmpRoute.path = childrenBaseUrl
      tmpRoute.breadcrumbNeste = tmpBreadcrumb
      delete tmpRoute.children
      res.push(tmpRoute)
      const childrenRoutes = flatAsyncRoutesRecursive(route.children, tmpBreadcrumb, childrenBaseUrl)
      childrenRoutes.forEach((item) => {
        // 如果 path 一样则覆盖，因为子路由的 path 可能设置为空，导致和父路由一样，直接注册会提示路由重复
        if (res.some(v => v.path === item.path)) {
          res.forEach((v, i) => {
            if (v.path === item.path) {
              res[i] = item
            }
          })
        }
        else {
          res.push(item)
        }
      })
    }
    else {
      const tmpRoute = cloneDeep(route)
      tmpRoute.path = resolveRoutePath(baseUrl, tmpRoute.path)
      // 处理面包屑导航
      const tmpBreadcrumb = cloneDeep(breadcrumb)
      tmpBreadcrumb.push({
        path: tmpRoute.path,
        title: tmpRoute.title,
        hide: !tmpRoute.breadcrumb && tmpRoute.breadcrumb === false,
      })
      tmpRoute.breadcrumbNeste = tmpBreadcrumb
      res.push(tmpRoute)
    }
  })
  return res
}

const useRouteStore = defineStore(
  // 唯一ID
  'route',
  {
    state: () => ({
      isGenerate: false,
      routes: [] as Route.recordMainRaw[],
      fileSystemRoutes: [] as Route.recordRaw[],
      currentRemoveRoutes: [] as Function[],
      routesList: [],
    }),
    getters: {
      // 扁平化路由（将三级及以上路由数据拍平成二级）
      flatRoutes: (state) => {
        const settingsStore = useSettingsStore()
        const routes: Route.recordRaw[] = []
        if (state.routes) {
          if (settingsStore.app.routeBaseOn !== 'filesystem') {
            state.routes.forEach((item) => {
              routes.push(...cloneDeep(item.children))
            })
            routes.forEach(item => flatAsyncRoutes(item))
          }
          else {
            routes.push(...cloneDeep(state.fileSystemRoutes))
          }
        }
        return routes
      },
      flatSystemRoutes: () => {
        const routes = [...systemRoutes]
        routes.forEach(item => flatAsyncRoutes(item))
        return routes
      },
    },
    actions: {
      // 根据权限动态生成路由（前端生成）
      generateRoutesAtFront(asyncRoutes: Route.recordMainRaw[]) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<void>(async (resolve) => {
          const settingsStore = useSettingsStore()
          const userStore = useUserStore()
          let accessedRoutes
          // 如果权限功能开启，则需要对路由数据进行筛选过滤
          if (settingsStore.app.enablePermission) {
            const permissions = await userStore.getPermissions()
            accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
          }
          else {
            accessedRoutes = cloneDeep(asyncRoutes)
          }
          // 设置 routes 数据
          this.isGenerate = true
          this.routes = accessedRoutes.filter(item => item.children?.length !== 0)
          // console.log(this.routes)

          resolve()
        })
      },
      // 根据权限动态生成路由（后端获取）
      generateRoutesAtBack(asyncRoutes: Route.recordMainRaw[]) {
        let url = window.location.href; //获取当前url
        let pageUrl = url.split("/")[4]; //获取#/之前的字符串
        console.log(pageUrl);

        // 大屏页不调用菜单以及权限接口
        if (pageUrl!=='bigScreenStart'&& pageUrl !== 'bigScreenStartNew'&& pageUrl!=='bigScreenNew') {

          return new Promise<void>((resolve) => {
            api.get('system/baseMenu/queryMenuTreeListByUser').then(async (replace: any) => {
              this.routesList = replace.result
              const settingsStore = useSettingsStore()
              const userStore = useUserStore()
              const asyncRoutesOnline = formatBackRoutes(replace.result)
              let accessedRoutes
              // 如果权限功能开启，则需要对路由数据进行筛选过滤
              if (settingsStore.app.enablePermission&&pageUrl!=='bigScreenStart'&&pageUrl!=='bigScreenStartNew'&&pageUrl!=='bigScreenNew') {
                await userStore.getPermissions()
              }
              accessedRoutes = cloneDeep(asyncRoutesOnline)
              // console.log(accessedRoutes)

              // 设置 routes 数据
              this.isGenerate = true
              this.routes = accessedRoutes.filter(item => item.children.length !== 0)
              resolve()
            })
          })
       }else{
          return new Promise<void>(async (resolve) => {
            const settingsStore = useSettingsStore()
            const userStore = useUserStore()
            let accessedRoutes
            // 如果权限功能开启，则需要对路由数据进行筛选过滤
            if (settingsStore.app.enablePermission&&pageUrl!=='bigScreenStart'&&pageUrl!=='bigScreenStartNew'&&pageUrl!=='bigScreenNew') {
              const permissions = await userStore.getPermissions()
              accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
            }
            else {
              accessedRoutes = cloneDeep(asyncRoutes)
            }
            // 设置 routes 数据
            this.isGenerate = true
            this.routes = accessedRoutes.filter(item => item.children?.length !== 0)
            // console.log(this.routes)

            resolve()
          })
       }

      },
      // 根据权限动态生成路由（文件系统生成）
      generateRoutesAtFilesystem(asyncRoutes: Route.recordRaw[]) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<void>(async (resolve) => {
          const settingsStore = useSettingsStore()
          const userStore = useUserStore()
          let accessedRoutes
          // 如果权限功能开启，则需要对路由数据进行筛选过滤
          if (settingsStore.app.enablePermission) {
            const permissions = await userStore.getPermissions()
            accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
          }
          else {
            accessedRoutes = cloneDeep(asyncRoutes)
          }
          // 设置 routes 数据
          this.isGenerate = true
          this.fileSystemRoutes = accessedRoutes.filter(item => item.children?.length !== 0)
          resolve()
        })
      },
      // 记录 accessRoutes 路由，用于登出时删除路由
      setCurrentRemoveRoutes(routes: Function[]) {
        this.currentRemoveRoutes = routes
      },
      // 清空动态路由
      removeRoutes() {
        this.isGenerate = false
        this.routes = []
        this.currentRemoveRoutes.forEach((removeRoute) => {
          removeRoute()
        })
        this.currentRemoveRoutes = []
      },
      // 更新路由数据
      updataRoutes(newData: any) {
        // console.log(newData)
        this.routes = newData
      },
    },
  },
)

export default useRouteStore
