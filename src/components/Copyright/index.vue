<!--
 * @Description:底部copyright组件
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2022-10-31 09:37:16
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-04-02 10:17:05
-->
<script lang="ts" setup name="Copyright">
import useSettingsStore from '@/store/modules/settings'

const route = useRoute()
const settingsStore = useSettingsStore()
const copyright = reactive((window as any).copyright || settingsStore.copyright.dates)
</script>

<template>
  <footer v-if="route.meta.copyright ?? settingsStore.copyright.enable" class="copyright">
    <span>Copyright</span>
    <span class="icon">©</span>
    <span >{{copyright}}</span>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: #fff;
  font-size: 14px;
  background-color: #2a9e88;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;

  span,
  a {
    padding: 0 5px;
  }

  a {
    text-decoration: none;
    color: var(--el-text-color-secondary);
    transition: var(--el-transition-color);

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  .icon {
    padding: 0;
    font-size: 18px;
  }
}
</style>
