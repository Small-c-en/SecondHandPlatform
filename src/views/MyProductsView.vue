<template>
  <div class="my-products-view">
    <TopNav />
    <div class="content-container">
      <MyProducts />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopNav from '../components/shared/TopNav.vue'
import Footer from '../components/shared/Footer.vue'
import MyProducts from '../components/product/MyProducts.vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  // 如果URL中有status参数，保持该参数
  if (!route.query.status) {
    // 如果没有status参数，但是有其他参数，添加status参数
    const query = { ...route.query }
    if (Object.keys(query).length > 0) {
      router.replace({ path: route.path, query })
    }
  }
})
</script>

<style scoped>
.my-products-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}
</style>
