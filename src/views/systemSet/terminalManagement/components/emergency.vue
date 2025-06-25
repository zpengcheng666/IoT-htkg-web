<script setup lang='ts'>

const props = defineProps({
  // 详情数据
  infoData: {
    type: Object,
    default() {
      return {}
    },
  },

})

</script>

<template>
  <div class="common-layout">
    <el-card class="box-card">
      <template #header>
        <div class="card-header bs-tit">
          <span>应急信息</span>
        </div>
      </template>
      <el-table
        :data="props.infoData.stageList"
        border
        style="width: 100%; margin-top: 0;"
        default-expand-all
      >

        <el-table-column
          prop="name"
          label="名称"
        />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.box-card {
  border: none;
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
