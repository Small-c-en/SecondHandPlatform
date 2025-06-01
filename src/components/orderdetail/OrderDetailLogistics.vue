<template>
  <div class="order-detail-logistics detail-card">
    <h4 class="section-title">物流追踪</h4>
    <div class="logistics-header">
      <span class="company-name">物流公司：{{ logistics.company || '暂无信息' }}</span>
      <span v-if="logistics.trackingNumber" class="tracking-number">
        运单号：{{ logistics.trackingNumber }}
        <span
          class="copy-icon-inline"
          title="复制运单号"
          @click="copyTrackingNumber(logistics.trackingNumber)"
          >📋</span
        >
      </span>
      <span v-else class="tracking-number">运单号：暂无</span>
    </div>

    <div class="logistics-timeline">
      <div v-if="logistics.updates && logistics.updates.length > 0">
        <div
          v-for="(update, index) in logistics.updates"
          :key="index"
          :class="['timeline-item', { current: index === 0 }]"
        >
          <div class="timeline-node">
            <div :class="['node-dot', { 'current-dot': index === 0 }]"></div>
            <div v-if="index < logistics.updates.length - 1" class="node-line"></div>
          </div>
          <div class="timeline-content">
            <p class="status-text">{{ update.status }}</p>
            <p class="timestamp">{{ update.time }}</p>
            <p v-if="update.location" class="location-text">{{ update.location }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-logistics-info">
        <p>暂无物流更新信息。</p>
      </div>
    </div>

    <!-- Placeholder for dynamic map - This is a simplified text-based representation -->
    <div class="logistics-map-placeholder">
      <div class="map-icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ff6f00"
          width="48"
          height="48"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          />
        </svg>
      </div>
      <p class="map-text">物流动态地图展示区域 (开发中)</p>
      <div v-if="logistics.currentLocation" class="current-location-indicator">
        当前预估位置：{{ logistics.currentLocation }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'

const props = defineProps({
  logistics: {
    type: Object,
    required: true,
    default: () => ({
      company: 'N/A',
      trackingNumber: 'N/A',
      updates: [],
      currentLocation: 'N/A',
    }),
  },
})

const showModal = inject('showModal')

const copyTrackingNumber = async (id) => {
  if (!id || id === 'N/A') return
  try {
    await navigator.clipboard.writeText(id)
    if (showModal) {
      showModal({ title: '复制成功', message: '运单号已复制到剪贴板。' })
    } else {
      alert('运单号已复制到剪贴板。')
    }
  } catch (err) {
    console.error('复制运单号失败:', err)
    if (showModal) {
      showModal({ title: '复制失败', message: '无法复制运单号。' })
    } else {
      alert('无法复制运单号。')
    }
  }
}
</script>

<style scoped>
.order-detail-logistics {
  /* Uses .detail-card from parent */
}

/* .section-title inherited */

.logistics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #555;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 15px;
}

.company-name {
  font-weight: 500;
}

.tracking-number {
  color: #777;
  display: flex;
  align-items: center;
}

.copy-icon-inline {
  margin-left: 5px;
  font-size: 13px;
  color: #007bff;
  cursor: pointer;
}
.copy-icon-inline:hover {
  color: #0056b3;
}

.logistics-timeline {
  position: relative;
  padding-left: 20px; /* Space for timeline nodes */
  margin-bottom: 20px;
}

.timeline-item {
  display: flex;
  position: relative;
  margin-bottom: 15px;
}

.timeline-node {
  position: absolute;
  left: -9px; /* Adjust to center the dot on the imaginary line */
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-dot {
  width: 10px;
  height: 10px;
  background-color: #ccc; /* Default dot color */
  border-radius: 50%;
  z-index: 1;
}

.node-dot.current-dot {
  background-color: #ff6f00; /* Orange for current step */
  width: 12px;
  height: 12px;
  left: -10px; /* Re-center slightly larger dot */
  box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.3);
}

.node-line {
  width: 2px;
  background-color: #ccc; /* Default line color */
  flex-grow: 1;
  min-height: 40px; /* Ensure line is visible even for short content */
  margin-top: 2px;
}

.timeline-item.current .node-line {
  /* No special styling for line of current item, it leads to next potentially */
}

.timeline-content {
  margin-left: 15px; /* Space from node to content */
  padding-bottom: 5px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 3px 0;
}

.timeline-item.current .status-text {
  color: #ff6f00; /* Orange for current status text */
  font-weight: 600;
}

.timestamp {
  font-size: 12px;
  color: #888;
  margin: 0 0 3px 0;
}

.location-text {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.no-logistics-info {
  text-align: center;
  color: #777;
  font-size: 14px;
  padding: 20px 0;
}

.logistics-map-placeholder {
  background-color: #f9f9f9;
  border: 1px dashed #ddd;
  padding: 20px;
  text-align: center;
  color: #777;
  border-radius: 6px;
  margin-top: 10px;
}

.map-icon-container {
  margin-bottom: 10px;
}

.map-text {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.current-location-indicator {
  font-size: 13px;
  color: #ff6f00;
  margin-top: 5px;
}
</style>
