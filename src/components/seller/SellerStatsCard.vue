<template>
  <div class="seller-stats-card">
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalSales }}</div>
        <div class="stat-label">总销量</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.productCount }}</div>
        <div class="stat-label">在售商品</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.reviewCount }}</div>
        <div class="stat-label">评价数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.positiveRate }}%</div>
        <div class="stat-label">好评率</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.followerCount }}</div>
        <div class="stat-label">粉丝数</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalSales: 0,
      productCount: 0,
      reviewCount: 0,
      positiveRate: 0,
      followerCount: 0,
    }),
  },
})
</script>

<style scoped>
.seller-stats-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #ff6f00;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

@media screen and (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }
}
</style>
