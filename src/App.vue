<script setup>
import { RouterView } from 'vue-router'
import GlobalModal from '@/components/shared/GlobalModal.vue'
import { reactive, provide, readonly } from 'vue'

// Modal State Management
const modalState = reactive({
  isVisible: false,
  title: '提示',
  message: '',
  confirmText: '确定',
  cancelText: '取消',
  showCancelButton: false,
  showCloseButton: true,
  closeOnOverlayClick: true,
  isActionInProgress: false,
  onConfirm: () => {},
  onCancel: () => {},
  _resolvePromise: null, // Internal for promise-based usage
})

const showModal = (options = {}) => {
  return new Promise((resolve) => {
    modalState.isVisible = true
    modalState.title = options.title || '提示'
    modalState.message = options.message || ''
    ;(modalState.confirmText = options.confirmText || '确定'),
      (modalState.cancelText = options.cancelText || '取消'),
      (modalState.showCancelButton = options.showCancelButton || false)
    modalState.showCloseButton =
      options.showCloseButton === undefined ? true : options.showCloseButton
    modalState.closeOnOverlayClick =
      options.closeOnOverlayClick === undefined ? true : options.closeOnOverlayClick
    modalState.isActionInProgress = options.isActionInProgress || false

    modalState._resolvePromise = resolve // Store the resolve function

    modalState.onConfirm = () => {
      if (options.onConfirm) {
        const result = options.onConfirm()
        if (result instanceof Promise) {
          modalState.isActionInProgress = true
          result
            .then((value) => {
              modalState.isVisible = false
              modalState.isActionInProgress = false
              modalState._resolvePromise({ confirmed: true, value })
            })
            .catch((error) => {
              modalState.isActionInProgress = false
              // Optionally keep modal open or show error in modal
              console.error('Modal onConfirm promise error:', error)
              modalState._resolvePromise({ confirmed: false, error: 'confirm_error' }) // Or re-throw
            })
        } else {
          modalState.isVisible = false
          modalState._resolvePromise({ confirmed: true, value: result })
        }
      } else {
        modalState.isVisible = false
        modalState._resolvePromise({ confirmed: true })
      }
    }

    modalState.onCancel = () => {
      if (options.onCancel) {
        options.onCancel()
      }
      modalState.isVisible = false
      modalState._resolvePromise({ confirmed: false })
    }
  })
}

// Provide the modal control functions to the rest of the app
provide('showModal', showModal)
provide('modalState', readonly(modalState)) // provide readonly state for observation if needed
</script>

<template>
  <RouterView />
  <GlobalModal
    :is-visible="modalState.isVisible"
    :title="modalState.title"
    :message="modalState.message"
    :confirm-text="modalState.confirmText"
    :cancel-text="modalState.cancelText"
    :show-cancel-button="modalState.showCancelButton"
    :show-close-button="modalState.showCloseButton"
    :close-on-overlay-click="modalState.closeOnOverlayClick"
    :is-action-in-progress="modalState.isActionInProgress"
    @confirm="modalState.onConfirm"
    @cancel="modalState.onCancel"
  />
</template>

<style scoped>
/* Add your styles here */
</style>
