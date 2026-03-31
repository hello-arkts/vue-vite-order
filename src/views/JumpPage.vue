<template>
  <div class="jump-page">
    <NavBar title="返回" @click="handleClick" />
    <div class="jump-page-container">
      <div class='jump-page-content'>
        <p class="note-text">{{ currentAd?.note }}</p>
      </div>
      <div class="jump-page-btn-group">
        <el-button type="primary" class="nav-btn">联系客服</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { useAdvertisementStore } from '@/store/advertisement.js';

const advertisementStore = useAdvertisementStore()
const currentAd = advertisementStore.currentAd

const handleClick = () => {
  advertisementStore.setCurrentAd({})
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
</style>