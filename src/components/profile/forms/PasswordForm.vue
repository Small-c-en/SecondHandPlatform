<template>
  <form class="password-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="currentPassword">当前密码</label>
      <div class="password-input">
        <input
          id="currentPassword"
          v-model="formData.currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          placeholder="请输入当前密码"
          required
        />
        <button
          type="button"
          class="toggle-btn"
          @click="showCurrentPassword = !showCurrentPassword"
        >
          <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="newPassword">新密码</label>
      <div class="password-input">
        <input
          id="newPassword"
          v-model="formData.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="请输入新密码"
          pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
          required
        />
        <button type="button" class="toggle-btn" @click="showNewPassword = !showNewPassword">
          <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <p class="password-hint">密码必须包含字母和数字，长度至少8位</p>
    </div>

    <div class="form-group">
      <label for="confirmPassword">确认新密码</label>
      <div class="password-input">
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="请再次输入新密码"
          required
        />
        <button
          type="button"
          class="toggle-btn"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">取消</button>
      <button type="submit" class="submit-btn" :disabled="!isValid">确认修改</button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isValid = computed(() => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return (
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword &&
    passwordPattern.test(formData.newPassword)
  )
})

const handleSubmit = () => {
  if (!isValid.value) return

  emit('submit', {
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword,
  })
}
</script>

<style scoped>
.password-form {
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

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding: 8px 12px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.password-input input:focus {
  border-color: #ff5722;
  outline: none;
}

.toggle-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.toggle-btn:hover {
  color: #333;
}

.password-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
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

.submit-btn:hover:not(:disabled) {
  background: #f4511e;
}

.submit-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}
</style>
