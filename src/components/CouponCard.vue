<template>
  <el-card class="coupon-card" shadow="hover" @click="handleCardClick">
    <div class="card-content">
      <div class="card-logo">
        <el-avatar :size="35" :style="{ background: logoColor }">
          {{ coupon.name.charAt(0) }}
        </el-avatar>
      </div>
      <div class="card-name">{{ coupon.name }}</div>
      <div class="card-discount">{{ coupon.discount }}</div>
      <el-button class="card-btn" size="small" round @click.stop="openDrawer">立即使用</el-button>
    </div>
  </el-card>

  <!-- 优惠券详情抽屉 -->
  <el-drawer
    v-model="drawerVisible"
    direction="btt"
    size="85%"
    :show-close="false"
    :with-header="false"
    class="coupon-drawer"
    style="border-radius: 26px 26px 0 0"
  >
    <div class="drawer-content">
      <!-- 商户信息 -->
      <div class="merchant-info">
        <el-avatar :size="61" :style="{ background: logoColor }">
          {{ coupon.name.charAt(0) }}
        </el-avatar>
        <h2 class="merchant-name">{{ coupon.name }}</h2>
        <div class="discount-text">{{ coupon.discount }}</div>
      </div>

      <!-- 二维码区域 -->
      <div class="qrcode-section">
        <div class="qrcode-box">
          <div class="qrcode-placeholder">
            <div class="qr-pattern">
              <div v-for="i in 81" :key="i" class="qr-cell" :class="{ filled: qrPattern[i-1] }"></div>
            </div>
          </div>
        </div>
        <div class="coupon-code">券码 {{ couponCode }}</div>
        <div class="coupon-tip">请向店员出示此二维码进行核销</div>
      </div>

      <!-- 券类型选择 -->
      <div class="coupon-types">
        <div class="types-scroll">
          <div 
            v-for="(type, index) in couponTypes" 
            :key="index"
            class="type-card"
            :class="{ active: activeCouponType === index }"
            @click="activeCouponType = index"
          >
            <div class="type-header">
              <span class="type-name">{{ type.name }}</span>
              <span class="type-value">฿{{ type.value }}</span>
            </div>
            <div class="type-desc">{{ type.description }}</div>
            <div class="type-expire">有效期 {{ type.expireDate }}</div>
          </div>
        </div>
      </div>

      <!-- 门店地址 -->
      <div class="store-address">
        <div class="address-header">
          <el-icon><Location /></el-icon>
          <span class="address-label">门店地址：</span>
        </div>
        <div class="address-text">{{ storeAddress }}</div>
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
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Location, Position } from '@element-plus/icons-vue'

const props = defineProps({
  coupon: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const drawerVisible = ref(false)
const activeCouponType = ref(0)

// 根据名称生成不同的logo背景色
const logoColors = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
]

const logoColor = computed(() => {
  const index = props.coupon.name.length % logoColors.length
  return logoColors[index]
})

// 生成券码
const couponCode = computed(() => {
  return String(props.coupon.id).padStart(7, '0')
})

// 券类型数据
const couponTypes = ref([
  { name: '满减券', value: '100', description: '满500减฿100', expireDate: '2026-06-30' },
  { name: '现金券', value: '50', description: '全场消费减฿50', expireDate: '2026-06-30' },
  { name: '现金券', value: '30', description: '全场消费减฿30', expireDate: '2026-06-30' }
])

// 门店地址
const storeAddress = '30 ซอย ราษฎร์พัฒนา 32 แขวง หัวหมาก เขต บางกะปิ\nกรุงเทพมหานคร 10220'

// 生成二维码图案
const qrPattern = ref([])
const generateQrPattern = () => {
  qrPattern.value = Array.from({ length: 81 }, () => Math.random() > 0.5)
  const corners = [0, 1, 2, 6, 7, 8, 9, 18, 72, 73, 74, 78, 79, 80]
  corners.forEach(i => qrPattern.value[i] = true)
}

// 打开抽屉时生成二维码
watch(drawerVisible, (val) => {
  if (val) {
    generateQrPattern()
  }
})

const handleCardClick = () => {
  emit('click', props.coupon)
}

const openDrawer = () => {
  drawerVisible.value = true
}

const copyAddress = () => {
  navigator.clipboard?.writeText(storeAddress)
  ElMessage.success('地址已复制')
}

const handleNavigation = () => {
  ElMessage.success('正在打开导航...')
}
</script>

<style scoped>
.coupon-card {
  display: block;
  width: 168px;
  height: 132px;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.08);
  border-radius: 22px 22px 22px 22px;
  cursor: pointer;
  transition: all 0.25s ease;
  padding:16px ;
}

:deep(.el-card__body){
  padding: 0 !important;
}

.coupon-card:hover {
  transform: translateY(-2px);
}

.coupon-card:active {
  transform: scale(0.98);
}

.card-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.card-logo :deep(.el-avatar) {
  font-size: 24px;
  font-weight: 600;
}

.card-name {
  font-size: var(--font-xs);
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 84px;
  height: 12px;
  font-style: normal;
  text-transform: none;
}

.card-discount {
  font-size: var(--font-sm);
  color: var(--primary-red);
  font-weight: 500;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.card-btn {
  margin-top: 6px;
}

/* 抽屉样式 */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.coupon-drawer{

}


.drawer-title {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
}

.drawer-content {
}

/* 商户信息 */
.merchant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.merchant-info :deep(.el-avatar) {
  font-size: 32px;
  font-weight: bold;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 5px;
}

.merchant-name {
  font-size: var(--font-lg);
  font-weight: bold;
  text-align: left;
  font-style: normal;
  text-transform: none;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.discount-text {
  font-size: var(--font-md);
  color: var(--primary-red);
  font-weight: bold;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

/* 二维码区域 */
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.qrcode-box {
  width: 220px;
  height: 220px;
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

.type-card {
  min-width: 140px;
  padding: 12px;
  background: #ffe2d7;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.type-card:active {
  transform: scale(0.97);
}

.type-card.active {
  border-color: var(--primary-red);
}

.type-header {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.type-name {
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-weight: 500;
}

.type-value {
  font-size: var(--font-lg);
  color: var(--text-primary);
  font-weight: 700;
}

.type-card.active .type-value {
  color: var(--primary-red);
}

.type-desc {
  font-size: var(--font-xs);
  color: var(--primary-red);
  margin-bottom: 8px;
}

.type-expire {
  font-size: var(--font-xs);
  color: var(--text-tertiary);
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
  .coupon-card :deep(.el-card__body) {
    padding: 20px;
  }
  
  .card-logo :deep(.el-avatar) {
    width: 64px !important;
    height: 64px !important;
    font-size: 28px;
  }
  
  .card-content {
    gap: 10px;
  }
  
  .drawer-content {
    padding: 28px 24px;
  }
  
  .merchant-info :deep(.el-avatar) {
    width: 88px !important;
    height: 88px !important;
    font-size: 36px;
  }
  
  .qrcode-box {
    width: 200px;
    height: 200px;
  }
  
  .types-scroll {
    gap: 16px;
  }
  
  .type-card {
    min-width: 160px;
    padding: 16px;
  }
  
  .store-address {
    padding: 20px;
  }
  
  .nav-btn {
    height: 52px;
  }
}

/* 桌面端 (992px+) */
@media (min-width: 992px) {
  .coupon-card :deep(.el-card__body) {
    padding: 16px;
  }
  
  .card-logo :deep(.el-avatar) {
    width: 56px !important;
    height: 56px !important;
    font-size: 24px;
  }
  
  .card-content {
    gap: 8px;
  }
  
  .drawer-content {
    padding: 24px 20px;
  }
  
  .merchant-info :deep(.el-avatar) {
    width: 80px !important;
    height: 80px !important;
    font-size: 32px;
  }
  
  .qrcode-box {
    width: 180px;
    height: 180px;
  }
  
  .types-scroll {
    gap: 12px;
  }
  
  .type-card {
    min-width: 140px;
    padding: 12px;
  }
  
  .store-address {
    padding: 16px;
  }
  
  .nav-btn {
    height: 48px;
  }
}
</style>