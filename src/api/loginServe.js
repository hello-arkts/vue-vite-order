import { post } from './request.js'

/**
 * 注册
 */
export const register = (params = {}) => {
    return post('/mall-portal/member/register', params)
}

/**
 * 登录
 */
export const login = (params = {}) => {
    return post('/mall-portal/member/login', params)
}

/**
 * 获取验证码
 */
export const getCode = (params = {}) => {
    return post('/mall-portal/member/getCode', params)
}

