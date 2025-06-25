<script lang="ts" setup name="Topbar">
import { compile } from 'path-to-regexp'
import { Calendar } from '@element-plus/icons-vue'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const enableSubMenuCollapseButton = computed(() => {
  return settingsStore.mode === 'mobile' || (
    ['side', 'head', 'single'].includes(settingsStore.menu.menuMode)
    && settingsStore.menu.enableSubMenuCollapseButton
  )
})
const data = reactive({
  modeSwitchStatus: sessionStorage.modeSwitch,
})
const breadcrumbList = computed(() => {
  const breadcrumbList = []
  if (settingsStore.dashboard.enable) {
    breadcrumbList.push({
      path: '/dashboard',
      title: settingsStore.dashboard.title,
    })
  }
  if (route.meta.breadcrumbNeste) {
    breadcrumbList.push(...route.meta.breadcrumbNeste.filter(item => item.hide === false))
  }
  return breadcrumbList
})

const scrollTop = ref(0)

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
function onScroll() {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop
}

function pathCompile(path: string) {
  const toPath = compile(path)
  return toPath(route.params)
}
function toSub(val: any) {
  const sidebarMenus = menuStore.sidebarMenus[val].children as any
  const subMenuArr = []
  for (let i = 0; i < sidebarMenus.length; i++) {
    // console.log(sidebarMenus[i])

    if (sidebarMenus[i].children && !sidebarMenus[i].hide) {
      if (sidebarMenus[i].children.length > 0) {
        subMenuArr.push(sidebarMenus[i])
      }
    }
    else {
      subMenuArr.push(sidebarMenus[i])
    }
  }
  menuStore.setSubMenus(subMenuArr)
  menuStore.setSubPath(menuStore.sidebarMenus[val].path)
  sessionStorage.setItem('subMenus', JSON.stringify(subMenuArr))
  sessionStorage.setItem('tabActive', val)
  window.console.log(menuStore.subMenus)
}

function clickTab(val: any) {
  setTimeout(() => {
    window.console.log(menuStore.subMenus[0])
    // 默认跳转第一个子菜单
    setTimeout(() => {
      if (menuStore.subMenus[0].hide) {
        router.push({
          name: menuStore.subMenus[0].name,
        })
      }
      else {
        router.push({
          name: menuStore.subMenus[0].children[0].name,
        })
      }
    }, 100)
  }, 100)
}
watch(
  () => menuStore.sidebarMenus,
  (newVal, oldVal) => {
    window.console.log(newVal)
    const tabActive = sessionStorage.getItem('tabActive') as any
    window.console.log(tabActive)
    // console.log(menuStore.sidebarMenus)
    // if (subMenus) {
    //   menuStore.setSubMenus(JSON.parse(subMenus))
    // }

    if (tabActive) {
      // 过滤空子级
      const sidebarMenus = menuStore.sidebarMenus[tabActive].children as any
      const subMenuArr = []
      for (let i = 0; i < sidebarMenus.length; i++) {
        if (sidebarMenus[i].children && !sidebarMenus[i].hide) {
          if (sidebarMenus[i].children.length > 0) {
            subMenuArr.push(sidebarMenus[i])
          }
        }
        else {
          subMenuArr.push(sidebarMenus[i])
        }
      }
      menuStore.setSubMenus(subMenuArr)
      menuStore.setSubPath(menuStore.sidebarMenus[tabActive].path)
      menuStore.setTabActive(parseInt(tabActive))
    }
    // nextTick(() => {
    //   tabList = newVal
    // })
  },
)
onMounted(() => {
  // const subMenus = sessionStorage.getItem('subMenus') as any
  // setTimeout(() => {

    let tabActive = sessionStorage.getItem('tabActive') as any
    window.console.log(tabActive)
    // if (!tabActive) {
    //   tabActive = 0
    // }
    // if (subMenus) {
    //   menuStore.setSubMenus(JSON.parse(subMenus))
    // }
    // console.log(menuStore.sidebarMenus)
    if (tabActive) {
      // 过滤空子级
      const sidebarMenus = menuStore.sidebarMenus[tabActive].children as any
      const subMenuArr = []
      for (let i = 0; i < sidebarMenus.length; i++) {
        if (sidebarMenus[i].children && !sidebarMenus[i].hide) {
          if (sidebarMenus[i].children.length > 0) {
            subMenuArr.push(sidebarMenus[i])
          }
        }
        else {
          subMenuArr.push(sidebarMenus[i])
        }
      }
      // console.log(subMenuArr)

      menuStore.setSubMenus(subMenuArr)
      menuStore.setSubPath(menuStore.sidebarMenus[tabActive].path)
      menuStore.setTabActive(parseInt(tabActive))

    }
  // }, 100);

})
</script>

<template>
  <div class="topbar-container">
    <!-- <div class="left-box"> -->
    <!-- <div v-if="enableSubMenuCollapseButton" class="sidebar-collapse" :class="{ 'is-collapse': settingsStore.menu.subMenuCollapse }" @click="settingsStore.toggleSidebarCollapse()">
        <el-icon>
          <svg-icon name="toolbar-collapse" />
        </el-icon>
      </div> -->
    <!-- <el-breadcrumb v-if="settingsStore.breadcrumb.enable && settingsStore.mode === 'pc' && settingsStore.app.routeBaseOn !== 'filesystem'">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path" :to="index < breadcrumbList.length - 1 ? pathCompile(item.path) : ''">
            {{ item.title }}
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb> -->
    <el-tabs v-model="menuStore.tabActive" class="tabs_box" @tab-change="toSub"
      @tab-click="clickTab(menuStore.tabActive)">
      <el-tab-pane v-for="(item, index) in menuStore.sidebarMenus" :key="index" :name="index">
        <template #label>
          <div v-if="menuStore.sidebarMenus">
            <span class="custom-tabs-label">
              <el-icon v-if="item.meta.icon" class="title-icon">
                <svg-icon :name="item.meta.icon" />
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.topbar-container {
  width: 100%;
  // position: absolute;
  box-sizing: border-box;
  z-index: 999;
  top: 0;
  display: flex;
  align-items: center;
  height: 60px;

  --el-tabs-header-height: 60px;

  background: linear-gradient(to top, #fff, #b4e2d4);
  transition: width 0.3s, top 0.3s, transform 0.3s, background-color 0.3s, var(--el-transition-box-shadow);

  :deep(.el-tabs__item) {
    padding: 0;
  }

  :deep(.el-tabs) {
    --el-tabs-header-height: 60px;
  }

  :deep(.el-tabs__item:hover) {
    color: #09815d;
    transition: 0.5s;
  }

  /* stylelint-disable-next-line no-duplicate-selectors */
  :deep(.el-tabs__item) {
    transition: 0.5s;
    margin: 0 16px;
  }

  :deep(.is-active) {
    color: #09815d;
    font-weight: bold;

    /* background: linear-gradient(#09815d, #09815d) no-repeat center 10px/100% 2px, linear-gradient(to right, #09815d, #09815d 1px, #fff 1px, #fff calc(100% - 1px), #09815d calc(100% - 1px), #09815d) no-repeat center 10px/100% 100%; */
  }

  .tabs_box {
    width: 80%;

    .custom-tabs-label {
      padding: 0 26px;
      font-size: 18px;

      .el-icon {
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
        margin-left: 10px;
      }
    }
  }

  :deep(.tabs_box) {
    white-space: nowrap;

    .el-tabs__header {
      margin: 0;
    }
  }

  &.fixed {
    position: fixed;

    &.shadow {
      box-shadow: 0 10px 10px -10px var(--g-box-shadow-color);
    }
  }

  .left-box {
    display: flex;
    align-items: center;
    padding-right: 50px;
    overflow: hidden;
    mask-image: linear-gradient(90deg, #000 0%, #000 calc(100% - 50px), transparent);

    .sidebar-collapse {
      display: flex;
      align-items: center;
      height: 50px;
      cursor: pointer;

      .el-icon {
        color: var(--el-text-color-primary);
        transition: var(--el-transition-color), var(--el-transition-md-fade);
      }

      &:hover .el-icon {
        color: #09815d;
      }

      &.is-collapse .el-icon {
        transform: rotateZ(-180deg);
      }

      & + .el-breadcrumb {
        margin-left: 0;
      }
    }

    :deep(.el-breadcrumb) {
      margin-left: 20px;
      white-space: nowrap;

      .el-breadcrumb__item {
        display: inline-block;
        float: none;

        span {
          font-weight: normal;
        }

        &:last-child span {
          color: #97a8be;
        }
      }
    }
  }
}

// 面包屑动画
.breadcrumb-enter-active {
  transition: all 0.25s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(30px) skewX(-50deg);
}
</style>
