/**
 * 优惠券相关 API 接口
 */
import { post } from './request.js'

/**
 * 获取优惠券列表
 * @param {Object} params - 查询参数
 * @param {number} params.category - 分类ID
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export const getCouponList = (params = {}) => {
  return post('/mall-portal/member/coupon/coupon1List', params)
}

