import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import PaymentSuccessView from '@/views/PaymentSuccessView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('../views/PublishView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true,
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderView.vue'),
    },
    {
      path: '/orderDetail/:orderId',
      name: 'orderDetail',
      component: () => import('../views/OrderDetailView.vue'),
    },
    {
      path: '/productsList',
      name: 'product-list',
      component: () => import('../views/ProductListView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/message-center',
      name: 'message-center',
      component: () => import('../views/MessageCenterView.vue'),
    },
    {
      path: '/chat/:chatId',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      props: true,
    },
    {
      path: '/my-products',
      name: 'my-products',
      component: () => import('../views/MyProductsView.vue'),
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: PaymentSuccessView,
      meta: {
        title: '支付成功',
        requiresAuth: true,
      },
    },
  ],
})

export default router
