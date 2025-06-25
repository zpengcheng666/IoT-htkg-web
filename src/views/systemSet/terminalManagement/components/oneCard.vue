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
const lists = reactive(props.infoData[0]) as any || {}
console.log(lists);

</script>

<template>
  <div class="common-layout">
    <div class="box-card-child-img">
      <el-image class="img-header" :src="lists.perDept?lists.perDept:noData" fit="" />
    </div>
    <div>
      <div class="box-card-child-info">
        <div class="count-down">
          单位： {{ lists.perDept ? lists.perDept : '--' }}
        </div>
      </div>
      <div class="box-card-child-info">
        <div class="count-down">
          姓名： {{ lists.perName ? lists.perName : '--' }}
        </div>
      </div>
      <div class="box-card-child-info">
        <div class="count-down">
          职务： {{ lists.perTitle ? lists.perTitle : '--' }}
        </div>
      </div>
      <div class="box-card-child-info">
        <div class="count-down">
          卡号：{{ lists.cardCode ? lists.cardCode : '--' }}
        </div>
      </div>
    </div>
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
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.count-down {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.box-card-child-img {
  width: 25%;
  margin: 0 auto;

  .img-header {
    width: 100%;
  }
}

.box-card-child-info {
  text-align: center;
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

  /* #0d619b */

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
