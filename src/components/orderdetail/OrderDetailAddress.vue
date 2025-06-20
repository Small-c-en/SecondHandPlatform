<template>
  <div>
    <!-- 添加收货地址选择 -->
    <div class="address-section">
      <div class="section-header">
        <i class="fas fa-map-marker-alt"></i>
        <span>收货地址</span>
      </div>
      <div class="address-content" v-if="!isEditingAddress">
        <div class="selected-address" v-if="selectedAddress">
          <div class="address-info">
            <p class="contact-info">
              <span class="name">{{ selectedAddress.name }}</span>
              <span class="phone">{{ selectedAddress.phone }}</span>
            </p>
            <p class="address-detail">{{ selectedAddress.fullAddress }}</p>
          </div>
          <button class="edit-btn" @click="startEditAddress">
            <i class="fas fa-edit"></i>
            修改
          </button>
        </div>
        <div class="no-address" v-else>
          <button class="add-address-btn" @click="startEditAddress">
            <i class="fas fa-plus"></i>
            添加收货地址
          </button>
        </div>
      </div>
      <div class="address-edit" v-else>
        <el-select
          v-model="selectedAddressId"
          placeholder="选择收货地址"
          class="address-select"
          @change="handleAddressChange"
        >
          <el-option
            v-for="addr in addressList"
            :key="addr.id"
            :label="formatAddressLabel(addr)"
            :value="addr.id"
          >
            <div class="address-option">
              <p class="option-contact">
                <span class="name">{{ addr.name }}</span>
                <span class="phone">{{ addr.phone }}</span>
              </p>
              <p class="option-address">{{ addr.fullAddress }}</p>
            </div>
          </el-option>
        </el-select>
        <div class="edit-actions">
          <button class="confirm-btn" @click="confirmAddressEdit">确认</button>
          <button class="cancel-btn" @click="cancelAddressEdit">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// 使用 props
import { ref } from 'vue'
// const { order } = props

// 地址相关状态
const isEditingAddress = ref(false)
const selectedAddressId = ref(null)
const selectedAddress = ref(null)

// 模拟地址数据
const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****1234',
    fullAddress: '浙江省杭州市西湖区文三路 100 号',
  },
  {
    id: 2,
    name: '李四',
    phone: '139****5678',
    fullAddress: '浙江省杭州市滨江区江南大道 200 号',
  },
])

// 格式化地址标签
const formatAddressLabel = (address) => {
  return `${address.name} ${address.phone}`
}

// 开始编辑地址
const startEditAddress = () => {
  isEditingAddress.value = true
  if (selectedAddress.value) {
    selectedAddressId.value = selectedAddress.value.id
  }
}

// 确认地址修改
const confirmAddressEdit = () => {
  selectedAddress.value = addressList.value.find((addr) => addr.id === selectedAddressId.value)
  isEditingAddress.value = false
}

// 取消地址修改
const cancelAddressEdit = () => {
  isEditingAddress.value = false
  selectedAddressId.value = selectedAddress.value?.id || null
}

// 处理地址变更
const handleAddressChange = (addressId) => {
  selectedAddressId.value = addressId
}
</script>
<style scoped>
.address-section {
  /* margin: 20px 0; */
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

.address-edit {
  padding: 15px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #eee;
}

.address-select {
  width: 100%;
  margin-bottom: 15px;
}

.address-option {
  padding: 8px 0;
}

.option-contact {
  margin: 0 0 4px;
  font-size: 14px;
}

.option-address {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn,
.cancel-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
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

:deep(.el-select .el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
}
</style>
