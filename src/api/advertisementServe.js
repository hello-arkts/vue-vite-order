import { post } from './request.js'

// 获取广告列表
export function getAdvertisementList() {
  return post('/mall-portal/home/homeAdvertiseList')
}
