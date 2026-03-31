<template>
  <Teleport to="body">
    <div v-if="isVisible" class="drawer-overlay" :class="{ 'is-closing': !opened }" @click="closeDrawer">
      <div
        class="drawer-wrapper"
        :style="wrapperStyle"
        @click.stop
      >
        <div class="drawer-container">
          <div class="drag-handle">
            <div
              class="drag-indicator"
              @touchstart="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd"
              @mousedown="onMouseDown"
            >
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

const LONG_PRESS_DURATION = 100
const MOVE_THRESHOLD = 0.5

const emit = defineEmits(['update:modelValue', 'drag-start', 'drag-end', 'height-change'])

const isVisible = ref(props.modelValue)
const opened = ref(false)
const isDragging = ref(false)

let startY = 0
let startHeight = 0
let startTime = 0
let startX = 0
let startYPos = 0
let currentHeight = ref(95)

watch(() => props.modelValue, (val) => {
  if (val) {
    opened.value = false
    currentHeight.value = parseInt(props.initialSize)
    isVisible.value = true
    setTimeout(() => {
      opened.value = true
    }, 10)
  } else {
    opened.value = false
    setTimeout(() => {
      isVisible.value = false
    }, 300)
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

const onTouchStart = (e) => {
  const touch = e.touches[0]
  startTime = Date.now()
  startX = touch.clientX
  startYPos = touch.clientY
  startY = touch.clientY
  startHeight = currentHeight.value
  isDragging.value = false
  document.body.style.overflow = 'hidden'
}

const onMouseDown = (e) => {
  startTime = Date.now()
  startX = e.clientX
  startYPos = e.clientY
  startY = e.clientY
  startHeight = currentHeight.value
  isDragging.value = false

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.overflow = 'hidden'
}

const onMouseMove = (e) => {
  const deltaTime = Date.now() - startTime
  const deltaX = Math.abs(e.clientX - startX)
  const deltaY = Math.abs(e.clientY - startYPos)

  if (!isDragging.value && deltaTime < LONG_PRESS_DURATION) return
  if (!isDragging.value && deltaX < MOVE_THRESHOLD && deltaY < MOVE_THRESHOLD) return

  if (!isDragging.value) {
    isDragging.value = true
    emit('drag-start')
  }

  handleDrag(e.clientY)
}

const onMouseUp = () => {
  const deltaTime = Date.now() - startTime
  const deltaX = Math.abs(event.clientX - startX)
  const deltaY = Math.abs(event.clientY - startYPos)

  if (!isDragging.value && deltaTime < LONG_PRESS_DURATION && deltaX < MOVE_THRESHOLD && deltaY < MOVE_THRESHOLD) {
    closeDrawer()
  }

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
  const touch = e.touches[0]
  const deltaTime = Date.now() - startTime
  const deltaX = Math.abs(touch.clientX - startX)
  const deltaY = Math.abs(touch.clientY - startYPos)

  if (!isDragging.value && deltaTime < LONG_PRESS_DURATION) return
  if (!isDragging.value && deltaX < MOVE_THRESHOLD && deltaY < MOVE_THRESHOLD) return

  if (!isDragging.value) {
    e.preventDefault()
    isDragging.value = true
    emit('drag-start')
  }

  e.preventDefault()
  handleDrag(touch.clientY)
}

const onTouchEnd = (e) => {
  const touch = e.changedTouches[0]
  const deltaTime = Date.now() - startTime
  const deltaX = Math.abs(touch.clientX - startX)
  const deltaY = Math.abs(touch.clientY - startYPos)

  if (!isDragging.value && deltaTime < LONG_PRESS_DURATION && deltaX < MOVE_THRESHOLD && deltaY < MOVE_THRESHOLD) {
    closeDrawer()
  }

  endDrag()
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    emit('drag-end')
  }
  document.body.style.overflow = ''
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
  background: white;
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
  padding: 20px;
}
</style>
