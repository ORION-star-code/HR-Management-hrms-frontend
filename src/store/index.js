import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('userToken') || null,
  }),
  actions: {
    async login(credentials) {
      const users = await api.get('/users'); // 从 JSON Server 获取用户数据
      const user = users.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password &&
          u.role === credentials.role
      );

      if (!user) {
        throw new Error('用户名或密码错误');
      }

      this.token = 'fake-token'; // 模拟 token
      this.user = user;
      localStorage.setItem('userToken', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));

      return user.role;
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
    },
  },
});
