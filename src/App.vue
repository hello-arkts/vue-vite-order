<script setup>
import { ref, watch } from 'vue'
import LoginDrawer from '@/components/LoginDrawer.vue'
import { getLoginDrawerStatus, hideLoginDrawer, emitLoginSuccess } from '@/utils/loginDrawer.js'

const loginDrawerVisible = ref(false)

// 监听全局登录抽屉状态
watch(() => getLoginDrawerStatus(), (newValue) => {
  loginDrawerVisible.value = newValue
}, { immediate: true })

// 监听本地状态变化，同步到全局
watch(loginDrawerVisible, (newValue) => {
  if (!newValue) {
    hideLoginDrawer()
  }
})

// 登录成功处理
const handleLoginSuccess = (data) => {
  // 触发所有等待的回调
  emitLoginSuccess(data)
  // 关闭抽屉
  loginDrawerVisible.value = false
  hideLoginDrawer()
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- 全局登录抽屉 -->
  <LoginDrawer
    v-model="loginDrawerVisible"
    @login-success="handleLoginSuccess"
  />
</template>

<style>
/* 页面切换动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
