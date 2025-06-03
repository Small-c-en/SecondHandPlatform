<template>
  <div class="image-upload-area">
    <h3 class="upload-title">商品图片</h3>
    <p class="upload-tip">第一张图片将作为商品主图（最多上传9张，每张不超过5MB）</p>

    <el-upload
      v-model:file-list="fileList"
      action="/api/upload"
      list-type="picture-card"
      :limit="9"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible" width="800px">
      <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:images'])

const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 初始化文件列表
watch(
  () => props.images,
  (newImages) => {
    fileList.value = newImages.map((img, index) => ({
      name: `image-${index + 1}`,
      url: img.url,
      status: 'success',
    }))
  },
  { immediate: true },
)

// 监听文件列表变化
watch(
  fileList,
  (newFileList) => {
    const images = newFileList.map((file) => ({
      url: file.url || URL.createObjectURL(file.raw),
      name: file.name,
    }))
    emit('update:images', images)
  },
  { deep: true },
)

const handleRemove = (uploadFile) => {
  fileList.value = fileList.value.filter((file) => file.uid !== uploadFile.uid)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  return true
}

const handleSuccess = (response, uploadFile) => {
  // 这里应该处理实际的上传响应
  // 目前模拟上传成功
  uploadFile.url = URL.createObjectURL(uploadFile.raw)
  ElMessage.success('上传成功')
}

const handleError = () => {
  ElMessage.error('上传失败，请重试')
}
</script>

<style scoped>
.image-upload-area {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.upload-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.upload-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 150px;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
  transition: all 0.3s;
}

:deep(.el-upload--picture-card:hover) {
  border-color: var(--el-color-primary);
  background-color: #f5f5f5;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  --el-upload-list-picture-card-size: 150px;
}

:deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
