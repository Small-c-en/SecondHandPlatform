<template>
  <div>
    <!-- 收货地址 -->
    <div class="address-section">
      <div class="section-header">
        <i class="fas fa-map-marker-alt"></i>
        <span>收货地址</span>
      </div>
      <div class="address-content">
        <div class="selected-address" v-if="selectedAddress">
          <div class="address-info">
            <p class="contact-info">
              <span class="name">{{ selectedAddress.name }}</span>
              <span class="phone">{{ selectedAddress.phone }}</span>
            </p>
            <p class="address-detail">{{ selectedAddress.fullAddress }}</p>
          </div>
          <button class="edit-btn" @click="openAddressModal">
            <i class="fas fa-edit"></i>
            修改
          </button>
        </div>
        <div class="no-address" v-else>
          <button class="add-address-btn" @click="openAddressModal">
            <i class="fas fa-plus"></i>
            添加收货地址
          </button>
        </div>
      </div>
    </div>

    <!-- 地址选择弹窗 -->
    <el-dialog
      v-model="addressModalVisible"
      title="选择收货地址"
      width="700px"
      :show-close="true"
      :close-on-click-modal="false"
    >
      <div class="address-modal-content" v-if="!showAddressForm && !showEditForm">
        <div class="address-list">
          <div
            v-for="addr in addressList"
            :key="addr.id"
            class="address-item"
            :class="{
              'is-default': addr.isDefault,
              'is-selected': addr.id === tempSelectedAddressId,
            }"
            @click="selectAddress(addr.id)"
          >
            <div class="address-item-content">
              <div class="address-item-header">
                <div class="address-item-contact">
                  <span class="name">{{ addr.name }}</span>
                  <span class="phone">{{ addr.phone }}</span>
                </div>
                <div class="address-item-tags">
                  <span v-if="addr.isDefault" class="default-tag">默认</span>
                </div>
              </div>
              <div class="address-item-body">
                <p class="address-detail">{{ addr.fullAddress }}</p>
              </div>
            </div>
            <div class="address-item-actions">
              <button class="action-btn edit-address" @click.stop="editAddress(addr)">
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="action-btn set-default"
                @click.stop="setAsDefault(addr.id)"
                v-if="!addr.isDefault"
              >
                设为默认
              </button>
            </div>
          </div>
        </div>
        <div class="address-modal-footer">
          <button class="add-new-address" @click="showAddressForm = true">
            <i class="fas fa-plus"></i> 新增收货地址
          </button>
          <div class="action-buttons">
            <button class="cancel-btn" @click="addressModalVisible = false">取消</button>
            <button class="confirm-btn" @click="confirmAddressSelection">确认</button>
          </div>
        </div>
      </div>

      <!-- 新增地址表单 -->
      <div class="address-form-container" v-if="showAddressForm">
        <h3 class="form-title">新增收货地址</h3>
        <div class="address-form">
          <div class="form-row">
            <div class="form-group">
              <label>收货人</label>
              <el-input v-model="newAddress.name" placeholder="请输入收货人姓名"></el-input>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <el-input v-model="newAddress.phone" placeholder="请输入手机号码"></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label>所在地区</label>
              <div class="region-selects">
                <el-select v-model="newAddress.province" placeholder="省份">
                  <el-option
                    v-for="item in provinces"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select v-model="newAddress.city" placeholder="城市">
                  <el-option
                    v-for="item in cities"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select v-model="newAddress.district" placeholder="区/县">
                  <el-option
                    v-for="item in districts"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label>详细地址</label>
              <el-input
                v-model="newAddress.detailAddress"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址信息，如街道、门牌号等"
              ></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <el-checkbox v-model="newAddress.isDefault">设为默认收货地址</el-checkbox>
            </div>
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="cancelAddAddress">取消</button>
            <button class="confirm-btn" @click="saveNewAddress">保存</button>
          </div>
        </div>
      </div>

      <!-- 编辑地址表单 -->
      <div class="address-form-container" v-if="showEditForm">
        <h3 class="form-title">编辑收货地址</h3>
        <div class="address-form">
          <div class="form-row">
            <div class="form-group">
              <label>收货人</label>
              <el-input v-model="editingAddress.name" placeholder="请输入收货人姓名"></el-input>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <el-input v-model="editingAddress.phone" placeholder="请输入手机号码"></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label>所在地区</label>
              <div class="region-selects">
                <el-select v-model="editingAddress.province" placeholder="省份">
                  <el-option
                    v-for="item in provinces"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select v-model="editingAddress.city" placeholder="城市">
                  <el-option
                    v-for="item in cities"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select v-model="editingAddress.district" placeholder="区/县">
                  <el-option
                    v-for="item in districts"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label>详细地址</label>
              <el-input
                v-model="editingAddress.detailAddress"
                type="textarea"
                :rows="2"
                placeholder="请输入详细地址信息，如街道、门牌号等"
              ></el-input>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group checkbox-group">
              <el-checkbox v-model="editingAddress.isDefault">设为默认收货地址</el-checkbox>
            </div>
          </div>
          <div class="form-actions">
            <button class="cancel-btn" @click="cancelEditAddress">取消</button>
            <button class="confirm-btn" @click="updateAddress">保存</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElDialog, ElMessage, ElInput, ElSelect, ElOption, ElCheckbox } from 'element-plus'

// 地址相关状态
const addressModalVisible = ref(false)
const selectedAddress = ref(null)
const tempSelectedAddressId = ref(null)
const showAddressForm = ref(false)
const showEditForm = ref(false)

// 新地址表单数据
const newAddress = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
})

// 编辑地址表单数据
const editingAddress = ref({
  id: null,
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
})

// 模拟地址数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****1234',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    detailAddress: '文三路 100 号',
    fullAddress: '浙江省杭州市西湖区文三路 100 号',
    isDefault: true,
  },
  {
    id: 2,
    name: '李四',
    phone: '139****5678',
    province: '浙江省',
    city: '杭州市',
    district: '滨江区',
    detailAddress: '江南大道 200 号',
    fullAddress: '浙江省杭州市滨江区江南大道 200 号',
    isDefault: false,
  },
  {
    id: 3,
    name: '王五',
    phone: '137****9012',
    province: '浙江省',
    city: '杭州市',
    district: '余杭区',
    detailAddress: '仓前街道 300 号',
    fullAddress: '浙江省杭州市余杭区仓前街道 300 号',
    isDefault: false,
  },
  {
    id: 4,
    name: '赵六',
    phone: '136****3456',
    province: '浙江省',
    city: '杭州市',
    district: '拱墅区',
    detailAddress: '莫干山路 400 号',
    fullAddress: '浙江省杭州市拱墅区莫干山路 400 号',
    isDefault: false,
  },
])

// 模拟地区数据
const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省']
const cities = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市']
const districts = ['西湖区', '滨江区', '余杭区', '拱墅区', '上城区']

// 打开地址选择弹窗
const openAddressModal = () => {
  addressModalVisible.value = true
  showAddressForm.value = false
  showEditForm.value = false

  // 设置临时选中的地址ID
  if (selectedAddress.value) {
    tempSelectedAddressId.value = selectedAddress.value.id
  } else {
    // 如果没有选中地址，则默认选中默认地址
    const defaultAddr = addressList.value.find((addr) => addr.isDefault)
    tempSelectedAddressId.value = defaultAddr ? defaultAddr.id : null
  }
}

// 选择地址
const selectAddress = (addressId) => {
  tempSelectedAddressId.value = addressId
}

// 确认地址选择
const confirmAddressSelection = () => {
  selectedAddress.value = addressList.value.find((addr) => addr.id === tempSelectedAddressId.value)
  addressModalVisible.value = false
}

// 编辑地址
const editAddress = (address) => {
  showEditForm.value = true
  showAddressForm.value = false

  // 复制地址数据到编辑表单
  editingAddress.value = {
    id: address.id,
    name: address.name,
    phone: address.phone,
    province: address.province,
    city: address.city,
    district: address.district,
    detailAddress: address.detailAddress,
    isDefault: address.isDefault,
  }

  // 阻止事件冒泡
  event.stopPropagation()
}

// 取消编辑地址
const cancelEditAddress = () => {
  showEditForm.value = false
}

// 更新地址
const updateAddress = () => {
  // 验证表单
  if (!validateAddressForm(editingAddress.value)) {
    return
  }

  // 更新地址数据
  const index = addressList.value.findIndex((addr) => addr.id === editingAddress.value.id)
  if (index !== -1) {
    // 如果设为默认地址，需要将其他地址设为非默认
    if (editingAddress.value.isDefault) {
      addressList.value.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // 更新地址数据
    const updatedAddress = {
      ...editingAddress.value,
      fullAddress: `${editingAddress.value.province}${editingAddress.value.city}${editingAddress.value.district}${editingAddress.value.detailAddress}`,
    }

    addressList.value[index] = updatedAddress

    // 如果当前编辑的是已选中的地址，需要更新选中的地址
    if (selectedAddress.value && selectedAddress.value.id === updatedAddress.id) {
      selectedAddress.value = updatedAddress
    }

    // 更新临时选中的地址ID
    tempSelectedAddressId.value = updatedAddress.id

    ElMessage.success('地址更新成功')
    showEditForm.value = false
  }
}

// 设置默认地址
const setAsDefault = (addressId) => {
  // 将所有地址设为非默认
  addressList.value.forEach((addr) => {
    addr.isDefault = false
  })

  // 将选中的地址设为默认
  const defaultAddress = addressList.value.find((addr) => addr.id === addressId)
  if (defaultAddress) {
    defaultAddress.isDefault = true
    ElMessage.success(`已将 ${defaultAddress.name} 的地址设为默认`)
  }

  // 阻止事件冒泡
  event.stopPropagation()
}

// 取消新增地址
const cancelAddAddress = () => {
  showAddressForm.value = false
  resetNewAddressForm()
}

// 重置新地址表单
const resetNewAddressForm = () => {
  newAddress.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false,
  }
}

// 保存新地址
const saveNewAddress = () => {
  // 验证表单
  if (!validateAddressForm(newAddress.value)) {
    return
  }

  // 生成新的ID
  const newId = Math.max(...addressList.value.map((addr) => addr.id)) + 1

  // 如果设为默认地址，需要将其他地址设为非默认
  if (newAddress.value.isDefault) {
    addressList.value.forEach((addr) => {
      addr.isDefault = false
    })
  }

  // 创建新地址对象
  const newAddressObj = {
    id: newId,
    name: newAddress.value.name,
    phone: newAddress.value.phone,
    province: newAddress.value.province,
    city: newAddress.value.city,
    district: newAddress.value.district,
    detailAddress: newAddress.value.detailAddress,
    fullAddress: `${newAddress.value.province}${newAddress.value.city}${newAddress.value.district}${newAddress.value.detailAddress}`,
    isDefault: newAddress.value.isDefault,
  }

  // 添加到地址列表
  addressList.value.push(newAddressObj)

  // 选中新地址
  tempSelectedAddressId.value = newId

  ElMessage.success('新增地址成功')
  showAddressForm.value = false
  resetNewAddressForm()
}

// 验证地址表单
const validateAddressForm = (form) => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入收货人姓名')
    return false
  }

  if (!form.phone.trim()) {
    ElMessage.warning('请输入手机号码')
    return false
  }

  if (!form.province || !form.city || !form.district) {
    ElMessage.warning('请选择所在地区')
    return false
  }

  if (!form.detailAddress.trim()) {
    ElMessage.warning('请输入详细地址')
    return false
  }

  return true
}
</script>
<style scoped>
.address-section {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 500;
}

.section-header i {
  color: #ff6f00;
}

.selected-address {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #eee;
}

.address-info {
  flex: 1;
}

.contact-info {
  margin: 0 0 8px;
  font-size: 15px;
  color: #333;
}

.contact-info .name {
  font-weight: 500;
  margin-right: 15px;
}

.contact-info .phone {
  color: #666;
}

.address-detail {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.edit-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s;
}

.edit-btn:hover {
  color: #ff6f00;
  border-color: #ff6f00;
}

.no-address {
  text-align: center;
  padding: 20px;
}

.add-address-btn {
  padding: 8px 20px;
  border: 1px dashed #ddd;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.add-address-btn:hover {
  color: #ff6f00;
  border-color: #ff6f00;
}

/* 地址弹窗样式 */
.address-modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.address-list {
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px;
}

.address-item {
  position: relative;
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
}

.address-item:hover {
  border-color: #ff6f00;
  box-shadow: 0 2px 8px rgba(255, 111, 0, 0.1);
}

.address-item.is-selected {
  border-color: #ff6f00;
  background-color: #fff9f5;
}

.address-item.is-default {
  border-color: #ff6f00;
  background-color: #fff9f5;
}

.address-item-content {
  flex: 1;
}

.address-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.address-item-contact {
  display: flex;
  align-items: center;
}

.address-item-contact .name {
  font-weight: 500;
  margin-right: 15px;
  font-size: 15px;
}

.address-item-contact .phone {
  color: #666;
  font-size: 14px;
}

.address-item-tags {
  display: flex;
  gap: 5px;
}

.default-tag {
  padding: 2px 6px;
  background-color: #ff6f00;
  color: white;
  border-radius: 3px;
  font-size: 12px;
}

.address-item-body {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.address-item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 10px;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.action-btn:hover {
  color: #ff6f00;
  border-color: #ff6f00;
}

.address-modal-footer {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.add-new-address {
  padding: 8px 15px;
  border: 1px dashed #ddd;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  font-size: 13px;
}

.add-new-address:hover {
  color: #ff6f00;
  border-color: #ff6f00;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.confirm-btn,
.cancel-btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn {
  background: #ff6f00;
  color: #fff;
  border: none;
}

.confirm-btn:hover {
  background: #f26100;
}

.cancel-btn {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  color: #333;
  border-color: #ccc;
}

/* 地址表单样式 */
.address-form-container {
  padding: 10px;
}

.form-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.region-selects {
  display: flex;
  gap: 10px;
}

.region-selects :deep(.el-select) {
  flex: 1;
}

.checkbox-group {
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

:deep(.el-dialog__header) {
  padding: 15px 20px;
  margin-right: 0;
  border-bottom: 1px solid #eee;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  border-color: #ff6f00;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  border-color: #ff6f00;
  box-shadow: 0 0 0 1px rgba(255, 111, 0, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff6f00;
  border-color: #ff6f00;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #ff6f00;
}
</style>
