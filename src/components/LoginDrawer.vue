<template>
  <el-drawer
    v-model="drawerVisible"
    direction="btt"
    size="85%"
    :show-close="false"
    :with-header="false"
    class="login-drawer"
    style="border-radius: 26px 26px 0 0; background: #FFFFFF;"
  >
    <div class="drawer-content">
      <!-- 标题 -->
      <div class="login-title">登陆</div>
      
      <!-- 手机号输入 -->
      <div class="input-group">
        <div class="phone-input-wrapper">
          <img src="../assets/icons/Smatphone.svg" class="input-icon phone-left-icon" />
          <div class="country-code">
            <span class="code">+66</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </div>
          <el-input
            v-model="loginForm.phone"
            placeholder="062 229 3340"
            class="phone-input"
          />
          <img src="../assets/icons/red.svg" class="input-icon flag-icon" />
        </div>
      </div>
      
      <!-- 密码输入 -->
      <div class="input-group">
        <div class="password-input-wrapper">
          <img src="../assets/icons/mima.svg" class="input-icon password-left-icon" />
          <el-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="password-input"
          />
          <div class="eye-icon" @click="showPassword = !showPassword">
            <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.5C6.5 4.5 3.5 6.5 2 10C3.5 13.5 6.5 15.5 10 15.5C13.5 15.5 16.5 13.5 18 10C16.5 6.5 13.5 4.5 10 4.5Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="10" cy="10" r="2.5" stroke="#999999" stroke-width="1.5"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.5C6.5 4.5 3.5 6.5 2 10C3.5 13.5 6.5 15.5 10 15.5C13.5 15.5 16.5 13.5 18 10C16.5 6.5 13.5 4.5 10 4.5Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="10" cy="10" r="2.5" stroke="#999999" stroke-width="1.5"/>
              <path d="M3 3L17 17" stroke="#999999" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 登录按钮 -->
      <el-button
        type="primary"
        size="large"
        class="login-btn"
        @click="handleLogin"
        :loading="loading"
      >
        登陆
      </el-button>
      
      <!-- 注册链接 -->
      <div class="register-link">
        没有账号？ <a href="#" class="register-btn">立即注册</a>
      </div>
      
      <!-- 服务协议 -->
      <div class="agreement">
        <el-checkbox v-model="agreeTerms" class="agreement-checkbox">
          <span class="agreement-text">继续即表示您已同意</span>
          <a href="#" class="agreement-link">《MXCOME服务协议与隐私政策》</a>
        </el-checkbox>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { login } from '@/api/loginServe.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login-success'])

const drawerVisible = ref(props.modelValue)
const loginForm = ref({
  phone: '',
  password: ''
})
const showPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  drawerVisible.value = newValue
})

// 监听drawerVisible变化，通知父组件
watch(drawerVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleLogin = async () => {
  // 表单验证
  if (!loginForm.value.phone) {
    ElMessage.error('请输入手机号')
    return
  }

  if (!loginForm.value.password) {
    ElMessage.error('请输入密码')
    return
  }

  if (!agreeTerms.value) {
    ElMessage.error('请同意服务协议和隐私政策')
    return
  }

  loading.value = true

  try {
    const response = await login({
      phone: loginForm.value.phone,
      password: loginForm.value.password
    })

    if (response.code === 200) {
      // 保存 token
      const token = response.data?.token || response.data?.accessToken
      if (token) {
        localStorage.setItem('token', token)
      }

      ElMessage.success('登录成功')
      emit('login-success', response.data)
      drawerVisible.value = false
    } else {
      ElMessage.error(response.msg || response.message || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error(error.message || '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-drawer {
  padding: 0;
}

.drawer-content {
  padding: 32px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.login-title {
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  margin-bottom: 40px;
}

.input-group {
  margin-bottom: 16px;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 0 12px;
  height: 50px;
  background: #FFFFFF;
}

.input-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.phone-left-icon {
  margin-right: 8px;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
  border-right: 1px solid #E5E5E5;
  margin-right: 8px;
}

.code {
  font-size: 14px;
  color: #333333;
  font-weight: 400;
}

.arrow-icon {
  font-size: 12px;
  color: #999999;
}

.phone-input {
  flex: 1;
}

.phone-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
}

.phone-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #333333;
}

.phone-input :deep(.el-input__inner::placeholder) {
  color: #999999;
}

.flag-icon {
  width: 24px;
  height: 16px;
  margin-left: 8px;
}

.password-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 0 12px;
  height: 50px;
  background: #FFFFFF;
}

.password-left-icon {
  margin-right: 8px;
}

.password-input {
  flex: 1;
}

.password-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
}

.password-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #333333;
}

.password-input :deep(.el-input__inner::placeholder) {
  color: #999999;
}

.eye-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #F5F5F5;
  border: none;
  border-radius: 24px;
  margin-top: 32px;
  margin-bottom: 24px;
  color: #999999;
}

.login-btn:hover {
  background: #EEEEEE;
}

.register-link {
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
  color: #666666;
}

.register-btn {
  color: #E53935;
  text-decoration: none;
  font-weight: 500;
}

.agreement {
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #999999;
  padding-left: 4px;
}

.agreement-text {
  color: #999999;
}

.agreement-link {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .drawer-content {
    padding: 40px 32px;
  }
  
  .login-title {
    font-size: 22px;
    margin-bottom: 48px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .login-btn {
    height: 52px;
    font-size: 18px;
    margin-top: 40px;
  }
}
</style>