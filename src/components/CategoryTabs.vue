<template>
  <div class="category-tabs" :class="{ 'wrap-mode': isWrap }" :style="{ padding: paddingNum + 'px', background: bgColor,paddingBottom: paddingNumBottom + 'px' }">
    <div 
      v-for="(tab, index) in tabs" 
      :key="index"
      class="tab-item"
      :class="{ active: modelValue === index }"
      @click="handleSelect(tab,index)"
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
  },
  paddingNum: {
    type: Number,
    default: 12
  },
  paddingNumBottom: {
    type: Number,
    default: 12
  },
  bgColor: {
    type: String,
    default: 'var(--bg-card)'
  },
  isWrap: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleSelect = (tab,index) => {
  emit('update:modelValue', index)
  emit('change', tab)
}
</script>

<style scoped>
.category-tabs {
  display: flex;
  gap: 0 12px;
  padding: 12px 16px;
  overflow-x: auto;
  background: var(--bg-card);
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

/* 换行模式 */
.category-tabs.wrap-mode {
  flex-wrap: wrap;
  overflow-x: visible;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px 16px;
}

.wrap-mode .tab-item {
  flex: none;
  width: 100%;
  margin-bottom: 0;
}

.tab-item {
  flex: 0 0 112px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  cursor: pointer;
  font-size: var(--font-sm);
  color: var(--text-secondary);
  border: 1px solid transparent;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.08);
  border-radius: 22px 22px 22px 22px;
  font-weight: bold;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-item:active {
  transform: scale(0.96);
}

.tab-item.active {
  color: var(--text-white);
  background: #FF3957;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.08);
  border-radius: 22px 22px 22px 22px;
}

.tab-icon {
  font-size: 14px;
  display: flex;
  justify-content: center;
}

.tab-icon-image {
  width: 17px;
  height: 17px;
  object-fit: contain;
}
</style>