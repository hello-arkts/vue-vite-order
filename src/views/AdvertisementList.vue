<template>
  <div class="party-page">
    <NavBar title="返回" />
    <div class="party-page-container">
      
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { onMounted, ref } from 'vue'
import { getAdvertisementList } from '@/api/index.js'

const addAdvertisementList = ref([])

const getAdvertisementListData = async () => {
const res = await getAdvertisementList()
  if (res.code === 200) {
    addAdvertisementList.value = res.data
  }
}

onMounted( () => {
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

.party-page-container {
  padding:8px 16px;
  display: flex;
  flex: 1;
}

</style>