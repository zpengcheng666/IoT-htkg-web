import axios from 'axios'
// import qs from 'qs'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import useUserStore from '@/store/modules/user'
const toLogin = () => {
  useUserStore().logout()
  setTimeout(() => {
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.path !== '/login' ? router.currentRoute.value.fullPath : undefined,
        isLoseToken: 'true',
      },
    })
  }, 500)
}

const api = axios.create({
  baseURL: import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true' ? '/proxy/' : (<any>window).baseUrl || import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
})

api.interceptors.request.use(
  (request) => {
    const userStore = useUserStore()
    /**
     * 全局拦截请求发送前提交的参数
     * 以下代码为示例，在请求头里带上 token 信息
     */
    if (userStore.isLogin && request.headers) {
      request.headers['X-Access-Token'] = userStore.token
      // request.headers.X_Access_Token = userStore.token
    }
    // 是否将 POST 请求参数进行字符串化处理
    if (request.method === 'post') {
      // request.data = qs.stringify(request.data, {
      //   arrayFormat: 'brackets',
      // })
    }

    // // 如果是delete，改变传参数据格式
    // if (request.method === 'delete') {
    //   request.data = { data: request.data }
    // }
    return request
  },
)

api.interceptors.response.use(
  (response) => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{ status: 1, error: '', data: '' }
     * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 error 会返回错误信息
     */
    // console.log('1111111')
    if (response.data.code !== 200 && response.data.code) {
      // 这里做错误提示，如果使用了 element plus 则可以使用 Message 进行提示
      // ElMessage.error(options)
      // console.log('dfskjldfsk')
      ElMessage({
        message: response.data.message,
        type: 'error',
      })
      return Promise.reject(response.data)
    }

    return Promise.resolve(response.data)
  },
  (error) => {
    let message = error.message
    // console.log('55555555')
    if (error.response.status === 401) {
      toLogin()
      return false
    }
    else {
      // console.log('666666')
      if (message === 'Network Error') {
        message = '后端网络故障'
      }
      else if (message.includes('timeout')) {
        message = '接口请求超时'
      }
      else if (message.includes('Request failed with status code')) {
        message = `接口${message.substr(message.length - 3)}异常`
      }

      ElMessage({
        message,
        type: 'error',
      })
    }

    return Promise.reject(error)
  },
)

export default api
