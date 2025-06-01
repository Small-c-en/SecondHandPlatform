<template>
  <div class="profile-content">
    <component :is="currentComponent" v-if="currentComponent" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AccountManagement from './AccountManagement.vue'
import MyProducts from '../product/MyProducts.vue'
import MyFavorites from './MyFavorites.vue'
import BrowsingHistory from './BrowsingHistory.vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
})

const currentComponent = computed(() => {
  switch (props.activeTab) {
    case 'account':
      return AccountManagement
    case 'products':
      return MyProducts
    case 'favorites':
      return MyFavorites
    case 'history':
      return BrowsingHistory
    default:
      return null
  }
})
</script>

<style scoped>
.profile-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-height: 600px;
}
</style>
