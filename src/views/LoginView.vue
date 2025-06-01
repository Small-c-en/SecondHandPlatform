<template>
  <div class="login-page">
    <LoadingModal :visible="isLoading" text="登录中..." />
    <nav class="login-nav">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <div class="logo-icon">
            <i class="fas fa-recycle"></i>
            <i class="fas fa-shopping-cart"></i>
          </div>
          <span>二手平台</span>
        </router-link>
      </div>
      <div class="welcome-text">
        <span>让闲置物品流动起来</span>
        <div class="sub-text">优质二手交易平台</div>
      </div>
    </nav>

    <div class="login-container">
      <div class="auth-form">
        <RegisterForm v-if="showRegister" @switch-to-login="showRegister = false" />

        <div v-else class="login-form">
          <h1>登录</h1>

          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                type="text"
                v-model="loginForm.account"
                placeholder="请输入手机号或邮箱"
                @focus="handleFocus('account')"
                @blur="handleBlur('account')"
                :class="{
                  focused: focusedField === 'account',
                  error: showAccountError,
                  valid: isValidAccount,
                }"
              />
            </div>
            <div
              class="tip-message"
              :class="{ error: showAccountError, success: isValidAccount && loginForm.account }"
            >
              {{ accountMessage }}
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="loginForm.password"
                placeholder="请输入密码"
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
              :class="{ error: showPasswordError, success: isValidPassword && loginForm.password }"
            >
              {{ passwordMessage }}
            </div>
          </div>

          <div class="form-group" v-if="showVerifyCode">
            <div class="input-wrapper verify-code">
              <i class="fas fa-puzzle-piece fa-spin"></i>
              <input
                type="text"
                v-model="loginForm.verifyCode"
                placeholder="请输入验证码"
                @focus="handleFocus('verifyCode')"
                @blur="handleBlur('verifyCode')"
                :class="{ focused: focusedField === 'verifyCode' }"
              />
              <button
                class="verify-code-btn"
                :class="{ counting: isCountingDown }"
                @click="handleGetVerifyCode"
                :disabled="isCountingDown || !isValidAccount"
              >
                {{ countDownText }}
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button
              class="login-btn"
              @click="handleLogin"
              :disabled="!isFormValid"
              :class="{ disabled: !isFormValid, active: isFormValid }"
            >
              <span class="btn-text">登录</span>
            </button>
            <div class="action-links">
              <a class="register-link" @click="showRegister = true">注册账号</a>
              <a class="forgot-password" @click="handleForgotPassword">忘记密码？</a>
            </div>
          </div>

          <div class="third-party-login">
            <div class="divider">
              <span>其他方式登录</span>
            </div>
            <div class="third-party-icons">
              <div
                class="icon-item"
                v-for="platform in thirdPartyPlatforms"
                :key="platform.name"
                @click="handleThirdPartyLogin(platform.name)"
              >
                <img :src="platform.icon" :alt="platform.name" />
                <span>{{ platform.name }}</span>
              </div>
            </div>
          </div>

          <div class="login-footer">
            <label class="remember-password">
              <input type="checkbox" v-model="loginForm.rememberPassword" />
              <span>记住密码</span>
            </label>
            <div class="agreement">
              登录即代表您同意
              <a @click.prevent="showAgreement">《用户协议》</a>
              和
              <a @click.prevent="showPrivacy">《隐私政策》</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import LoadingModal from '@/components/common/LoadingModal.vue'

const router = useRouter()
const showRegister = ref(false)
const focusedField = ref(null)
const showPassword = ref(false)
const showVerifyCode = ref(false)
const isCountingDown = ref(false)
const countDown = ref(60)
const isLoading = ref(false)

const loginForm = ref({
  account: '',
  password: '',
  verifyCode: '',
  rememberPassword: false,
})

const thirdPartyPlatforms = [
  {
    name: '微信',
    icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.png',
  },
  {
    name: '支付宝',
    icon: 'https://img.alicdn.com/tfs/TB1OIxTF4v1gK0jSZFFXXb0sXXa-200-200.png',
  },
  {
    name: 'QQ',
    icon: 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tencent-login/logo_qq.png',
  },
]

const countDownText = computed(() => {
  return isCountingDown.value ? `${countDown.value}秒后重试` : '获取验证码'
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

const handleLogin = async () => {
  if (!isFormValid.value || isLoading.value) return

  isLoading.value = true
  try {
    // 模拟登录请求
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

const showAgreement = () => {
  window.$showModal({
    title: '用户协议',
    message: `
      <div class="agreement-content">
        <h3>用户协议</h3>
        <p>欢迎使用我们的二手交易平台！</p>
        <h4>1. 服务条款</h4>
        <p>本协议是您与二手交易平台之间的法律协议，请您仔细阅读。</p>
        <h4>2. 账号注册</h4>
        <p>用户注册时应当提供真实、准确、完整的个人资料。</p>
        <h4>3. 用户义务</h4>
        <p>用户应当遵守中华人民共和国相关法律法规。</p>
        <h4>4. 交易规则</h4>
        <p>平台仅为用户提供信息发布及交易的平台，用户应自行承担交易风险。</p>
        <h4>5. 隐私保护</h4>
        <p>我们将严格保护用户的个人信息安全。</p>
      </div>
    `,
    confirmText: '我已阅读并同意',
    showCancelButton: true,
    cancelText: '暂不同意',
    width: '600px',
  })
}

const showPrivacy = () => {
  window.$showModal({
    title: '隐私政策',
    message: `
      <div class="privacy-content">
        <h3>隐私政策</h3>
        <p>我们非常重视您的隐私保护。</p>
        <h4>1. 信息收集</h4>
        <p>我们收集的信息包括但不限于：用户名、手机号、邮箱等。</p>
        <h4>2. 信息使用</h4>
        <p>我们收集的信息将用于：提供服务、改善体验、安全保障等。</p>
        <h4>3. 信息保护</h4>
        <p>我们采用业界标准的安全技术保护您的个人信息。</p>
        <h4>4. 信息共享</h4>
        <p>未经您的同意，我们不会向第三方分享您的个人信息。</p>
        <h4>5. Cookie使用</h4>
        <p>我们使用Cookie来提供更好的服务体验。</p>
      </div>
    `,
    confirmText: '我已阅读并同意',
    showCancelButton: true,
    cancelText: '暂不同意',
    width: '600px',
  })
}

const handleForgotPassword = () => {
  // 处理忘记密码
}

const handleThirdPartyLogin = (platform) => {
  console.log(`使用 ${platform} 登录`)
}

const showAccountError = computed(() => {
  if (!loginForm.value.account) return false
  return !isValidAccount.value
})

const showPasswordError = computed(() => {
  if (!loginForm.value.password) return false
  return loginForm.value.password.length < 6
})

const accountMessage = computed(() => {
  const account = loginForm.value.account
  if (!account) return '请输入手机号或邮箱'
  if (account.includes('@')) {
    return isValidEmail(account) ? '邮箱格式正确' : '请输入正确的邮箱格式'
  }
  return isValidPhone(account) ? '手机号格式正确' : '请输入正确的手机号'
})

const passwordMessage = computed(() => {
  const password = loginForm.value.password
  if (!password) return '请输入密码'
  return password.length >= 6 ? '密码格式正确' : '密码长度不能少于6位'
})

const isValidAccount = computed(() => {
  const account = loginForm.value.account
  if (!account) return false
  return account.includes('@') ? isValidEmail(account) : isValidPhone(account)
})

const isValidPassword = computed(() => {
  return loginForm.value.password.length >= 6
})

const isFormValid = computed(() => {
  return isValidAccount.value && isValidPassword.value
})

function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5, #ededed);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.login-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  z-index: 100;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #ff5722;
  font-size: 24px;
  font-weight: bold;
}

.logo-icon {
  position: relative;
  width: 32px;
  height: 32px;
}

.logo-icon i {
  position: absolute;
  font-size: 20px;
}

.logo-icon .fa-recycle {
  top: 0;
  left: 0;
  transform: rotate(-30deg);
}

.logo-icon .fa-shopping-cart {
  bottom: 0;
  right: 0;
  transform: scale(0.8);
}

.welcome-text {
  text-align: right;
  color: #666;
}

.welcome-text span {
  font-size: 18px;
  font-weight: 500;
}

.sub-text {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.auth-form {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.login-form h1 {
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

.login-btn {
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

.login-btn:disabled {
  background: #ffab91;
  cursor: not-allowed;
  opacity: 0.8;
}

.login-btn:active {
  transform: scale(0.98);
}

.btn-text {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.btn-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.action-links {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.register-link,
.forgot-password {
  color: #ff5722;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.third-party-login {
  margin-top: 40px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 100px);
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #9e9e9e;
  font-size: 14px;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon-item:hover {
  transform: scale(1.1);
}

.icon-item img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.icon-item span {
  font-size: 12px;
  color: #666;
}

.login-footer {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9e9e9e;
}

.remember-password {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-password input[type='checkbox'] {
  accent-color: #ff5722;
}

.agreement a {
  color: #ff5722;
  text-decoration: none;
  cursor: pointer;
}

.error-message {
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
  padding-left: 12px;
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

.login-btn {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.login-btn.active {
  opacity: 1;
  background: #ff5722;
}

.login-btn.active:hover {
  background: #f4511e;
}

.login-btn.disabled {
  background: #ffab91;
  cursor: not-allowed;
}

/* Modal content styles */
:deep(.agreement-content),
:deep(.privacy-content) {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 16px;
}

:deep(.agreement-content) h3,
:deep(.privacy-content) h3 {
  color: #333;
  margin-bottom: 16px;
}

:deep(.agreement-content) h4,
:deep(.privacy-content) h4 {
  color: #666;
  margin: 16px 0 8px;
}

:deep(.agreement-content) p,
:deep(.privacy-content) p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}
</style>
