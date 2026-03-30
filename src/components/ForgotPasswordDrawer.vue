<template>
  <el-drawer
    v-model="drawerVisible"
    direction="btt"
    size="70%"
    :show-close="false"
    :with-header="false"
    class="forgot-password-drawer"
    style="border-radius: 26px 26px 0 0; background: #FFFFFF;"
  >
    <div class="drawer-content">
      <!-- 标题 -->
      <div class="forgot-title">忘记密码</div>
      
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
            v-model="form.phone"
            placeholder="请输入手机号"
            class="phone-input"
          />
          <img :src="selectedCountry.icon" class="input-icon flag-icon" />
        </div>
      </div>
      
      <!-- 验证码输入 -->
      <div class="input-group">
        <div class="code-input-wrapper">
          <img src="../assets/icons/yzm.svg" class="input-icon code-left-icon" />
          <el-input
            v-model="form.code"
            placeholder="请输入验证码"
            class="code-input"
            maxlength="6"
          />
          <span
            class="send-code-btn"
            :class="{ disabled: countdown > 0 || !isPhoneValid }"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </span>
        </div>
      </div>
      
      <!-- 新密码输入 -->
      <div class="input-group">
        <div class="password-input-wrapper">
          <img src="../assets/icons/mima.svg" class="input-icon password-left-icon" />
          <el-input
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="请输入新密码"
            class="password-input"
          />
          <div class="eye-icon-wrapper" @click="showNewPassword = !showNewPassword">
            <img v-if="showNewPassword" src="../assets/icons/yy.svg" class="eye-icon-img" />
            <img v-else src="../assets/icons/yn.svg" class="eye-icon-img" />
          </div>
        </div>
      </div>
      
      <!-- 确认新密码输入 -->
      <div class="input-group">
        <div class="password-input-wrapper">
          <img src="../assets/icons/mima.svg" class="input-icon password-left-icon" />
          <el-input
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="请再次输入新密码"
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
      
      <!-- 确定按钮 -->
      <el-button
        type="primary"
        size="large"
        class="submit-btn"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!canSubmit"
      >
        确定
      </el-button>
      
      <!-- 切换登录 -->
      <div class="switch-login">
        <a href="#" class="switch-login-btn" @click.prevent="switchToLogin">切换登录</a>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, ArrowLeft } from '@element-plus/icons-vue'
import { getCode, forgotPassword } from '@/api/loginServe.js'
import { countryCodes } from '@/utils/curatedList.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'reset-success', 'switch-login'])

const drawerVisible = ref(props.modelValue)
const countdown = ref(0)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
let countdownTimer = null

const form = ref({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

// 默认选中中国
const selectedCountry = ref(countryCodes.find(c => c.code === '+86') || countryCodes[0])

// 手机号验证
const isPhoneValid = computed(() => {
  const phone = form.value.phone.trim()
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
  const password = form.value.newPassword
  // 至少8位，首字母大写，包含字母和数字
  return /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
})

// 是否可以提交
const canSubmit = computed(() => {
  return isPhoneValid.value && 
         form.value.code.length >= 4 &&
         isPasswordValid.value && 
         form.value.newPassword === form.value.confirmPassword
})

// 处理国家选择
const handleCountryChange = (country) => {
  selectedCountry.value = country
  form.value.phone = ''
}

// 发送验证码
const sendCode = async () => {
  if (!isPhoneValid.value) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  
  if (countdown.value > 0) return
  
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('telephone', form.value.phone)
    formData.append('phoneCode', selectedCountry.value.code)
    const response = await getCode(formData)
    
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
  if (!isPhoneValid.value) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  
  if (form.value.code.length < 4) {
    ElMessage.error('请输入正确的验证码')
    return
  }
  
  if (!isPasswordValid.value) {
    ElMessage.error('密码格式不正确')
    return
  }
  
  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('telephone', form.value.phone)
    formData.append('phoneCode', selectedCountry.value.code)
    formData.append('authCode', form.value.code)
    formData.append('newPassword', form.value.newPassword)

    const response = await forgotPassword(formData)
    
    if (response.code === 200) {
      ElMessage.success('密码重置成功')
      emit('reset-success')
      closeDrawer()
    } else {
      ElMessage.error(response.msg || '密码重置失败')
    }
  } catch (error) {
    console.error('密码重置错误:', error)
    ElMessage.error(error.message || '密码重置失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 关闭抽屉并重置
const closeDrawer = () => {
  drawerVisible.value = false
  resetForm()
}

// 切换到登录
const switchToLogin = () => {
  closeDrawer()
  emit('switch-login')
}

// 重置表单
const resetForm = () => {
  form.value = {
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  }
  showNewPassword.value = false
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
.forgot-password-drawer {
  padding: 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.forgot-title {
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 90px;
  height: 32px;
  font-size: 13px;
  color: #E53935;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-code-btn.disabled {
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
  padding: 4px;
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

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #F5F5F5;
  border: none;
  border-radius: 24px;
  margin-top: 16px;
  color: #999999;
}

.submit-btn:not(:disabled) {
  background: linear-gradient(135deg, #FF6B6B 0%, #E53935 100%);
  color: #FFFFFF;
}

.submit-btn:not(:disabled):hover {
  opacity: 0.9;
}

.switch-login {
  text-align: right;
  margin-top: 16px;
}

.switch-login-btn {
  font-size: 14px;
  color: #409EFF;
  text-decoration: none;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .back-btn {
    top: 40px;
    left: 32px;
  }
  
  .forgot-title {
    font-size: 22px;
    margin-bottom: 48px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .submit-btn {
    height: 52px;
    font-size: 18px;
  }
}
</style>
