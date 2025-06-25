<script setup lang='ts'>
import noData from '@/assets/images/noData.png'
const props = defineProps({
  // 详情数据
  infoData: {
    type: Array<any>,
    default() {
      return []
    },
  },

})

</script>

<template>
  <div class="common-layout">
    <el-card class="box-card current-airport">
      <template #header>
        <div class="card-header bs-tit">
          <span>全部卫星</span>
          <!-- <em>{{ props.infoData.length }}</em>颗 -->
        </div>
      </template>
      <!-- direction="left" -->
      <!-- <vue3-seamless-scroll v-if="props.infoData.length > 0 " :limit-scroll-num="3" step="0.5"  class="list_box" :list="props.infoData"> -->
      <div class="list_box">
        <el-carousel height="100%" indicator-position="none" class="carousel-box" >
          <el-carousel-item v-for="(val, index) in props.infoData" :key="index"  class="box-card-child-box">
            <div v-for="(item) in val" :key="item.id" class="box-card-child">
              <div class="box-card-item">
                {{ item.name }}
              </div>
              <div class="box-card-item">
                {{ item.satelliteType }}
              </div>
              <div class="box-card-item">
                {{ item.nationality }}
              </div>
              <div class="box-card-item">
                {{ item.enterTime }}
              </div>
              <div class="box-card-item">
                {{ item.leaveTime }}
              </div>
              <div class="box-card-item">
                {{ item.period }}
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <!-- </vue3-seamless-scroll> -->
      </div>

      <div v-if="props.infoData.length === 0" style="width: 100%;height: 100%;">
        <img :src="noData" alt="" style="width: auto;height: 98%;margin: 0 auto;display: block;">
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  height: 100%;
}

.box-card {
  height: 100%;
  border: none;
  border-radius: 0;
}

.list_box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  // display: flex;
  // justify-content: space-between;
  // flex-wrap: wrap;
}

.carousel-box {
  height: 100%;
}

.box-card-child-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.box-card-child {
  width: 30%;
  height: 100%;
  border: none;
  border-radius: 0;
  padding: 10px;
  color: #fff;
  background: rgb(255 255 255 / 15%);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: left;
}

:deep(::-webkit-scrollbar) {
  width: 5px;
  height: 5px;
  border-radius: 10px;
  transition: all 2s;
}

:deep(::-webkit-scrollbar-track) {
  box-shadow: inset 0 0 6px rgb(0 0 0 / 30%);
  border-radius: 10px;
  background-color: #e3e3e3;
}

:deep(::-webkit-scrollbar-thumb) {
  border: none;
  border-radius: 10px;
  background: repeating-linear-gradient(45deg, #0179c9, #0179c9 6px, #008eec 6px, #008eec 12px) no-repeat left top/5px 100%;
}

:deep(.el-card__header) {
  border-bottom: none;
  color: #fff;
  padding: 0;
}

:deep(.box-card .el-card__body) {
  height: calc(100% - 62px);
  margin: 0 5px;
  padding: 0 5px;
  overflow: hidden;
  overflow-y: auto;
}

:deep(.current-airport>.el-card__body>.el-card:first-child) {
  border-color: #fe0;
}

.bs-tit {
  $bs-tit-bgcolor: #51b893;

  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  font-size: 18px;
  text-shadow: 0 0 3px #333;
  background: linear-gradient(135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat 10px calc(50% + 10px)/10px 10px, repeating-linear-gradient(45deg, $bs-tit-bgcolor, $bs-tit-bgcolor 3px, transparent 3px, transparent 6px) no-repeat 2em calc(50% + 10px)/calc(100% - 2.625em) 10px;
  color: #fff;

  span {
    display: block;
    line-height: 48px;
    padding: 0 1em 0 calc(1em + 10px);
    background: linear-gradient(-135deg, transparent, transparent 50%, $bs-tit-bgcolor 50%, $bs-tit-bgcolor) no-repeat right calc(50% + 10px)/10px 10px, linear-gradient($bs-tit-bgcolor, $bs-tit-bgcolor) no-repeat 20px calc(50% + 10px)/calc(100% - 30px) 10px;
  }

  span em {
    font-style: normal;
    padding: 0 0.5em;
    font-size: 20px;
    font-weight: bold;
  }

  span em.badge {
    font-style: normal;
    padding: 0 0.5em;
    background: #f05a65;
    border-radius: 14px;
    font-size: 14px;
    font-weight: normal;
    margin: 0 0.5em;
  }
}

:deep(.el-card) {
  background: none;
}
</style>
