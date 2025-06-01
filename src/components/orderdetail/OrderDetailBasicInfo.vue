<template>
  <div class="order-detail-basic-info detail-card-gray">
    <div class="info-header">
      <div class="left-info">
        <p class="order-number">订单号：{{ order.orderNumber }}</p>
        <p class="order-time">下单时间：{{ order.orderTime }}</p>
      </div>
      <div class="right-info">
        <span :class="['status-tag', getStatusClass(order.status)]">{{
          order.statusText || order.status
        }}</span>
      </div>
    </div>

    <div class="progress-bar-container">
      <div
        v-for="(node, index) in order.progressNodes"
        :key="index"
        :class="['progress-node', getNodeClass(node.status)]"
      >
        <div class="node-dot-container">
          <div class="node-dot"></div>
        </div>
        <div class="node-label">
          <p class="node-name">{{ node.name }}</p>
          <p
            v-if="node.time && (node.status === 'completed' || node.status === 'active')"
            class="node-time"
          >
            {{ formatNodeTime(node.time) }}
          </p>
        </div>
        <div v-if="index < order.progressNodes.length - 1" class="node-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({
      // Provide a more complete default for clarity
      orderNumber: 'N/A',
      orderTime: 'N/A',
      status: 'unknown',
      statusText: '未知状态',
      progressNodes: [],
    }),
  },
})

const getStatusClass = (statusKey) => {
  const statusMap = {
    topay: 'status-orange', // 待付款 - 橙色
    toship: 'status-blue', // 待发货 - 蓝色 (可调整)
    toreceive: 'status-orange', // 待收货 - 橙色 (按要求)
    completed: 'status-green', // 已完成 - 绿色
    cancelled: 'status-grey', // 已取消 - 灰色
    unknown: 'status-grey',
  }
  return statusMap[statusKey] || 'status-grey'
}

const getNodeClass = (nodeStatus) => {
  // nodeStatus can be 'completed', 'active', 'pending'
  return `node-status-${nodeStatus}`
}

const formatNodeTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  // Assuming dateTimeString is like 'YYYY-MM-DD HH:mm:ss'
  // We want to display MM-DD HH:mm
  const parts = dateTimeString.split(' ')
  if (parts.length === 2) {
    const datePart = parts[0].substring(5) // MM-DD
    const timePart = parts[1].substring(0, 5) // HH:mm
    return `${datePart} ${timePart}`
  }
  return dateTimeString // Fallback
}
</script>

<style scoped>
.detail-card-gray {
  background-color: #f8f9fa; /* 浅灰色背景 */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px; /* If used as a standalone card */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.left-info .order-number {
  font-size: 14px;
  color: #6c757d; /* 灰色小字 */
  margin: 0 0 5px 0;
}

.left-info .order-time {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.status-tag {
  padding: 6px 12px;
  border-radius: 15px; /* More rounded tag */
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

/* Status Tag Colors */
.status-orange {
  background-color: #ff6f00;
} /* 橙色 for 待收货, 待付款 */
.status-green {
  background-color: #28a745;
} /* 绿色 for 已完成 */
.status-blue {
  background-color: #007bff;
} /* 蓝色 for 待发货 (example) */
.status-grey {
  background-color: #6c757d;
} /* 灰色 for 已取消, 未知 */

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top for multi-line labels */
  position: relative; /* For absolute positioning of lines */
  padding: 10px 0;
}

.progress-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;
}

.node-dot-container {
  position: relative;
  z-index: 2;
  padding-bottom: 5px; /* Space for the label below */
}

.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc; /* Default pending color */
  border: 2px solid #f8f9fa; /* Same as card background to punch it out */
  box-sizing: border-box;
}

.node-label .node-name {
  font-size: 13px;
  color: #555; /* Default label color */
  margin-top: 8px;
  margin-bottom: 3px;
  font-weight: 500;
}

.node-label .node-time {
  font-size: 11px;
  color: #888;
  margin: 0;
}

/* Node Status Specific Styles */
.progress-node.node-status-completed .node-dot {
  background-color: #6c757d; /* Completed but not active - greyish */
}
.progress-node.node-status-completed .node-label .node-name,
.progress-node.node-status-completed .node-label .node-time {
  color: #6c757d;
}

.progress-node.node-status-active .node-dot {
  background-color: #ff6f00; /* Active node - orange */
  transform: scale(1.25);
}
.progress-node.node-status-active .node-label .node-name,
.progress-node.node-status-active .node-label .node-time {
  color: #ff6f00; /* Orange text for active node */
  font-weight: bold;
}

.progress-node.node-status-pending .node-dot {
  background-color: #e0e0e0; /* Lighter grey for pending */
}
.progress-node.node-status-pending .node-label .node-name {
  color: #aaa;
}

/* Line between nodes */
.progress-node:not(:last-child) .node-line {
  position: absolute;
  top: 6px; /* Vertically center with the dot */
  left: calc(50% + 10px); /* Start after the dot of the current node */
  width: calc(100% - 20px); /* Extend to the next node, leaving space around dots */
  height: 2px;
  background-color: #ccc; /* Default line color */
  z-index: 1;
}

/* Line color for completed segments leading to an active or completed node */
.progress-node.node-status-completed:not(:last-child) .node-line {
  background-color: #6c757d; /* Grey for completed segment lines */
}
.progress-node.node-status-active
  ~ .progress-node.node-status-completed:not(:last-child)
  .node-line {
  background-color: #6c757d;
}

/* Active segment line styling */
.progress-node.node-status-active:not(:last-child) .node-line,
.progress-node.node-status-completed.has-active-next .node-line /* If a completed node is just before an active one */ {
  /* This logic can be complex if we want the line before active to be orange */
  /* Simpler: if a node is completed and its line leads to an active node, make it orange */
}

/* If the node before the active one is completed, its line should be orange */
/* This requires looking ahead or a parent class, which is tricky with pure CSS. */
/* Let's color the line based on the status of the node it originates from for now. */
/* Active node's line leading out (if any) will be orange */
.progress-node.node-status-active:not(:last-child) .node-line {
  background-color: #ff6f00; /* Orange line originating from active node */
}

/* If a completed node is followed by an active node, its connecting line should be orange. */
/* This is slightly more complex to achieve purely with sibling selectors if active node isn't immediate. */
/* For simplicity, the mock data should ensure the node before 'active' is 'completed' */
/* and we can rely on the active node itself to have an orange dot. */
/* The line color from a completed node to an active node: */
/* We can try to make the *previous* completed node's line orange if the *current* one is active. */
/* This is hard. Let's stick to: line color is based on originating node's completed status or active status. */
</style>
