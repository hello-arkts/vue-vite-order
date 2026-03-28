<template>
  <div class="coupon-detail-page">
    <!-- 顶部导航 -->
    <NavBar title="精选优惠" :showShare="true" @share="handleShare" />

    <!-- 分类标签 -->
    <CategoryTabs 
      v-model="activeCategory" 
      :tabs="categories" 
    />

    <!-- 优惠券详情卡片 -->
    <div class="detail-content">
      <el-card class="detail-card" shadow="never">
        <!-- 商户信息 -->
        <div class="merchant-info">
          <el-avatar :size="80" :style="{ background: logoColor }">
            {{ couponDetail.name.charAt(0) }}
          </el-avatar>
          <h2 class="merchant-name">{{ couponDetail.name }}</h2>
          <div class="discount-text">{{ couponDetail.discount }}</div>
        </div>

        <!-- 二维码区域 -->
        <div class="qrcode-section">
          <div class="qrcode-box">
            <!-- 模拟二维码 -->
            <div class="qrcode-placeholder">
              <div class="qr-pattern">
                <div v-for="i in 81" :key="i" class="qr-cell" :class="{ filled: qrPattern[i-1] }"></div>
              </div>
            </div>
          </div>
          <div class="coupon-code">券码 {{ couponDetail.code }}</div>
          <div class="coupon-tip">请向店员出示此二维码进行核销</div>
        </div>

        <!-- 券类型选择 -->
        <div class="coupon-types">
          <div class="types-scroll">
            <CouponTypeCard 
              v-for="(type, index) in couponTypes" 
              :key="index"
              :couponType="type"
              :isActive="activeCouponType === index"
              @click="selectCouponType(index)"
            />
          </div>
        </div>

        <!-- 门店地址 -->
        <div class="store-address">
          <div class="address-header">
            <el-icon><Location /></el-icon>
            <span class="address-label">门店地址：</span>
          </div>
          <div class="address-text">
            {{ couponDetail.address }}
          </div>
          <el-button type="primary" link @click="copyAddress">复制地址</el-button>
        </div>

        <!-- 导航按钮 -->
        <el-button 
          type="primary" 
          size="large" 
          class="nav-btn" 
          @click="handleNavigation"
        >
          <el-icon><Position /></el-icon>
          导航到店
        </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, Position } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import CouponTypeCard from '../components/CouponTypeCard.vue'

const route = useRoute()
const activeCategory = ref(0)
const activeCouponType = ref(0)

const categories = [
  { name: '网红餐厅', icon: '🍜' },
  { name: '酒店住宿', icon: '🏨' },
  { name: '租车接机', icon: '🚗' }
]

// 模拟优惠券详情数据
const couponDetail = ref({
  id: 1,
  name: 'Nara Thai Cuisine',
  discount: '满500减100',
  code: '0000001',
  address: '30 ซอย ราษฎร์พัฒนา 32 แขวง หัวหมาก เขต บางกะปิ\nกรุงเทพมหานคร 10220'
})

// 券类型
const couponTypes = ref([
  { name: '满减券', value: '100', description: '满500减฿100', expireDate: '2026-06-30' },
  { name: '现金券', value: '50', description: '全场消费减฿50', expireDate: '2026-06-30' },
  { name: '现金券', value: '30', description: '全场消费减฿30', expireDate: '2026-06-30' }
])

// Logo颜色
const logoColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
const logoColor = computed(() => {
  const index = couponDetail.value.name.length % logoColors.length
  return logoColors[index]
})

// 生成二维码图案 (简化模拟)
const qrPattern = ref([])
onMounted(() => {
  // 生成随机二维码图案
  qrPattern.value = Array.from({ length: 81 }, () => Math.random() > 0.5)
  // 确保角落有定位符
  const corners = [0, 1, 2, 6, 7, 8, 9, 18, 72, 73, 74, 78, 79, 80]
  corners.forEach(i => qrPattern.value[i] = true)
})

const selectCouponType = (index) => {
  activeCouponType.value = index
}

const handleShare = () => {
  ElMessage.success('分享功能开发中')
}

const copyAddress = () => {
  navigator.clipboard?.writeText(couponDetail.value.address)
  ElMessage.success('地址已复制')
}

const handleNavigation = () => {
  ElMessage.success('正在打开导航...')
}
</script>

<style scoped>
.coupon-detail-page {
  min-height: 100vh;
  background: var(--bg-card);
}

.detail-content {
  padding: 16px;
  background: var(--bg-page);
  min-height: calc(100vh - 100px);
}

.detail-card {
  border-radius: var(--radius-lg);
}

.detail-card :deep(.el-card__body) {
  padding: 24px 16px;
}

/* 商户信息 */
.merchant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.merchant-info :deep(.el-avatar) {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
}

.merchant-name {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.discount-text {
  font-size: var(--font-lg);
  color: var(--primary-red);
  font-weight: 600;
}

/* 二维码区域 */
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.qrcode-box {
  width: 180px;
  height: 180px;
  padding: 12px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
}

.qrcode-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-pattern {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
}

.qr-cell {
  background: white;
  border-radius: 1px;
}

.qr-cell.filled {
  background: #000;
}

.coupon-code {
  font-size: var(--font-md);
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.coupon-tip {
  font-size: var(--font-xs);
  color: var(--text-tertiary);
}

/* 券类型选择 */
.coupon-types {
  margin-bottom: 24px;
}

.types-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  -webkit-overflow-scrolling: touch;
}

.types-scroll::-webkit-scrollbar {
  display: none;
}

/* 门店地址 */
.store-address {
  padding: 16px;
  background: var(--bg-page);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.address-text {
  font-size: var(--font-sm);
  color: var(--text-primary);
  line-height: 1.5;
  white-space: pre-line;
  margin-bottom: 8px;
}

/* 导航按钮 */
.nav-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-md);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #4169E1 0%, #5B7FFF 100%);
  border: none;
}

.nav-btn:hover {
  background: linear-gradient(135deg, #3658c8 0%, #4a6ee8 100%);
}

/* ============ 响应式设计 ============ */

/* 平板端 (768px+) */
@media (min-width: 768px) {
  .detail-content {
    padding: 20px 24px;
  }
  
  .detail-card :deep(.el-card__body) {
    padding: 32px 24px;
  }
  
  .merchant-info {
    margin-bottom: 32px;
  }
  
  .merchant-info :deep(.el-avatar) {
    width: 96px !important;
    height: 96px !important;
    font-size: 40px;
  }
  
  .qrcode-box {
    width: 200px;
    height: 200px;
  }
  
  .qrcode-section {
    margin-bottom: 32px;
  }
  
  .coupon-types {
    margin-bottom: 32px;
  }
  
  .types-scroll {
    gap: 16px;
  }
  
  .store-address {
    padding: 20px;
    margin-bottom: 32px;
  }
  
  .nav-btn {
    height: 52px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .detail-content {
    padding: 20px;
  }
  
  .detail-card :deep(.el-card__body) {
    padding: 28px 20px;
  }
  
  .merchant-info :deep(.el-avatar) {
    width: 88px !important;
    height: 88px !important;
    font-size: 36px;
  }
  
  .qrcode-box {
    width: 180px;
    height: 180px;
  }
}
</style>
