<template>
  <form class="address-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="name">收货人姓名</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        placeholder="请输入收货人姓名"
        required
      />
    </div>

    <div class="form-group">
      <label for="phone">手机号码</label>
      <input
        id="phone"
        v-model="formData.phone"
        type="tel"
        placeholder="请输入手机号码"
        pattern="[0-9]{11}"
        required
      />
    </div>

    <div class="form-group">
      <label for="province">省份</label>
      <select id="province" v-model="formData.province" required>
        <option value="">请选择省份</option>
        <option v-for="province in provinces" :key="province" :value="province">
          {{ province }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="city">城市</label>
      <select id="city" v-model="formData.city" required>
        <option value="">请选择城市</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="district">区/县</label>
      <select id="district" v-model="formData.district" required>
        <option value="">请选择区/县</option>
        <option v-for="district in districts" :key="district" :value="district">
          {{ district }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="address">详细地址</label>
      <textarea
        id="address"
        v-model="formData.detailAddress"
        placeholder="请输入详细地址，如街道名称、门牌号等"
        required
      ></textarea>
    </div>

    <div class="form-group checkbox">
      <label>
        <input type="checkbox" v-model="formData.isDefault" />
        设为默认地址
      </label>
    </div>

    <div class="form-actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">取消</button>
      <button type="submit" class="submit-btn">保存</button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  address: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// 模拟省市区数据
const provinces = ['广东省', '北京市', '上海市', '浙江省']
const cities = ['广州市', '深圳市', '东莞市', '佛山市']
const districts = ['天河区', '越秀区', '海珠区', '白云区']

const formData = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
})

onMounted(() => {
  if (props.address) {
    Object.assign(formData, props.address)
  }
})

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>

<style scoped>
.address-form {
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

.form-group input[type='text'],
.form-group input[type='tel'],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #ff5722;
  outline: none;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-group.checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
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
