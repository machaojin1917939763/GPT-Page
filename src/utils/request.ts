import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
  timeout: 30000,
  withCredentials: true,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加请求日志
    console.log('Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      data: config.data,
    });

    // 确保请求路径正确
    if (!config.url?.startsWith('/api/')) {
      config.url = `/api${config.url}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 添加详细的错误日志
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      fullError: error,
    });

    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error(`请求的资源不存在: ${error.config.url}`);
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`网络错误: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('未收到响应', error.request);
    } else {
      console.error('请求配置错误', error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
