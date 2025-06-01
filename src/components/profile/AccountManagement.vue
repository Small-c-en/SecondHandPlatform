<template>
  <div class="account-management">
    <div class="section-title">
      <h2>账号管理</h2>
      <button class="edit-btn" @click="toggleEditMode">
        {{ isEditing ? '保存' : '编辑' }}
      </button>
    </div>

    <div class="info-sections">
      <div class="info-section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>账号</label>
            <span v-if="!isEditing">{{ userInfo.account }}</span>
            <div v-else class="input-wrapper">
              <input
                v-model="editedInfo.account"
                type="text"
                placeholder="请输入账号"
                @input="validateAccount"
              />
              <span class="error-message" v-if="validationErrors.account">
                {{ validationErrors.account }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <label>用户名</label>
            <span v-if="!isEditing">{{ userInfo.username }}</span>
            <div v-else class="input-wrapper">
              <input
                v-model="editedInfo.username"
                type="text"
                placeholder="请输入用户名"
                @input="validateUsername"
              />
              <span class="error-message" v-if="validationErrors.username">
                {{ validationErrors.username }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <label>手机号</label>
            <span v-if="!isEditing">{{ userInfo.phone }}</span>
            <div v-else class="input-wrapper">
              <input
                v-model="editedInfo.phone"
                type="tel"
                placeholder="请输入手机号"
                @input="validatePhone"
              />
              <span class="error-message" v-if="validationErrors.phone">
                {{ validationErrors.phone }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <label>邮箱</label>
            <span v-if="!isEditing">{{ userInfo.email }}</span>
            <div v-else class="input-wrapper">
              <input
                v-model="editedInfo.email"
                type="email"
                placeholder="请输入邮箱"
                @input="validateEmail"
              />
              <span class="error-message" v-if="validationErrors.email">
                {{ validationErrors.email }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="section-header">
          <h3>收货地址</h3>
          <button class="add-address-btn" @click="openAddressModal('add')">
            <i class="fas fa-plus"></i> 新增地址
          </button>
        </div>
        <div class="address-list">
          <div v-for="address in addresses" :key="address.id" class="address-item">
            <div class="address-info">
              <div class="address-header">
                <span class="name">{{ address.name }}</span>
                <span class="phone">{{ address.phone }}</span>
                <span v-if="address.isDefault" class="default-tag">默认</span>
              </div>
              <div class="address-detail">
                {{
                  `${address.province}${address.city}${address.district}${address.detailAddress}`
                }}
              </div>
            </div>
            <div class="address-actions">
              <button class="action-btn edit" @click="openAddressModal('edit', address)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click="deleteAddress(address.id)">
                <i class="fas fa-trash"></i>
              </button>
              <button
                v-if="!address.isDefault"
                class="action-btn set-default"
                @click="setDefaultAddress(address.id)"
              >
                设为默认
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>安全设置</h3>
        <div class="security-items">
          <div class="security-item">
            <div class="security-info">
              <span class="security-title">登录密码</span>
              <span class="security-desc">建议定期更换密码，确保账号安全</span>
            </div>
            <template v-if="!isChangingPassword">
              <button class="change-btn" @click="startPasswordChange">修改</button>
            </template>
            <template v-else>
              <div class="password-change-form">
                <div v-if="!oldPasswordVerified" class="form-step">
                  <div class="form-group">
                    <label for="oldPassword">请输入旧密码</label>
                    <input
                      id="oldPassword"
                      v-model="passwordForm.oldPassword"
                      type="password"
                      placeholder="请输入旧密码"
                    />
                  </div>
                  <div class="form-actions">
                    <button class="cancel-btn" @click="cancelPasswordChange">取消</button>
                    <button class="verify-btn" @click="verifyOldPassword">验证</button>
                  </div>
                </div>
                <div v-else class="form-step">
                  <div class="form-group">
                    <label for="newPassword">新密码</label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="请输入新密码"
                      pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                    />
                    <p class="password-hint">密码必须包含字母和数字，长度至少8位</p>
                  </div>
                  <div class="form-group">
                    <label for="confirmPassword">确认新密码</label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                  <div class="form-actions">
                    <button class="cancel-btn" @click="cancelPasswordChange">取消</button>
                    <button
                      class="submit-btn"
                      :disabled="!isPasswordValid"
                      @click="submitPasswordChange"
                    >
                      确认修改
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="security-item">
            <div class="security-info">
              <span class="security-title">手机验证</span>
              <span class="security-desc">已绑定手机：{{ maskPhone(userInfo.phone) }}</span>
            </div>
            <button class="change-btn" @click="showPhoneModal = true">修改</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地址管理弹窗 -->
    <CustomModal v-model="showAddressModal">
      <template #title>{{ editingAddress ? '编辑地址' : '新增地址' }}</template>
      <template #content>
        <AddressForm
          :address="editingAddress"
          @submit="handleAddressSubmit"
          @cancel="closeAddressModal"
        />
      </template>
    </CustomModal>

    <!-- 修改手机号弹窗 -->
    <CustomModal v-model="showPhoneModal">
      <template #title>修改手机号</template>
      <template #content>
        <div class="phone-change-form">
          <div v-if="!oldPhoneVerified" class="form-step">
            <div class="form-group">
              <label for="oldPhone">当前手机号</label>
              <input
                id="oldPhone"
                v-model="phoneForm.oldPhone"
                type="tel"
                placeholder="请输入当前手机号"
                @input="validateOldPhone"
              />
              <span class="error-message" v-if="validationErrors.oldPhone">
                {{ validationErrors.oldPhone }}
              </span>
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="cancelPhoneChange">取消</button>
              <button class="verify-btn" :disabled="!isOldPhoneValid" @click="verifyOldPhone">
                验证
              </button>
            </div>
          </div>
          <div v-else class="form-step">
            <div class="form-group">
              <label for="newPhone">新手机号</label>
              <input
                id="newPhone"
                v-model="phoneForm.newPhone"
                type="tel"
                placeholder="请输入新手机号"
                @input="validateNewPhone"
              />
              <span class="error-message" v-if="validationErrors.newPhone">
                {{ validationErrors.newPhone }}
              </span>
            </div>
            <div class="form-group">
              <label for="verificationCode">验证码</label>
              <div class="verification-input">
                <input
                  id="verificationCode"
                  v-model="phoneForm.verificationCode"
                  type="text"
                  placeholder="请输入验证码"
                  pattern="[0-9]{6}"
                  required
                />
                <button
                  type="button"
                  class="send-code-btn"
                  :disabled="!isNewPhoneValid || countdown > 0"
                  @click="sendVerificationCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="cancelPhoneChange">取消</button>
              <button class="submit-btn" :disabled="!isPhoneFormValid" @click="submitPhoneChange">
                确认修改
              </button>
            </div>
          </div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import CustomModal from '../shared/CustomModal.vue'
import AddressForm from './forms/AddressForm.vue'

const isEditing = ref(false)
const showAddressModal = ref(false)
const showPhoneModal = ref(false)
const editingAddress = ref(null)
const oldPhoneVerified = ref(false)
const countdown = ref(0)
let timer = null

const isChangingPassword = ref(false)
const oldPasswordVerified = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validationErrors = reactive({
  account: '',
  username: '',
  phone: '',
  email: '',
  oldPhone: '',
  newPhone: '',
})

const userInfo = reactive({
  account: 'user123',
  username: '数码达人',
  phone: '13800138000',
  email: 'user@example.com',
})

const editedInfo = reactive({ ...userInfo })

const phoneForm = reactive({
  oldPhone: '',
  newPhone: '',
  verificationCode: '',
})

const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detailAddress: '天河路123号',
    isDefault: true,
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detailAddress: '科技园456号',
    isDefault: false,
  },
])

const toggleEditMode = async () => {
  if (isEditing.value) {
    if (!isFormValid.value) {
      alert('请检查输入是否正确')
      return
    }
    try {
      // 这里应该调用API保存修改
      Object.assign(userInfo, editedInfo)
      isEditing.value = false
    } catch (error) {
      console.error('保存失败:', error)
    }
  } else {
    isEditing.value = true
  }
}

const openAddressModal = (type, address = null) => {
  editingAddress.value = type === 'edit' ? { ...address } : null
  showAddressModal.value = true
}

const closeAddressModal = () => {
  showAddressModal.value = false
  editingAddress.value = null
}

const handleAddressSubmit = async (addressData) => {
  try {
    if (editingAddress.value) {
      // 更新地址
      addresses.value = addresses.value.map((addr) =>
        addr.id === editingAddress.value.id ? { ...addr, ...addressData } : addr,
      )
    } else {
      // 新增地址
      const newAddress = {
        id: Date.now(),
        ...addressData,
        isDefault: addresses.value.length === 0,
      }
      addresses.value.push(newAddress)
    }
    closeAddressModal()
  } catch (error) {
    console.error('保存地址失败:', error)
  }
}

const deleteAddress = async (addressId) => {
  if (!confirm('确定要删除这个地址吗？')) return

  try {
    // 这里应该调用API删除地址
    addresses.value = addresses.value.filter((addr) => addr.id !== addressId)
  } catch (error) {
    console.error('删除地址失败:', error)
  }
}

const setDefaultAddress = async (addressId) => {
  try {
    // 这里应该调用API设置默认地址
    addresses.value = addresses.value.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }))
  } catch (error) {
    console.error('设置默认地址失败:', error)
  }
}

const maskPhone = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const startPasswordChange = () => {
  isChangingPassword.value = true
  oldPasswordVerified.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const cancelPasswordChange = () => {
  isChangingPassword.value = false
  oldPasswordVerified.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const verifyOldPassword = async () => {
  try {
    // 这里应该调用API验证旧密码
    // const response = await verifyPassword(passwordForm.oldPassword)
    oldPasswordVerified.value = true
  } catch (error) {
    console.error('密码验证失败:', error)
    alert('旧密码验证失败，请重试')
  }
}

const submitPasswordChange = async () => {
  if (!isPasswordValid.value) return

  try {
    // 这里应该调用API修改密码
    // await changePassword({
    //   oldPassword: passwordForm.oldPassword,
    //   newPassword: passwordForm.newPassword,
    // })
    console.log('密码修改成功')
    isChangingPassword.value = false
    oldPasswordVerified.value = false
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败，请重试')
  }
}

const validateAccount = () => {
  const value = editedInfo.account
  if (!value) {
    validationErrors.account = '账号不能为空'
  } else if (value.length < 4) {
    validationErrors.account = '账号长度不能小于4位'
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    validationErrors.account = '账号只能包含字母、数字和下划线'
  } else {
    validationErrors.account = ''
  }
}

const validateUsername = () => {
  const value = editedInfo.username
  if (!value) {
    validationErrors.username = '用户名不能为空'
  } else if (value.length < 2) {
    validationErrors.username = '用户名长度不能小于2位'
  } else {
    validationErrors.username = ''
  }
}

const validatePhone = () => {
  const value = editedInfo.phone
  if (!value) {
    validationErrors.phone = '手机号不能为空'
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    validationErrors.phone = '请输入正确的手机号'
  } else {
    validationErrors.phone = ''
  }
}

const validateEmail = () => {
  const value = editedInfo.email
  if (!value) {
    validationErrors.email = '邮箱不能为空'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    validationErrors.email = '请输入正确的邮箱地址'
  } else {
    validationErrors.email = ''
  }
}

const validateOldPhone = () => {
  const value = phoneForm.oldPhone
  if (!value) {
    validationErrors.oldPhone = '手机号不能为空'
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    validationErrors.oldPhone = '请输入正确的手机号'
  } else {
    validationErrors.oldPhone = ''
  }
}

const validateNewPhone = () => {
  const value = phoneForm.newPhone
  if (!value) {
    validationErrors.newPhone = '手机号不能为空'
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    validationErrors.newPhone = '请输入正确的手机号'
  } else if (value === phoneForm.oldPhone) {
    validationErrors.newPhone = '新手机号不能与当前手机号相同'
  } else {
    validationErrors.newPhone = ''
  }
}

const isFormValid = computed(() => {
  return (
    !validationErrors.account &&
    !validationErrors.username &&
    !validationErrors.phone &&
    !validationErrors.email
  )
})

const isOldPhoneValid = computed(() => {
  return phoneForm.oldPhone && !validationErrors.oldPhone
})

const isNewPhoneValid = computed(() => {
  return phoneForm.newPhone && !validationErrors.newPhone
})

const isPhoneFormValid = computed(() => {
  return isNewPhoneValid.value && phoneForm.verificationCode.length === 6
})

const isPasswordValid = computed(() => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return (
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordPattern.test(passwordForm.newPassword)
  )
})

const verifyOldPhone = async () => {
  try {
    // 这里应该调用API验证旧手机号
    if (phoneForm.oldPhone === userInfo.phone) {
      oldPhoneVerified.value = true
    } else {
      alert('手机号验证失败')
    }
  } catch (error) {
    console.error('手机号验证失败:', error)
  }
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

const submitPhoneChange = async () => {
  try {
    // 这里应该调用API修改手机号
    userInfo.phone = phoneForm.newPhone
    showPhoneModal.value = false
    oldPhoneVerified.value = false
    phoneForm.oldPhone = ''
    phoneForm.newPhone = ''
    phoneForm.verificationCode = ''
  } catch (error) {
    console.error('修改手机号失败:', error)
  }
}

const cancelPhoneChange = () => {
  showPhoneModal.value = false
  oldPhoneVerified.value = false
  phoneForm.oldPhone = ''
  phoneForm.newPhone = ''
  phoneForm.verificationCode = ''
  clearInterval(timer)
}
</script>

<style scoped>
.account-management {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.edit-btn {
  padding: 8px 24px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-btn:hover {
  background: #f4511e;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.info-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 14px;
  color: #666;
}

.info-item input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.info-item input:focus {
  border-color: #ff5722;
  outline: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-address-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid #ff5722;
  color: #ff5722;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.add-address-btn:hover {
  background: #ff5722;
  color: white;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.address-header {
  margin-bottom: 8px;
}

.address-header .name {
  font-weight: 500;
  margin-right: 12px;
}

.address-header .phone {
  color: #666;
}

.default-tag {
  background: #ff5722;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

.address-detail {
  color: #666;
  font-size: 14px;
}

.address-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: #e3f2fd;
  color: #1976d2;
}

.action-btn.delete {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.set-default {
  background: #fff3e0;
  color: #ff5722;
}

.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-title {
  font-weight: 500;
  color: #333;
}

.security-desc {
  font-size: 14px;
  color: #666;
}

.change-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid #ff5722;
  color: #ff5722;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-btn:hover {
  background: #ff5722;
  color: white;
}

.password-change-form {
  margin-top: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #333;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  border-color: #ff5722;
  outline: none;
}

.password-hint {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.verify-btn,
.submit-btn {
  padding: 6px 16px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.verify-btn:hover,
.submit-btn:hover:not(:disabled) {
  background: #f4511e;
}

.submit-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid #ddd;
  color: #666;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  font-size: 12px;
  color: #ff4d4f;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #ff5722;
  outline: none;
}

.form-group input.error {
  border-color: #ff4d4f;
}
</style>
