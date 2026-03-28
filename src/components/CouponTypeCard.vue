<template>
  <el-card 
    class="coupon-type-card" 
    :class="{ active: isActive }"
    shadow="hover"
    @click="handleClick"
  >
    <div class="type-header">
      <span class="type-name">{{ couponType.name }}</span>
      <span class="type-value">฿{{ couponType.value }}</span>
    </div>
    <div class="type-desc">{{ couponType.description }}</div>
    <div class="type-expire">
      <span class="expire-label">有效期</span>
      <span class="expire-date">{{ couponType.expireDate }}</span>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({
  couponType: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.couponType)
}
</script>

<style scoped>
.coupon-type-card {
  min-width: 140px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.coupon-type-card :deep(.el-card__body) {
  padding: 12px;
}

.coupon-type-card:active {
  transform: scale(0.97);
}

.coupon-type-card.active {
  border-color: var(--primary-red);
  background: var(--primary-red-light);
}

.type-header {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.type-name {
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.type-value {
  font-size: var(--font-lg);
  color: var(--text-primary);
  font-weight: 700;
}

.coupon-type-card.active .type-value {
  color: var(--primary-red);
}

.type-desc {
  font-size: var(--font-xs);
  color: var(--primary-red);
  margin-bottom: 8px;
}

.type-expire {
  display: flex;
  gap: 4px;
  font-size: var(--font-xs);
  color: var(--text-tertiary);
}

.expire-label {
  opacity: 0.8;
}
</style>
