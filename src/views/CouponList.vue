<template>
  <div class="coupon-list-page">
    <!-- 顶部导航 -->
    <NavBar title="精选优惠" />

    <!-- 分类标签 -->
    <CategoryTabs 
      v-model="activeCategory" 
      :tabs="categories" 
    />

    <!-- 优惠券列表 -->
    <div class="coupon-content">
      <div class="coupon-grid">
        <CouponCard 
          v-for="coupon in filteredCoupons" 
          :key="coupon.id"
          :coupon="coupon"
          @click="goToCouponDetail"
        />
      </div>

      <!-- 空状态 -->
      <el-empty v-if="filteredCoupons.length === 0" description="暂无优惠券" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import CouponCard from '../components/CouponCard.vue'
import categories from '../unit/curatedList.js'


const router = useRouter()
const activeCategory = ref(0)

// 模拟数据 - 与设计图一致
const coupons = ref([
  { id: 1, name: 'Nara Thai Cuisine', discount: '满500减100', category: 0 },
  { id: 2, name: 'KFC Thailand', discount: '满100减10', category: 0 },
  { id: 3, name: 'Bar.Yard', discount: '满500减100', category: 0 },
  { id: 4, name: "McDonald's", discount: '满500减100', category: 0 },
  { id: 5, name: 'Nara Thai Cuisine', discount: '满500减100', category: 0 },
  { id: 6, name: 'KFC Thailand', discount: '满100减10', category: 0 },
  { id: 7, name: 'Bar.Yard', discount: '满500减100', category: 0 },
  { id: 8, name: "McDonald's", discount: '满500减100', category: 0 },
  { id: 9, name: '曼谷希尔顿酒店', discount: '满1000减200', category: 1 },
  { id: 10, name: '芭提雅度假村', discount: '满2000减300', category: 1 },
  { id: 11, name: 'Grab租车', discount: '首单立减50', category: 2 },
  { id: 12, name: '机场接机服务', discount: '预约9折', category: 2 }
])

const filteredCoupons = computed(() => {
  return coupons.value.filter(c => c.category === activeCategory.value)
})

const goToCouponDetail = (coupon) => {
  router.push(`/coupon/${coupon.id}`)
}
</script>

<style scoped>
.coupon-list-page {
  min-height: 100vh;
  background: var(--bg-card);
}

.coupon-content {
  padding: 16px;
  background: var(--bg-page);
  min-height: calc(100vh - 100px);
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 加载动画 */
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

.coupon-grid > * {
  animation: fadeInUp 0.4s ease forwards;
}

.coupon-grid > *:nth-child(1) { animation-delay: 0.05s; }
.coupon-grid > *:nth-child(2) { animation-delay: 0.1s; }
.coupon-grid > *:nth-child(3) { animation-delay: 0.15s; }
.coupon-grid > *:nth-child(4) { animation-delay: 0.2s; }
.coupon-grid > *:nth-child(5) { animation-delay: 0.25s; }
.coupon-grid > *:nth-child(6) { animation-delay: 0.3s; }
.coupon-grid > *:nth-child(7) { animation-delay: 0.35s; }
.coupon-grid > *:nth-child(8) { animation-delay: 0.4s; }
.coupon-grid > *:nth-child(9) { animation-delay: 0.45s; }
.coupon-grid > *:nth-child(10) { animation-delay: 0.5s; }
.coupon-grid > *:nth-child(11) { animation-delay: 0.55s; }
.coupon-grid > *:nth-child(12) { animation-delay: 0.6s; }

/* ============ 响应式设计 ============ */

/* 平板端 (768px+) */
@media (min-width: 768px) {
  .coupon-content {
    padding: 20px 24px;
  }
  
  .coupon-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .coupon-content {
    padding: 20px;
  }
  
  .coupon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
