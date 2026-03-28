<template>
  <div class="home-page">
    <!-- 顶部用户区域 -->
    <div class="header-section">
      <div class="user-info">
        <el-avatar :size="48" class="user-avatar">
          U
        </el-avatar>
        <el-button round size="small" class="lottery-btn">
          <el-icon><Present /></el-icon>
          抽奖
        </el-button>
      </div>
    </div>

    <!-- 快速通关区域 -->
    <el-card class="quick-section" shadow="hover">
      <div class="section-header">
        <span class="section-title">快速通关</span>
        <el-tag type="warning" effect="dark" round>ROE行程客户免费</el-tag>
      </div>
      <div class="quick-cards">
        <div class="quick-card" v-for="card in quickCards" :key="card.title">
          <span class="card-icon">{{ card.icon }}</span>
          <div class="card-content">
            <div class="card-title">{{ card.title }} <el-icon><TopRight /></el-icon></div>
            <div class="card-desc">{{ card.desc }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 活动Banner -->
    <div class="banner-section">
      <div class="banner">
        <div class="banner-left">
          <span class="banner-flag">🏳️‍🌈</span>
          <span class="banner-title">派对旅行 | ROE Pride Season 2026</span>
        </div>
        <el-icon><Calendar /></el-icon>
      </div>
      <div class="banner-tags">
        <span>全5星住宿出行</span>
        <el-divider direction="vertical" />
        <span>热门精选活动</span>
        <el-divider direction="vertical" />
        <span>全程无购物</span>
        <el-divider direction="vertical" />
        <span>更多福利保障</span>
      </div>
    </div>

    <!-- 精选优惠区域 -->
    <el-card class="coupon-section" shadow="never">
      <div class="section-header">
        <span class="section-title">精选优惠</span>
        <el-button text type="primary" @click="goToCouponList">
          查看所有<el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <!-- 分类标签 -->
      <CategoryTabs 
        v-model="activeCategory" 
        :tabs="categories" 
      />

      <!-- 优惠券列表 -->
      <div class="coupon-grid">
        <CouponCard 
          v-for="coupon in filteredCoupons" 
          :key="coupon.id"
          :coupon="coupon"
          @click="goToCouponDetail"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Present, TopRight, Calendar, ArrowRight } from '@element-plus/icons-vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import CouponCard from '../components/CouponCard.vue'

const router = useRouter()
const activeCategory = ref(0)

const quickCards = [
  { icon: '📋', title: '入境卡申请', desc: '温馨提示：入境必须' },
  { icon: '🎫', title: '海关VIP通道', desc: '无需等待' },
  { icon: '📱', title: '泰国电信卡', desc: 'eSim & 实体卡' },
  { icon: '🚗', title: 'VIP接机', desc: '专属服务' }
]

const categories = [
  { name: '网红餐厅', icon: '🍜' },
  { name: '酒店住宿', icon: '🏨' },
  { name: '租车接机', icon: '🚗' },
  { name: '景点门票', icon: '🎫' },
  { name: '热门零食', icon: '🍿' },
  { name: '休闲娱乐', icon: '🎭' }
]

const coupons = ref([
  { id: 1, name: 'Nara Thai Cuisine', discount: '满500减100', category: 0 },
  { id: 2, name: 'KFC Thailand', discount: '满100减10', category: 0 },
  { id: 3, name: 'Bar.Yard', discount: '满500减100', category: 0 },
  { id: 4, name: "McDonald's", discount: '满500减100', category: 0 },
  { id: 5, name: '曼谷希尔顿酒店', discount: '满1000减200', category: 1 },
  { id: 6, name: '芭提雅度假村', discount: '满2000减300', category: 1 },
  { id: 7, name: 'Grab租车', discount: '首单立减50', category: 2 },
  { id: 8, name: '机场接机', discount: '预约9折', category: 2 }
])

const filteredCoupons = computed(() => {
  return coupons.value.filter(c => c.category === activeCategory.value)
})

const goToCouponList = () => {
  router.push('/coupons')
}

const goToCouponDetail = (coupon) => {
  router.push(`/coupon/${coupon.id}`)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-page);
}

/* 顶部区域 */
.header-section {
  background: linear-gradient(180deg, #ffd6d6 0%, #f5f5f5 100%);
  padding: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 20px;
  font-weight: 600;
  border: 2px solid white;
}

.lottery-btn {
  background: white;
  box-shadow: var(--shadow-card);
}

/* 快速通关 */
.quick-section {
  margin: -20px 16px 16px;
  border-radius: var(--radius-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-card:hover {
  background: #eee;
}

.quick-card:active {
  transform: scale(0.98);
}

.card-icon {
  font-size: 20px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 2px;
}

.card-desc {
  font-size: var(--font-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* Banner */
.banner-section {
  margin: 0 16px 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  color: white;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.banner-flag {
  font-size: 16px;
}

.banner-title {
  font-size: var(--font-sm);
  font-weight: 600;
}

.banner-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-xs);
  opacity: 0.9;
  flex-wrap: wrap;
}

.banner-tags :deep(.el-divider) {
  border-color: rgba(255, 255, 255, 0.5);
}

/* 精选优惠 */
.coupon-section {
  margin: 0 16px 16px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.coupon-section :deep(.el-card__body) {
  padding: 16px 0 16px;
}

.coupon-section .section-header {
  padding: 0 16px;
}

.coupon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}
</style>
