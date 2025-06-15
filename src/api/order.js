import { BASE_URL } from './config'
import request from '@/utils/request'

// 获取订单列表
export function getOrders(params) {
  return request({
    url: `${BASE_URL}/orders`,
    method: 'GET',
    params,
  })
}

// 获取订单详情
export function getOrderById(id) {
  return request({
    url: `${BASE_URL}/orders/${id}`,
    method: 'GET',
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: `${BASE_URL}/orders`,
    method: 'POST',
    data,
  })
}

// 取消订单
export function cancelOrder(id, data) {
  return request({
    url: `${BASE_URL}/orders/${id}/cancel`,
    method: 'POST',
    data,
  })
}

// 确认收货
export function confirmReceipt(id, data) {
  return request({
    url: `${BASE_URL}/orders/${id}/confirm-receipt`,
    method: 'POST',
    data,
  })
}

// 支付订单
export function payOrder(id, data) {
  return request({
    url: `${BASE_URL}/orders/${id}/pay`,
    method: 'POST',
    data,
  })
}

// 获取订单物流信息
export function getOrderLogistics(id) {
  return request({
    url: `${BASE_URL}/orders/${id}/logistics`,
    method: 'GET',
  })
}
