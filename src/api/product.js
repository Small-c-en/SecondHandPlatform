import { BASE_URL } from './config'
import request from '@/utils/request'

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.category] - 商品分类
 * @param {number} [params.minPrice] - 最低价格
 * @param {number} [params.maxPrice] - 最高价格
 * @param {string} [params.condition] - 商品成色
 * @param {string} [params.sortBy] - 排序方式(price_asc/price_desc/time_desc/comprehensive)
 * @returns {Promise} 返回商品列表数据
 */
export function getProductList(params) {
  return request({
    url: '/products',
    method: 'get',
    params,
  })
}

/**
 * 获取商品分类列表
 * @returns {Promise} 返回分类列表
 */
export function getCategories() {
  return request({
    url: '/products/categories',
    method: 'get',
  })
}

/**
 * 获取商品成色选项
 * @returns {Promise} 返回成色选项列表
 */
export function getConditions() {
  return request({
    url: '/products/conditions',
    method: 'get',
  })
}

/**
 * 获取商品详情
 * @param {string} productId - 商品ID
 * @returns {Promise} 返回商品详情
 */
export function getProductDetail(productId) {
  return request({
    url: `/products/${productId}`,
    method: 'get',
  })
}

/**
 * 获取商品推荐列表
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 推荐数量
 * @param {string} [params.category] - 商品分类
 * @returns {Promise} 返回推荐商品列表
 */
export function getRecommendedProducts(params) {
  return request({
    url: '/products/recommended',
    method: 'get',
    params,
  })
}

/**
 * 获取商品评价列表
 * @param {string} productId - 商品ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.sortBy] - 排序方式(time_desc/rating_desc)
 * @returns {Promise} 返回评价列表
 */
export function getProductReviews(productId, params) {
  return request({
    url: `/products/${productId}/reviews`,
    method: 'get',
    params,
  })
}

/**
 * 添加商品评价
 * @param {string} productId - 商品ID
 * @param {Object} data - 评价数据
 * @param {number} data.rating - 评分(1-5)
 * @param {string} data.content - 评价内容
 * @param {string[]} [data.images] - 评价图片
 * @returns {Promise} 返回添加结果
 */
export function addProductReview(productId, data) {
  return request({
    url: `/products/${productId}/reviews`,
    method: 'post',
    data,
  })
}

/**
 * 获取卖家信息
 * @param {string} sellerId - 卖家ID
 * @returns {Promise} 返回卖家信息
 */
export function getSellerInfo(sellerId) {
  return request({
    url: `/sellers/${sellerId}`,
    method: 'get',
  })
}

/**
 * 获取卖家其他商品
 * @param {string} sellerId - 卖家ID
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 获取数量
 * @param {string} [params.excludeProductId] - 排除的商品ID
 * @returns {Promise} 返回商品列表
 */
export function getSellerProducts(sellerId, params) {
  return request({
    url: `/sellers/${sellerId}/products`,
    method: 'get',
    params,
  })
}

/**
 * 收藏商品
 * @param {string} productId - 商品ID
 * @returns {Promise} 返回收藏结果
 */
export function favoriteProduct(productId) {
  return request({
    url: `/products/${productId}/favorite`,
    method: 'post',
  })
}

/**
 * 取消收藏商品
 * @param {string} productId - 商品ID
 * @returns {Promise} 返回取消结果
 */
export function unfavoriteProduct(productId) {
  return request({
    url: `/products/${productId}/favorite`,
    method: 'delete',
  })
}

/**
 * 分享商品
 * @param {string} productId - 商品ID
 * @param {Object} data - 分享数据
 * @param {string} data.platform - 分享平台(wechat/weibo/qq)
 * @returns {Promise} 返回分享结果
 */
export function shareProduct(productId, data) {
  return request({
    url: `/products/${productId}/share`,
    method: 'post',
    data,
  })
}

// 创建商品
export function createProduct(data) {
  return request({
    url: `${BASE_URL}/products`,
    method: 'POST',
    data,
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `${BASE_URL}/products/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `${BASE_URL}/products/${id}`,
    method: 'DELETE',
  })
}

// 获取商品评论
export function getProductComments(productId, params) {
  return request({
    url: `${BASE_URL}/products/${productId}/comments`,
    method: 'GET',
    params,
  })
}

// 添加商品评论
export function addProductComment(productId, data) {
  return request({
    url: `${BASE_URL}/products/${productId}/comments`,
    method: 'POST',
    data,
  })
}
