<template>
  <div class="register-form">
    <LoadingModal :visible="isLoading" text="注册中..." />
    <h1>注册账号</h1>

    <div class="form-group">
      <div class="input-wrapper">
        <i class="fas fa-mobile-alt"></i>
        <input
          type="text"
          v-model="registerForm.phone"
          placeholder="请输入手机号"
          @focus="handleFocus('phone')"
          @blur="handleBlur('phone')"
          :class="{
            focused: focusedField === 'phone',
            error: showPhoneError,
            valid: isValidPhone(registerForm.phone),
          }"
        />
      </div>
      <div
        class="tip-message"
        :class="{
          error: showPhoneError,
          success: isValidPhone(registerForm.phone) && registerForm.phone,
        }"
      >
        {{ phoneMessage }}
      </div>
    </div>

    <div class="form-group">
      <div class="input-wrapper verify-code">
        <i class="fas fa-shield-alt"></i>
        <input
          type="text"
          v-model="registerForm.verifyCode"
          placeholder="请输入验证码"
          @focus="handleFocus('verifyCode')"
          @blur="handleBlur('verifyCode')"
          :class="{ focused: focusedField === 'verifyCode', valid: registerForm.verifyCode }"
        />
        <button
          class="verify-code-btn"
          :class="{
            counting: isCountingDown,
            active: !isCountingDown && isValidPhone(registerForm.phone),
          }"
          @click="handleGetVerifyCode"
          :disabled="isCountingDown || !isValidPhone(registerForm.phone)"
        >
          {{ countDownText }}
        </button>
      </div>
      <div class="tip-message" :class="{ success: registerForm.verifyCode }">
        {{ verifyCodeMessage }}
      </div>
    </div>

    <div class="form-group">
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="registerForm.password"
          placeholder="请设置密码"
          @focus="handleFocus('password')"
          @blur="handleBlur('password')"
          :class="{
            focused: focusedField === 'password',
            error: showPasswordError,
            valid: isValidPassword,
          }"
        />
        <i
          :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye', 'password-toggle']"
          @click="togglePassword"
        ></i>
      </div>
      <div
        class="tip-message"
        :class="{ error: showPasswordError, success: isValidPassword && registerForm.password }"
      >
        {{ passwordMessage }}
      </div>
    </div>

    <div class="form-group">
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="registerForm.confirmPassword"
          placeholder="请确认密码"
          @focus="handleFocus('confirmPassword')"
          @blur="handleBlur('confirmPassword')"
          :class="{
            focused: focusedField === 'confirmPassword',
            error: showConfirmPasswordError,
            valid: isValidConfirmPassword,
          }"
        />
        <i
          :class="['fas', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'password-toggle']"
          @click="toggleConfirmPassword"
        ></i>
      </div>
      <div
        class="tip-message"
        :class="{
          error: showConfirmPasswordError,
          success: isValidConfirmPassword && registerForm.confirmPassword,
        }"
      >
        {{ confirmPasswordMessage }}
      </div>
    </div>

    <div class="form-actions">
      <button
        class="register-btn"
        @click="handleRegister"
        :disabled="!isFormValid"
        :class="{ disabled: !isFormValid, active: isFormValid }"
      >
        <span class="btn-text">注册</span>
      </button>
      <a class="back-to-login" @click="$emit('switch-to-login')">返回登录</a>
    </div>

    <div class="register-footer">
      <div class="agreement">
        注册即代表您同意
        <a @click.prevent="showAgreement">《用户协议》</a>
        和
        <a @click.prevent="showPrivacy">《隐私政策》</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LoadingModal from '@/components/common/LoadingModal.vue'

const emit = defineEmits(['switch-to-login'])

const focusedField = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isCountingDown = ref(false)
const countDown = ref(60)
const isLoading = ref(false)

const registerForm = ref({
  phone: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
})

const countDownText = computed(() => {
  return isCountingDown.value ? `${countDown.value}秒后重试` : '获取验证码'
})

const showPhoneError = computed(() => {
  if (!registerForm.value.phone) return false
  return !isValidPhone(registerForm.value.phone)
})

const showPasswordError = computed(() => {
  if (!registerForm.value.password) return false
  return registerForm.value.password.length < 6
})

const showConfirmPasswordError = computed(() => {
  if (!registerForm.value.confirmPassword) return false
  return registerForm.value.password !== registerForm.value.confirmPassword
})

const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const isFormValid = computed(() => {
  return (
    isValidPhone(registerForm.value.phone) &&
    registerForm.value.verifyCode &&
    registerForm.value.password.length >= 6 &&
    registerForm.value.password === registerForm.value.confirmPassword
  )
})

const handleFocus = (field) => {
  focusedField.value = field
}

const handleBlur = (field) => {
  if (focusedField.value === field) {
    focusedField.value = null
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleGetVerifyCode = () => {
  if (isCountingDown.value) return

  isCountingDown.value = true
  countDown.value = 60

  const timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--
    } else {
      clearInterval(timer)
      isCountingDown.value = false
    }
  }, 1000)
}

const handleRegister = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    // 模拟注册请求
    await new Promise((resolve) => setTimeout(resolve, 1500))
    emit('switch-to-login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    isLoading.value = false
  }
}

const showAgreement = () => {
  // 触发全局弹窗显示用户协议
  window.$showModal({
    title: '用户协议',
    message: '这里是用户协议内容...',
    confirmText: '我已阅读并同意',
  })
}

const showPrivacy = () => {
  // 触发全局弹窗显示隐私政策
  window.$showModal({
    title: '隐私政策',
    message: '这里是隐私政策内容...',
    confirmText: '我已阅读并同意',
  })
}

const phoneMessage = computed(() => {
  const phone = registerForm.value.phone
  if (!phone) return '请输入手机号'
  return isValidPhone(phone) ? '手机号格式正确' : '请输入正确的手机号'
})

const verifyCodeMessage = computed(() => {
  return registerForm.value.verifyCode ? '验证码已输入' : '请输入验证码'
})

const passwordMessage = computed(() => {
  const password = registerForm.value.password
  if (!password) return '请设置密码'
  return password.length >= 6 ? '密码格式正确' : '密码长度不能少于6位'
})

const confirmPasswordMessage = computed(() => {
  const { password, confirmPassword } = registerForm.value
  if (!confirmPassword) return '请确认密码'
  return password === confirmPassword ? '两次密码输入一致' : '两次输入的密码不一致'
})

const isValidPassword = computed(() => {
  return registerForm.value.password.length >= 6
})

const isValidConfirmPassword = computed(() => {
  const { password, confirmPassword } = registerForm.value
  return confirmPassword && password === confirmPassword
})
</script>

<style scoped>
.register-form {
  width: 100%;
}

.register-form h1 {
  font-size: 24px;
  font-weight: bold;
  color: #ff8a65;
  margin-bottom: 32px;
  text-align: center;
}

.form-group {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i:not(.password-toggle) {
  position: absolute;
  left: 12px;
  color: #bdbdbd;
  transition: color 0.3s ease;
}

.input-wrapper input {
  width: 100%;
  height: 48px;
  padding: 0 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.input-wrapper input.focused {
  border-color: #ff5722;
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.1);
}

.input-wrapper input.focused + i {
  color: #ff5722;
}

.input-wrapper input.error {
  border-color: #f44336;
}

.password-toggle {
  position: absolute !important;
  right: 12px;
  cursor: pointer;
  color: #bdbdbd;
}

.verify-code {
  gap: 12px;
}

.verify-code-btn {
  position: absolute;
  right: 8px;
  padding: 0 16px;
  height: 32px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.verify-code-btn.counting,
.verify-code-btn:disabled {
  background: #ffab91;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.register-btn {
  width: 80%;
  height: 48px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.register-btn:hover {
  background: #e64a19;
}

.register-btn:active {
  transform: scale(0.98);
}

.register-btn.disabled {
  background: #ffab91;
  cursor: not-allowed;
}

.register-btn.active {
  opacity: 1;
  background: #ff5722;
}

.register-btn.active:hover {
  background: #f4511e;
}

.back-to-login {
  color: #ff5722;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.register-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 12px;
  color: #9e9e9e;
}

.agreement a {
  color: #ff5722;
  text-decoration: none;
  cursor: pointer;
}

.tip-message {
  font-size: 12px;
  margin-top: 4px;
  padding-left: 12px;
  color: #ff5722;
  transition: all 0.3s ease;
}

.tip-message.error {
  color: #f44336;
}

.tip-message.success {
  color: #4caf50;
}

.input-wrapper input.valid {
  border-color: #4caf50;
}

.input-wrapper input.valid + i {
  color: #4caf50;
}

.verify-code-btn.active {
  background: #ff5722;
}

.verify-code-btn.active:hover {
  background: #f4511e;
}
</style>
