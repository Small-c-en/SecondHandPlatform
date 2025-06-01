<template>
  <div class="bottom-bar">
    <button class="clear-read" @click="clearReadMessages">清空已读</button>
    <button class="back-to-top" @click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['clearReadMessages', 'scrollToTop'])

const clearReadMessages = () => {
  emit('clearReadMessages')
}

const scrollToTop = () => {
  emit('scrollToTop')
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #eee;
  z-index: 99;
}

.clear-read {
  background-color: #999;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
}

.back-to-top {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
