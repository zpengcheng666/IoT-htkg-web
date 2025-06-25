<script lang="ts" setup name="Tools">
import { useFullscreen } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, User } from '@element-plus/icons-vue'
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import toolBg from '@/assets/images/tool-bg.png'
import useMenuStore from '@/store/modules/menu'
const toolBgStyle = reactive({
  backgroundImage: `url(${toolBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const menuStore = useMenuStore()
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
})
</script>

<template>
  <div class="tools">
    <div class="buttons">
      <el-dropdown v-if="data.dataNavData.length > 0" popper-class="dropdownBoxNew" :disabled="data.modeSwitchStatus === 'config'">
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
            <div v-for="(v, i) in data.dataNavData" :key="i" :class="i === 0 ? '' : 'hasBorderTop'">
              <el-dropdown-item v-for="(val, index) in v.children" :key="index" @click="toPage(val.name, i)">
                {{ val.title }}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown v-if="data.sysNavData.length > 0" popper-class="dropdownBoxNew" :disabled="data.modeSwitchStatus === 'config'">
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
      color: #01c4f9;

      .el-icon {
        color: #01c4f9;
        transition: var(--el-transition-color);
        margin-right: 8px;
      }
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
  .dropdownBoxNew {
    border: none !important;

    .dropdownPop {
      background: rgb(6 75 161 / 85%);
      box-shadow: 0 0 6px rgb(9 106 185 / 60%);
      border: 1px solid rgb(5 12 46);
      backdrop-filter: blur(6px);

      .el-dropdown-menu__item {
        color: var(--g-header-color);
        // border-top: solid 1px #2a9e88;
        // border-bottom: solid 1px  #005545;
      }

      .hasBorderBottom {
        border-bottom: solid 1px  #126ab3;
      }

      .hasBorderTop {
        border-top: solid 1px rgb(30 125 204);
      }

      .el-dropdown-menu__item:first-child {
        border-top: none;
      }

      .el-dropdown-menu__item:last-child {
        border-bottom: none;
      }

      .el-dropdown-menu__item:hover {
        background-color: rgb(0 59 133);
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
      background: rgb(6 75 161 / 85%) !important;
    }
  }
</style>
