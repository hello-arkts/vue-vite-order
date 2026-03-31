<template>
  <div class="jump-page">
    <NavBar title="返回" @click="handleClick" />
    <div class="jump-page-container">
      <div class='jump-page-content'>
        <p class="note-text">{{ currentAd?.note }}</p>
      </div>
      <div class="jump-page-btn-group">
        <el-button type="primary" class="nav-btn" @click="contactDrawerVisible = true">联系客服</el-button>
      </div>
    </div>

    <DraggableDrawer
      v-model="contactDrawerVisible"
      initial-size="60%"
    >
      <div class="contact-drawer-content">
        <div class="qrcode-section">
          <canvas ref="qrCanvas" class="qrcode-canvas"></canvas>
          <p class="qrcode-tip">长按保存到手机</p>
        </div>
      </div>
    </DraggableDrawer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import NavBar from "@/components/NavBar.vue";
import DraggableDrawer from '@/components/DraggableDrawer.vue';
import QRCode from 'qrcode'
import { useAdvertisementStore } from '@/store/advertisement.js';

const advertisementStore = useAdvertisementStore()
const currentAd = advertisementStore.currentAd
const contactDrawerVisible = ref(false)
const qrCanvas = ref(null)

const wechatWorkUrl = 'https://work.weixin.qq.com/wework_admin/join?vcode=76ed8f937061301e880d9b749eef32fe&r=futureentrance_wqq'

const generateQrCode = async () => {
  await nextTick()
  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, wechatWorkUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
    }
  }
}

const handleClick = () => {
  advertisementStore.setCurrentAd({})
}

watch(contactDrawerVisible, (val) => {
  if (val) {
    setTimeout(() => {
      generateQrCode()
    }, 100)
  }
})
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
  width: 250px;
  height: 48px;
  font-size: var(--font-md);
  background: #5668F4;
  border-radius: 25px 25px 25px 25px;
  border: none;
  margin-bottom: 20px;
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