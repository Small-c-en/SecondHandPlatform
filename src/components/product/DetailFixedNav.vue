<template>
  <div class="detail-fixed-nav">
    <button class="nav-button back-button">
      <!-- 占位：返回图标 -->
      <span class="icon">←</span> 返回列表
    </button>
    <button class="nav-button share-button">
      <!-- 占位：分享图标 -->
      <span class="icon">↪</span> 分享商品
    </button>
  </div>
</template>

<script setup>
// 逻辑可以后续添加，例如返回列表的路由跳转，分享功能的实现
</script>

<style scoped>
.detail-fixed-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(245, 245, 245, 0.9); /* 半透明灰色背景 */
  backdrop-filter: blur(5px); /* 毛玻璃效果，如果浏览器支持 */
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 确保在最上层 */
  height: 60px; /* 固定高度 */
}

.nav-button {
  background-color: transparent; /* 透明背景，依赖父容器的背景 */
  color: #333; /* 白色文字，但考虑到背景半透明，深色可能更佳 */
  border: none;
  padding: 10px 20px;
  border-radius: 20px; /* 圆角按钮 */
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.nav-button .icon {
  margin-right: 8px;
  font-size: 18px; /* 图标稍大 */
}

/* 为了更好的视觉效果，可以给按钮添加一些交互样式 */
.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* 如果有图标库，可以替换这里的文本图标 */
</style>
