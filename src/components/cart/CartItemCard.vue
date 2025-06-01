<template>
  <div class="cart-item-card" :class="{ selected: item.selected }" @click.self="toggleSelect">
    <div class="item-selector">
      <input
        type="checkbox"
        :id="`item-${item.id}`"
        :checked="item.selected"
        @change="toggleSelect"
      />
    </div>
    <div class="item-thumbnail">
      <img :src="item.imageUrl" :alt="item.name" />
    </div>
    <div class="item-details">
      <p class="item-name">{{ item.name }}</p>
      <div class="item-tags">
        <span class="condition-tag">{{ item.conditionTag }}</span>
      </div>
      <p class="item-price">
        <span class="current-price">¥{{ item.currentPrice }}</span>
        <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
      </p>
    </div>
    <div class="item-quantity">
      <button class="quantity-btn" @click.stop="decreaseQuantity">-</button>
      <input
        type="number"
        class="quantity-input"
        :value="item.quantity"
        @change.stop="updateQuantity"
        @input.stop="manualQuantityInput"
        min="1"
      />
      <button class="quantity-btn" @click.stop="increaseQuantity">+</button>
    </div>
    <div class="item-actions">
      <button class="delete-btn" @click.stop="$emit('delete-item', item.id)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.17l2.12-2.12 1.41 1.41L13.41 13.5l2.12 2.12-1.41 1.41L12 14.93l-2.12 2.12-1.41-1.41L10.59 13.5l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:quantity', 'delete-item', 'update:selected'])

const toggleSelect = () => {
  emit('update:selected', !props.item.selected)
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update:quantity', { id: props.item.id, quantity: props.item.quantity - 1 })
  }
}

const increaseQuantity = () => {
  emit('update:quantity', { id: props.item.id, quantity: props.item.quantity + 1 })
}

const updateQuantity = (event) => {
  let newQuantity = parseInt(event.target.value, 10)
  if (isNaN(newQuantity) || newQuantity < 1) {
    newQuantity = 1
    event.target.value = 1 // Reset input if invalid
  }
  emit('update:quantity', { id: props.item.id, quantity: newQuantity })
}

const manualQuantityInput = (event) => {
  // Allows immediate feedback for typed values, validation on change
  // Can add more complex logic if needed (e.g., max quantity)
}
</script>

<style scoped>
.cart-item-card {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0; /* 浅灰色线条分隔 */
  transition: background-color 0.2s ease;
  margin-bottom: 10px;
  position: relative; /* For potential drag-and-drop indicators if implemented */
}

.cart-item-card.selected {
  background-color: #fff9f2; /* Slightly different background for selected items */
}

.item-selector {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.item-selector input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.item-thumbnail {
  width: 90px;
  height: 90px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持1:1比例 */
}

.item-details {
  flex-grow: 1;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90px; /* Match thumbnail height */
}

.item-name {
  font-weight: bold;
  color: #333; /* 黑色加粗字体 */
  font-size: 15px;
  line-height: 1.4;
  max-height: calc(1.4em * 2); /* 最多两行 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 6px;
}

.item-tags {
  margin-bottom: 6px;
}

.condition-tag {
  background-color: #ff6f00; /* 橙色底 */
  color: white; /* 白字 */
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 10px; /* 圆形 */
  display: inline-block;
}

.item-price .current-price {
  font-size: 18px; /* 橙色大号字体 */
  color: #ff6f00;
  font-weight: bold;
  margin-right: 8px;
}

.item-price .original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.item-quantity {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.quantity-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #555;
  width: 28px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}
.quantity-btn:hover {
  background-color: #eee;
  border-color: #ccc;
}

.quantity-input {
  width: 40px;
  height: 28px;
  text-align: center;
  border: 1px solid #ddd;
  margin: 0 5px;
  font-size: 14px;
  border-radius: 4px;
  -moz-appearance: textfield; /* Firefox */
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.item-actions .delete-btn {
  background: none;
  border: none;
  color: #999; /* 灰色垃圾桶图标 */
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.item-actions .delete-btn:hover {
  color: #e53935; /* Hover时变红 */
}
</style>
