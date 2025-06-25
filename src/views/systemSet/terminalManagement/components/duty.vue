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
          <span>值班信息</span>
        </div>
      </template>
      <div v-show="props.infoData.length !== 0" class="info_box">
        <el-carousel :interval="5000" arrow="never" height="210px" indicator-position="none">
          <el-carousel-item v-for="(item, index) in props.infoData" :key="index">
            <div class="card_box">
              <div v-for="(v, i) in item" :key="i" class="duty_card">
                <img>
                <p>值班：{{ v.dutyName }}</p>
                <p>姓名：{{ v.name }}</p>
                <p>岗位：{{ v.dutyPost }}</p>
                <p>{{ v.dutySjd }}</p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
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

.info_box {
  height: 100%;
}

.card_box {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.duty_card {
  position: relative;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  border: solid 2px #e3e3e3;
  border-radius: 10px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(rgb(255 255 255 / 2%), rgb(255 255 255 / 2%)) no-repeat left top/100% 100%;
  box-shadow: 0 0 6px #6666;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -56px;
    left: -50px;
    width: 180%;
    height: 100px;
    border-radius: 100% 0 60% 100%;
    background: rgb(255 255 255 / 5%);
    transform: rotate(-25deg);
  }

  img {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    border-radius: 50%;
    background:
      radial-gradient(#999, #999 50%, transparent 55%, transparent) no-repeat center 10px/28px 28px,
      radial-gradient(#999, #999 50%, transparent 55%, transparent) no-repeat center 30px/48px 64px,
      linear-gradient(rgb(255 255 255 / 50%), rgb(255 255 255 / 50%));
    box-shadow: 0 0 6px #6669;
    margin-bottom: 10px;
  }

  p {
    text-align: left;
    padding: 0 6px;
    margin: 4px 0;
  }
}

.box-card {
  border: none;
  height: 100%;
  border-radius: 0;
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

:deep(.el-table) {
  --el-table-bg-color: none;

  * {
    background: none;
    color: #fff;
    border-color: rgb(255 255 255 / 75%);
  }

  th {
    background: none;
  }
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: transparent;
}

:deep(.el-card) {
  background: none;
  border: none;
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
</style>
