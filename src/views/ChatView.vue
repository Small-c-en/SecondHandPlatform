<template>
  <div class="chat-view">
    <div class="chat-header">
      <button class="back-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <h3>{{ chatPartner }}</h3>
    </div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="message.id" class="message-group">
        <!-- 时间显示（每10分钟显示一次） -->
        <div
          v-if="index === 0 || getTimeDiff(messages[index - 1].time, message.time) > 10"
          class="time-divider"
        >
          {{ message.time }}
        </div>
        <div :class="['message-item', message.sender === 'me' ? 'me' : 'other']">
          <div class="message-detail">
            <span class="username" :class="message.sender === 'other' ? 'text-right' : ''">{{
              message.sender === 'me' ? '我' : chatPartner
            }}</span>
            <div class="message-content">{{ message.text }}</div>
          </div>
          <img
            :src="message.sender === 'me' ? myAvatar : partnerAvatar"
            alt="头像"
            class="avatar"
          />
        </div>
      </div>
    </div>
    <div class="chat-shortcut">
      <div class="quick-questions">
        <button v-for="(q, i) in quickQuestions" :key="i" @click="newMessage = q">
          {{ q }}
        </button>
      </div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        v-model="newMessage"
        placeholder="输入消息..."
        @keyup.enter="sendMessage"
      />
      <button
        @click="sendMessage"
        :class="{ 'disabled-btn': !newMessage.trim() }"
        :disabled="!newMessage.trim()"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟用户头像（实际应从接口获取）
const myAvatar =
  'https://c-ssl.dtstatic.com/uploads/blog/202304/15/20230415081411_9a88c.thumb.400_0.jpg'
const partnerAvatar =
  'https://tse4-mm.cn.bing.net/th/id/OIP-C.Ai8cgXo5wJ0eX1m2GWQrGQAAAA?w=180&h=186&c=7&r=0&o=5&dpr=1.5&pid=1.7'

// 模拟聊天数据
const chatPartner = computed(() => `用户${route.params.chatId}`)
const messages = ref([
  { id: 1, sender: 'other', text: '你好，这个商品还在吗？', time: '10:00', avatar: partnerAvatar },
  { id: 2, sender: 'me', text: '在的，还有货。', time: '10:02', avatar: myAvatar },
  { id: 3, sender: 'other', text: '什么时候可以发货？', time: '10:15', avatar: partnerAvatar },
  { id: 4, sender: 'me', text: '明天上午就能发货~', time: '10:16', avatar: myAvatar },
])

// 常用问题列表
const quickQuestions = ref(['这个商品还有货吗？', '什么时候可以发货？', '支持退换货吗？'])

// 计算时间差（分钟）
const getTimeDiff = (time1, time2) => {
  const [h1, m1] = time1.split(':').map(Number)
  const [h2, m2] = time2.split(':').map(Number)
  return (h2 - h1) * 60 + (m2 - m1)
}
const newMessage = ref('')

const goBack = () => {
  router.back()
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      sender: 'me',
      text: newMessage.value,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    newMessage.value = ''
  }
}
</script>

<style scoped lang="scss">
.chat-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: white;
  border-bottom: 1px solid #eee;
  height: 60px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  margin-right: 15px;
  background: none;
  border: none;
  cursor: pointer;
}

.chat-messages {
  padding: 15px;
  margin-top: 60px;
  margin-bottom: 60px;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.time-divider {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin: 10px 0;
}

.message-group {
  margin-bottom: 15px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
}

.message-item.me {
  justify-content: flex-end;
}

.message-item.other {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.message-detail {
  max-width: 70%;
}

.username {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  padding-left: 8px;
}

.message-content {
  padding: 10px 15px;
  border-radius: 15px;
  word-wrap: break-word;
}

.message-item.me .message-content {
  background-color: #007bff;
  color: white;
  margin-left: auto;
}

.message-item.other .message-content {
  background-color: white;
  color: #333;
}

.chat-shortcut {
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
}

.quick-questions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.quick-questions button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background: white;
  cursor: pointer;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.emoji-picker {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.emoji-picker span {
  font-size: 20px;
  cursor: pointer;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 15px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  margin-right: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s;
}

.chat-input input:focus {
  outline: none;
  border-color: #007bff;
}

.chat-input button {
  padding: 15px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.chat-input button.disabled-btn {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
