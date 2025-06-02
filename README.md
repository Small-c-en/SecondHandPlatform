# SecondHandPlatform (二手交易平台)

## 项目介绍

SecondHandPlatform 是一个基于 Vue 3 + Vite 构建的现代化二手交易平台前端项目。该项目采用了最新的前端技术栈，提供了流畅的用户体验和丰富的功能特性。

## 技术栈

- **核心框架：** Vue 3
- **构建工具：** Vite 6
- **状态管理：** Pinia
- **UI 框架：** Element Plus
- **路由管理：** Vue Router 4
- **HTTP 客户端：** Axios
- **CSS 预处理器：** SASS
- **代码规范：** ESLint + Prettier
- **开发工具推荐：** VSCode + Volar

## 项目结构

```
SecondHandPlatform/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── views/             # 页面视图
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── services/          # API 服务
│   ├── data/              # 数据文件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── public/                # 公共资源目录
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── package.json           # 项目依赖配置
├── .eslintrc.js          # ESLint 配置
├── .prettierrc.json      # Prettier 配置
└── README.md             # 项目说明文档
```

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发服务器启动

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 代码格式化

```bash
# ESLint 修复
npm run lint

# Prettier 格式化
npm run format
```

## 主要功能

- 用户认证与授权
- 商品浏览与搜索
- 商品发布与管理
- 在线交易
- 用户消息通知
- 个人中心管理

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范

- 遵循 Vue 3 组合式 API 风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循组件化和模块化开发原则
- 保持代码简洁和可维护性

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 版本历史

- 0.0.0: 项目初始化

## 许可证

[MIT License](LICENSE)
