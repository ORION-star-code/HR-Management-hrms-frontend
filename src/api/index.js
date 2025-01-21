import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // JSON Server 地址
  timeout: 5000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    alert(error.response?.data?.message || '请求错误');
    return Promise.reject(error);
  }
);

export default api;
