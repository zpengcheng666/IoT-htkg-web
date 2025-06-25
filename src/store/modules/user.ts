import useRouteStore from './route'
import useMenuStore from './menu'
import api from '@/api'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  {
    state: () => ({
      username: localStorage.username || '',
      token: localStorage.token || '',
      failure_time: localStorage.failure_time || '',
      permissions: [] as string[],
    }),
    getters: {
      isLogin: (state) => {
        let retn = false
        if (state.token) {
          // if (new Date().getTime() < parseInt(state.failure_time)) {
          retn = true
          // }
        }
        return retn
      },
    },
    actions: {
      login(data: {
        username: string
        password: string
      }) {
        return new Promise<void>((resolve, reject) => {
          // 通过 mock 进行登录
          api.post('sys/login', data).then((res: any) => {
            localStorage.setItem('username', data.username)
            localStorage.setItem('token', res.result.token)
            localStorage.setItem('failure_time', res.timestamp)
            this.username = data.username
            this.token = res.result.token
            this.failure_time = res.result.failure_time

            resolve()
            // window.console.log('3333')
          }).catch((error) => {
            reject(error)
            // window.console.log(error)
          })
        })
      },
      logout() {
        return new Promise<void>((resolve) => {
          const routeStore = useRouteStore()
          const menuStore = useMenuStore()
          localStorage.removeItem('username')
          localStorage.removeItem('token')
          localStorage.removeItem('failure_time')
          this.username = ''
          this.token = ''
          this.failure_time = ''
          routeStore.removeRoutes()
          menuStore.setActived(0)
          resolve()
        })
      },
      // 获取我的权限
      getPermissions() {
        return new Promise<string[]>((resolve) => {
          // 获取权限
          api.get('system/baseMenu/getAuths').then((res: any) => {
            this.permissions = res.result
            resolve(res.result)
          })
        })
      },
      editPassword(data: {
        password: string
        newpassword: string
      }) {
        return new Promise<void>((resolve) => {
          api.post('member/edit/password', {
            username: this.username,
            password: data.password,
            newpassword: data.newpassword,
          }, {
            baseURL: '/mock/',
          }).then(() => {
            resolve()
          })
        })
      },
    },
  },
)

export default useUserStore
