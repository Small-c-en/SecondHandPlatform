<template>
  <div class="seller-stats-card">
    <h3 class="stats-title">店铺数据概览</h3>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalSales }}</div>
          <div class="stat-label">总销量</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <el-icon><Goods /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.productCount }}</div>
          <div class="stat-label">在售商品</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <el-icon><ChatSquare /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.reviewCount }}</div>
          <div class="stat-label">评价数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <el-icon><Star /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.positiveRate }}%</div>
          <div class="stat-label">好评率</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.followerCount }}</div>
          <div class="stat-label">粉丝数</div>
        </div>
      </div>
    </div>

    <!-- 添加销售趋势图表预览 -->
    <div class="trend-preview">
      <h4 class="trend-title">
        <span>近期销售趋势</span>
        <el-button link type="primary" size="small">查看详情</el-button>
      </h4>
      <div class="trend-chart">
        <!-- 这里可以放置一个简单的趋势图表 -->
        <div class="chart-placeholder">
          <div class="chart-line">
            <div
              class="chart-dot"
              v-for="i in 7"
              :key="i"
              :style="{ height: getRandomHeight() + '%' }"
            ></div>
          </div>
          <div class="chart-days">
            <span v-for="i in 7" :key="i">{{ getDayLabel(i) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加快捷操作区域 -->
    <div class="quick-actions">
      <el-button type="primary" class="action-button">
        <el-icon><Plus /></el-icon>发布商品
      </el-button>
      <el-button type="warning" class="action-button">
        <el-icon><Promotion /></el-icon>店铺推广
      </el-button>
      <el-button type="success" class="action-button">
        <el-icon><DataAnalysis /></el-icon>数据分析
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {
  ShoppingCart,
  Goods,
  ChatSquare,
  Star,
  User,
  Plus,
  Promotion,
  DataAnalysis,
} from '@element-plus/icons-vue'
import { computed } from 'vue'

const props = defineProps({
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

// 生成随机高度用于图表示例
const getRandomHeight = () => {
  return Math.floor(Math.random() * 60) + 20
}

// 获取最近7天的日期标签
const getDayLabel = (index) => {
  const days = ['一', '二', '三', '四', '五', '六', '日']
  return days[index - 1]
}
</script>

<style scoped>
.seller-stats-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
}

.stats-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 111, 0, 0.1);
  border-radius: 8px;
  margin-right: 12px;
  color: #ff6f00;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* 趋势预览样式 */
.trend-preview {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.trend-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.chart-placeholder {
  height: 100px;
  display: flex;
  flex-direction: column;
}

.chart-line {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 10px;
}

.chart-dot {
  width: 8px;
  background-color: #ff6f00;
  border-radius: 4px;
  position: relative;
}

.chart-dot::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 8px;
  background-color: #ff6f00;
  border-radius: 4px;
  bottom: 0;
  left: 0;
}

.chart-days {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

/* 快捷操作区域 */
.quick-actions {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

@media screen and (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    flex-direction: column;
  }

  .stat-value {
    font-size: 18px;
  }
}
</style>
