import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  // 计算购物车中所有商品的总数量
  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })

  function addToCart(item) {
    const existingItem = items.value.find((i) => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }

  function removeFromCart(itemId) {
    const index = items.value.findIndex((i) => i.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(itemId, quantity) {
    const item = items.value.find((i) => i.id === itemId)
    if (item) {
      item.quantity = quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalQuantity,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
