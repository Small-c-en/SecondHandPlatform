import request from '@/utils/request'

/**
 * 获取系统通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回系统通知列表
 */
export function getSystemMessages(params) {
  return request({
    url: '/messages/system',
    method: 'get',
    params,
  })
}

/**
 * 获取交易提醒列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回交易提醒列表
 */
export function getTransactionMessages(params) {
  return request({
    url: '/messages/transaction',
    method: 'get',
    params,
  })
}

/**
 * 获取聊天消息列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise} 返回聊天消息列表
 */
export function getChatMessages(params) {
  return request({
    url: '/messages/chat',
    method: 'get',
    params,
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise} 返回各类型消息的未读数量
 */
export function getUnreadCounts() {
  return request({
    url: '/messages/unread-counts',
    method: 'get',
  })
}

/**
 * 标记消息为已读
 * @param {string} messageId - 消息ID
 * @param {string} type - 消息类型 (system/transaction/chat)
 * @returns {Promise} 返回操作结果
 */
export function markMessageAsRead(messageId, type) {
  return request({
    url: `/messages/${type}/${messageId}/read`,
    method: 'put',
  })
}

/**
 * 标记所有消息为已读
 * @param {string} type - 消息类型 (system/transaction/chat)
 * @returns {Promise} 返回操作结果
 */
export function markAllMessagesAsRead(type) {
  return request({
    url: `/messages/${type}/read-all`,
    method: 'put',
  })
}

/**
 * 删除消息
 * @param {string} messageId - 消息ID
 * @param {string} type - 消息类型 (system/transaction/chat)
 * @returns {Promise} 返回操作结果
 */
export function deleteMessage(messageId, type) {
  return request({
    url: `/messages/${type}/${messageId}`,
    method: 'delete',
  })
}

/**
 * 清空已读消息
 * @param {string} type - 消息类型 (system/transaction/chat)
 * @returns {Promise} 返回操作结果
 */
export function clearReadMessages(type) {
  return request({
    url: `/messages/${type}/clear-read`,
    method: 'delete',
  })
}

/**
 * 获取消息详情
 * @param {string} messageId - 消息ID
 * @param {string} type - 消息类型 (system/transaction/chat)
 * @returns {Promise} 返回消息详情
 */
export function getMessageDetail(messageId, type) {
  return request({
    url: `/messages/${type}/${messageId}`,
    method: 'get',
  })
}
