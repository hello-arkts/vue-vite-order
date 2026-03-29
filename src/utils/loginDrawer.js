import { ref } from 'vue'

// 登录抽屉显示状态
const loginDrawerVisible = ref(false)

// 登录成功后的回调函数队列
const loginSuccessCallbacks = []

/**
 * 显示登录抽屉
 */
export const showLoginDrawer = () => {
  loginDrawerVisible.value = true
}

/**
 * 隐藏登录抽屉
 */
export const hideLoginDrawer = () => {
  loginDrawerVisible.value = false
}

/**
 * 获取登录抽屉状态
 */
export const getLoginDrawerStatus = () => loginDrawerVisible.value

/**
 * 注册登录成功回调
 * @param {Function} callback
 */
export const onLoginSuccess = (callback) => {
  if (typeof callback === 'function') {
    loginSuccessCallbacks.push(callback)
  }
}

/**
 * 触发登录成功回调
 * @param {Object} data 登录返回的数据
 */
export const emitLoginSuccess = (data) => {
  loginSuccessCallbacks.forEach(callback => {
    try {
      callback(data)
    } catch (error) {
      console.error('登录成功回调执行失败:', error)
    }
  })
  // 清空回调队列
  loginSuccessCallbacks.length = 0
}

/**
 * 清除所有登录成功回调
 */
export const clearLoginSuccessCallbacks = () => {
  loginSuccessCallbacks.length = 0
}
