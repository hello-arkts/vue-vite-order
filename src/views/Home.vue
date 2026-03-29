<template>
  <div class="home-page">
    <!-- 顶部用户区域 -->
    <div class="header-section">
      <div class="user-info">
        <el-avatar :size="48" class="user-avatar">
          U
        </el-avatar>
        <div class="user-info-title">
          <img src="../assets/icons/red.svg" alt="抽奖" class="lottery-btn">
          <span class="lottery-text">抽奖</span>
        </div>
      </div>
    </div>

    <!-- 快速通关区域 -->
    <el-card class="quick-section" shadow="never">
      <div class="section-header">
        <span class="section-title">快速通关</span>
        <el-tag effect="dark" class="quick-tag" round>
          <img src="../assets/icons/tag.svg" alt="ROE" class="roe-icon">
          ROE行程客户免费
        </el-tag>
      </div>
      <div class="quick-cards">
        <div class="quick-card" v-for="card in quickCards" :key="card.title">
          <img class="card-icon" :src="card.icon" :alt="card.title" />
          <div class="card-content">
            <div class="card-title">
              <span>{{ card.title }}</span>
              <img src="../assets/icons/fx.svg" alt="arrow-right" style="width: 13px; height: 13px;" />
            </div>
            <div class="card-desc" :style="{ color: card.color }">{{ card.desc }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 活动Banner -->
    <div class="banner-section">
      <div class="banner">
        <div class="banner-left">
          <img src="../assets/icons/ch.svg" alt="flag" style="width: 24px; height: 24px;" />
          <span class="banner-title">派对旅行</span>
          <span class="banner-separator">|</span>
          <span class="banner-title">ROE Pride Season 2026</span>
        </div>
        <img src="../assets/icons/calendar.svg" alt="calendar" style="width: 20px; height: 20px;" />
      </div>
      <el-divider direction="horizontal" class="banner-divider" />
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
      <div class="section-header_bottom">
        <span class="section-title">精选优惠</span>
        <span type="primary" @click="goToCouponList" style="display: flex; align-items: center;">
          <span>
            查看所有
          </span>
          <el-icon><ArrowRight /></el-icon>
        </span>
      </div>

      <!-- 分类标签 -->
      <CategoryTabs
        v-model="activeCategory" 
        @change="setCouponDetail"
        :tabs="categories"
        :paddingNum="0"
        bgColor="var(--bg-transparent)"
        :isWrap="true"
      />

      <!-- 优惠券列表 -->
      <div class="coupon-grid">
        <CouponCard 
          v-for="coupon in filteredCoupons" 
          :key="coupon.id"
          :coupon="coupon"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { Present, TopRight, Calendar, ArrowRight } from '@element-plus/icons-vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import CouponCard from '../components/CouponCard.vue'
import { categories,quickCards } from '../unit/curatedList.js'
import { getCouponList } from '../api/index.js'


const router = useRouter()
const activeCategory = ref(0)

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

const filteredCoupons = ref([])

const getCouponLists = async (type = 0) => {
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



const goToCouponList = () => {
  router.push('/coupons')
}

const setCouponDetail = (tab) => {
  getCouponLists(tab.id)
}

onMounted(() => {
  getCouponLists()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-gradient-yellow);
}

/* 顶部区域 */
.header-section {
  padding: 16px 16px 0;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 48px;
  height: 48px;
  border: 1px solid white;
}
.user-info-title{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .lottery-text{
    font-size:12px;
    font-weight:bold;
  }
}

.lottery-btn {
  width: 28px;
  height: 28px;
}

/* 快速通关 */
.quick-section {
  border: 0;
  margin: 28px 16px;
  border-radius: var(--radius-lg);
  background: transparent;
}
:deep(.el-card__body){
  padding: 0 !important;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-header_bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  text-align: left;
  font-style: normal;
  text-transform: none;
  font-size: var(--radius-lg);
  font-weight: bold;
  color: var(--text-primary);
}

.quick-tag {
  display: flex;
  font-size: 10px;
  .roe-icon{
    width: 13px;
    height: 13px;
    margin-right: 6px ;
  }
}
:deep(.el-tag__content){
  display: flex;
  align-items: center;
}
:deep(.el-tag){
  background: linear-gradient( 90deg, #AE1E26 0%, #FF392B 100%) !important;
  width: 126px;
  height: 21px;
  border: 0px;
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
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.08);
  border-radius: 22px 22px 22px 22px;
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
  font-size: var(--font-base);
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  font-style: normal;
  text-transform: none;
  gap: 8px;
}

.card-desc {
  font-size: var(--font-sm);
  color: var(--text-tertiary);
  margin-top: 4px;
  font-weight: 400;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

/* Banner */
.banner-section {
  margin: 0 16px 0 16px;
  padding: 16px;
  background: linear-gradient( 90deg, #FF6464 0%, #5F0FFF 100%);
  border-radius: 21px 21px 21px 21px;
  color: white;
  .banner-divider {
    margin: 18px 0 12px 0;
    height: 0;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid rgba(255,255,255,0.2);
  }
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

.banner-title {
  font-size: var(--font-md);
  font-weight: bold;
  color: #FFFFFF;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.banner-separator {
  opacity: 0.7;
  font-size: var(--font-sm);
}

.banner-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  opacity: 0.9;
  flex-wrap: wrap;
}

.banner-tags :deep(.el-divider) {
  border-color: rgba(255, 255, 255, 0.5);
}

/* 精选优惠 */
.coupon-section {
  padding: 25px 0 16px ;
  margin: 0 16px 16px;
  border-radius: var(--radius-lg);
  background: transparent;
  border: none;
}

.coupon-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* ============ 响应式设计 ============ */

/* 平板端 (768px+) */
@media (min-width: 768px) {
  .header-section {
    padding: 20px 24px;
  }

  .user-avatar {
    width: 56px !important;
    height: 56px !important;
    font-size: 24px;
  }

  .quick-section {
    margin: 24px 20px;
  }

  .quick-section :deep(.el-card__body) {
    padding: 20px;
  }

  .quick-cards {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .quick-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .card-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .card-title {
    justify-content: center;
  }

  .banner-section {
    margin: 0 24px 20px;
    padding: 20px 24px;
  }

  .coupon-section {
    padding: 25px 0 16px ;
    margin: 0 16px 16px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: transparent;
    border: none;
  }

  .section-header_bottom {
    padding: 0 20px;
    margin-bottom: 16px;
  }

  .coupon-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 0 20px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .header-section {
    padding: 24px;
  }

  .quick-section {
    margin: 28px 16px;
  }

  .quick-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .quick-card {
    flex-direction: row;
    text-align: left;
    padding: 14px;
  }
  :deep(.el-card__body){
    padding: 0;
  }

  .card-icon {
    font-size: 24px;
    margin-bottom: 0;
  }

  .card-title {
    justify-content: flex-start;
  }

  .banner-section {
    margin: 0 20px 20px;
  }

  .coupon-section {
    padding: 25px 0 16px ;
    margin: 0 16px 16px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: transparent;
    border: none;
  }

  .section-header_bottom {
    padding: 0 16px;
  }

  .coupon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;
  }
}
</style>