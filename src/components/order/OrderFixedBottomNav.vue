<template>
  <div class="order-fixed-bottom-nav">
    <button class="nav-button back-home">
      <!-- Placeholder for icon -->
      <span class="icon">🏠</span> 返回首页
    </button>
    <button v-if="showClearCancelledButton" class="nav-button clear-cancelled">
      <!-- Placeholder for icon -->
      <span class="icon">🗑️</span> 清空已取消订单
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// This prop would be true if there are cancelled orders and the current filter is 'cancelled'
// Or a global state indicating cancellable orders exist.
defineProps({
  showClearCancelledButton: {
    type: Boolean,
    default: false,
  },
})

// TODO: Implement actual navigation and clear action
</script>

<style scoped>
.order-fixed-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-evenly; /* Evenly space out the buttons */
  align-items: center;
  background-color: rgba(240, 240, 240, 0.85); /* 半透明灰色背景 */
  backdrop-filter: blur(5px);
  padding: 10px 0;
  height: 60px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-button {
  background-color: transparent; /* Button itself is transparent */
  color: #444; /* 白色图标/文字, but on light bg, darker is better */
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #000;
}

.nav-button .icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
