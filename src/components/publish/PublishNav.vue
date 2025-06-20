<template>
  <nav class="publish-nav">
    <h1 class="title">发布商品</h1>
    <div class="actions">
      <button class="nav-button draft-btn" @click="$emit('save-draft')">保存草稿</button>
      <button class="nav-button exit-btn" @click="$emit('exit')">退出</button>
    </div>
  </nav>
</template>

<script setup>
import { defineEmits } from 'vue'

defineEmits(['save-draft', 'exit'])
</script>

<style scoped>
.publish-nav {
  position: sticky; /* 或者 fixed，根据是否希望它一直置顶 */
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 55px;
  background-color: white; /* 淡蓝色导航条 */
  border: 1px solid #cccccc6e;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 8px 0px;
  border-radius: 8px;

  z-index: 900;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #ff6f00;
}

.actions .nav-button {
  background-color: #fff;
  border: 1px solid #adb5bd; /* 灰色边框 */
  color: #495057; /* 深灰色文字 */
  padding: 6px 12px;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all ease 0.3s;
}

.actions .nav-button:hover {
  background-color: #fefaf7;
  color: #ff6f00;
  border-color: #ff6f00;
}
</style>
