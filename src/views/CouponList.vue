<template>
  <div class="coupon-list-page">
    <!-- 固定顶部区域 -->
    <div class="fixed-header">
      <!-- 顶部导航 -->
      <NavBar title="精选优惠" />

      <!-- 分类标签 -->
      <CategoryTabs
          v-model="activeCategory"
          @change="setCouponDetail"
          :tabs="categories"
          :paddingNum="17"
          bgColor="var(--bg-transparent)"
      />
    </div>

    <!-- 优惠券列表 -->
    <div class="coupon-content">
      <div class="coupon-grid">
        <CouponCard
          v-for="(coupon, index) in filteredCoupons"
          :key="coupon.id"
          :coupon="coupon"
          :index="index"
          @click="goToCouponDetail"
        />
      </div>

      <!-- 空状态 -->
      <el-empty v-if="filteredCoupons.length === 0" description="暂无优惠券" />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import CouponCard from '../components/CouponCard.vue'
import { categories } from '../unit/curatedList.js'
import {getCouponList} from "@/api/index.js";

const activeCategory = ref(0)

const filteredCoupons = ref([])

const setCouponDetail = (tab) => {
  getCouponLists(tab.id)
}

const getCouponLists = async (type = 1) => {
  try {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('pageNum', 1)
    formData.append('pageSize', 999)
    const response = await getCouponList(formData)
    if (response.code === 200) {
      filteredCoupons.value = response.data.list || []
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
  }
}

onMounted(() => {
    getCouponLists()
 })
</script>

<style scoped>
.coupon-list-page {
  min-height: 100vh;
  background: #FBF9ED;
}

/* 固定顶部区域 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #FBF9ED;
  max-width: 430px;
  margin: 0 auto;
}

.coupon-content {
  padding: 0 16px;
  padding-top: 118px; /* 预留固定头部的高度 */
  min-height: calc(100vh - 100px);
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 加载动画 - 通过CSS变量控制延迟，由CouponCard组件应用 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 响应式设计 ============ */

/* 平板端 (768px+) */
@media (min-width: 768px) {
  .fixed-header {
    max-width: 720px;
  }
  
  .coupon-content {
    padding: 20px 24px;
    padding-top: 160px;
  }
  
  .coupon-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .fixed-header {
    max-width: 480px;
  }
  
  .coupon-content {
    padding: 20px;
    padding-top: 150px;
  }
  
  .coupon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
