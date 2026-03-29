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
      <div class="login-title">登录</div>
      
      <!-- 手机号输入 -->
      <div class="input-group">
        <div class="phone-input-wrapper">
          <div class="country-code">
            <span class="code">+66</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            class="phone-input"
          >
            <template #prefix>
              <img src="../assets/icons/ch.svg" class="phone-icon" />
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 密码输入 -->
      <div class="input-group">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          class="password-input"
          :show-password="showPassword"
        >
          <template #prefix>
            <img src="../assets/icons/fx.svg" class="password-icon" />
          </template>
        </el-input>
      </div>
      
      <!-- 记住密码和忘记密码 -->
      <div class="login-options">
        <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
        <a href="#" class="forgot-password">忘记密码？</a>
      </div>
      
      <!-- 登录按钮 -->
      <el-button
        type="primary"
        size="large"
        class="login-btn"
        @click="handleLogin"
        :loading="loading"
      >
        登录
      </el-button>
      
      <!-- 注册链接 -->
      <div class="register-link">
        没有账号？ <a href="#" class="register-btn">立即注册</a>
      </div>
      
      <!-- 服务协议 -->
      <div class="agreement">
        <el-checkbox v-model="agreeTerms">
          继续即表示您已同意
          <a href="#">《MXCOME服务协议与隐私政策》</a>
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
const rememberPassword = ref(false)
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
      ElMessage.success('登录成功')
      emit('login-success', response.data)
      drawerVisible.value = false
    } else {
      ElMessage.error(response.msg || '登录失败')
    }
  } catch (error) {
    ElMessage.error('登录失败，请稍后重试')
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
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  text-align: center;
  margin-bottom: 32px;
}

.input-group {
  margin-bottom: 20px;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #E4E7ED;
  border-radius: 8px;
  overflow: hidden;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-right: 1px solid #E4E7ED;
  background: #F5F7FA;
  height: 48px;
}

.code {
  font-size: 16px;
  color: #333333;
  font-weight: 500;
}

.phone-input {
  flex: 1;
}

.password-input {
  width: 100%;
  height: 48px;
}

.phone-icon,
.password-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  font-size: 14px;
  color: #5668F4;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: #5668F4;
  border-radius: 24px;
  margin-bottom: 16px;
}

.register-link {
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #606266;
}

.register-btn {
  color: #5668F4;
  text-decoration: none;
  font-weight: 500;
}

.agreement {
  font-size: 12px;
  color: #909399;
  margin-top: auto;
}

.agreement a {
  color: #5668F4;
  text-decoration: none;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .drawer-content {
    padding: 40px 32px;
  }
  
  .login-title {
    font-size: 28px;
    margin-bottom: 40px;
  }
  
  .input-group {
    margin-bottom: 24px;
  }
  
  .login-btn {
    height: 52px;
    font-size: 18px;
  }
}
</style>