<template>
  <div class="promotion-area" v-if="promotions && promotions.length > 0">
    <div class="promotion-header">
      <span class="title">优惠信息</span>
    </div>
    <ul class="promotion-list">
      <li v-for="(promo, index) in promotions" :key="index" class="promotion-item">
        <span class="promo-dot"></span>
        <span class="promo-description">{{ promo.description }}</span>
        <span v-if="promo.amount" class="promo-amount">- ¥{{ promo.amount.toFixed(2) }}</span>
      </li>
    </ul>
    <div class="view-all-promotions">
      <a href="#" @click.prevent="$emit('view-all-promos')">查看全部优惠</a>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  promotions: {
    type: Array,
    default: () => [], // Example: [{ description: '满100减10', amount: 10 }, { description: '平台券抵扣5元', amount: 5}]
  },
})

const emit = defineEmits(['view-all-promos'])
</script>

<style scoped>
.promotion-area {
  background-color: #fffaf5; /* 浅橙色背景 */
  padding: 15px 20px;
  margin-top: 10px; /* 与商品列表的间距 */
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.promotion-header {
  margin-bottom: 10px;
}

.promotion-header .title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.promotion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.promotion-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #555;
  padding: 5px 0;
}

.promo-dot {
  width: 6px;
  height: 6px;
  background-color: #ff6f00; /* 橙色小圆点 */
  border-radius: 50%;
  margin-right: 10px;
}

.promo-description {
  flex-grow: 1;
}

.promo-amount {
  color: #e53935; /* 红色字体突出显示优惠金额 */
  font-weight: 500;
}

.view-all-promotions {
  margin-top: 10px;
  text-align: right;
}

.view-all-promotions a {
  font-size: 13px;
  color: #007bff; /* Or your theme's link color */
  text-decoration: none;
}

.view-all-promotions a:hover {
  text-decoration: underline;
}
</style>
