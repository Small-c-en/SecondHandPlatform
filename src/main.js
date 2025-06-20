import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/element-plus-theme.scss' // 引入自定义主题

import App from './App.vue'
import router from './router'
import Modal from '@/components/common/Modal.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 注册全局 Modal 组件
app.config.globalProperties.$showModal = ({
  title,
  message,
  confirmText,
  cancelText,
  showCancelButton,
  width,
}) => {
  const modalDiv = document.createElement('div')
  document.body.appendChild(modalDiv)

  const modalApp = createApp(Modal, {
    visible: true,
    title,
    message,
    confirmText,
    cancelText,
    showCancelButton,
    width,
    onClose: () => {
      modalApp.unmount()
      document.body.removeChild(modalDiv)
    },
    onConfirm: () => {
      modalApp.unmount()
      document.body.removeChild(modalDiv)
    },
    onCancel: () => {
      modalApp.unmount()
      document.body.removeChild(modalDiv)
    },
  })

  modalApp.mount(modalDiv)
}

app.mount('#app')
