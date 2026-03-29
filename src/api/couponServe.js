/**
 * 优惠券相关 API 接口
 */
import { post } from './request.js'

/**
 * 获取优惠券列表
 */
export const getCouponList = (params = {}) => {
  return post('/mall-portal/member/coupon/coupon1List', params)
}

/**
 * 获取优惠券详情
 */
export const getCouponDetail = (params = {}) => {
  return post('/mall-portal/member/coupon/coupon1Detail', params)
}


