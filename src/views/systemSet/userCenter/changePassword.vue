<!--
 * @Description:修改密码
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-19 09:36:55
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 15:49:41
-->
<script  lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import api from '@/api'
const formSize = ref('default') as any
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  oldPwd: '',
  newPwd1: '',
  newPwd2: '',
})

// 修改密码提交
function submitChangePassword() {
  api.post('system/baseUser/changePwd', ruleForm).then((res: any) => {
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.message,
      })
    }
    else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((error) => {
    window.console.log(error)
  })
}
</script>

<template>
  <div>
    <page-main class="pageBox">
      <!-- 个人设置 -->
      <el-row>
        <el-col :span="8" :offset="8">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            :size="formSize"
          >
            <el-form-item
              label="原密码：" prop="oldPwd"
              :rules="[
                { required: true, message: '', trigger: 'blur' },
                { min: 6, max: 12, message: '', trigger: 'blur' },
              ]"
            >
              <el-input v-model="ruleForm.oldPwd" type="password" />
            </el-form-item>
            <el-form-item
              label="新密码：" prop="newPwd1" :rules="[
                { required: true, message: '', trigger: 'blur' },
                { min: 6, max: 16, message: '密码必须6-16位', trigger: 'blur' },
              ]"
            >
              <el-input v-model="ruleForm.newPwd1" type="password" />
            </el-form-item>
            <el-form-item
              label="确认密码：" prop="newPwd2" :rules="[
                { required: true, message: '', trigger: 'blur' },
                { min: 6, max: 16, message: '密码必须6-16位', trigger: 'blur' },
              ]"
            >
              <el-input v-model="ruleForm.newPwd2" type="password" />
            </el-form-item>
          </el-form>
          <el-col :span="24" style="text-align: center;">
            <el-button type="info" plain>
              取消
            </el-button>
            <el-button color="#2a9e88" @click="submitChangePassword">
              确认修改
            </el-button>
          </el-col>
        </el-col>
      </el-row>
    </page-main>
  </div>
</template>
