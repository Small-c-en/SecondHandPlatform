<template>
  <el-dialog
    v-model="dialogVisible"
    title="分享商品"
    width="360px"
    :close-on-click-modal="true"
    :show-close="true"
    class="share-dialog"
  >
    <div class="share-content">
      <div class="share-preview">
        <img :src="productImage" :alt="productTitle" class="product-image" />
        <div class="product-info">
          <h4 class="product-title">{{ productTitle }}</h4>
          <div class="product-price">¥{{ productPrice }}</div>
        </div>
      </div>

      <div class="share-methods">
        <div class="share-method" @click="handleCopyLink">
          <el-icon class="share-icon"><Link /></el-icon>
          <span>复制链接</span>
        </div>
        <div class="share-method" @click="handleGenerateQRCode">
          <el-icon class="share-icon"><Promotion /></el-icon>
          <span>二维码</span>
        </div>
        <div class="share-method" @click="handleShareToWeChat">
          <el-icon class="share-icon"><ChatDotRound /></el-icon>
          <span>微信</span>
        </div>
      </div>

      <div v-if="showQRCode" class="qr-code-container">
        <div ref="qrCodeRef" class="qr-code"></div>
        <el-button size="small" @click="downloadQRCode">保存二维码</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Promotion, ChatDotRound } from '@element-plus/icons-vue'
import QRCode from 'qrcode'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  productTitle: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const showQRCode = ref(false)
const qrCodeRef = ref(null)

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

const handleGenerateQRCode = async () => {
  showQRCode.value = true
  await generateQRCode()
}

const generateQRCode = async () => {
  if (!qrCodeRef.value) return

  try {
    const url = window.location.href
    await QRCode.toCanvas(qrCodeRef.value, url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
  } catch (err) {
    ElMessage.error('生成二维码失败')
  }
}

const downloadQRCode = () => {
  const canvas = qrCodeRef.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = `${props.productTitle}-二维码.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const handleShareToWeChat = () => {
  ElMessage.info('请使用微信扫描二维码分享')
  handleGenerateQRCode()
}

watch(
  () => dialogVisible.value,
  (newVal) => {
    if (!newVal) {
      showQRCode.value = false
    }
  },
)
</script>

<style scoped>
.share-content {
  padding: 10px;
}

.share-preview {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  margin: 0;
  font-size: 14px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #ff6f00;
  font-size: 16px;
  font-weight: bold;
}

.share-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.share-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.share-method:hover {
  background: #f5f5f5;
}

.share-icon {
  font-size: 24px;
  color: #666;
}

.share-method span {
  font-size: 12px;
  color: #666;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.qr-code {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
