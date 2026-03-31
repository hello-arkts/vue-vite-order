<template>
  <Teleport to="body">
    <div v-if="isVisible" class="drawer-overlay" :class="{ 'is-closing': !opened }" @click="closeDrawer">
      <div
        class="drawer-wrapper"
        :style="wrapperStyle"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @click.stop
      >
        <div class="drawer-container">
          <div class="drag-handle">
             <div class="drag-indicator" @click.stop="closeDrawer">
               <div class="drag-indicator-line"></div>
             </div>
          </div>
          <div class="drawer-content">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import PopupLock from '@/components/PopupLock.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialSize: {
    type: String,
    default: '95%'
  },
  minHeight: {
    type: String,
    default: '30%'
  },
  maxHeight: {
    type: String,
    default: '95%'
  }
})

const emit = defineEmits(['update:modelValue', 'drag-start', 'drag-end', 'height-change'])

const isVisible = ref(props.modelValue)
const opened = ref(false)
const isDragging = ref(false)

let startY = 0
let startHeight = 0
let hasMoved = false
let currentHeight = ref(95)

watch(() => props.modelValue, (val) => {
  isVisible.value = val
  if (val && props.initialSize) {
    currentHeight.value = parseInt(props.initialSize)
    requestAnimationFrame(() => {
      opened.value = true
    })
  } else {
    opened.value = false
  }
})

watch(isVisible, (val) => {
  emit('update:modelValue', val)
})

const wrapperStyle = computed(() => ({
  height: opened.value ? `${currentHeight.value}%` : '0%',
  transition: isDragging.value ? 'none' : 'height 0.3s ease'
}))

const closeDrawer = () => {
  opened.value = false
  setTimeout(() => {
    isVisible.value = false
  }, 300)
}

const getTarget = (e) => {
  const touch = e.touches ? e.touches[0] : e
  return document.elementFromPoint(touch.clientX, touch.clientY)
}

const onTouchStart = (e) => {
  const target = getTarget(e)
  console.log((target.closest('.drag-handle')),'xixi')
  if (target && !(target.closest('.drag-indicator'))) return

  e.preventDefault()
  hasMoved = false
  isDragging.value = true
  startY = e.touches[0].clientY
  startHeight = currentHeight.value
  document.body.style.overflow = 'hidden'
  emit('drag-start')
}

const onMouseDown = (e) => {
  const target = e.target
  if (target && !(target.closest('.drag-indicator'))) return

  hasMoved = false
  isDragging.value = true
  startY = e.clientY
  startHeight = currentHeight.value

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.overflow = 'hidden'
  emit('drag-start')
}

const onMouseMove = (e) => {
  if (!isDragging.value) return
  hasMoved = true
  handleDrag(e.clientY)
}

const onMouseUp = () => {
  endDrag()
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

const handleDrag = (clientY) => {
  if (!isDragging.value) return

  const deltaY = startY - clientY
  const windowHeight = window.innerHeight
  const deltaHeight = (deltaY / windowHeight) * 100

  let newHeight = startHeight + deltaHeight

  const minPercent = parseInt(props.minHeight)
  const maxPercent = parseInt(props.maxHeight)

  newHeight = Math.max(minPercent, Math.min(maxPercent, newHeight))

  currentHeight.value = newHeight
  emit('height-change', currentHeight.value)
}

const onTouchMove = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  hasMoved = true
  handleDrag(e.touches[0].clientY)
}

const onTouchEnd = () => {
  endDrag()
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    hasMoved = false
    document.body.style.overflow = ''
    emit('drag-end')
  }
}

const setHeight = (height) => {
  currentHeight.value = height
}

defineExpose({
  setHeight
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped lang="scss">
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;

  &.is-closing {
    opacity: 0;
  }
}

.drawer-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F9F5F6;
  border-radius: 26px 26px 0 0;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drag-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  z-index: 0;
}

.drag-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 20px;
  border-radius: 4px;
  z-index: 999;
  .drag-indicator-line {
    width: 50px;
    height: 6px;
    border-radius: 4px;
    background: #DDDDDD;
  }
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}
</style>
