<template>
  <div class="review-page">
    <TopNav title="商品评价" />

    <div class="review-container">
      <!-- 商品信息 -->
      <div class="product-card">
        <el-image
          :src="product.image"
          :preview-src-list="[product.image]"
          fit="cover"
          class="product-image"
        />
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>

      <!-- 评价表单 -->
      <div class="review-form">
        <div class="form-item">
          <div class="form-label">商品评分</div>
          <div class="rating-group">
            <el-rate
              v-model="form.rating"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :texts="['很差', '较差', '一般', '不错', '很好']"
              show-text
            />
          </div>
        </div>

        <div class="form-item">
          <div class="form-label">评价内容</div>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="请分享您对商品的使用体验"
            maxlength="500"
            show-word-limit
          />
        </div>

        <div class="form-item">
          <div class="form-label">上传图片</div>
          <el-upload
            v-model:file-list="form.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="6"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>

        <div class="form-item">
          <div class="form-label">匿名评价</div>
          <el-switch v-model="form.anonymous" />
        </div>

        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交评价
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" title="预览">
      <img :src="previewUrl" alt="Preview" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TopNav from '@/components/shared/TopNav.vue'

const route = useRoute()
const router = useRouter()

// 商品信息
const product = ref({
  id: '',
  name: '',
  price: '',
  image: '',
})

// 表单数据
const form = ref({
  rating: 5,
  content: '',
  images: [],
  anonymous: false,
})

const submitting = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')

// 获取商品信息
const fetchProductInfo = async () => {
  try {
    // TODO: 调用API获取商品信息
    product.value = {
      id: route.params.id,
      name: 'iPhone 13 Pro Max',
      price: '8999.00',
      image: 'https://example.com/iphone.jpg',
    }
  } catch (error) {
    ElMessage.error('获取商品信息失败')
  }
}

// 处理图片预览
const handlePreview = (file) => {
  previewUrl.value = file.url
  previewVisible.value = true
}

// 处理图片移除
const handleRemove = (file, fileList) => {
  form.value.images = fileList
}

// 处理图片上传
const handleChange = (file, fileList) => {
  form.value.images = fileList
}

// 处理取消
const handleCancel = () => {
  router.back()
}

// 处理提交
const handleSubmit = async () => {
  if (!form.value.content.trim()) {
    ElMessage.warning('请输入评价内容')
    return
  }

  submitting.value = true
  try {
    // TODO: 调用API提交评价
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('评价提交成功')
    router.back()
  } catch (error) {
    ElMessage.error('评价提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchProductInfo()
})
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background: #f5f5f5;
  margin-top: 60px;
}

.review-container {
  padding: 16px;
}

.product-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 18px;
  font-weight: 500;
  color: #ff6f00;
}

.review-form {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
}

.rating-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

@media screen and (max-width: 768px) {
  .review-container {
    padding: 12px;
  }

  .product-card {
    padding: 12px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .product-name {
    font-size: 14px;
  }

  .product-price {
    font-size: 16px;
  }

  .review-form {
    padding: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
