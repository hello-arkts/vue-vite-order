/**
 * 优惠券相关 API 接口
 */
import { post } from './request.js'

/**
 * 获取优惠券列表
 */
//// 优惠券列表原版
// export const getCouponList = (params = {}) => {
//   return post('/mall-portal/member/coupon/coupon1List', params)
// }

// 新版暂时使用
export const getCouponList = (params = {}) => {
  return post('/mall-portal/home/coupon1List', params)
}

/**
 * 获取优惠券详情
 */
//// 获取优惠券详情原版
// export const getCouponDetail = (params = {}) => {
//   return post('/mall-portal/member/coupon/coupon1Detail', params)
// }

// 获取优惠券详情新版
export const getCouponDetail = (params = {}) => {
  return post('/mall-portal/member/coupon/couponDetail', params)
}


