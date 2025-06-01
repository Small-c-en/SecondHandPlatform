<template>
  <form class="phone-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="currentPhone">当前手机号</label>
      <input id="currentPhone" type="tel" :value="maskPhone(currentPhone)" disabled />
    </div>

    <div class="form-group">
      <label for="newPhone">新手机号</label>
      <input
        id="newPhone"
        v-model="formData.newPhone"
        type="tel"
        placeholder="请输入新手机号"
        pattern="[0-9]{11}"
        required
      />
    </div>

    <div class="form-group">
      <label for="verificationCode">验证码</label>
      <div class="verification-input">
        <input
          id="verificationCode"
          v-model="formData.verificationCode"
          type="text"
          placeholder="请输入验证码"
          pattern="[0-9]{6}"
          required
        />
        <button
          type="button"
          class="send-code-btn"
          :disabled="countdown > 0"
          @click="sendVerificationCode"
        >
          {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">取消</button>
      <button type="submit" class="submit-btn">确认修改</button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const currentPhone = '13800138000' // 这里应该从用户数据中获取

const formData = reactive({
  newPhone: '',
  verificationCode: '',
})

const countdown = ref(0)
let timer = null

const maskPhone = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const sendVerificationCode = async () => {
  try {
    // 这里应该调用API发送验证码
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>

<style scoped>
.phone-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-group input:focus:not(:disabled) {
  border-color: #ff5722;
  outline: none;
}

.verification-input {
  display: flex;
  gap: 12px;
}

.verification-input input {
  flex: 1;
}

.send-code-btn {
  padding: 0 16px;
  background: #ff5722;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-code-btn:hover:not(:disabled) {
  background: #f4511e;
}

.send-code-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
}

.cancel-btn:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.submit-btn {
  background: #ff5722;
  border: none;
  color: white;
}

.submit-btn:hover {
  background: #f4511e;
}
</style>
