import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.account - 手机号或邮箱
 * @param {string} data.password - 密码
 * @param {string} [data.verifyCode] - 验证码（可选）
 * @param {boolean} [data.rememberPassword] - 是否记住密码
 * @returns {Promise} 返回登录结果
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

/**
 * 发送验证码
 * @param {Object} data - 验证码请求信息
 * @param {string} data.phone - 手机号
 * @param {string} data.type - 验证码类型（login/register/reset）
 * @returns {Promise} 返回发送结果
 */
export function sendVerifyCode(data) {
  return request({
    url: '/auth/verify-code',
    method: 'post',
    data,
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @param {string} data.phone - 手机号
 * @param {string} data.verifyCode - 验证码
 * @param {string} data.password - 密码
 * @returns {Promise} 返回注册结果
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}

/**
 * 第三方登录
 * @param {Object} data - 第三方登录信息
 * @param {string} data.platform - 平台名称（wechat/alipay/qq）
 * @param {string} data.code - 授权码
 * @returns {Promise} 返回登录结果
 */
export function thirdPartyLogin(data) {
  return request({
    url: '/auth/third-party-login',
    method: 'post',
    data,
  })
}

/**
 * 忘记密码
 * @param {Object} data - 重置密码信息
 * @param {string} data.phone - 手机号
 * @param {string} data.verifyCode - 验证码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 返回重置结果
 */
export function resetPassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data,
  })
}

/**
 * 退出登录
 * @returns {Promise} 返回退出结果
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  })
}
