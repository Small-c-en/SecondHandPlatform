<template>
  <div class="order-detail-actions-fixed">
    <div class="actions-container">
      <button
        v-if="actions.includes('contact_seller')"
        class="action-button secondary-button"
        @click="emitAction('contact_seller')"
      >
        联系卖家
      </button>
      <button
        v-if="actions.includes('cancel_order')"
        class="action-button danger-button"
        @click="emitAction('cancel_order')"
      >
        取消订单
      </button>
      <button
        v-if="actions.includes('pay_now')"
        class="action-button primary-button"
        @click="handlePayNow"
      >
        立即付款
      </button>
      <button
        v-if="actions.includes('remind_shipping')"
        class="action-button secondary-button"
        @click="emitAction('remind_shipping')"
      >
        提醒发货
      </button>
      <button
        v-if="actions.includes('view_logistics')"
        class="action-button secondary-button"
        @click="emitAction('view_logistics')"
      >
        查看物流
      </button>
      <button
        v-if="actions.includes('confirm_receipt')"
        class="action-button primary-button"
        @click="emitAction('confirm_receipt')"
      >
        确认收货
      </button>
      <button
        v-if="actions.includes('rate_order')"
        class="action-button primary-button"
        @click="emitAction('rate_order')"
      >
        评价订单
      </button>
      <button
        v-if="actions.includes('delete_order')"
        class="action-button danger-button"
        @click="emitAction('delete_order')"
      >
        删除订单
      </button>
      <button
        v-if="actions.includes('buy_again')"
        class="action-button secondary-button-orange"
        @click="emitAction('buy_again')"
      >
        再次购买
      </button>
    </div>

    <!-- 支付确认弹窗 -->
    <PaymentConfirmModal
      v-model:visible="showPaymentModal"
      :order-data="orderData"
      @confirm="handlePaymentConfirm"
      @cancel="handlePaymentCancel"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import PaymentConfirmModal from '@/components/payment/PaymentConfirmModal.vue'

const router = useRouter()
const showModal = inject('showModal')

const props = defineProps({
  orderStatus: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
    default: () => [],
  },
  orderData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['order-action'])
const showPaymentModal = ref(false)

const handlePayNow = async () => {
  console.log('Payment data:', props.orderData)

  if (!props.orderData?.payment?.paymentMethod) {
    showModal({
      title: '提示',
      message: '请先选择支付方式',
      showCancelButton: false,
    })
    return
  }

  // 显示支付确认弹窗
  showPaymentModal.value = true
}

const handlePaymentConfirm = async () => {
  try {
    // 模拟支付处理
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // 直接触发支付成功事件并跳转
    emit('order-action', 'pay_now')
  } catch {
    showPaymentModal.value = false
    showModal({
      title: '支付失败',
      message: '支付过程中出现错误，请稍后重试',
      showCancelButton: false,
    })
  }
}

const handlePaymentCancel = () => {
  showPaymentModal.value = false
  router.push('/orders')
}

const emitAction = (actionType) => {
  if (actionType === 'pay_now') {
    handlePayNow()
  } else {
    emit('order-action', actionType)
  }
}
</script>

<style scoped>
.order-detail-actions-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  padding: 12px 24px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  border-top: 1px solid #f0f0f0;
  z-index: 900;
  display: flex;
  justify-content: flex-end;
}

.actions-container {
  display: flex;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  justify-content: flex-end;
}

.action-button {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.primary-button {
  background-color: #ff6f00;
  color: white;
  border-color: #ff6f00;
}

.primary-button:hover {
  background-color: #e65100;
  border-color: #e65100;
}

.secondary-button {
  background-color: #f5f5f5;
  color: #333;
  border-color: #e0e0e0;
}

.secondary-button:hover {
  background-color: #e8e8e8;
  border-color: #d0d0d0;
}

.secondary-button-orange {
  background-color: white;
  color: #ff6f00;
  border: 1px solid #ff6f00;
}

.secondary-button-orange:hover {
  background-color: #fff3e0;
  border-color: #ff9e40;
}

.danger-button {
  background-color: #fff;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.danger-button:hover {
  background-color: #ffeef0;
  color: #c82333;
  border-color: #c82333;
}
</style>
