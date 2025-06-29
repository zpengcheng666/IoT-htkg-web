<script lang="ts" setup name="Layout">
import hotkeys from 'hotkeys-js'
import Header from './components/Header/index.vue'
import MainSidebar from './components/MainSidebar/index.vue'
import SubSidebar from './components/SubSidebar/index.vue'
import Topbar from './components/Topbar/index.vue'
import Search from './components/Search/index.vue'
import AppSetting from './components/AppSetting/index.vue'
import HotkeysIntro from './components/HotkeysIntro/index.vue'
import Notice from './components/Notice/index.vue'
import useSettingsStore from '@/store/modules/settings'
import useKeepAliveStore from '@/store/modules/keepAlive'
import useMenuStore from '@/store/modules/menu'

const routeInfo = useRoute()

const settingsStore = useSettingsStore()
const keepAliveStore = useKeepAliveStore()
const menuStore = useMenuStore()

const isRouterAlive = ref(true)
watch(() => settingsStore.menu.subMenuCollapse, (val) => {
  if (settingsStore.mode === 'mobile') {
    if (!val) {
      document.body.classList.add('hidden')
    }
    else {
      document.body.classList.remove('hidden')
    }
  }
})

watch(() => routeInfo.path, () => {
  if (settingsStore.mode === 'mobile') {
    settingsStore.$patch((state) => {
      state.menu.subMenuCollapse = true
    })
  }
})

const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}

provide('reload', reload)

onMounted(() => {
  hotkeys('f5', (e) => {
    if (settingsStore.toolbar.enablePageReload) {
      e.preventDefault()
      useMainPage().reload()
    }
  })
  hotkeys('alt+`', (e) => {
    if (settingsStore.menu.enableHotkeys) {
      e.preventDefault()
      useMenu().switchTo(menuStore.actived + 1 < menuStore.allMenus.length ? menuStore.actived + 1 : 0)
    }
  })
})
onUnmounted(() => {
  hotkeys.unbind('f5')
  hotkeys.unbind('alt+`')
})
</script>

<template>
  <div class="layout">
    <div id="app-main">
      <Header />
      <div class="wrapper">
        <!-- <div class="sidebar-container" :class="{ show: settingsStore.mode === 'mobile' && !settingsStore.menu.subMenuCollapse }">
          <MainSidebar />
        </div> -->
        <div class="sidebar-mask" :class="{ show: settingsStore.mode === 'mobile' && !settingsStore.menu.subMenuCollapse }" @click="settingsStore.toggleSidebarCollapse()" />
        <div class="main-container" :style="{ 'padding-bottom': $route.meta.paddingBottom } as any">
          <Topbar v-if="settingsStore.showTab" />
          <div class="main">
            <SubSidebar />
            <router-view v-slot="{ Component, route }">
              <transition name="main" mode="out-in" appear>
                <keep-alive :include="keepAliveStore.list">
                  <component :is="Component" v-if="isRouterAlive" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
          <Copyright />
        </div>
      </div>
      <el-backtop :right="20" :bottom="20" title="回到顶部" />
      <Notice v-if="settingsStore.modeSwitch === 'normal'" />
    </div>
    <AppSetting />
    <HotkeysIntro />
  </div>
</template>

<style lang="scss" scoped>
[data-mode="mobile"] {
  .sidebar-container {
    transform: translateX(calc((var(--g-main-sidebar-width) + var(--g-sub-sidebar-width)) * -1));

    &.show {
      transform: translateX(0);
    }
  }

  .main-container {
    margin-left: 0 !important;
  }

  &[data-menu-mode="single"] {
    .sidebar-container {
      transform: translateX(calc(var(--g-sub-sidebar-width) * -1));

      &.show {
        transform: translateX(0);
      }
    }
  }
}

.layout {
  height: 100%;
}

#app-main {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  transition: all 0.2s;
  min-width: 1300px;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: -1px 0 0 0 var(--g-box-shadow-color);
  transition: padding-top 0.3s;

  .sidebar-container {
    position: fixed;
    z-index: 1010;
    top: 0;
    bottom: 0;
    display: flex;
    transition: transform 0.3s, top 0.3s;
    width: calc(var(--g-main-sidebar-actual-width) + var(--g-sub-sidebar-actual-width));
  }

  .sidebar-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
    backdrop-filter: blur(2px);
    transition: all 0.2s;
    transform: translateZ(0);
    opacity: 0;
    visibility: hidden;

    &.show {
      opacity: 1;
      visibility: visible;
    }
  }

  .main-sidebar-container:not(.main-sidebar-leave-active) + .sub-sidebar-container {
    left: var(--g-main-sidebar-width);
  }

  .main-container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background-color: var(--g-main-bg);
    transition: margin-left 0.3s, background-color 0.3s;
    padding-bottom: 44px;

    .topbar-container {
      top: 0;
      z-index: 998;
    }

    .main {
      height: 100%;
      flex: auto;
      padding-left: calc(var(--g-main-sidebar-actual-width) + var(--g-sub-sidebar-actual-width));
      position: relative;
      overflow: hidden;
      transition: 0.3s;
    }

    .topbar-container + .main {
      margin: 0;
    }
  }
}

header:not(.header-leave-active) + .wrapper {
  padding-top: var(--g-header-height);

  .sidebar-container {
    top: var(--g-header-height);

    :deep(.sidebar-logo) {
      display: none;
    }

    :deep(.el-menu) {
      padding-top: 0;
    }
  }

  .main-container {
    .topbar-container {
      top: var(--g-header-height);

      :deep(.tools) {
        display: none;
      }
    }
  }
}

// 主内容区动画
.main-enter-active {
  transition: 0.2s;
}

.main-leave-active {
  transition: 0.15s;
}

.main-enter-from {
  opacity: 0;
  margin-left: -20px;
}

.main-leave-to {
  opacity: 0;
  margin-left: 20px;
}
</style>
