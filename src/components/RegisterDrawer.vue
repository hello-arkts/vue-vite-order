<template>
  <el-drawer
    v-model="drawerVisible"
    direction="btt"
    size="60%"
    :show-close="false"
    :with-header="false"
    class="register-drawer"
    style="border-radius: 26px 26px 0 0; background: #FFFFFF;"
  >
    <div class="drawer-content">
      <!-- 返回按钮 -->
      <div v-if="currentStep === 2" class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      
      <!-- 标题 -->
      <div class="register-title">{{ currentStep === 1 ? '注册' : '设置密码' }}</div>
      
      <!-- 第一步：手机号和验证码 -->
      <template v-if="currentStep === 1">
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
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              class="phone-input"
              maxlength="11"
            />
            <img :src="selectedCountry.icon" class="input-icon flag-icon" />
          </div>
        </div>
        
        <!-- 验证码输入 -->
        <div class="input-group">
          <div class="code-input-wrapper">
            <img src="../assets/icons/mima.svg" class="input-icon code-left-icon" />
            <el-input
              v-model="registerForm.code"
              placeholder="请输入验证码"
              class="code-input"
              maxlength="6"
            />
            <el-button 
              class="send-code-btn" 
              :disabled="countdown > 0 || !isPhoneValid"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 第二步：设置密码 -->
      <template v-if="currentStep === 2">
        <!-- 密码输入 -->
        <div class="input-group">
          <div class="password-input-wrapper">
            <img src="../assets/icons/mima.svg" class="input-icon password-left-icon" />
            <el-input
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              class="password-input"
            />
            <div class="eye-icon-wrapper" @click="showPassword = !showPassword">
              <img v-if="showPassword" src="../assets/icons/yy.svg" class="eye-icon-img" />
              <img v-else src="../assets/icons/yn.svg" class="eye-icon-img" />
            </div>
          </div>
        </div>
        
        <!-- 确认密码输入 -->
        <div class="input-group">
          <div class="password-input-wrapper">
            <img src="../assets/icons/mima.svg" class="input-icon password-left-icon" />
            <el-input
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              class="password-input"
            />
            <div class="eye-icon-wrapper" @click="showConfirmPassword = !showConfirmPassword">
              <img v-if="showConfirmPassword" src="../assets/icons/yy.svg" class="eye-icon-img" />
              <img v-else src="../assets/icons/yn.svg" class="eye-icon-img" />
            </div>
          </div>
        </div>
        
        <!-- 密码提示 -->
        <div class="password-tips">
          <p>密码应由字母加数字组成，首字母必须大写，长度最少8位</p>
          <p>请妥善保管密码，并避免使用简单密码组合</p>
        </div>
      </template>
      
      <!-- 注册/确定按钮 -->
      <el-button
        type="primary"
        size="large"
        class="register-btn"
        :class="{ 'confirm-btn': currentStep === 2 }"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!canSubmit"
      >
        {{ currentStep === 1 ? '注册' : '确定' }}
      </el-button>
      
      <!-- 切换登录链接 -->
      <div v-if="currentStep === 1" class="switch-login">
        <a href="#" class="switch-login-btn" @click.prevent="switchToLogin">切换登陆</a>
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
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowLeft } from '@element-plus/icons-vue'
import { getCode, register } from '@/api/loginServe.js'
import { countryCodes } from '@/utils/curatedList.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'register-success'])

const drawerVisible = ref(props.modelValue)
const currentStep = ref(1)
const countdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)
let countdownTimer = null

const registerForm = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 默认选中泰国
const selectedCountry = ref(countryCodes.find(c => c.code === '+66') || countryCodes[0])

// 手机号验证
const isPhoneValid = computed(() => {
  const phone = registerForm.value.phone.trim()
  // 泰国手机号：9位数字，以0开头
  if (selectedCountry.value.code === '+66') {
    return /^0\d{9}$/.test(phone)
  }
  // 中国手机号：11位数字，以1开头
  if (selectedCountry.value.code === '+86') {
    return /^1\d{10}$/.test(phone)
  }
  // 美国手机号：10位数字
  if (selectedCountry.value.code === '+1') {
    return /^\d{10}$/.test(phone)
  }
  // 默认至少6位数字
  return /^\d{6,}$/.test(phone)
})

// 密码验证
const isPasswordValid = computed(() => {
  const password = registerForm.value.password
  // 至少8位，首字母大写，包含字母和数字
  return /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
})

// 是否可以提交
const canSubmit = computed(() => {
  if (currentStep.value === 1) {
    return isPhoneValid.value && 
           registerForm.value.code.length >= 4 && 
           agreeTerms.value
  } else {
    return isPasswordValid.value && 
           registerForm.value.password === registerForm.value.confirmPassword &&
           agreeTerms.value
  }
})

// 处理国家选择
const handleCountryChange = (country) => {
  selectedCountry.value = country
  registerForm.value.phone = ''
}

// 发送验证码
const sendCode = async () => {
  if (!isPhoneValid.value) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  
  try {
    loading.value = true
    const response = await getCode({
      phone: selectedCountry.value.code + registerForm.value.phone
    })
    
    if (response.code === 200) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(response.msg || '发送失败，请稍后重试')
    }
  } catch (error) {
    console.error('发送验证码错误:', error)
    ElMessage.error('发送失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 处理提交
const handleSubmit = async () => {
  if (!agreeTerms.value) {
    ElMessage.error('请同意服务协议和隐私政策')
    return
  }
  
  if (currentStep.value === 1) {
    // 验证验证码
    if (registerForm.value.code.length < 4) {
      ElMessage.error('请输入正确的验证码')
      return
    }
    // 进入第二步
    currentStep.value = 2
  } else {
    // 第二步：提交注册
    if (!isPasswordValid.value) {
      ElMessage.error('密码格式不正确')
      return
    }
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
    
    loading.value = true
    try {
      const response = await register({
        phone: selectedCountry.value.code + registerForm.value.phone,
        code: registerForm.value.code,
        password: registerForm.value.password
      })
      
      if (response.code === 200) {
        ElMessage.success('注册成功')
        emit('register-success')
        closeDrawer()
      } else {
        ElMessage.error(response.msg || '注册失败')
      }
    } catch (error) {
      console.error('注册错误:', error)
      ElMessage.error(error.message || '注册失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }
}

// 返回第一步
const goBack = () => {
  currentStep.value = 1
  registerForm.value.password = ''
  registerForm.value.confirmPassword = ''
}

// 切换到登录
const switchToLogin = () => {
  closeDrawer()
  emit('switch-login')
}

// 关闭抽屉并重置
const closeDrawer = () => {
  drawerVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  currentStep.value = 1
  registerForm.value = {
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  }
  agreeTerms.value = false
  showPassword.value = false
  showConfirmPassword.value = false
  countdown.value = 0
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
}

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  drawerVisible.value = newValue
  if (newValue) {
    resetForm()
  }
})

// 监听drawerVisible变化，通知父组件
watch(drawerVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// 组件卸载时清除定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.register-drawer {
  padding: 0;
}

.drawer-content {
  padding: 32px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 32px;
  left: 24px;
  cursor: pointer;
  font-size: 20px;
  color: #333333;
  z-index: 10;
}

.register-title {
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

.code-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 0 12px;
  height: 50px;
  background: #FFFFFF;
}

.code-left-icon {
  margin-right: 8px;
}

.code-input {
  flex: 1;
}

.code-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
}

.code-input :deep(.el-input__inner) {
  font-size: 14px;
  color: #333333;
}

.code-input :deep(.el-input__inner::placeholder) {
  color: #999999;
}

.send-code-btn {
  min-width: 90px;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  color: #E53935;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-code-btn:disabled {
  color: #999999;
  cursor: not-allowed;
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

.eye-icon-wrapper {
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon-img {
  width: 20px;
  height: 20px;
}

.password-tips {
  margin: 16px 0 24px;
  padding: 0 4px;
}

.password-tips p {
  font-size: 12px;
  color: #999999;
  line-height: 1.6;
  margin: 0;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #F5F5F5;
  border: none;
  border-radius: 24px;
  margin-top: 16px;
  margin-bottom: 24px;
  color: #999999;
}

.register-btn:not(:disabled) {
  background: linear-gradient(135deg, #FF6B6B 0%, #E53935 100%);
  color: #FFFFFF;
}

.register-btn:not(:disabled):hover {
  opacity: 0.9;
}

.confirm-btn {
  margin-top: 32px;
}

.switch-login {
  text-align: right;
  margin-bottom: 32px;
}

.switch-login-btn {
  font-size: 14px;
  color: #409EFF;
  text-decoration: none;
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
  
  .back-btn {
    top: 40px;
    left: 32px;
  }
  
  .register-title {
    font-size: 22px;
    margin-bottom: 48px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .register-btn {
    height: 52px;
    font-size: 18px;
  }
}
</style>
