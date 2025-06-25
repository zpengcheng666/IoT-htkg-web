<script lang="ts" setup name="Tools">
import { useFullscreen } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, User } from '@element-plus/icons-vue'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import toolBg from '@/assets/images/tool-bg.png'
import useMenuStore from '@/store/modules/menu'
import api from '@/api'
const toolBgStyle = reactive({
  backgroundImage: `url(${toolBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const time = ref('')
const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const menuStore = useMenuStore()
const mainPage = useMainPage()
const { isFullscreen, toggle } = useFullscreen()
const data = reactive({
  modeSwitchStatus: sessionStorage.modeSwitch,
  dataNavData: [] as any, // 数据管理菜单数据
  sysNavData: [] as any, // 系统导航菜单数据
  modeNavData: [] as any, // 数据管理菜单数据
})

// 跳转页面
function toPage(path: string, index: any) {
  router.push({
    name: path,
  })
  setTimeout(() => {
    menuStore.setTabActive(index)
    sessionStorage.setItem('tabActive', index)
  }, 50)
  // console.log(menuStore.sidebarMenus)
}

// 跳转中心窗口
function toCenter() {
  router.push({
    name: 'centerWindow',
  })
}

// 点击模式切换
function modeSwitch() {
  if (sessionStorage.modeSwitch === 'normal') {
    settingsStore.setModeSwitch('config')
    data.modeSwitchStatus = 'config'
    router.push({
      name: 'configProcess',
    })
    setTimeout(() => {
      menuStore.setTabActive(0)
      sessionStorage.setItem('tabActive', '0')
      menuStore.setSubMenus(menuStore.sidebarMenus[0].children)
      menuStore.setSubPath(menuStore.sidebarMenus[0].path)
      sessionStorage.setItem('subMenus', JSON.stringify(menuStore.sidebarMenus[0].children))
    }, 100)
  }
  else if (sessionStorage.modeSwitch === 'config') {
    settingsStore.setModeSwitch('normal')
    data.modeSwitchStatus = 'normal'
    router.push({
      name: 'home',
    })
  }
}

function userCommand(command: 'dashboard' | 'setting' | 'hotkeys' | 'logout') {
  if (sessionStorage.modeSwitch === 'config') {
    return false
  }
  switch (command) {
    case 'dashboard':
      router.push({
        name: 'dashboard',
      })
      break
    case 'setting':
      // console.log('11111')
      router.push({
        name: 'user',
      })
      break
    case 'hotkeys':
      eventBus.emit('global-hotkeys-intro-toggle')
      break
    case 'logout':
      ElMessageBox.confirm(
        '是否退出登录?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          userStore.logout().then(() => {
            ElMessage({
              type: 'success',
              message: '退出成功！',
            })
            router.push({
              name: 'login',
            })
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消退出！',
          })
        })

      break
  }
}

function getNowTime() {
  let newTime = 0
  api.get('/monitor/server/status').then((res: any) => {
    newTime = res.timestamp
  }).catch((error) => {
    window.console.log(error)
  })
  const id = setInterval(() => {
    const now = new Date()
    time.value = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }, 1000)
}
onMounted(() => {
  // console.log('the component is now mounted.')
  window.console.log(menuStore.allMenus)
  for (const i in menuStore.allMenus) {
    // console.log(menuStore.allMenus[i])
    if (menuStore.allMenus[i].title === '数据管理') {
      data.dataNavData = menuStore.allMenus[i].children
    }
    else if (menuStore.allMenus[i].title === '系统设置') {
      data.sysNavData = menuStore.allMenus[i].children
    }
    else if (menuStore.allMenus[i].title === '模式切换') {
      data.modeNavData = menuStore.allMenus[i].children
    }
  }
  const mode = window.location.hash.split('/')[1]
  if (mode === 'config') {
    sessionStorage.setItem('modeSwitch', 'config')
    settingsStore.setModeSwitch('config')
    data.modeSwitchStatus = 'config'
  }
  else {
    sessionStorage.setItem('modeSwitch', 'normal')
    settingsStore.setModeSwitch('normal')
    data.modeSwitchStatus = 'normal'
  }
  // console.log(settingsStore.modeSwitch)
  // console.log(data.modeSwitchStatus)
  getNowTime()
})
</script>

<template>
  <div class="tools">
    <div class="buttons" :style="toolBgStyle">
      <el-dropdown v-if="data.dataNavData.length > 0" popper-class="dropdownBox" :disabled="data.modeSwitchStatus === 'config'">
        <span class="el-dropdown-link">
          <div class="item">
            <el-icon>
              <svg-icon name="menu-sjgl" />
            </el-icon>
            数据管理
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="dropdownPop">
            <!-- <el-dropdown-item @click="toPage('organizationalManagement', 0)">
              组织机构管理
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('locationManagement', 0)">
              位置管理
            </el-dropdown-item> -->
            <div v-for="(v, i) in data.dataNavData" :key="i" :class="i === 0 ? '' : 'hasBorderTop'">
              <el-dropdown-item v-for="(val, index) in v.children" :key="index" @click="toPage(val.name, i)">
                {{ val.title }}
              </el-dropdown-item>
            </div>

            <div v-auth="'center:window'" class="hasBorderTop">
              <el-dropdown-item @click="toCenter()">
                <span>中心窗口</span>
              </el-dropdown-item>
            </div>
            <!-- <el-dropdown-item class="hasBorderTop" @click="toPage('historyData', 0)">
              历史数据
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('historyCurve', 0)">
              历史曲线
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop" @click="toPage('alarmQuery', 1)">
              报警查询
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('alarmCount', 1)">
              报警统计
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop" @click="toPage('planManagement', 2)">
              预案管理
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('specialRecord', 2)">
              特情处置记录
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom hasBorderTop" @click="toPage('personInfo', 3)">
              人员信息同步
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop" @click="toPage('dictionaryData', 4)">
              字典数据
            </el-dropdown-item> -->
            <!-- <el-dropdown-item class="hasBorderTop" @click="toPage('businessLog', 5)">
              业务日志
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown v-if="data.sysNavData.length > 0" popper-class="dropdownBox" :disabled="data.modeSwitchStatus === 'config'">
        <span class="el-dropdown-link">
          <div class="item">
            <el-icon>
              <svg-icon name="menu-xtsz" />
            </el-icon>
            系统设置
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="dropdownPop">
            <div v-for="(v, i) in data.sysNavData" :key="i" :class="i === 0 ? '' : 'hasBorderTop'">
              <div v-for="(val, index) in v.children" :key="index">
                <el-dropdown-item v-if="val.sidebar" @click="toPage(val.name, i)">
                  <span>{{ val.title }}</span>
                </el-dropdown-item>
              </div>
            </div>

            <!-- <el-dropdown-item @click="toPage('user', 0)">
              身份管理
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('group', 0)">
              分组管理
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('role', 0)">
              角色管理
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('menu', 0)">
              菜单管理
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop" @click="toPage('reminderSet', 1)">
              提醒设置
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderBottom" @click="toPage('statisticsSet', 1)">
              分布统计区间设置
            </el-dropdown-item> -->
            <!-- <el-dropdown-item @click="toPage('equipmentValue')">
              设备标定值设置
            </el-dropdown-item> -->
            <!-- <el-dropdown-item class="hasBorderTop hasBorderBottom" @click="toPage('informationIssue', 2)">
              信息发布终端
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop" @click="toPage('personSet', 3)">
              个人设置
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('changePassword', 3)">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('messageNotice', 3)">
              消息通知
            </el-dropdown-item>
            <el-dropdown-item class="hasBorderTop hasBorderBottom" @click="toPage('netMonitoring', 4)">
              系统运维监控
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!--  -->
      <div v-if="data.modeNavData.length > 0" class="item" @click="modeSwitch()">
        <el-icon>
          <svg-icon name="menu-msqh" />
        </el-icon>
        模式切换
      </div>
      <div :class="data.modeSwitchStatus === 'config' ? 'item is-disabled' : 'item' " @click="userCommand('logout')">
        <el-icon>
          <svg-icon name="menu-exit" />
        </el-icon>
        退出登录
      </div>
    </div>

    <div class="user-wrapper">
      <el-avatar size="small">
        <el-icon><User /></el-icon>
      </el-avatar>
      欢迎您，{{ userStore.username }}
      <span class="time-box">
        <span class="icon-box">
          <el-icon><Clock /></el-icon>
        </span>
        {{ time }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tools {
  width: 410px;
  // display: flex;
  // align-items: center;
  padding: 0 20px;
  white-space: nowrap;

  .buttons {
    position: absolute;
    right: 0;
    width: auto;
    height: 40px;
    padding-left: 50px;

    .item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100px;
      font-weight: bold;
      cursor: pointer;
      vertical-align: middle;
      font-size: 14px;

      .el-icon {
        color: var(--el-text-color-primary);
        transition: var(--el-transition-color);
        margin-right: 8px;
      }
    }
  }

  .user-wrapper {
    position: absolute;
    right: 20px;
    top: 50px;
    margin-top: 20px;
    // margin-left: 65px;
    font-size: 16px;

    .time-box {
      // display: flex;
      // justify-items: center;
      margin-left: 20px;

      .icon-box {
        height: 100%;
        // display: flex;
        // justify-items: center;
      }
    }

    .el-avatar {
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 4px;
    }
  }
}

:deep(.buttons) {
  .el-dropdown {
    height: 100%;
    width: 100px;
    color: var(--g-header-color);
    font-size: 18px;
  }

  .is-disabled {
    color: var(--el-text-color-placeholder);
  }
}

:deep(.user-container) {
  display: inline-block;
  height: 24px;
  line-height: 24px;
  cursor: pointer;

  .user-wrapper {
    .el-avatar {
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 4px;
    }
  }
}
</style>

<style lang="scss">
  .dropdownBox {
    border: none !important;

    .dropdownPop {
      background: rgb(0 102 83);
      box-shadow: 0 0 6px rgb(0 67 55 / 60%);
      border: 1px solid rgb(0 102 83 / 85%);

      .el-dropdown-menu__item {
        color: var(--g-header-color);
        // border-top: solid 1px #2a9e88;
        // border-bottom: solid 1px  #005545;
      }

      .hasBorderBottom {
        border-bottom: solid 1px  #005545;
      }

      .hasBorderTop {
        border-top: solid 1px #2a9e88;
      }

      .el-dropdown-menu__item:first-child {
        border-top: none;
      }

      .el-dropdown-menu__item:last-child {
        border-bottom: none;
      }

      .el-dropdown-menu__item:hover {
        background-color: rgb(0 102 83);
        color: var(--g-header-menu-active-color);
      }

      .popper__arrow {
        border: 1px solid #4472cb !important;
      }

      .popper__arrow::before {
        border-top-color: #46bcff !important;
        border-bottom-color: #46bcff !important;
      }
    }

    .el-popper__arrow::before {
      border: solid 1px  #005545 !important;
      background: rgb(0 102 83 / 85%) !important;
    }
  }
</style>
