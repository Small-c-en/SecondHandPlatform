<template>
  <div class="user-info-card">
    <div class="user-header">
      <div class="avatar-section">
        <div class="avatar-wrapper" @click="triggerAvatarUpload">
          <img :src="userInfo.avatar || '/default-avatar.png'" alt="用户头像" />
          <div class="avatar-overlay">
            <i class="fas fa-camera"></i>
          </div>
        </div>
        <input
          type="file"
          ref="avatarInput"
          accept="image/*"
          style="display: none"
          @change="handleAvatarChange"
        />
      </div>
      <div class="user-basic-info">
        <h2>{{ userInfo.username }}</h2>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ userInfo.favorites }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userInfo.views }}</span>
            <span class="stat-label">浏览</span>
          </div>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="bio-header">
        <h3>个人简介</h3>
        <button class="edit-btn" @click="isEditingBio = true" v-if="!isEditingBio">
          <i class="fas fa-edit"></i> 编辑
        </button>
      </div>
      <div v-if="!isEditingBio" class="bio-content">
        {{ userInfo.bio || '这个人很懒，还没有写简介...' }}
      </div>
      <div v-else class="bio-edit">
        <textarea
          v-model="editedBio"
          placeholder="写点什么来介绍自己吧..."
          maxlength="200"
        ></textarea>
        <div class="bio-actions">
          <span class="char-count">{{ editedBio.length }}/200</span>
          <div class="action-buttons">
            <button class="cancel-btn" @click="cancelBioEdit">取消</button>
            <button class="save-btn" @click="saveBioEdit">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const avatarInput = ref(null)
const isEditingBio = ref(false)
const editedBio = ref('')

// 模拟用户数据
const userInfo = {
  username: '数码达人',
  avatar:
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.IW6IZYi255tkpNFkbH3xIgAAAA?w=213&h=213&c=7&r=0&o=5&dpr=1.5&pid=1.7',
  favorites: 128,
  views: 356,
  bio: '热爱数码产品，专注于二手数码交易5年。致力于为大家提供优质的二手数码产品，让闲置物品发挥更大的价值。',
}

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件类型和大小
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB限制
    alert('图片大小不能超过5MB')
    return
  }

  try {
    // 这里应该调用后端API上传图片
    // const formData = new FormData()
    // formData.append('avatar', file)
    // const response = await uploadAvatar(formData)
    console.log('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    alert('头像上传失败，请重试')
  }
}

const cancelBioEdit = () => {
  isEditingBio.value = false
  editedBio.value = userInfo.bio || ''
}

const saveBioEdit = async () => {
  try {
    // 这里应该调用API保存简介
    // await updateBio(editedBio.value)
    userInfo.bio = editedBio.value
    isEditingBio.value = false
  } catch (error) {
    console.error('保存简介失败:', error)
    alert('保存失败，请重试')
  }
}
</script>

<style scoped>
.user-info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.avatar-section {
  position: relative;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-overlay i {
  color: white;
  font-size: 24px;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.user-basic-info {
  flex: 1;
}

.user-basic-info h2 {
  margin: 0 0 12px;
  font-size: 24px;
  color: #333;
}

.user-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.user-bio {
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.bio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bio-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.edit-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 16px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  border-color: #ff5722;
  color: #ff5722;
}

.bio-content {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.bio-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bio-edit textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  line-height: 1.6;
  transition: border-color 0.3s ease;
}

.bio-edit textarea:focus {
  border-color: #ff5722;
  outline: none;
}

.bio-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.cancel-btn,
.save-btn {
  padding: 6px 16px;
  border-radius: 16px;
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

.save-btn {
  background: #ff5722;
  border: none;
  color: white;
}

.save-btn:hover {
  background: #f4511e;
}
</style>
