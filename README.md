# Vue 3 + TypeScript + Vite 后台管理系统

一个基于 Vue 3、TypeScript、Vite、Element Plus 的现代化后台管理系统模板。

## 🚀 特性

- 💪 Vue 3 + TypeScript + Vite 4
- 🎨 Element Plus
- 📦 Pinia 状态管理
- 🔐 基于角色的权限管理
- 🚦 动态路由
- 📝 可配置化菜单
- 🎯 Axios 封装
- 🔄 请求重试机制
- 📱 响应式设计

## 🛠️ 技术栈

- **Vue3**：采用 Vue3 + script setup 最新的 Composition API
- **TypeScript**：JavaScript 的超集，提供更好的类型检查
- **Vite**：下一代前端构建工具
- **Element Plus**：基于 Vue 3 的组件库
- **Pinia**：新一代状态管理工具
- **Vue Router**：Vue.js 官方路由
- **Axios**：基于 promise 的 HTTP 库

## 📦 项目结构
```bash
├── src/
│ ├── api/ # API 接口管理
│ ├── assets/ # 静态资源
│ ├── components/ # 公共组件
│ ├── config/ # 全局配置
│ ├── enums/ # 枚举定义
│ ├── hooks/ # 组合式函数
│ ├── http/ # Axios 配置和封装
│ ├── layouts/ # 布局组件
│ ├── routers/ # 路由配置
│ ├── stores/ # Pinia 状态管理
│ ├── styles/ # 全局样式
│ ├── types/ # TypeScript 类型定义
│ ├── utils/ # 工具函数
│ └── views/ # 页面组件
```

## 🚀 开始使用

### 环境准备

- Node.js >= 16
- pnpm >= 8

### 安装依赖

- pnpm install

### 启动项目

- pnpm dev

### 生产环境构建

- pnpm build

## 📋 功能特性

1. **用户认证**
   - 登录/注册
   - Token 管理
   - 记住密码

2. **路由管理**
   - 动态路由
   - 菜单权限
   - 面包屑导航

3. **主题定制**
   - 暗黑模式
   - 主题色切换
   - 布局设置

4. **数据处理**
   - 数据持久化
   - 请求重试
   - 错误处理

5. **组件封装**
   - 权限指令
   - 业务组件
   - 通用组件

## 📝 开发规范

1. **命名规范**
   - 文件夹：小写中划线
   - 组件：大驼峰
   - 变量：小驼峰
   - 常量：大写下划线

2. **代码风格**
   - ESLint
   - Prettier
   - TypeScript 严格模式

3. **提交规范**
   - feat: 新功能
   - fix: 修复
   - docs: 文档
   - style: 格式
   - refactor: 重构
   - test: 测试
   - chore: 构建

## 📄 环境变量

```bash
# 开发环境
VITE_BASE_URL=/v3/web/
VITE_DROP_CONSOLE=false

# 生产环境
VITE_BASE_URL=/v3/web/
VITE_DROP_CONSOLE=true
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 📝 License

[MIT](LICENSE)
