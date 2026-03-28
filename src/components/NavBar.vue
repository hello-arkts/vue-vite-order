<template>
  <div class="nav-bar">
    <div class="nav-left" @click="handleBack">
      <el-icon :size="20"><ArrowLeft /></el-icon>
    </div>
    <div class="nav-title">{{ title }}</div>
    <div class="nav-right">
      <slot name="right">
        <el-button v-if="showShare" size="small" @click="handleShare">分享</el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showShare: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['share'])
const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleShare = () => {
  emit('share')
}
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: var(--bg-card);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  width: 60px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-primary);
}

.nav-left:hover {
  color: var(--el-color-primary);
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
}

.nav-right {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* ============ 响应式设计 ============ */

/* 平板端 (768px+) */
@media (min-width: 768px) {
  .nav-bar {
    height: 52px;
    padding: 0 24px;
  }
  
  .nav-left {
    width: 80px;
  }
  
  .nav-left :deep(.el-icon) {
    font-size: 24px;
  }
  
  .nav-right {
    width: 80px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .nav-bar {
    height: 48px;
    padding: 0 20px;
  }
  
  .nav-left {
    width: 70px;
  }
  
  .nav-right {
    width: 70px;
  }
}
</style>
