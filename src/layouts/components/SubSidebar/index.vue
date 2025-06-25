<script lang="ts" setup name="SubSidebar">
import Logo from '../Logo/index.vue'
import SidebarItem from '../SidebarItem/index.vue'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
const settingsStore = useSettingsStore()
const menuStore = useMenuStore()
const defaultOpenedPaths = reactive([]) as any

const sidebarScrollTop = ref(0)
const menuRef = ref()
function onSidebarScroll(e: Event) {
  sidebarScrollTop.value = (e.target as HTMLElement).scrollTop
}
function closeMenu(key: any, keyPath: any) {
  return false
  // menuRef.open(keyPath)
}
function openMenu(key: any, keyPath: any) {
  // menuRef.value.open(keyPath)
  return false
}
const data = reactive({
  modeSwitchStatus: sessionStorage.modeSwitch,
})

window.console.log(menuStore.subMenus)
</script>

<template>
  <div v-if="['side', 'head', 'single'].includes(settingsStore.menu.menuMode) || settingsStore.mode === 'mobile'" class="sub-sidebar-container" :class="{ 'is-collapse': settingsStore.mode === 'pc' && settingsStore.menu.subMenuCollapse }" @scroll="onSidebarScroll">
    <!-- <Logo
      :show-logo="settingsStore.menu.menuMode === 'single'" class="sidebar-logo" :class="{
        'sidebar-logo-bg': settingsStore.menu.menuMode === 'single',
        'shadow': sidebarScrollTop,
      }"
    /> -->
    <!-- 侧边栏模式（无主导航） -->
    <el-menu
      ref="menuRef" :unique-opened="false" :default-openeds="defaultOpenedPaths" :default-active="$route.meta.activeMenu || $route.path" :collapse="settingsStore.mode === 'pc' && settingsStore.menu.subMenuCollapse" :collapse-transition="false"
      :class="{
        'is-collapse-without-logo': settingsStore.menu.menuMode !== 'single' && settingsStore.menu.subMenuCollapse,
      }"
      @close="closeMenu" @open="openMenu"
    >
      <transition-group name="sub-sidebar">
        <template v-for="(route, index) in menuStore.subMenus" :key="route.path || index">
          <SidebarItem v-if="route.meta.sidebar !== false " :item="route" :base-path="menuStore.subPath" />
          <!-- <SidebarItem v-if="route.meta.sidebar !== false && route.children.length > 0 " :item="route" :base-path="menuStore.subPath" /> -->
        </template>
      </transition-group>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sub-sidebar-container {
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;

  // firefox隐藏滚动条
  scrollbar-width: none;
  padding-top: 20px;
  // chrome隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  width: var(--g-sub-sidebar-width);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: var(--g-sub-sidebar-bg);
  box-shadow: 10px 0 10px -10px var(--g-box-shadow-color);
  transition: background-color 0.3s, var(--el-transition-box-shadow), left 0.3s, width 0.3s;

  &.is-collapse {
    width: 64px;

    .sidebar-logo {
      &:not(.sidebar-logo-bg) {
        display: none;
      }

      :deep(span) {
        display: none;
      }
    }
  }

  :deep(.el-sub-menu__title) {
    position: relative;
    color: #fff !important;
    font-size: 18px;
    background: linear-gradient(#07996b, #07996b) no-repeat 8px top/calc(100% - 40px) 100% !important;

    --el-menu-item-height: 48px;

    span {
      position: relative;
      padding-left: 14px;
    }

    span::after {
      content: "";
      position: absolute;
      top: calc(50% - 8px);
      right: 27px;
      width: 10px;
      height: 10px;
      border: solid #fe0;
      border-width: 4px 4px 0 0;
      transform: rotate(45deg);
    }

    span::before {
      content: "";
      position: absolute;
      top: calc(50% - 8px);
      right: 20px;
      width: 12px;
      height: 12px;
      border: solid #fe0;
      border-width: 2px 2px 0 0;
      transform: rotate(45deg);
    }
  }

  :deep(.el-sub-menu__title::after) {
    content: "";
    position: absolute;
    right: -16px;
    top: 0;
    width: 0;
    height: 0;
    border: 24px solid transparent;
    border-left: 24px solid #07996b;
  }

  :deep(.el-sub-menu__title::before) {
    content: "";
    position: absolute;
    left: 8px;
    top: calc(50% - 15px);
    width: 6px;
    height: 30px;
    border-radius: 0 8px 8px 0;
    background: linear-gradient(#ffd964, #ffd459);
    box-shadow: 1px 0 3px #666;
  }

  .sidebar-logo {
    transition: box-shadow 0.2s, background-color 0.3s, color 0.3s;
    background-color: var(--g-sub-sidebar-bg);

    &:not(.sidebar-logo-bg) {
      :deep(span) {
        color: var(--g-sub-sidebar-menu-color);
      }
    }

    &.sidebar-logo-bg {
      background-color: var(--g-main-sidebar-bg);
    }

    &.shadow {
      box-shadow: 0 10px 10px -10px var(--g-box-shadow-color);
    }
  }

  .el-menu {
    border-right: 0;
    // padding-top: var(--g-sidebar-logo-height);
    transition: border-color 0.3s, background-color 0.3s, color 0.3s, padding-top 0.3s;
    background-color: var(--g-sub-sidebar-bg);

    &:not(.el-menu--collapse) {
      width: inherit;
    }

    &.is-collapse-without-logo {
      padding-top: 0;
    }

    &.el-menu--collapse {
      :deep(.title-icon) {
        margin-right: 0;
      }

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        span,
        .el-sub-menu__icon-arrow {
          display: none;
        }
      }
    }

    &.menu-radius:not(.el-menu--collapse) {
      .sidebar-item {
        padding: 0 10px;

        &:first-child {
          padding-top: 10px;
        }

        &:last-child {
          padding-bottom: 10px;
        }
      }

      :deep(.el-menu--inline),
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        border-radius: 10px;
      }
    }
  }
}

// 次侧边栏动画
.sub-sidebar-enter-active {
  transition: opacity 0.3s, transform 0.3s;
}

.sub-sidebar-enter-from,
.sub-sidebar-leave-active {
  opacity: 0;
  transform: translateY(30px) skewY(10deg);
}

.sub-sidebar-leave-active {
  position: absolute;
}
</style>
