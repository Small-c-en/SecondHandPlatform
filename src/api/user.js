import { BASE_URL } from './config'
import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: `${BASE_URL}/auth/login`,
    method: 'POST',
    data,
  })
}

// 用户注册
export function register(data) {
  return request({
    url: `${BASE_URL}/auth/register`,
    method: 'POST',
    data,
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: `${BASE_URL}/users/info`,
    method: 'GET',
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: `${BASE_URL}/users/info`,
    method: 'PUT',
    data,
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: `${BASE_URL}/users/password`,
    method: 'PUT',
    data,
  })
}

// 获取用户收藏
export function getUserFavorites(params) {
  return request({
    url: `${BASE_URL}/users/favorites`,
    method: 'GET',
    params,
  })
}

// 添加收藏
export function addFavorite(productId) {
  return request({
    url: `${BASE_URL}/users/favorites/${productId}`,
    method: 'POST',
  })
}

// 取消收藏
export function removeFavorite(productId) {
  return request({
    url: `${BASE_URL}/users/favorites/${productId}`,
    method: 'DELETE',
  })
}
