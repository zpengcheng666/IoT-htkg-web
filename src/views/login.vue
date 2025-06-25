<!--
 * @Description:登录页
 * @Version: 1.0
 * @Autor: Jiang Wei
 * @Date: 2024-03-13 08:55:45
 * @LastEditors: Jiang Wei
 * @LastEditTime: 2024-03-19 14:34:19
-->

<script lang="ts" setup name="Login">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import pageBg from '@/assets/images/page-bg.jpg'
const bgStyle = reactive({
  backgroundImage: `url(${pageBg})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
})

// 引入路由
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const title = import.meta.env.VITE_APP_TITLE

// 表单类型，login 登录，reset 重置密码
const formType = ref('login')
const loading = ref(false)
const passwordType = ref('password')

// 登录
const loginFormRef = ref<FormInstance>()
const loginPasswordRef = ref<HTMLElement>()
const loginForm = ref({
  username: localStorage.login_username || '',
  password: localStorage.login_password || '',
  remember: !!localStorage.login_username,
})
const loginRules = ref<FormRules>({
  username: [
    { required: true, trigger: 'blur', message: '请输入用户名' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' },
  ],
})
function handleLogin() {
  loginFormRef.value && loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      userStore.login(loginForm.value).then(() => {
        window.console.log('666666')

        loading.value = false
        if (loginForm.value.remember) {
          localStorage.setItem('login_username', loginForm.value.username)
          localStorage.setItem('login_password', loginForm.value.password)
        }
        else {
          localStorage.removeItem('login_username')
          localStorage.removeItem('login_password')
        }
        sessionStorage.setItem('modeSwitch', 'normal')

        ElMessage({
          type: 'success',
          message: '登录成功！',
          center: true,
          duration: 1000,
        })
        router.push({
          name: 'home',
        })
      }).catch(() => {
        loading.value = false
      })
    }
  })
}

onMounted(() => {
  // 失去token返回时提示
  if (route.query.isLoseToken === 'true') {
    ElMessage({
      message: '登录失效，请重新登录',
      type: 'error',
    })
  }
})
</script>

<template>
  <div>
    <div class="bg-banner" :style="bgStyle" />
    <div id="login-box">
      <el-form
        v-show="formType === 'login'" ref="loginFormRef" :model="loginForm" :rules="loginRules"
        class="login-form" autocomplete="on"
      >
        <div class="title-container">
          <h3 class="title">
            {{ title }}
          </h3>
        </div>
        <div>
          <el-form-item prop="username">
            <el-input ref="name" v-model="loginForm.username" placeholder="用户名" text tabindex="1" autocomplete="on">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="loginPasswordRef" v-model="loginForm.password" :type="passwordType" placeholder="密码"
              tabindex="2" autocomplete="on" @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="flex-bar">
          <el-checkbox v-model="loginForm.remember">
            记住密码
          </el-checkbox>
        </div>
        <div :loading="loading" class="login-btn" @click.prevent="handleLogin">
          登录
        </div>
      </el-form>
    </div>
    <Copyright />
  </div>
</template>

<style lang="scss" scoped>
:deep(input[type="password"]::-ms-reveal) {
  display: none;
}

.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
}

#login-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: raba(0, 0, 0, 0.75);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow);

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 400px;
    width: 640px;
    padding: 50px 40px;
    overflow: hidden;

    .title-container {
      position: relative;
      text-align: center;

      .title {
        font-size: 1.3em;
        color: #0e7052;
        margin: 0 auto 30px;
        font-weight: bold;
      }
    }
  }

  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      height: 48px;
      line-height: inherit;
      width: 100%;

      input {
        height: 48px;
      }

      .el-input__prefix,
      .el-input__suffix {
        display: flex;
        align-items: center;
      }

      .el-input__prefix {
        left: 10px;
      }

      .el-input__suffix {
        right: 10px;
      }
    }
  }

  .flex-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    :deep(.el-checkbox) {
      height: 48px;
      line-height: inherit;
      width: 100%;

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #0e7052;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #0e7052;
        border-color: #0e7052;
      }

      .el-checkbox__inner:hover {
        color: #0e7052 !important;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 44px;
    line-height: 44px;
    background: #0e7052;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 400;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}
</style>
