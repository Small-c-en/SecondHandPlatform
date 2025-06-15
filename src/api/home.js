// 首页相关接口
import { BASE_URL } from './config'
import request from '@/utils/request'

// 获取首页所有数据
export function getHomeData() {
  return request({
    url: `${BASE_URL}/home`,
    method: 'GET',
  })
}

// 获取分类导航
export function getCategories() {
  return request({
    url: `${BASE_URL}/categories`,
    method: 'GET',
  })
}

// 获取指定分类详情
export function getCategoryById(id) {
  return request({
    url: `${BASE_URL}/categories/${id}`,
    method: 'GET',
  })
}

// 获取轮播图
export function getBanners() {
  return request({
    url: `${BASE_URL}/banners`,
    method: 'GET',
  })
}

// 获取推荐商品
export function getRecommendedProducts(params) {
  return request({
    url: `${BASE_URL}/products/recommended`,
    method: 'GET',
    params,
  })
}

// 获取精选商品
export function getFeaturedProducts() {
  return request({
    url: `${BASE_URL}/products/featured`,
    method: 'GET',
  })
}

// 获取所有排行榜
export function getRankings() {
  return request({
    url: `${BASE_URL}/rankings`,
    method: 'GET',
  })
}

// 获取指定类型排行榜
export function getRankingByType(type) {
  return request({
    url: `${BASE_URL}/rankings/${type}`,
    method: 'GET',
  })
}

// 获取所有楼层
export function getFloors() {
  return request({
    url: `${BASE_URL}/floors`,
    method: 'GET',
  })
}

// 获取指定楼层详情
export function getFloorById(id) {
  return request({
    url: `${BASE_URL}/floors/${id}`,
    method: 'GET',
  })
}

// Mock数据
export const mockHomeData = {
  // 分类导航数据
  categoryNav: [
    {
      id: 1,
      name: '手机数码',
      icon: 'phone',
      children: [
        { id: 11, name: '手机' },
        { id: 12, name: '平板' },
        { id: 13, name: '笔记本' },
      ],
    },
    {
      id: 2,
      name: '电脑办公',
      icon: 'laptop',
      children: [
        { id: 21, name: '台式机' },
        { id: 22, name: '一体机' },
        { id: 23, name: '显示器' },
      ],
    },
  ],

  // 轮播图数据
  carousel: [
    {
      id: 1,
      image: 'https://example.com/banner1.jpg',
      title: '限时特惠',
      link: '/promotion/1',
    },
    {
      id: 2,
      image: 'https://example.com/banner2.jpg',
      title: '新品上市',
      link: '/promotion/2',
    },
  ],

  // 推荐商品数据
  recommendedProducts: [
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      description: '95新 全网通 256GB',
      price: 6999,
      originalPrice: 9599,
      image: 'https://example.com/iphone.jpg',
      badge: '严选认证',
      sales: 1234,
      rating: 4.8,
      tags: ['95新', '官方验机'],
    },
  ],

  // 排行榜数据
  rankings: [
    {
      type: 'hot',
      title: '热销榜',
      icon: 'fire',
      items: [
        {
          id: 1,
          title: 'MacBook Pro M1',
          price: 8999,
          image: 'https://example.com/macbook.jpg',
        },
      ],
    },
  ],

  // 精选推荐数据
  featuredProducts: [
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      description: '95新 全网通 256GB',
      price: 6999,
      originalPrice: 9599,
      image: 'https://example.com/iphone.jpg',
      badge: '严选认证',
    },
  ],

  // 楼层数据
  floors: [
    {
      id: 1,
      title: '夏日焕新',
      subtitle: '品质二手，焕然一新',
      theme: {
        gradient: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
        image: 'https://example.com/theme1.jpg',
      },
      mainProduct: {
        id: 1,
        title: '限量版球鞋',
        price: 1299,
        image: 'https://example.com/shoes.jpg',
      },
      subProducts: [
        {
          id: 1,
          title: '运动手表',
          price: 899,
          image: 'https://example.com/watch.jpg',
          category: '运动装备',
        },
      ],
    },
  ],
}
