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
import TopNav from '../components/shared/TopNav.vue'
import Footer from '../components/shared/Footer.vue'
import MyProducts from '../components/product/MyProducts.vue'
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
