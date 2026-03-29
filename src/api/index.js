/**
 * API 模块统一导出
 */
import { login, register, getCode } from './loginServe.js'
import { getCouponList, getCouponDetail } from './couponServe.js'

// 请求工具
export { default as request, get, post, put, del } from './request.js'

export {
  login,
  register,
  getCode,
  getCouponList,
  getCouponDetail
}
