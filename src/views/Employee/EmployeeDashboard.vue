<template>
  <el-container class="dashboard">
    <!-- 头部 -->
    <el-header class="header">
      <div class="user-info">
        <el-avatar :src="avatarUrl || '/path/to/avatar.jpg'" size="medium" />
        <span class="user-name">{{ userName || "员工名字" }}</span>
      </div>
      <el-button
        class="logout-button"
        type="danger"
        size="small"
        @click="logout"
      >
        退出登录
      </el-button>
    </el-header>

    <!-- 侧边栏和内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="250px" class="aside">
        <el-menu
          class="menu"
          :default-active="activeMenu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/employee/info"><i class="el-icon-user"></i>个人信息</el-menu-item>
          <el-menu-item index="/employee/salary"><i class="el-icon-wallet"></i>工资查看</el-menu-item>
          <el-menu-item index="/employee/attendance"><i class="el-icon-date"></i>考勤记录</el-menu-item>
          <el-menu-item index="/employee/leave"><i class="el-icon-document"></i>请假/离职申请</el-menu-item>
          <el-menu-item index="/employee/training"><i class="el-icon-school"></i>培训活动</el-menu-item>
          <el-menu-item index="/employee/avatar"><i class="el-icon-picture-outline"></i>头像设置</el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区域 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userName: "", // 存储员工名字
      avatarUrl: "", // 存储员工头像 URL
      activeMenu: "/employee/info", // 记录当前选中的菜单项
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.$router.push(index); // 跳转到对应路由
    },
    logout() {
      this.$confirm("确定要退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功",
          });
          localStorage.removeItem("token"); // 清除 token
          localStorage.removeItem("role"); // 清除角色
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
    async getEmployeeInfo() {
      try {
        const response = await axios.get("http://localhost:8080/employee/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        this.userName = data.name;  // 假设返回的数据包含员工名字
        this.avatarUrl = data.avatar || "/path/to/avatar.jpg";  // 假设返回数据包含头像链接
        localStorage.setItem("userName", this.userName);  // 存储到本地缓存，避免重复请求
        localStorage.setItem("avatarUrl", this.avatarUrl);  // 存储头像链接
      } catch (error) {
        console.error("获取员工信息失败:", error);
      }
    },
  },
  mounted() {
    // 优先从 localStorage 获取员工信息
    this.userName = localStorage.getItem("userName") || "";
    this.avatarUrl = localStorage.getItem("avatarUrl") || "";
    
    // 如果本地缓存没有数据，才发起请求
    if (!this.userName || !this.avatarUrl) {
      this.getEmployeeInfo(); // 页面加载时获取员工信息
    }
  },
};
</script>

<style scoped>
.dashboard {
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #dcdfe6;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .user-name {
  margin-left: 10px;
  font-size: 16px;
}

.logout-button {
  margin-left: auto;
}

.menu {
  height: 100%;
  border-right: 1px solid #dcdfe6;
}

.aside {
  background-color: #f5f5f5;
}

.main {
  padding: 20px;
  background-color: #f9f9f9;
  overflow: auto;
}
</style>
