<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <h1>管理员仪表盘</h1>
      <p>欢迎回来！请选择需要管理的功能模块。</p>
    </header>
    <main class="dashboard-actions">
      <div class="card" @click="navigateTo('/admin/manage-employees')">
        <div class="card-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>管理员工信息</h3>
        <p>新增、删除、编辑和查询员工</p>
      </div>
      <div class="card" @click="navigateTo('/admin/manage-attendance')">
        <div class="card-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <h3>考勤管理</h3>
        <p>管理迟到、缺勤记录并进行处罚</p>
      </div>
      <div class="card" @click="navigateTo('/admin/manage-leave')">
        <div class="card-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <h3>请假与离职申请</h3>
        <p>审批请假申请并处理离职员工</p>
      </div>
      <div class="card" @click="navigateTo('/admin/manage-training')">
        <div class="card-icon">
          <i class="fas fa-chalkboard-teacher"></i>
        </div>
        <h3>培训管理</h3>
        <p>管理培训活动计划与记录</p>
      </div>
    </main>
    <footer class="dashboard-footer">
      <button class="logout-button" @click="logout">退出登录</button>
    </footer>
  </div>
</template>

<script>
import { clearAuth } from '@/utils/auth'; // 导入 clearAuth 函数
export default {
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        clearAuth();
        this.$router.push('/login');
        this.$message.success('退出成功');
      }).catch(() => {
        this.$message.info('已取消退出');
      });
    }
  },
};
</script>

<style scoped>
/* 背景设置为白色 */
.admin-dashboard {
  background: #ffffff; /* 设置背景色为白色 */
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: #333;
}

/* 标题样式 */
.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 36px;
  color: #007bff; /* 强调色 */
  margin-bottom: 10px;
}

.dashboard-header p {
  font-size: 16px;
  color: #6c757d;
}

/* 卡片布局 */
.dashboard-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 20px;
  width: 250px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #007bff;
}

.card-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon i {
  color: white;
  font-size: 24px;
}

.card h3 {
  color: #007bff;
  font-size: 20px;
  margin-bottom: 10px;
}

.card p {
  color: #555;
  font-size: 14px;
}

.card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* 退出按钮样式 */
.dashboard-footer {
  margin-top: 20px;
}

.logout-button {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.logout-button:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #c82333, #a71d2a);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-actions {
    gap: 15px;
  }

  .card {
    width: 90%;
  }
}
</style>
