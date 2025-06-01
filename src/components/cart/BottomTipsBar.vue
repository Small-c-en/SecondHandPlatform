<template>
  <div class="bottom-tips-bar">
    <p v-for="(tip, index) in tips" :key="index">{{ tip }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  tips: {
    type: Array,
    default: () => ['商品价格以结算为准', '优惠仅在有效期内可用'],
  },
})
</script>

<style scoped>
.bottom-tips-bar {
  padding: 10px 20px;
  background-color: #f9f9f9; /* Very light grey or white */
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.bottom-tips-bar p {
  font-size: 12px;
  color: #888; /* 灰色文字 */
  margin: 3px 0;
  line-height: 1.4;
}
</style>
