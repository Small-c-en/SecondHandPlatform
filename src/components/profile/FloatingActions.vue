<template>
  <div class="floating-action-buttons">
    <button class="fab" @click="handleAction('publish')" title="发布商品">
      <!-- 替换为白色简约图标 -->
      <span>➕</span>
    </button>
    <button class="fab" @click="handleAction('messages')" title="消息中心">
      <span>💬</span>
    </button>
    <button class="fab" @click="handleAction('home')" title="返回首页">
      <span>🏠</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleAction = (action) => {
  console.log(`快捷操作: ${action}`)
  switch (action) {
    case 'publish':
      // router.push('/publish'); // 假设有发布页面路由
      break
    case 'messages':
      // router.push('/messages'); // 假设有消息中心路由
      break
    case 'home':
      router.push('/')
      break
  }
}
</script>

<style scoped>
.floating-action-buttons {
  position: fixed;
  bottom: 30px;
  right: 30px; /* 或者根据整体布局调整，确保在 .profile-view-container 内 */
  display: flex;
  flex-direction: column; /* 或 row，根据设计调整 */
  gap: 15px;
  z-index: 1000;
}

.fab {
  background-color: #ff6f00; /* 橙色背景 */
  color: white;
  border: none;
  border-radius: 50%; /* 圆形 */
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.fab:hover {
  transform: scale(1.1);
}

.fab span {
  font-size: 22px; /* 白色简约图标 */
}
</style>
