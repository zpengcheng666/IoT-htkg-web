// 子系统首页
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
</script>

<template>
  <page-main class="main">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="subhome-box">
          <h2>门禁安检子系统</h2>
          <el-row>
            <el-col :span="4">
              <el-icon>
                <Delete />
              </el-icon>
            </el-col>
            <el-col :span="20">
              <p>文字啊</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="subhome-box gray">
          <h2>门禁安检子系统</h2>
          <el-row>
            <el-col :span="4">
              <el-icon>
                <Delete />
              </el-icon>
            </el-col>
            <el-col :span="20">
              <p>文字啊</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </page-main>
</template>

<style lang="scss" scoped>
.subhome-box {
  border: 1px solid #79a49f;
  margin-bottom: 20px;
  height: 160px;

  h2 {
    color: #ffda75;
    font-size: 1rem;
    background: linear-gradient(#ffda75, #ffda75) no-repeat 10px center/6px 20px, linear-gradient(135deg, #008669, #006851 60%, transparent 60%) no-repeat left top/50% 100%;
    padding: 0.75rem 1.5rem;
    margin: 0;
  }

  .el-col:first-child .el-icon {
    margin: 10px 0 0 20px;
    width: 64px;
    height: 64px;
    font-size: 32px;
  }
}

.subhome-box.gray {
  border: 1px solid #ccc;

  h2 {
    background: linear-gradient(#999, #999) no-repeat 10px center/6px 20px, linear-gradient(135deg, #ccc, #ccc 60%, transparent 60%) no-repeat left top/50% 100%;
    color: #999;
  }
}
</style>
