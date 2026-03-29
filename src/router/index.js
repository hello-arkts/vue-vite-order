import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/coupons',
    name: 'CouponList',
    component: () => import('../views/CouponList.vue')
  },
  {
    path: '/jump',
    name: 'Jump',
    component: () => import('../views/JumpPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/order/'),
  routes
})

export default router
