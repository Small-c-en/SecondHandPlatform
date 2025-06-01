<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-dialog">
        <div v-if="title" class="modal-header">
          <h3>{{ title }}</h3>
          <button v-if="showCloseButton" class="modal-close-button" @click="handleCancel">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p v-html="message"></p>
          <!-- Use v-html if message can contain HTML, otherwise use {{ message }} -->
        </div>
        <div class="modal-footer">
          <button
            v-if="showCancelButton"
            class="btn btn-cancel"
            @click="handleCancel"
            :disabled="isActionInProgress"
          >
            {{ cancelText }}
          </button>
          <button class="btn btn-confirm" @click="handleConfirm" :disabled="isActionInProgress">
            <span v-if="isActionInProgress" class="spinner"></span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '提示',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  showCancelButton: {
    type: Boolean,
    default: false,
  },
  showCloseButton: {
    // Option to show a close (X) button in the header
    type: Boolean,
    default: true,
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true, // Allow closing by clicking outside the dialog
  },
  isActionInProgress: {
    // To show a spinner on the confirm button
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  if (props.isActionInProgress) return
  emit('confirm')
}

const handleCancel = () => {
  if (props.isActionInProgress) return // Prevent closing if action is happening
  emit('cancel')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick && !props.isActionInProgress) {
    emit('cancel') // Treat overlay click as cancel
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure modal is on top */
}

.modal-dialog {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 450px; /* Max width for the modal */
  overflow: hidden;
  transform: translate(0, 0); /* Helps with transition rendering */
}
.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.3s ease;
}
.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: translateY(-20px); /* Slight animation from top */
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.modal-close-button:hover {
  color: #777;
}

.modal-body {
  padding: 20px;
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  max-height: 60vh; /* Prevent very long content from breaking layout */
  overflow-y: auto; /* Add scroll for long messages */
}

.modal-body p {
  margin: 0;
  white-space: pre-wrap; /* Respect newlines in the message string */
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #f9f9f9;
}

.btn {
  padding: 8px 18px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  min-width: 80px; /* Ensure buttons have a decent size */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-confirm {
  background-color: #007bff; /* Primary blue */
  color: white;
  border-color: #007bff;
}
.btn-confirm:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
.btn-confirm:disabled {
  background-color: #a0cfff;
  border-color: #a0cfff;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #f0f0f0; /* Light grey */
  color: #555;
  border-color: #ccc;
}
.btn-cancel:hover {
  background-color: #e0e0e0;
  border-color: #bbb;
}
.btn-cancel:disabled {
  background-color: #f8f8f8;
  border-color: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
  margin-right: 8px; /* Space between spinner and text */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
