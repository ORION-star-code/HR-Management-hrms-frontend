<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img class="logo" src="@/assets/Back1.jpg" alt="Logo" />
        <h2>Job Application Portal</h2>
      </div>
      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            round
            @click="login"
            class="btn-login"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserLogin",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
        if (this.loginForm.username && this.loginForm.password) {
          try {
            const response = await axios.post("http://localhost:8080/login", this.loginForm);

            if (response.data.code === 1) {
              const userRole = response.data.data.role;
              const employeeId = response.data.data.employeeId;  // 获取 employeeId
              localStorage.setItem("role", userRole);
              localStorage.setItem("token", response.data.data.token); // 存储 token
              localStorage.setItem("employeeId", employeeId);  // 存储 employeeId

              this.$message.success("登录成功");

              if (userRole === "admin") {
                this.$router.push("/admin");
              } else if (userRole === "employee") {
                this.$router.push("/employee/info");
              }
            } else {
              this.$message.error(response.data.msg);
            }
          } catch (error) {
            console.error("Login Error:", error);
            this.$message.error("登录失败，请稍后重试");
          }
        } else {
          this.$message.error("请填写用户名和密码");
        }
      }
   }
};
</script>



<style scoped>
.login-page {
  background-image: url('@/assets/Back1.jpg'); /* 使用导入的图片作为背景 */
  background-size: cover; /* 背景覆盖整个页面 */
  background-position: center; /* 背景居中对齐 */
  height: 100vh; /* 全屏高度 */
  display: flex; /* Flex 布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.login-container {
  background: rgba(255, 255, 255, 0.9); /* 白色背景，带透明度 */
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  width: 350px;
  text-align: center;
}

.login-header {
  margin-bottom: 20px;
}

.logo {
  width: 60px;
  height: 60px;
}

h2 {
  margin: 10px 0 20px;
  color: #333;
}

.login-form {
  width: 100%;
}

.el-input {
  margin-bottom: 20px;
}

.btn-login {
  width: 100%;
}
</style>
