<script lang="ts" setup name="SidebarItem">
// import SidebarItem from './index.vue'
import { isExternalLink, resolveRoutePath } from '@/utils'
import type { Menu } from '@/global'
const props = defineProps({
  item: {
    type: Object as () => Menu.recordRaw,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['clickMenu'])

const router = useRouter()

const hasChildren = computed(() => {
  let flag = true
  if (props.item.children) {
    if (props.item.children.every(item => item.meta.sidebar === false)) {
      flag = false
    }
  }
  else {
    flag = false
  }
  return flag
})

const reload = inject('reload') as any

const clickMenu = async (val: any) => {
  emits('clickMenu', val)
  setTimeout(() => {
    reload()
  }, 100)
}
// console.log(props.item)
// console.log(props.basePath)
</script>

<template>
  <div class="sidebar-item">
    <router-link v-if="!hasChildren" v-slot="{ href, navigate, isActive, isExactActive }" custom :to="resolveRoutePath(basePath, item.path || '')">
      <a :href="isExternalLink(resolveRoutePath(basePath, item.path || '')) ? resolveRoutePath(basePath, item.path || '') : href" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']" :target="isExternalLink(resolveRoutePath(basePath, item.path || '')) ? '_blank' : '_self'" @click="navigate">
        <el-menu-item :title="item.meta.title" :index="resolveRoutePath(basePath, item.path || '')" @click="clickMenu(item)">
          <el-icon v-if="item.meta.icon" class="title-icon">
            <svg-icon :name="item.meta.icon" />
          </el-icon>
          <span class="title" style="padding-left: 15px;">{{ item.meta.title }}</span>
        </el-menu-item>
      </a>
    </router-link>
    <el-sub-menu v-else :title="item.meta.title" :index="resolveRoutePath(basePath, item.path || '')" @click="clickMenu(item)">
      <div class="menu_mb" />

      <template #title>
        <el-icon v-if="item.meta.icon" class="title-icon">
          <svg-icon :name="item.meta.icon" />
        </el-icon>
        <span class="title">{{ item.meta.title }}</span>
      </template>
      <template v-for="route in item.children">
        <SidebarItem v-if="route.meta.sidebar !== false" :key="route.path" :item="route" :base-path="resolveRoutePath(basePath, item.path || '')" />
      </template>
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
.menu_mb {
  width: 100%;
  height: 60px;
  // background-color: red;
  position: absolute;
  top: -60px;
}

:deep(.el-menu-item),
:deep(.el-menu-item span.title),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu__title span.title) {
  flex: 1;
  vertical-align: inherit;

  @include text-overflow;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  justify-content: center;
  // background-image: (url(@/assets/images/menu-bg.png)) !important;
  // background-repeat: no-repeat !important;
  // background-size: 100% 100% !important;
}

:deep(.el-sub-menu),
:deep(.el-menu-item) {
  .title-icon {
    width: 20px;
    font-size: 20px;
    vertical-align: -0.25em;
    transition: transform 0.3s;
    color: unset;
  }

  .title-icon + .title {
    margin-left: 10px;
  }

  &:hover > .title-icon,
  .el-sub-menu__title:hover > .title-icon {
    transform: scale(1.2);
  }
}

a {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.el-sub-menu__title {
  > .badge {
    &-dot {
      right: 40px;
    }

    &-text {
      right: 40px;
    }
  }
}

.el-menu-item.is-active,
.el-menu--collapse .el-sub-menu.is-active > .el-sub-menu__title,
.el-sub-menu .el-menu--inline .el-menu-item.is-active {
  position: relative;
  font-weight: bold;

  /* background-color: transparent !important;
   background-image: linear-gradient(to right, #c6e7e0, #bfded7) !important; */
}

/* .el-sub-menu .el-menu--inline .el-menu-item.is-active::after {
  position: absolute;
  right: 0;
  top: calc(50% - 10px);
  content: "";
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right: 14px solid #e5e6e8;
} */

:deep(.el-sub-menu .el-menu--inline .el-menu-item) {
  position: relative;
  background: repeating-linear-gradient(to right, #13c18a, #13c18a 2px, transparent 2px, transparent 4px) no-repeat center bottom/calc(100% - 16px) 1px !important;
}

:deep(.el-sub-menu .el-menu--inline .el-menu-item::after) {
  content: "";
  position: absolute;
  top: calc(50% - 2px);
  left: 40px;
  width: 4px;
  height: 4px;
  background: var(--menu-active, #666);
  border-radius: 4px;
}

:deep(.el-sub-menu .el-menu) {
  display: block !important;
}

:deep(.el-sub-menu__title .el-icon) {
  display: none !important;
}

.el-sub-menu .el-menu--inline .el-menu-item.is-active::after {
  --menu-active: #07996b;

  box-shadow: 0 0 2px #07996b;
}

.el-sub-menu .el-menu--inline .sidebar-item:last-child .el-menu-item {
  background: none !important;
}

.el-sub-menu.is-active .el-sub-menu__title {
  margin-left: -20px;
}

.el-sub-menu .el-sub-menu span.title {
  padding-left: 15px;
}
</style>

<style lang="scss">
.el-menu--inline {
  background-color: var(--g-sub-sidebar-menu-bg) !important;

  .el-menu-item,
  .el-sub-menu > .el-sub-menu__title {
    color: var(--g-sub-sidebar-menu-color);
    background-color: var(--g-sub-sidebar-menu-bg) !important;

    &:hover {
      color: var(--g-sub-sidebar-menu-hover-color) !important;
      background-color: var(--g-sub-sidebar-menu-hover-bg) !important;
    }
  }
}

.el-menu-item,
.el-sub-menu__title {
  color: var(--g-sub-sidebar-menu-color) !important;
  background: transparent !important;

  &:hover {
    color: var(--g-sub-sidebar-menu-hover-color) !important;
    background-color: var(--g-sub-sidebar-menu-hover-bg) !important;
  }
}

.el-menu-item.is-active,
.el-menu--collapse .el-sub-menu.is-active > .el-sub-menu__title,
.el-sub-menu .el-menu--inline .el-menu-item.is-active {
  color: var(--g-sub-sidebar-menu-active-color) !important;
  background-color: var(--g-sub-sidebar-menu-active-bg) !important;

  .icon,
  .el-sub-menu__icon-arrow {
    color: unset;
  }
}
</style>
