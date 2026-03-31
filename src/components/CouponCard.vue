<template>
  <el-card
    class="coupon-card"
    shadow="hover"
    :style="{ animationDelay: `${index * 0.05}s` }"
    @click="handleCardClick"
  >
    <div class="card-content">
      <div class="card-logo" style="height: 35px">
        <el-avatar :size="35">
          <img :src="coupon.shop?.logo" />
        </el-avatar>
      </div>
      <div class="card-name">{{ coupon.name }}</div>
      <div class="card-discount">{{ couponAmount(coupon) }}</div>
      <el-button class="card-btn" size="small" round @click.stop="openDrawer">立即使用</el-button>
    </div>
  </el-card>

  <!-- 优惠券详情抽屉 -->
  <DraggableDrawer
    v-model="drawerVisible"
    initial-size="95%"
    min-height="30%"
    max-height="95%"
  >
    <div class="drawer-content">
      <!-- 商户信息 -->
      <div class="merchant-info">
        <el-avatar :size="61">
          <img :src="couponTypes.shop?.logo || coupon.shop?.logo" />
        </el-avatar>
        <h2 class="merchant-name">{{ couponTypes?.name }}</h2>
        <div class="discount-text">{{ couponAmount(couponTypes) }}</div>
        <img src="../assets/icons/fxtb.svg" class="share-text" />
      </div>

      <!-- 二维码区域 -->
      <div class="qrcode-section">
        <div class="qrcode-box">
          <canvas ref="qrCanvas" class="qrcode-canvas"></canvas>
        </div>
        <div class="coupon-code" v-if="couponTypes.code">券码 {{ couponTypes.code }}</div>
        <div class="coupon-tip">请向店员出示此二维码进行核销</div>
      </div>

      <!-- 券类型选择 -->
      <div class="coupon-types">
        <div class="types-scroll">
          <div 
            v-for="(type, index) in couponTypes.couponList"
            :key="index"
            class="type-card"
            :class="{ active: activeCouponType === type.id }"
            @click="activeCoupon(type, index)"
          >
            <div class="type-header">
              <span class="type-name">{{ couponType(type) }}</span>
              <span class="type-value">฿{{ type.amount }}</span>
            </div>
            <div class="type-desc">{{ couponAmount(type) }}</div>
            <div class="type-expire">有效期 {{ type.endTime ? type.endTime.split(' ')[0] : '' }}</div>
          </div>
        </div>
      </div>

      <!-- 门店地址 -->
      <div class="store-address-container">
        <div class="store-address">
          <div class="address-row" @click="toggleAddressDropdown">
            <img src="../assets/icons/zb.svg" class="location-icon" />
            <span class="address-text">{{ selectedStoreAddress }}</span>
            <el-icon class="dropdown-icon" :class="{ 'rotate': addressDropdownVisible }"><ArrowDown /></el-icon>
          </div>
          <div class="address-dropdown" v-show="addressDropdownVisible">
            <div
                v-for="(store, index) in couponTypes.shopList"
                :key="index"
                class="address-item"
                :class="{ 'active': selectedStoreId === store.id }"
            >
              <div @click="selectStore(store, index)">
                <div class="store-name">{{ store.name }}</div>
                <div class="store-detail">{{ store.address }}</div>
              </div>
              <el-button type="text" class="copy-address-btn" @click="copyAddress(store)">复制地址</el-button>
            </div>
          </div>  
        </div>
        <el-button class="select-store-btn" type="primary" size="small" round @click="handleSelectStore">选择门店</el-button>
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

    <!-- 地图应用选择抽屉 -->
    <DraggableDrawer
      v-model="mapDialogVisible"
      initial-size="60%"
    >
      <div class="map-options">
        <div
          v-for="mapApp in mapApps"
          :key="mapApp.id"
          class="map-option"
          @click="openMapAppHandler(mapApp)"
        >
          <div class="map-icon">
            <img :src="mapApp.icon" :alt="mapApp.name" />
          </div>
          <div class="map-info">
            <div class="map-name">{{ mapApp.name }}</div>
            <div class="map-desc">{{ mapApp.description }}</div>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </DraggableDrawer>
  </DraggableDrawer>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Position, ArrowRight } from '@element-plus/icons-vue'
import {getCouponDetail} from "@/api/index.js"
import {mapApps} from "@/utils/curatedList.js"

import QRCode from 'qrcode'
import { openMapApp } from '@/utils/openMap.js'
import DraggableDrawer from '@/components/DraggableDrawer.vue'

const props = defineProps({
  coupon: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const drawerVisible = ref(false)
const activeCouponType = ref(props.coupon.id)
const qrCanvas = ref(null)
const mapDialogVisible = ref(false)

const couponTypes = ref([])
const addressDropdownVisible = ref(false)
const selectedStoreId = ref(0)
const selectedStoreAddress = ref('')

// 优惠券金额
const couponAmount = (coupon) => {
  if (coupon.minPoint && coupon.minPoint > 0) {
    return '满   ' +'฿'+ coupon.minPoint + '减    ' +'฿'+ coupon.amount
  } else {
    return '฿'+ coupon.amount +'    代金券'
  }
}

// 优惠券类型
const couponType = (coupon) => {
  if (coupon.minPoint && coupon.minPoint > 0) {
    return '满减券'
  } else {
    return '代金券'
  }
}

const toggleAddressDropdown = () => {
  addressDropdownVisible.value = !addressDropdownVisible.value
}

const selectStore = (store, index) => {
  selectedStoreId.value = store.id
  selectedStoreAddress.value = store.address
  addressDropdownVisible.value = false
}

// 生成二维码
const generateQrCode = async () => {
  await nextTick()
  if (qrCanvas.value && couponTypes.value.qrcode) {
    try {
      await QRCode.toCanvas(qrCanvas.value, couponTypes.value.qrcode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
    }
  }
}

// 打开抽屉时生成二维码
watch(couponTypes, (val) => {
  if (val) {
    generateQrCode()
  }
})

const handleCardClick = () => {
  emit('click', props.coupon)
}

const openDrawer = () => {
  getCouponDetails(props.coupon.id)
}

const copyAddress = (item) => {
  navigator.clipboard?.writeText(item.address)
  ElMessage.success('地址已复制')
}

const handleSelectStore = () => {
  addressDropdownVisible.value = true
}

const handleNavigation = () => {
  if (!selectedStoreAddress.value) {
    ElMessage.warning('请先选择门店地址')
    return
  }
  mapDialogVisible.value = true
}

const openMapAppHandler = async (mapApp) => {
  const success = await openMapApp(mapApp, couponTypes.value.shopList, selectedStoreId.value, selectedStoreAddress.value)
  if (success) {
    mapDialogVisible.value = false
  }
}

const activeCoupon = (row, index) => {
  activeCouponType.value = row.id
  getCouponDetails(row.id)
}

//获取优惠券详情
const getCouponDetails = async (id) => {
  const formData = new FormData()
  formData.append('couponId', id)
  try {
    const res = await getCouponDetail(formData)
    if (res.code === 200) {
      couponTypes.value = res.data || []
      drawerVisible.value = true

      // 初始化默认门店
      selectedStoreId.value = couponTypes.value.shopList[0]?.id || 0
      selectedStoreAddress.value = couponTypes.value.shopList[0]?.address || ''
    } else {
      ElMessage.error(res.msg || '优惠券获取失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '优惠券获取失败')
  }
}
</script>

<style scoped lang="scss">
.coupon-card {
  display: block;
  width: 168px;
  height: 132px;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.08);
  border-radius: 22px 22px 22px 22px;
  cursor: pointer;
  transition: all 0.25s ease;
  padding:16px;
  /* 列表项入场动画 - 仅作用于卡片本身 */
  animation: fadeInUp 0.4s ease forwards;
}

/* 列表项入场动画 */
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

.drawer-content {
}

/* 商户信息 */
.merchant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 10px;
  .share-text {
    width: 30px;
    background: var(--bg-transparent);
    font-size: var(--font-base);
    color: var(--text-primary);
    font-weight: bold;
    text-align: center;
    font-style: normal;
    text-transform: none;
    position: absolute;
    right: 20px;
  }
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
  margin-bottom: 28px;
}

.qrcode-box {
  width: 220px;
  height: 220px;
  padding: 12px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  margin-bottom: 7px;
}

.qrcode-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.coupon-code {
  font-size: var(--font-md);
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.coupon-tip {
  font-size: var(--font-lg);
  color: var(--text-primary);
  font-weight: 500;
  font-style: normal;
  text-transform: none;
}

/* 券类型选择 */
.coupon-types {
  margin-bottom: 20px;
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
  width: 118px;
  height: 87px;
  background: #FFE2D7;
  border-radius: 16px 16px 16px 16px;
  min-width: 140px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.type-card:active {
  transform: scale(0.97);
}

.type-card.active {
  border: 2px solid #FF3957;
}

.type-header {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 2px;
}

.type-name {
  font-size: var(--font-md);
  color: var(--text-primary);
  font-family: IBM Plex Sans Thai, IBM Plex Sans Thai !important;
  font-weight: 600;
  font-style: normal;
  text-transform: none;
}

.type-value {
  font-size: var(--font-md);
  color: var(--text-primary);
  font-family: IBM Plex Sans Thai, IBM Plex Sans Thai !important;
  font-weight: 600;
  font-style: normal;
  text-transform: none;
}

.type-desc {
  font-size: var(--font-sm);
  margin-bottom: 2px;
  font-family: IBM Plex Sans Thai, IBM Plex Sans Thai !important;
  font-weight: 500;
  color: #FF3957;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.type-expire {
  font-size: var(--font-xs);
  color: var(--text-primary);
  font-style: normal;
  text-align: center;
  text-transform: none;
}

/* 门店地址容器 */
.store-address-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
}

/* 门店地址 */
.store-address {
  flex: 1;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-width: 0;
}

/* 选择门店按钮 */
.select-store-btn {
  align-self: flex-start;
  flex-shrink: 0;
  height: 40px;
  padding: 0 16px;
  font-size: var(--font-sm);
  background: #5668F4;
  border-radius: 25px 25px 25px 25px;
}

.copy-address-btn {
  width: 80px;
  height: 100%;
  font-size: var(--font-sm);
  color: var(--text-secondary);
  padding: 4px 6px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
}

.address-row {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.location-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.address-text {
  flex: 1;
  font-size: var(--font-sm);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.dropdown-icon {
  font-size: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.address-dropdown {
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  width: 100%;
  transform: translateY(-100%);
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid var(--border-light);
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: 0 -2px 8px rgb(0 0 0 / 0.17);
  box-sizing: border-box;
  z-index: 10;
}

.address-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.address-item:hover {
  background-color: #f5f5f5;
}

.address-item.active {
  background-color: #FFF0F2;
}

.store-name {
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4px;
}

.store-detail {
  font-size: var(--font-xs);
  color: var(--text-secondary);
  word-break: break-word;
}

/* 导航按钮 */
.nav-btn {
  width: 100%;
  height: 48px;
  font-size: var(--font-md);
  background: #5668F4;
  border-radius: 25px 25px 25px 25px;
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
    padding: 16px 20px;
  }
  
  .location-icon {
    width: 24px;
    height: 24px;
  }
  
  .address-text {
    font-size: var(--font-base);
  }
  
  .dropdown-icon {
    font-size: 18px;
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
    padding: 12px 16px;
  }
  
  .location-icon {
    width: 20px;
    height: 20px;
  }
  
  .nav-btn {
    height: 48px;
  }
}

/* 地图选择抽屉样式 */
.map-drawer :deep(.el-drawer) {
  border-radius: 26px 26px 0 0;
  overflow: hidden;
  background: #F9F5F6;
}

.map-drawer :deep(.el-drawer__body) {
  padding: 24px 24px 24px;
  background: #F9F5F6;
}

.map-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.map-option {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #FFFFFF;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-option:hover {
  border-color: #5668F4;
  background: #F5F7FF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(86, 104, 244, 0.15);
}

.map-option:active {
  transform: scale(0.98);
}

.map-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.map-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.map-name {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.map-desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.arrow-icon {
  font-size: 20px;
  color: var(--text-tertiary);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.map-option:hover .arrow-icon {
  color: #5668F4;
  transform: translateX(4px);
}

/* 地图抽屉响应式 */
@media (min-width: 768px) {
  .map-option {
    padding: 20px;
  }
  
  .map-icon {
    width: 56px;
    height: 56px;
  }
  
  .map-icon img {
    width: 36px;
    height: 36px;
  }
  
  .map-name {
    font-size: var(--font-md);
  }
  
  .map-desc {
    font-size: var(--font-base);
  }
}
</style>

<style>
  .el-drawer.coupon-drawer .el-drawer__body {
    padding: 0 !important;
  }
</style>