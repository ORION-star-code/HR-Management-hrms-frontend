import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).use(router).use(ElementPlus).mount('#app');
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("role");
  if (to.path === "/login" && role) {
    // 如果用户已登录且尝试访问登录页，重定向到相应的面板
    if (role === "hr") {
      next("/hr-dashboard");
    } else {
      next("/user-dashboard");
    }
  } else if (to.path === "/login" || role) {
    next(); // 登录成功后才允许进入其他页面
  } else {
    next("/login"); // 未登录则重定向到登录页
  }
});
