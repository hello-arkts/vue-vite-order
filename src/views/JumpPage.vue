<template>
  <div class="jump-page">
    <NavBar title="返回" @click="handleClick" />
    <div class="jump-page-container">
      <div class='jump-page-content'>
        <p class="note-text">{{ currentAd?.note || advertisementStore.applyUrl }}</p>
      </div>
      <div class="jump-page-btn-group">
        <el-button
            type="primary"
            class="nav-btn"
            @click="handleApplyClick"
            v-if="advertisementStore.selfApplyStatus">
          自行申请
        </el-button>
        <el-button type="primary" class="nav-btn" @click="contactDrawerVisible = true">联系客服</el-button>
      </div>
    </div>

    <DraggableDrawer
      v-model="contactDrawerVisible"
      initial-size="70%"
    >
      <div class="contact-drawer-content">
        <div class="qrcode-section">
          <img src="../assets/icons/wexin.png" alt="客服二维码" class="qrcode-canvas" draggable="true">
          <p class="qrcode-tip">长按保存到手机</p>
        </div>
      </div>
    </DraggableDrawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from "@/components/NavBar.vue";
import DraggableDrawer from '@/components/DraggableDrawer.vue';
import { useAdvertisementStore } from '@/store/advertisement.js';

const advertisementStore = useAdvertisementStore()
const currentAd = advertisementStore.currentAd
const contactDrawerVisible = ref(false)

// 自行申请点击事件
const handleApplyClick = () => {
  window.open(advertisementStore.applyUrl, '_blank')
}

// 返回点击事件
const handleClick = () => {
  advertisementStore.setCurrentAd({})
  advertisementStore.applyUrl = ''
  advertisementStore.selfApplyStatus = false
}

</script>

<style scoped>
.jump-page {
  min-height: 100vh;
  background: #FBF9ED;
  display: flex;
  flex-direction: column;
}

.jump-page-container {
  padding:8px 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.jump-page-btn-group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-text {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.nav-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-md);
  background: #5668F4;
  border: none;
  margin-bottom: 20px;
  border-radius: 24px;
}

.contact-drawer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.qrcode-canvas {
  width: 260px;
  height: 360px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-tip {
  margin-top: 16px;
  font-size: var(--font-md);
  color: var(--text-secondary);
}

.contact-btn {
  width: 200px;
  height: 44px;
  font-size: var(--font-base);
  background: #5668F4;
  border-radius: 22px;
  border: none;
}
</style>