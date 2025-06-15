// API基础配置
export const BASE_URL = '/api/v1'

// 通用响应格式
export const commonResponses = {
  success: {
    code: 200,
    message: '操作成功',
  },
  badRequest: {
    code: 400,
    message: '请求参数错误',
  },
  unauthorized: {
    code: 401,
    message: '未授权',
  },
  forbidden: {
    code: 403,
    message: '禁止访问',
  },
  notFound: {
    code: 404,
    message: '资源不存在',
  },
  serverError: {
    code: 500,
    message: '服务器内部错误',
  },
}
