<template>
  <div class="order-detail-seller-card detail-card">
    <h4 class="section-title">卖家信息</h4>
    <div class="seller-info-content">
      <img
        :src="seller.avatar || 'https://via.placeholder.com/40x40?text=卖家'"
        alt="卖家头像"
        class="seller-avatar"
      />
      <div class="seller-details">
        <p class="seller-nickname">{{ seller.nickname }}</p>
        <div class="seller-rating">
          <!-- Simple star rating (can be replaced with an actual star icon component) -->
          <span
            v-for="n in 5"
            :key="n"
            :class="['star-icon', { filled: n <= Math.round(seller.rating || 0) }]"
          >
            ★
          </span>
          <span class="rating-value">({{ (seller.rating || 0).toFixed(1) }})</span>
        </div>
      </div>
      <button class="contact-seller-button" @click="contactSeller">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="16"
          height="16"
        >
          <path
            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
          />
        </svg>
        联系卖家
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'

const props = defineProps({
  seller: {
    type: Object,
    required: true,
    default: () => ({
      avatar: '',
      nickname: '卖家信息加载中...',
      rating: 0,
    }),
  },
})

const showModal = inject('showModal')

const contactSeller = () => {
  console.log('Contacting seller:', props.seller.nickname)
  if (showModal) {
    showModal({
      title: '联系卖家',
      message: `正在尝试与卖家 ${props.seller.nickname} 取得联系... (功能开发中)`,
    })
  } else {
    alert(`联系卖家 ${props.seller.nickname} (功能开发中)`)
  }
  // This would typically open a chat window or navigate to a messaging page.
}
</script>

<style scoped>
.order-detail-seller-card {
  /* Uses .detail-card from parent View */
}

/* .section-title inherited from parent */

.seller-info-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.seller-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.seller-details {
  flex-grow: 1;
}

.seller-nickname {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.seller-rating {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.star-icon {
  color: #ccc; /* Default empty star color */
  margin-right: 2px;
  font-size: 16px;
}

.star-icon.filled {
  color: #ffc107; /* Filled star color (gold/yellow) */
}

.rating-value {
  margin-left: 5px;
  color: #777;
}

.contact-seller-button {
  background-color: #6c757d; /* Grey background */
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.contact-seller-button svg {
  margin-right: 2px; /* Fine-tune spacing */
}

.contact-seller-button:hover {
  background-color: #5a6268;
}
</style>
