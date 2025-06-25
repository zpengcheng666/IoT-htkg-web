<script lang="ts" setup name="Header">
import Logo from '../Logo/index.vue'
import Tools from '../Tools/index.vue'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
import headerBg from '@/assets/images/header-bg.png'
import navBg from '@/assets/images/nav-bg.png'
const headerBgStyle = reactive({
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const navBgStyle = reactive({
  backgroundImage: `url(${navBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})
const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const router = useRouter()
const navRef = ref()

// 顶部模式鼠标滚动
function handlerMouserScroll(event: WheelEvent) {
  navRef.value.scrollBy({
    left: (event.deltaY || event.detail) > 0 ? 50 : -50,
  })
}

// 点击切换
function switchTo(val: any, index: any) {
  if (val.title === '装备管理分系统') {
    return false
  }
  const sidebarMenus = val.children[0].children as any
  const subMenuArr = []
  for (let i = 0; i < sidebarMenus.length; i++) {
    if (sidebarMenus[i].children) {
      if (sidebarMenus[i].children.length > 0) {
        subMenuArr.push(sidebarMenus[i])
      }
    }
    else {
      subMenuArr.push(sidebarMenus[i])
    }
  }

  menuStore.setSubMenus([])
  menuStore.setSubMenus(subMenuArr)

  // menuStore.setSubMenus(val.children[0].children)
  menuStore.setSubPath(val.children[0].path)
  menuStore.setActived(index)
  menuStore.setTabActive(0)
  sessionStorage.setItem('tabActive', '0')
  sessionStorage.setItem('subMenus', JSON.stringify(subMenuArr))

  // 默认跳转第一个子菜单
  setTimeout(() => {
    router.push({
      name: menuStore.subMenus[0].children[0].name,
    })
  }, 100)
}
// console.log(menuStore.allMenus)
</script>

<template>
  <transition name="header">
    <header v-if="settingsStore.mode === 'pc' && settingsStore.menu.menuMode === 'head'" :style="headerBgStyle">
      <div class="header-container">
        <div class="main">
          <Logo />
          <!-- 顶部模式 -->
          <div v-if="settingsStore.modeSwitch === 'normal'" ref="navRef" class="nav" :style="navBgStyle" @wheel.prevent="handlerMouserScroll">
            <template v-for="(item, index) in menuStore.allMenus" :key="index">
              <div v-if="item.children && item.children.length !== 0 && !item.meta.hide" class="item-container" :class="{ active: index === menuStore.actived }">
                <div class="item" @click="switchTo(item, index)">
                  <el-icon>
                    <svg-icon v-if="item.meta.icon" :name="item.meta.icon" />
                  </el-icon>
                  <span v-if="item.meta.title">{{ item.meta.title }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <Tools />
      </div>
    </header>
  </transition>
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: var(--g-header-height);
  color: var(--g-header-color);
  background-color: var(--g-header-bg);
  transition: background-color 0.3s, var(--el-transition-color);
  min-width: 1300px;

  .header-container {
    width: var(--g-header-width);
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .main {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      height: 100%;
    }
  }

  @media screen and (max-width: var(--g-header-width)) {
    .header-container {
      width: 100%;
    }
  }

  :deep(.title) {
    position: relative;
    width: inherit;
    height: inherit;
    padding: inherit;
    background-color: inherit;

    .logo {
      width: 72px;
      height: 38px;
    }

    span {
      font-size: 32px;
      letter-spacing: 2px;
      color: var(--g-header-color);

      &::after {
        content: "INTEGRATED INFORMATION MANAGEMENT SYSTEM";
        display: block;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 9px;
        font-weight: normal;
        letter-spacing: -0.8px;
      }
    }
  }

  .nav {
    // flex: 1;
    display: flex;
    width: 60%;
    height: 60px;
    margin: 0 auto;
    padding: 0 40px;
    margin-bottom: -55px;
    overflow-x: auto;
    justify-content: space-around;
    // mask-image: linear-gradient(to right, transparent, #000 20px, #000 calc(100% - 20px), transparent);
    // background-color: #0e7052;
    // firefox隐藏滚动条
    scrollbar-width: none;

    // chrome隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }

    .item-container {
      position: relative;
      display: flex;
      width: 25%;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        // flex-direction: column;
        padding: 0 5px;
        width: 100%;
        height: 100%;
        cursor: pointer;
        font-weight: bold;
        color: var(--g-header-menu-color);
        // background-color: var(--g-header-bg);
        transition: background-color 0.3s, var(--el-transition-color);

        &:hover {
          color: var(--g-header-menu-hover-color);
          // background-color: var(--g-header-menu-hover-bg);
        }

        .el-icon {
          font-size: 24px;
          vertical-align: middle;
          margin-right: 8px;
        }

        span {
          text-align: center;
          vertical-align: middle;
          word-break: break-all;

          @include text-overflow(1, false);
        }
      }

      &.active .item {
        color: var(--g-header-menu-active-color);
        // background-color: var(--g-header-menu-active-bg);
      }
    }
  }

  :deep(.tools) {
    height: 100%;
    margin-right: -20px;
    padding: 0;

    .buttons .item .el-icon {
      color: var(--g-header-color);
    }

    .user-container {
      font-size: 16px;
      color: var(--g-header-color);
    }
  }
}

// 头部动画
.header-enter-active,
.header-leave-active {
  transition: transform 0.3s;
}

.header-enter-from,
.header-leave-to {
  transform: translateY(calc(var(--g-header-height) * -1));
}
</style>
