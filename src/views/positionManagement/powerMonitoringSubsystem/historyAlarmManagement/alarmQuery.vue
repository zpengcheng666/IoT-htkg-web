<route lang="yaml">
name: personalSetting
meta:
  title: 报警查询
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
      电力报警查询
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
</style>

