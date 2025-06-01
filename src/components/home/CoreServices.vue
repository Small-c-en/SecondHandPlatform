<template>
  <div class="core-services-section">
    <div class="service-card" @click="handleServiceClick('publish')">
      <div class="service-icon">➕</div>
      <div class="service-name">发布商品</div>
    </div>
    <div class="service-card" @click="handleServiceClick('orders')">
      <div class="service-icon">订单</div>
      <div class="service-name">我的订单</div>
    </div>
    <div class="service-card" @click="handleServiceClick('deals')">
      <div class="service-icon">🔥</div>
      <div class="service-name">今日捡漏</div>
    </div>
    <!-- 可以根据需要添加更多服务卡片 -->
  </div>
</template>

<script setup>
// 卡片点击跳转逻辑
const handleServiceClick = (service) => {
  console.log(`跳转到: ${service}`)
  // 实际项目中会使用 router.push()
}
</script>

<style scoped>
.core-services-section {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: #f9f9f9; /* 比主背景稍浅，或用白色 */
}

.service-card {
  background-color: #fff5e6; /* 浅橙色背景 */
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: calc(33% - 20px); /* 假设3个卡片，留出间隙 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.service-icon {
  font-size: 28px; /* 简约线条图标，这里用 emoji/文字占位 */
  margin-bottom: 10px;
  color: #ff6f00; /* 橙色品牌色 */
}

.service-name {
  font-size: 16px;
  color: #333; /* 白色文字，但浅橙色背景下黑色更清晰 */
}
</style>
