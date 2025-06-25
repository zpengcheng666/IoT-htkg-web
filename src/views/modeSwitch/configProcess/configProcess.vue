<!--
 * @Description:系统总体配置流程
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2023-08-11 10:00:22
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-21 10:45:19
-->
<script lang="ts" setup>
import configBg from '@/assets/images/config-bg.png'
import useMenuStore from '@/store/modules/menu'
const menuStore = useMenuStore()

onMounted(() => {
  menuStore.setTabActive(0)
})
</script>

<template>
  <page-main class="pageBox">
    <div class="config-box">
      <div class="config-title">
        系统总体配置流程
      </div>·
      <div>
        <el-image class="img-bg" :src="configBg" fit="" />
      </div>
    </div>
  </page-main>
</template>

<style lang="scss" scoped>
.config-box {
  width: 100%;
  height: calc(100vh - 334px);
  background-origin: content-box;
}

.img-bg {
  width: 100%;
  height: 90%;
  object-fit: contain;
}

.config-title {
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  color: #33745f;
  padding: 1rem 0;
}
</style>
