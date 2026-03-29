<template>
  <el-drawer
    v-model="drawerVisible"
    direction="btt"
    size="60%"
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
          <el-dropdown trigger="click" @command="handleCountryChange" class="country-dropdown">
            <div class="country-code">
              <span class="code">{{ selectedCountry.code }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="country in countryCodes" 
                  :key="country.code" 
                  :command="country"
                  class="country-dropdown-item"
                >
                  <img :src="country.icon" class="dropdown-flag-icon" />
                  <span class="dropdown-country-name">{{ country.name }}</span>
                  <span class="dropdown-country-code">{{ country.code }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-input
            v-model="loginForm.phone"
            placeholder="062 229 3340"
            class="phone-input"
          />
          <img :src="selectedCountry.icon" class="input-icon flag-icon" />
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
            <img v-if="showPassword" src="../assets/icons/yy.svg" class="eye-icon" />
            <img v-if="!showPassword" src="../assets/icons/yn.svg" class="eye-icon" />
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
        没有账号？ <a href="#" class="register-btn" @click.prevent="goToRegister">立即注册</a>
      </div>
      
      <!-- 服务协议 -->
      <div class="agreement" v-if="false">
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
import { countryCodes } from '@/utils/curatedList.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login-success', 'switch-register'])

const drawerVisible = ref(props.modelValue)
const loginForm = ref({
  phone: '',
  password: ''
})
const showPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

// 默认选中泰国
const selectedCountry = ref(countryCodes.find(c => c.code === '+66') || countryCodes[0])

// 处理国家选择
const handleCountryChange = (country) => {
  selectedCountry.value = country
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  drawerVisible.value = newValue
})

// 监听drawerVisible变化，通知父组件
watch(drawerVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// 跳转到注册
const goToRegister = () => {
  drawerVisible.value = false
  emit('switch-register')
}

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

.country-dropdown {
  cursor: pointer;
}

.country-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  width: 60px;
  padding-right: 8px;
  border-right: 1px solid #E5E5E5;
  margin-right: 8px;
}

.country-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  min-width: 160px;
}

.dropdown-flag-icon {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
}

.dropdown-country-name {
  flex: 1;
  font-size: 14px;
  color: #333333;
}

.dropdown-country-code {
  font-size: 14px;
  color: #999999;
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
  width: 40px;
  height: 40px;
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