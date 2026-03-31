<template>
  <div class="party-page">
    <NavBar title="派对旅行" :padding-bottom="16" />
    <div class="party-page-container">
      <div class="advertisement-list">
        <div
          v-for="item in addAdvertisementList"
          :key="item.id"
          class="advertisement-item"
          @click="handleClick(item)"
        >
          <div class="advertisement-image-wrapper">
            <img :src="item.pic" :alt="item.name" class="advertisement-image" />
            <div class="advertisement-overlay">
              <span class="advertisement-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { onMounted, ref } from 'vue'
import { getAdvertisementList } from '@/api/index.js'
import { useRouter } from "vue-router";
import { useAdvertisementStore } from '@/store/advertisement.js';

const addAdvertisementList = ref([])
const router = useRouter()
const advertisementStore = useAdvertisementStore()

const getAdvertisementListData = async () => {
const res = await getAdvertisementList()
  if (res.code === 200) {
    addAdvertisementList.value = res.data
  }
}

const handleClick = (item) => {
  if (item) {
    advertisementStore.setCurrentAd(item)
    router.push('/jump')
  }
}

onMounted(() => {
  getAdvertisementListData()
})
</script>

<style scoped>
.party-page {
  min-height: 100vh;
  background: #FBF9ED;
  display: flex;
  flex-direction: column;
}

:deep(.nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #FBF9ED;
}

.party-page-container {
  padding: 60px 16px 8px 16px;
  display: flex;
  flex: 1;
}

.advertisement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.advertisement-item {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: #FFE5D0;
}

.advertisement-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.advertisement-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  filter: blur(0);
  transition: filter 0.3s;
}

.advertisement-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 16px 16px 16px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.advertisement-name {
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

</style>