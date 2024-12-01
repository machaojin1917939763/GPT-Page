# GPT-Page

基于 Arco Design Pro 的 ChatGPT 聊天界面实现，提供流畅的对话体验和现代化的界面设计。

## 功能特点

- 🚀 现代化的聊天界面设计
- 💬 实时消息交互与流式响应
- ✨ 打字机效果的消息显示
- 📝 支持 Markdown 格式
- 🎨 科技感的代码块样式
- 📱 响应式布局设计
- 🔄 会话记录保持
- 🌐 WebSocket 实时通信
- 🎯 支持多种 AI 模型

## 快速开始

### 环境准备

- Node.js >= 14
- npm >= 6
- 现代浏览器（支持 WebSocket）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看页面

### 构建项目

```bash
npm run build
```

## 项目依赖

- [@arco-design/web-react](https://arco.design/react/docs/start) - UI 组件库
- [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) - Markdown 渲染
- WebSocket - 实时通信
- TypeScript - 类型支持
- React - 前端框架

## 项目结构

```
src/
  ├── pages/
  │   ├── example/              # 聊天页面
  │   │   ├── index.tsx        # 页面组件
  │   │   └── index.module.css # 样式文件
  │   └── login/               # 登录相关
  │       ├── index.tsx
  │       └── form.tsx
  ├── mock/                    # 模拟数据
  │   ├── user.ts
  │   └── index.ts
  ├── locale/                  # 国际化配置
  │   └── index.ts
  └── settings.json           # 项目配置
```

## 配置说明

### WebSocket 配置

默认 WebSocket 连接地址为：`ws://127.0.0.1:8081/websocket/chaojin`

可以在 `src/pages/example/index.tsx` 中修改配置：

```typescript
const websocket = new WebSocket('ws://127.0.0.1:8081/websocket/chaojin');
```

### 环境配置

在 `.env.development` 中配置开发环境变量：

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WEBSOCKET_URL=ws://localhost:8081
```

## 开发说明

### 1. 消息格式

```typescript
interface ChatMessage {
  content: string; // 消息内容
  role: 'user' | 'assistant'; // 消息角色
  timestamp: number; // 时间戳
}
```

### 2. 请求格式

```typescript
interface ChatRequest {
  username: string; // 用户名
  message: string; // 消息内容
  session_id?: string; // 会话ID
  nick_token: string; // 用户令牌
  model: string; // AI模型
}
```

### 3. 支持的功能

- 实时对话：通过 WebSocket 实现流式响应
- 会话管理：支持多会话切换和历史记录
- Markdown 渲染：支持代码块、表格等格式
- 响应式设计：适配不同屏幕尺寸

## 注意事项

- 该项目是作为 Arco Design Pro 的一个子页面运行的
- 需要确保 WebSocket 服务器正常运行
- 建议在开发时打开浏览器控制台，查看 WebSocket 连接状态
- 确保后端服务支持 WebSocket 连接
- 在生产环境部署时注意修改相关配置

## 常见问题

1. WebSocket 连接失败

   - 检查服务器是否正常运行
   - 确认 WebSocket 地址配置是否正确
   - 检查网络连接状态

2. 样式问题
   - 确保已正确安装 `@arco-design/web-react` 依赖
   - 检查 CSS 模块导入是否正确

## 贡献指南

欢迎提交 Issue 和 Pull Request

## License

[MIT](LICENSE)
