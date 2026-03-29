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
    return post('/mall-portal/util/getAuthCodeByInvitation', params)
}

/**
 * 校验验证码
 */
export const getAuthCode = (params = {}) => {
    return post('/mall-portal/util/checkAuthCode', params)
}

/**
 * 设置密码
 */
export const setPassword = (params = {}) => {
    return post('/mall-portal/sso/setPassword', params)
}

