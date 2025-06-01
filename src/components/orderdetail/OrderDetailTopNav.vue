<template>
  <div class="order-detail-top-nav detail-card">
    <div class="nav-left">
      <button @click="onBack" class="back-button" aria-label="返回">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
    </div>
    <div class="nav-center">
      <h1 class="nav-title">订单详情</h1>
    </div>
    <div class="nav-right">
      <button class="nav-action-button share-button" aria-label="分享订单" @click="shareOrder">
        <!-- Placeholder for Share Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
          />
        </svg>
      </button>
      <div class="more-actions-wrapper">
        <button
          class="nav-action-button more-button"
          aria-label="更多操作"
          @click="toggleMoreActions"
        >
          <!-- Placeholder for More (three vertical dots) Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
        <transition name="dropdown-fade">
          <div v-if="showMoreActions" class="more-actions-dropdown">
            <ul>
              <li @click="handleAction('collect')">收藏订单</li>
              <li @click="handleAction('add_remark')">添加备注</li>
              <li @click="handleAction('report_issue')">问题反馈</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, inject } from 'vue'

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['back', 'action'])
const showModal = inject('showModal') // Assuming GlobalModal is available

const showMoreActions = ref(false)

const onBack = () => {
  emit('back')
}

const shareOrder = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: '订单详情',
        text: `查看我的订单 ${props.orderId} 的详情。`,
        url: window.location.href, // Shares the current page URL
      })
      console.log('订单分享成功')
    } catch (error) {
      console.error('分享失败:', error)
      if (showModal) showModal({ title: '分享失败', message: '无法完成分享操作。' })
      else alert('分享失败')
    }
  } else {
    // Fallback for browsers that don't support Web Share API (e.g., copy link)
    try {
      await navigator.clipboard.writeText(window.location.href)
      if (showModal)
        showModal({ title: '链接已复制', message: '订单链接已复制到剪贴板，快去分享吧！' })
      else alert('订单链接已复制到剪贴板')
    } catch (error) {
      console.error('复制链接失败:', error)
      if (showModal) showModal({ title: '复制失败', message: '无法复制订单链接。' })
      else alert('无法复制订单链接')
    }
  }
}

const toggleMoreActions = () => {
  showMoreActions.value = !showMoreActions.value
}

const handleAction = (actionType) => {
  showMoreActions.value = false // Close dropdown
  console.log(`More action: ${actionType} for order ${props.orderId}`)
  // emit('action', { type: actionType, orderId: props.orderId }); // Emit to parent if needed
  // For now, just using modal for feedback
  if (showModal) {
    showModal({
      title: '操作提示',
      message: `将对订单 ${props.orderId} 执行操作: ${actionType} (功能开发中)`,
    })
  } else {
    alert(`将对订单 ${props.orderId} 执行操作: ${actionType} (功能开发中)`)
  }
}
</script>

<style scoped>
.order-detail-top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #fff; /* White background as per main page style */
  border-bottom: 1px solid #eee; /* Subtle separator */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  /* Removed .detail-card direct application for more specific control */
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-center {
  flex-grow: 1;
  text-align: center;
}

.nav-title {
  font-size: 18px;
  font-weight: 600; /* Black, bold */
  color: #333;
  margin: 0;
}

.back-button,
.nav-action-button {
  background-color: transparent; /* Default transparent */
  border: none;
  padding: 8px;
  border-radius: 50%; /* Circular for icon buttons */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555; /* Icon color */
  transition: background-color 0.2s;
}

.back-button:hover,
.nav-action-button:hover {
  background-color: #f0f0f0; /* Light grey hover for icon buttons */
}

.share-button {
  background-color: #e0e0e0; /* Grey background for share button */
  color: #fff; /* White icon */
}
.share-button svg {
  fill: #555; /* Darker icon for contrast on grey bg */
}

.share-button:hover {
  background-color: #bdbdbd;
}

.more-actions-wrapper {
  position: relative;
}

.more-actions-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 5px 0;
  width: 160px;
  z-index: 1001;
  margin-top: 8px;
}

.more-actions-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.more-actions-dropdown li {
  padding: 10px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.more-actions-dropdown li:hover {
  background-color: #f5f5f5;
}

/* Dropdown Transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
