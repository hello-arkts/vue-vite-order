import axios from 'axios'
import qs from 'qs'

// 创建 axios 实例
const service = axios.create({
  baseURL: '',
  timeout: 120 * 1000,
})

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

    // 请求错误统一拦截，code 不为 200 或 0
    if (response.data.code !== 200 && response.data.code !== 0) {
      const error = new Error(response.data.message || '请求失败')
      error.code = response.data.code
      error.data = response.data
      return Promise.reject(error)
    }

    return response.data.data || response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // 可以在这里处理登录过期逻辑
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
