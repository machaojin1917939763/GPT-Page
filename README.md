# GPT-Page

基于 Arco Design Pro 的 ChatGPT 聊天界面实现。

## 功能特点

- 🚀 现代化的聊天界面设计
- 💬 实时消息交互
- ✨ 打字机效果的消息显示
- 📝 支持 Markdown 格式
- 🎨 科技感的代码块样式
- 📱 响应式布局设计

## 快速开始

### 环境准备

- Node.js >= 14
- npm >= 6

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

## 项目依赖

- [@arco-design/web-react](https://arco.design/react/docs/start) - UI 组件库
- [@uiw/react-markdown-preview](https://github.com/uiwjs/react-markdown-preview) - Markdown 渲染
- WebSocket - 实时通信

## 目录结构

```
src/
  ├── pages/
  │   └── example/
  │       ├── index.tsx        # 聊天页面组件
  │       └── index.module.css # 样式文件
  └── ...
```

## WebSocket 配置

默认 WebSocket 连接地址为：`ws://127.0.0.1:8081/websocket/chaojin`

可以在 `src/pages/example/index.tsx` 中修改配置：

```typescript
const websocket = new WebSocket('ws://127.0.0.1:8081/websocket/chaojin');
```

## 开发说明

1. 消息格式

```typescript
interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}
```

2. 请求格式

```typescript
interface ChatRequest {
  username: string;
  message: string;
  session_id?: string;
  nick_token: string;
  model: string;
}
```

## 注意事项

- 该项目是作为 Arco Design Pro 的一个子页面运行的
- 需要确保 WebSocket 服务器正常运行
- 建议在开发时打开浏览器控制台，查看 WebSocket 连接状态

## License

[MIT](LICENSE)
