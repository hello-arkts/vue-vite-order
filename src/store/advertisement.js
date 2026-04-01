import { defineStore } from 'pinia'

export const useAdvertisementStore = defineStore('advertisement', {
  state: () => ({
    currentAd: null, // 当前广告
    selfApplyStatus: false, // 自行申请状态
    applyUrl: '', // 申请地址
  }),
  actions: {
    setCurrentAd(ad) {
      this.currentAd = ad
    }
  },
  persist: true,
})