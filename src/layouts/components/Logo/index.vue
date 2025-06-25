<script lang="ts" setup name="Logo">
// import imgLogo from '@/assets/images/logo.png'
import useSettingsStore from '@/store/modules/settings'
import useMenuStore from '@/store/modules/menu'
defineProps({
  showLogo: {
    type: Boolean,
    default: true,
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
})
const menuStore = useMenuStore()
const settingsStore = useSettingsStore()

const title = ref(import.meta.env.VITE_APP_TITLE)
// const logo = ref(imgLogo)

const to = computed(() => {
  const rtn: {
    name?: string
  } = {}
  if (settingsStore.modeSwitch === 'normal') {
    rtn.name = 'home'
  }
  else {
    rtn.name = 'configProcess'
  }
  // console.log(rtn)
  return rtn
})
</script>

<template>
  <router-link :to="to" class="title" :class="{ 'is-link': settingsStore.dashboard.enable }" :title="title">
    <!-- <img v-if="showLogo" :src="logo" class="logo"> -->
    <span v-if="showTitle">{{ settingsStore.modeSwitch === 'normal' ? title : '阵地综合信息管理系统-配置模式' }}</span>
    <!-- <div v-if="showTitle">
      INTEGRATED INFORMATION MANAGEMENT SYSTEM
    </div> -->
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  position: fixed;
  z-index: 1000;
  top: 0;
  width: inherit;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--g-sidebar-logo-height);
  text-align: center;
  overflow: hidden;
  text-decoration: none;

  &.is-link {
    cursor: pointer;
  }

  .logo {
    width: 30px;
    height: 30px;

    & + span {
      margin-left: 10px;
    }
  }

  span {
    display: block;
    font-weight: bold;
    color: #fff;

    @include text-overflow;
  }
}
</style>
