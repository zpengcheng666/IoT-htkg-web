<route lang="yaml">
name: personalSetting
meta:
  title: 阵地管理系统页面
  cache: personal-edit.password
          </route>

<script lang="ts" setup name="PersonalSetting">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
</script>

<template>
  <div>
    <page-main class="pageBox">
      电能统计
    </page-main>
  </div>
</template>

 <style lang="scss" scoped>
.pageBox{

}
</style>

