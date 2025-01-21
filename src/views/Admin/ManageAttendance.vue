<template>
  <div class="manage-attendance">
    <router-link to="/admin" class="back-button">返回上一级</router-link>
    <header class="attendance-header">
      <h1>考勤管理</h1>
      <p>查看并管理员工的考勤记录，处理迟到或缺勤情况。</p>
    </header>
    <main class="attendance-table-container">
      <!-- 搜索框 -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索员工姓名..."
          class="search-input"
        />
      </div>

      <!-- 考勤记录表格 -->
      <table>
        <thead>
          <tr>
            <th>员工姓名</th>
            <th>迟到次数</th>
            <th>缺勤次数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id">
            <td>{{ record.employeeName || '未知员工' }}</td> <!-- 修改为employeeName -->
            <td>{{ getLateCount(record.status) }}</td>
            <td>{{ getAbsentCount(record.status) }}</td>
            <td>
              <button @click="openPenaltyModal(record)" class="penalize-button">处罚</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 无数据提示 -->
      <p v-if="filteredRecords.length === 0" class="no-data">暂无考勤记录</p>
      
      <!-- 错误信息 -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      
      <!-- 分页控件 -->
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">上一页</button>
        <span>{{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">下一页</button>
      </div>
    </main>

    <!-- 处罚弹窗 -->
    <div v-if="penaltyModal" class="penalty-modal">
      <h3>处罚员工</h3>
      <input v-model="penaltyAmount" placeholder="处罚金额" type="number" required />
      <textarea v-model="penaltyReason" placeholder="处罚原因" required></textarea>
      <button @click="submitPenalty">提交处罚</button>
      <button @click="closePenaltyModal">关闭</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      attendanceRecords: [], 
      searchQuery: "",
      errorMessage: "",
      currentPage: 1,
      totalPages: 1,
      recordsPerPage: 10,
      penaltyModal: false,
      penaltyAmount: null,
      penaltyReason: "",
      currentRecordId: null,
    };
  },
  computed: {
    filteredRecords() {
      return (this.attendanceRecords || []).filter((record) => {
        const name = record.employeeName || ""; // 使用 employeeName
        return name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
      async fetchAttendanceRecords(page = 1) {
          try {
              const response = await axios.get("http://localhost:8080/admin/attendance/list", {
                  params: {
                      offset: (page - 1) * this.recordsPerPage,
                      limit: this.recordsPerPage
                  }
              });
              
              const { records, totalCount } = response.data;
              this.attendanceRecords = records || [];
              this.totalPages = Math.ceil(totalCount / this.recordsPerPage);
          } catch (error) {
              console.error("获取考勤记录失败:", error);
              this.errorMessage = "获取考勤记录失败，请稍后重试。";
          }
      },

    // 分页控制
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchAttendanceRecords(page);
      }
    },

    // 获取迟到次数
    getLateCount(status) {
      return status === 'late' ? 1 : 0;
    },

    // 获取缺勤次数
    getAbsentCount(status) {
      return status === 'absent' ? 1 : 0;
    },

    // 开启处罚弹窗
    openPenaltyModal(record) {
      this.penaltyModal = true;
      this.currentRecordId = record.id;
    },

    // 提交处罚
    async submitPenalty() {
      if (!this.penaltyAmount || !this.penaltyReason) {
        this.$message.error("请填写处罚金额和处罚原因！");
        return;
      }

      const penalty = {
        penaltyAmount: this.penaltyAmount,
        penaltyReason: this.penaltyReason,
      };

      try {
        await axios.post(`http://localhost:8080/admin/attendance/penalty/${this.currentRecordId}`, penalty);
        this.$message.success(`员工ID ${this.currentRecordId} 处罚成功！`);
        this.fetchAttendanceRecords();
        this.closePenaltyModal();
      } catch (error) {
        this.$message.error("处罚失败，请稍后重试");
      }
    },

    // 关闭处罚弹窗
    closePenaltyModal() {
      this.penaltyModal = false;
      this.penaltyAmount = null;
      this.penaltyReason = "";
    },
  },

  mounted() {
    this.fetchAttendanceRecords();
  },
};
</script>

<style scoped>
/* 整体布局 */
.manage-attendance {
  font-family: 'Arial', sans-serif;
  background: white;
  min-height: 100vh;
  padding: 20px;
  color: #333;
}

/* 返回上一级按钮 */
.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}

/* 标题样式 */
.attendance-header {
  text-align: center;
  margin-bottom: 30px;
}

.attendance-header h1 {
  font-size: 36px;
  color: #007bff;
  margin-bottom: 10px;
}

.attendance-header p {
  font-size: 16px;
  color: #6c757d;
}

/* 搜索框样式 */
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.search-input {
  width: 50%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: box-shadow 0.2s ease;
}

.search-input:focus {
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  outline: none;
}

/* 表格容器 */
.attendance-table-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #007bff;
  color: white;
  font-size: 16px;
}

td {
  color: #555;
  font-size: 14px;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

/* 按钮样式 */
.penalize-button {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.penalize-button:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #c82333, #a71d2a);
}

/* 无数据样式 */
.no-data {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #6c757d;
}

.error {
  color: red;
  font-size: 1em;
  text-align: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .attendance-header h1 {
    font-size: 28px;
  }

  table {
    font-size: 12px;
  }

  .penalize-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .search-input {
    width: 80%;
  }
}

/* 处罚弹窗样式 */
.penalty-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.penalty-modal h3 {
  margin-bottom: 10px;
  color: #007bff;
}

.penalty-modal input, .penalty-modal textarea {
  width: 80%;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}

.penalty-modal button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.penalty-modal button:hover {
  background-color: #0056b3;
}
</style>
