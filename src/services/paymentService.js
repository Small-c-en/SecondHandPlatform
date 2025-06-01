import axios from 'axios'

// 支付状态枚举
export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
}

// 支付方式枚举
export const PaymentMethod = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
}

class PaymentService {
  // 创建支付订单
  async createPayment(orderId, amount, method) {
    try {
      // 实际项目中，这里应该调用后端API创建支付订单
      // 这里使用模拟数据
      const response = await this.mockApiCall({
        orderId,
        amount,
        method,
        paymentId: `PAY${Date.now()}`,
        status: PaymentStatus.PENDING,
        createdAt: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error('创建支付订单失败:', error)
      throw new Error('创建支付订单失败')
    }
  }

  // 查询支付状态
  async checkPaymentStatus(paymentId) {
    try {
      // 实际项目中，这里应该调用后端API查询支付状态
      // 这里使用模拟数据
      const response = await this.mockApiCall({
        paymentId,
        status: PaymentStatus.SUCCESS,
        updatedAt: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error('查询支付状态失败:', error)
      throw new Error('查询支付状态失败')
    }
  }

  // 模拟API调用
  async mockApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          message: 'success',
          data,
        })
      }, 1000) // 模拟1秒的网络延迟
    })
  }

  // 获取支付二维码（实际项目中需要对接支付平台）
  async getPaymentQRCode(paymentId, method) {
    try {
      // 实际项目中，这里应该调用支付平台的API获取支付二维码
      // 这里返回模拟数据
      const qrCodeUrl = `https://example.com/pay/${method}/${paymentId}`
      return qrCodeUrl
    } catch (error) {
      console.error('获取支付二维码失败:', error)
      throw new Error('获取支付二维码失败')
    }
  }

  // 模拟支付回调
  async mockPaymentCallback(paymentId) {
    try {
      // 实际项目中，这里是支付平台的回调通知
      // 这里模拟支付成功的回调
      const response = await this.mockApiCall({
        paymentId,
        status: PaymentStatus.SUCCESS,
        completedAt: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error('支付回调处理失败:', error)
      throw new Error('支付回调处理失败')
    }
  }
}

export default new PaymentService()
