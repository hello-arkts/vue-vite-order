import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdvertisementStore = defineStore('advertisement', () => {
  const currentAd = ref(null)

  const setCurrentAd = (ad) => {
    currentAd.value = ad
  }

  const clearCurrentAd = () => {
    currentAd.value = null
  }

  return {
    currentAd,
    setCurrentAd,
    clearCurrentAd
  }
})