<template>
  <div class="attendance">
    <el-card class="attendance-card">
      <h3 class="attendance-title">考勤记录</h3>
      <!-- 考勤记录表格 -->
      <el-table
        v-if="!loading && !error"
        :data="attendanceData"
        border
        stripe
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="remarks" label="备注" />
      </el-table>

      <!-- 错误提示 -->
      <el-alert 
        v-if="error" 
        type="error" 
        :closable="false" 
        class="error-alert"
      >
        {{ error }}
      </el-alert>

      <!-- 空数据提示 -->
      <el-empty 
        v-if="!loading && !error && attendanceData.length === 0" 
        description="暂无考勤记录" 
        class="empty-state"
      />

      <!-- 加载状态 -->
      <el-loading 
        v-if="loading" 
        text="加载中..." 
        class="loading-state"
      />
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      attendanceData: [], // 考勤数据
      loading: false, // 加载状态
      error: null, // 错误消息
      employeeId: localStorage.getItem('employeeId') || this.$route.params.employeeId, // 从 localStorage 或 URL 参数获取员工ID
    };
  },
  created() {
    this.fetchAttendanceData();  // 创建时获取考勤数据
  },
  methods: {
    // 获取考勤数据
    async fetchAttendanceData() {
      this.loading = true;
      this.error = null;
      try {
        // 确保从后端正确获取考勤记录
        const response = await axios.get('http://localhost:8080/employee/attendance', {
          params: {
            employeeId: this.employeeId,  // 确保传递正确的员工ID
          },
        });

        // 将返回的考勤记录处理并赋值给 `attendanceData`
        if (response.data && Array.isArray(response.data)) {
          this.attendanceData = response.data.map(record => ({
            ...record,
            status: this.mapStatus(record.status),  // 转换状态显示
          }));
        } else {
          this.error = '返回的数据格式不正确';
          console.error('Error: Invalid response format', response.data);
        }
      } catch (error) {
        this.error = '无法获取考勤数据，请稍后再试';
        console.error('Error fetching attendance data:', error);
      } finally {
        this.loading = false;
      }
    },
    // 状态映射
    mapStatus(statusCode) {
      const statusMap = {
        late: '迟到',
        earlyLeave: '早退',
        absent: '缺勤',
        present: '正常',
      };
      return statusMap[statusCode] || '未知状态';
    },
  },
};
</script>

<style scoped>
.attendance {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.attendance-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.attendance-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.el-table {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.error-alert {
  margin-top: 20px;
}

.empty-state {
  margin-top: 20px;
  text-align: center;
}

.loading-state {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
