<template>
  <div class="image-upload-area">
    <div class="upload-header">
      <h3>商品图片</h3>
      <span class="required-tip">最多上传9张图片，至少上传1张</span>
    </div>

    <div class="upload-content" :class="{ 'has-error': showError }">
      <div class="upload-grid">
        <el-upload
          v-model:file-list="fileList"
          action="/api/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :limit="9"
          :class="{ 'hide-upload': fileList.length >= 9 }"
        >
          <div class="upload-trigger">
            <i class="el-icon-plus upload-icon"></i>
            <span class="upload-text">点击上传</span>
          </div>
        </el-upload>
      </div>

      <span class="error-message" v-if="showError">请至少上传1张商品图片</span>
    </div>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:images'])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([])
const showError = ref(false)

const handleRemove = (uploadFile) => {
  const updatedImages = fileList.value
    .filter((file) => file.uid !== uploadFile.uid)
    .map((file) => ({
      url: file.url,
      name: file.name,
    }))
  emit('update:images', updatedImages)
  validateImages()
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const handleChange = (uploadFile, uploadFiles) => {
  if (uploadFiles.length > 9) {
    uploadFiles.pop() // Remove the last file if exceeding limit
    return
  }

  fileList.value = uploadFiles
  const images = uploadFiles.map((file) => ({
    url: file.url,
    name: file.name,
  }))
  emit('update:images', images)
  validateImages()
}

const validateImages = () => {
  showError.value = fileList.value.length === 0
  return !showError.value
}

// 监听外部传入的images变化
watch(
  () => props.images,
  (newImages) => {
    if (newImages && newImages.length > 0) {
      fileList.value = newImages.map((img) => ({
        name: img.name,
        url: img.url,
      }))
    }
  },
  { deep: true },
)

defineExpose({
  validateImages,
})
</script>

<style scoped>
.image-upload-area {
  margin-top: 24px;
}

.upload-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.upload-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.required-tip {
  color: #999;
  font-size: 14px;
}

.upload-content {
  padding: 20px;
  background: #fff5f0;
  border-radius: 8px;
  border: 1px solid transparent;
}

.upload-content.has-error {
  border-color: #f56c6c;
}

.error-message {
  display: block;
  margin-top: 8px;
  color: #f56c6c;
  font-size: 12px;
}

.upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
  line-height: 148px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
  border-radius: 8px;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8c939d;
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
}

:deep(.hide-upload .el-upload--picture-card) {
  display: none;
}
</style>
