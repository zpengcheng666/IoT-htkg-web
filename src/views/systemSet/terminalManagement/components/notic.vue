/* stylelint-disable scss/operator-no-unspaced */
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
    <el-card class="box-card">
      <template #header>
        <div class="card-header bs-tit">
          <span>通知公告</span>
        </div>
      </template>
      <vue3-seamless-scroll v-if="props.infoData.length > 0 " :limit-scroll-num="3" step="0.5" class="list_box" :list="props.infoData">
        <div v-for="notice in props.infoData.length > 4 ? props.infoData : props.infoData.slice(0, 4)" v-show="props.infoData.length > 0" :key="notice.id" class="text item notice">
          <div>
            <h3>{{ notice.title }}</h3>
            <p>{{ notice.content }}</p>
          </div>
          <p class="notice-time">
            {{ notice.publishTime }}
          </p>
        </div>
      </vue3-seamless-scroll>
      <div v-show="props.infoData.length === 0" style="width: 100%;height: 100%;">
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
  border: none;
  border-radius: 0;
  height: 100%;
}

.list_box {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
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

.notice {
  border-bottom: 1px dashed #fff;
  padding: 0.85rem;
  color: #fff;
  display: flex;
  align-items: flex-end;
  gap: 20px;

  >div {
    flex: 1;
  }

  h3 {
    margin: 0;
    padding: 0;
    font-size: 18px;
  }

  p {
    margin: 0;
    padding: 0;
    line-height: 1.75;
    font-size: 16px;
  }

  p.notice-time {
    text-align: right;
    font-size: 12px;
    color: #e3e3e3;
  }
}

.bs-tit {
  $bs-tit-bgcolor: #51b893; /* #0d619b */

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
