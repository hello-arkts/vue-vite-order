<template>
  <div class="category-tabs">
    <div 
      v-for="(tab, index) in tabs" 
      :key="index"
      class="tab-item"
      :class="{ active: modelValue === index }"
      @click="handleSelect(index)"
    >
      <span class="tab-icon" v-if="tab.icon">
        <img :src="tab.icon" class="tab-icon-image" />
      </span>
      <span class="tab-name">{{ tab.name }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const handleSelect = (index) => {
  emit('update:modelValue', index)
}
</script>

<style scoped>
.category-tabs {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  overflow-x: auto;
  background: var(--bg-card);
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-page);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: var(--font-sm);
  color: var(--text-secondary);
  border: 1px solid transparent;
}

.tab-item:active {
  transform: scale(0.96);
}

.tab-item.active {
  background: var(--primary-red-light);
  color: var(--primary-red);
  border-color: var(--primary-red-border);
}

.tab-icon {
  font-size: 14px;
  display: flex;
  justify-content: center;
}

.tab-icon-image {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.tab-name {
  font-weight: 500;
}
</style>