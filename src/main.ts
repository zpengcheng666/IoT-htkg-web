import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import VueGridLayout from 'vue-grid-layout'
import vue3SeamlessScroll from 'vue3-seamless-scroll'
import App from './App.vue'
import pinia from './store'
import router from './router'
import useSettingsStore from './store/modules/settings'
// 引入 iconfont
import './assets/iconfont/iconfont.js'

import echarts from './utils/echart'
// 自定义指令
import directive from '@/utils/directive'
// 加载 svg 图标
import 'virtual:svg-icons-register'
// 全局样式
import '@/assets/styles/globals.scss'
// 动画样式
import '@/assets/styles/animate.min.css'
// 加载 iconify 图标（element plus）
import { downloadAndInstall } from '@/iconify-ep'

if (useSettingsStore().app.iconifyOfflineUse) {
  downloadAndInstall()
}
const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.use(ElementPlus)
app.use(pinia)
app.use(vue3SeamlessScroll as any)
app.use(router)
app.use(VueGridLayout)
// app.use(vueSeamless)
directive(app)

app.mount('#app')
