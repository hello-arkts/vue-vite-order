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
    return post('/mall-portal/sso/login', params)
}

/**
 * 获取验证码
 */
export const getCode = (params = {}) => {
    return post('/mall-portal/util/getAuthCodeByInvitation', params)
}

/**
 * 注册账号
 */
export const registerAccount = (params = {}) => {
    return post('/mall-portal/sso/register', params)
}

/**
 * 设置密码
 */
export const setPassword = (params = {}) => {
    return post('/mall-portal/sso/setPassword', params)
}

