import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Input,
  Button,
  Avatar,
  Select,
  Upload,
} from '@arco-design/web-react';
import {
  IconRobot,
  IconUser,
  IconSend,
  IconCopy,
  IconEdit,
  IconThumbUp,
  IconThumbDown,
  IconImage,
  IconUpload,
} from '@arco-design/web-react/icon';
import MarkdownPreview from '@uiw/react-markdown-preview';
import styles from './index.module.css';

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatRequest {
  username: string;
  message: string;
  session_id?: string;
  nick_token: string;
  model: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}

interface ModelOption {
  value: string;
  label: string;
}

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: '关于React性能优化的讨论',
      lastMessage: '我们来讨论一下React中的性能优化策略...',
      timestamp: Date.now() - 3600000, // 1小时前
    },
    {
      id: '2',
      title: 'TypeScript类型系统',
      lastMessage: '泛型是TypeScript中非常重要的特性...',
      timestamp: Date.now() - 86400000, // 1天前
    },
    {
      id: '3',
      title: '项目架构设计',
      lastMessage: '让我们讨论一下微服务架构的优势...',
      timestamp: Date.now() - 172800000, // 2天前
    },
    {
      id: '4',
      title: 'WebSocket实现原理',
      lastMessage: 'WebSocket提供了全双工通信机制...',
      timestamp: Date.now() - 259200000, // 3天前
    },
  ]);
  const [selectedModel, setSelectedModel] = useState<string>('GPT-4o-mini');

  const modelOptions: ModelOption[] = [
    { value: 'GPT-4o-2024-08-06', label: 'GPT-4o 2024-08-06' },
    { value: 'GPT-4o-mini', label: 'GPT-4o Mini' },
    { value: 'o1-mini', label: 'o1 Mini' },
    { value: 'o1-preview', label: 'o1 Preview' },
    { value: 'GPT-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'Claude-3.5-Sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'GPT-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'GPT-3.5-turbo-instruct', label: 'GPT-3.5 Turbo Instruct' },
    { value: 'LLama-3.1-405b', label: 'LLama 3.1 405b' },
    { value: 'LLama-3.1-70b', label: 'LLama 3.1 70b' },
    { value: 'LLama-3-70b', label: 'LLama 3 70b' },
  ];

  useEffect(() => {
    // 创建WebSocket连接
    const websocket = new WebSocket('ws://127.0.0.1:8081/websocket/chaojin');

    websocket.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    websocket.onmessage = (event) => {
      const data = event.data;

      // 处理sessionId
      if (!sessionId && data.length === 32 && /^[a-f0-9]+$/.test(data)) {
        setSessionId(data);
        return;
      }

      // 处理正常的消息
      setMessages((prev) => {
        // 如果最后一条消息是助手的消息，则替换它
        if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            {
              content: data,
              role: 'assistant',
              timestamp: Date.now(),
            },
          ];
        }
        // 如果最后一条是用户消息，则添加新的助手消息
        return [
          ...prev,
          {
            content: data,
            role: 'assistant',
            timestamp: Date.now(),
          },
        ];
      });
    };

    websocket.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    // 自动滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !ws) return;

    const chatRequest: ChatRequest = {
      username: 'chaojin',
      message: inputValue,
      nick_token: 'chaojin',
      model: selectedModel,
    };

    // 如果有sessionId，添加到请求中
    if (sessionId) {
      chatRequest.session_id = sessionId;
    }

    // 发送消息到服务器
    ws.send(JSON.stringify(chatRequest));

    // 添加用户消息到列表
    setMessages((prev) => [
      ...prev,
      {
        content: inputValue,
        role: 'user',
        timestamp: Date.now(),
      },
    ]);

    setInputValue('');
  };

  // 添加处理markdown输入的函数
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.newChat}>
          <Button long type="outline" className={styles.newChatButton}>
            新对话
          </Button>
        </div>
        <div className={styles.historyList}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={styles.historyItem}>
              <Typography.Text className={styles.historyTitle} ellipsis>
                {chat.title}
              </Typography.Text>
              <Typography.Text
                className={styles.historyMessage}
                type="secondary"
                ellipsis
              >
                {chat.lastMessage}
              </Typography.Text>
              <Typography.Text className={styles.historyTime} type="secondary">
                {new Date(chat.timestamp).toLocaleDateString()}
              </Typography.Text>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <Typography.Title heading={5} style={{ margin: 0 }}>
            ChatGPT 对话
            {sessionId && (
              <Typography.Text
                type="secondary"
                style={{ fontSize: '14px', marginLeft: '8px' }}
              >
                ({sessionId})
              </Typography.Text>
            )}
          </Typography.Title>
        </div>

        <div className={styles.messageList}>
          {messages.map((msg, index) => (
            <div
              key={msg.timestamp}
              className={`${styles.messageWrapper} ${
                msg.role === 'user'
                  ? styles.userMessageWrapper
                  : styles.assistantMessageWrapper
              }`}
            >
              <div className={styles.messageContent}>
                <div className={styles.messageAvatar}>
                  {msg.role === 'user' ? (
                    <Avatar size={36}>
                      <IconUser />
                    </Avatar>
                  ) : (
                    <Avatar size={36} style={{ backgroundColor: '#165DFF' }}>
                      <IconRobot />
                    </Avatar>
                  )}
                </div>
                <div className={styles.messageBody}>
                  <div className={styles.messageRole}>
                    {msg.role === 'user' ? '你' : 'ChatGPT'}
                  </div>
                  <div className={styles.messageText}>
                    <MarkdownPreview
                      source={msg.content}
                      className={styles.markdown}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.messageActions}>
                <div className={styles.actionButton}>
                  <IconCopy /> 复制
                </div>
                <div className={styles.actionButton}>
                  <IconEdit /> 编辑
                </div>
                {msg.role === 'assistant' && (
                  <>
                    <div className={styles.actionButton}>
                      <IconRobot /> 基于当前会话开始
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.toolBar}>
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              options={modelOptions}
              className={styles.modelSelect}
              bordered={false}
              triggerProps={{
                autoAlignPopupWidth: false,
                position: 'bl',
              }}
            />
            <Upload
              action="/api/upload"
              showUploadList={false}
              className={styles.uploadButton}
            >
              <Button
                type="text"
                icon={<IconUpload />}
                className={styles.toolbarButton}
              >
                上传文件
              </Button>
            </Upload>
            <Button
              type="text"
              icon={<IconImage />}
              className={styles.toolbarButton}
              onClick={() => setSelectedModel('dall-e-3')}
            >
              图片生成
            </Button>
          </div>

          <div className={styles.inputWrapper}>
            <Input.TextArea
              value={inputValue}
              onChange={setInputValue}
              placeholder={
                selectedModel === 'dall-e-3'
                  ? '描述你想生成的图片...'
                  : '输入消息... (Shift + Enter 换行，Enter 发送)'
              }
              onKeyDown={handleKeyDown}
              className={styles.input}
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
            <Button
              type="primary"
              icon={<IconSend />}
              className={styles.sendButton}
              onClick={handleSend}
            />
          </div>
          <div className={styles.inputFooter}>
            <Typography.Text type="secondary" className={styles.inputTip}>
              ChatGPT 可能会产生错误信息。考虑检查重要信息。
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
