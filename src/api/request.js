import axios from 'axios'
import qs from 'qs'
import { showLoginDrawer } from '@/utils/loginDrawer.js'

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 120 * 1000,
})

// 标记是否正在显示登录抽屉，防止重复弹出
let isShowingLoginDrawer = false

/**
 * 需要登录的错误码列表
 */
const LOGIN_REQUIRED_CODES = [401, 403, 1001, 1002, 1003, -1, -2]

/**
 * 检查是否需要登录
 * @param {Object} error 错误对象
 * @returns {boolean}
 */
const checkNeedLogin = (error) => {
  // 检查 HTTP 状态码
  if (error.response?.status === 401 || error.response?.status === 403) {
    return true
  }

  // 检查响应体中的错误码
  const code = error.response?.data?.code || error.code
  if (code && LOGIN_REQUIRED_CODES.includes(Number(code))) {
    return true
  }

  // 检查响应消息中是否包含登录相关关键词
  const message = error.response?.data?.message || error.message || ''
  const loginKeywords = ['登录', '未登录', '登录过期','登录信息过期' ,'token', '认证', '授权', 'unauthorized', 'login']
  return loginKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))
}

/**
 * 处理需要登录的情况
 */
const handleNeedLogin = () => {
  if (isShowingLoginDrawer) {
    return
  }

  isShowingLoginDrawer = true
  localStorage.removeItem('token')
  showLoginDrawer()

  // 延迟重置标记，避免抽屉动画期间重复触发
  setTimeout(() => {
    isShowingLoginDrawer = false
  }, 500)
}

// request 拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }

    // 参数表单提交
    if (config.formData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = qs.stringify(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    // 返回体不做任何处理
    if (response.config.originalRes) {
      return response
    }

    // 检查响应码是否需要登录
    if (response.data.code && LOGIN_REQUIRED_CODES.includes(Number(response.data.code))) {
      handleNeedLogin()
      const error = new Error(response.data.message || '登录已过期，请重新登录')
      error.code = response.data.code
      error.data = response.data
      error.needLogin = true
      return Promise.reject(error)
    }

    // 请求错误统一拦截，code 不为 200 或 0
    if (response.data.code !== 200 && response.data.code !== 0) {
      const error = new Error(response.data.message || '请求失败')
      error.code = response.data.code
      error.data = response.data
      return Promise.reject(error)
    }

    return response.data
  },
  (error) => {
    // 检查是否需要登录
    if (checkNeedLogin(error)) {
      handleNeedLogin()
      error.needLogin = true
    }
    return Promise.reject(error)
  }
)

/**
 * GET 请求
 * @param {string} url
 * @param {Object} params
 * @param {Object} config
 * @returns {Promise}
 */
export const get = (url, params = {}, config = {}) => {
  return service.get(url, { params, ...config })
}

/**
 * POST 请求
 * @param {string} url
 * @param {Object} data
 * @param {Object} config
 * @returns {Promise}
 */
export const post = (url, data = {}, config = {}) => {
  return service.post(url, data, config)
}

/**
 * PUT 请求
 * @param {string} url
 * @param {Object} data
 * @param {Object} config
 * @returns {Promise}
 */
export const put = (url, data = {}, config = {}) => {
  return service.put(url, data, config)
}

/**
 * DELETE 请求
 * @param {string} url
 * @param {Object} config
 * @returns {Promise}
 */
export const del = (url, config = {}) => {
  return service.delete(url, config)
}

export default service
