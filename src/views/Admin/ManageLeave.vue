<template>
  <div class="manage-leave">
    <h2>请假与离职申请管理</h2>
    <p>本页面用于管理和处理员工的请假及离职申请。</p>
    
    <!-- 返回上一级按钮 -->
    <button class="back-button" @click="goBack">返回上一级</button>

    <!-- 搜索框 -->
    <div class="search-container">
      <input v-model="searchQuery" @input="onSearch" placeholder="搜索员工姓名、申请类型或状态" />
    </div>

    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>员工姓名</th>
            <th>申请类型</th>
            <th>申请时间</th>
            <th>申请原因</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leave in paginatedLeaveRequests" :key="leave.id">
            <td>{{ leave.employeeName }}</td>
            <td>{{ leave.leaveType }}</td>
            <td>{{ leave.startDate }}</td>
            <td>{{ leave.reason }}</td>
            <td>
              <span :class="getStatusClass(leave.status)">{{ leave.status }}</span>
            </td>
            <td>
              <button @click="approveLeave(leave.id)" :disabled="leave.status !== 'pending'" :class="getButtonClass(leave.status)">批准</button>
              <button @click="rejectLeave(leave.id)" :disabled="leave.status !== 'pending'" :class="getButtonClass(leave.status)">拒绝</button>
              <button v-if="leave.leaveType === '离职'" @click="softDelete(leave.id)" :disabled="leave.status === '已删除'" :class="getButtonClass(leave.status)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredLeaveRequests.length === 0" class="no-data">暂无申请记录</p>
    </div>

    <!-- 分页控件放在表格下方 -->
    <div class="pagination-container">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
      <select v-model="pageSize" @change="changePageSize">
        <option value="5">5条/页</option>
        <option value="10">10条/页</option>
        <option value="20">20条/页</option>
      </select>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      leaveRequests: [],
      totalCount: 0, // 添加 totalCount 属性
      showDeleted: false,
      isLoading: false,
      searchQuery: "", // 用于存储搜索框的输入内容
      pageSize: 5, // 每页显示的记录条数
      currentPage: 1, // 当前页
    };
  },
  computed: {
    filteredLeaveRequests() {
      return this.leaveRequests.filter((leave) => {
        return (
          (leave.employeeName && leave.employeeName.includes(this.searchQuery)) ||
          (leave.leaveType && leave.leaveType.includes(this.searchQuery)) ||
          (leave.status && leave.status.includes(this.searchQuery))
        );
      });
    },
    // 计算总页数
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize);
    },
    // 分页后的数据
    paginatedLeaveRequests() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.leaveRequests.slice(startIndex, startIndex + this.pageSize);
    }
  },
  created() {
    this.fetchLeaveRequests();
  },
  methods: {
    // 封装API请求
    async fetchLeaveRequests() {
      this.isLoading = true;
      try {
        const response = await axios.get("http://localhost:8080/admin/leave/list", {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            name: this.searchQuery, // 搜索条件
          }
        });

        console.log(response.data);  // 调试：查看返回的数据

        // 获取响应数据中的 'data' 部分，并赋值给 leaveRequests
        this.leaveRequests = response.data.data || [];  // 如果返回值为空，则初始化为空数组
        this.totalCount = response.data.totalCount || 0;  // 确保 totalCount 不为 undefined
      } catch (error) {
        console.error("获取请假申请数据失败:", error);
      } finally {
        this.isLoading = false;
      }
    },
    // 搜索框输入时触发，动态过滤数据
    onSearch() {
      this.currentPage = 1; // 重置当前页为1
    },
    // 页码切换
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchLeaveRequests(); // 刷新数据
    },
    // 改变每页显示的条数
    changePageSize() {
      this.currentPage = 1; // 每次修改分页条数时，跳转到第一页
      this.fetchLeaveRequests(); // 刷新数据
    },
    async approveLeave(id) {
      const request = this.leaveRequests.find((req) => req.id === id);
      if (request && request.status === "pending") {
        try {
          await axios.put(`http://localhost:8080/admin/leave/approve/${id}`, {
            status: "approved", // 设置为批准
            type: request.leaveType // 确保传递 leaveType
          });
          request.status = "approved"; // 更新前端状态
          alert(`已批准 ${request.employeeName} 的 ${request.leaveType} 申请`);
        } catch (error) {
          console.error("批准操作失败:", error);
          alert("批准操作失败，请稍后重试。");
        }
      } else {
        alert("该申请已处理");
      }
    },
    async rejectLeave(id) {
      const request = this.leaveRequests.find((req) => req.id === id);
      if (request && request.status === "pending") {
        try {
          await axios.put(`http://localhost:8080/admin/leave/reject/${id}`, {
            status: "rejected",
            type: request.leaveType // 传递 leaveType
          });
          request.status = "rejected";
          alert(`已拒绝 ${request.employeeName} 的 ${request.leaveType} 申请`);
        } catch (error) {
          console.error("拒绝操作失败:", error);
          alert("拒绝操作失败，请稍后重试。");
        }
      } else {
        alert("该申请已处理");
      }
    },
    async softDelete(id) {
      const request = this.leaveRequests.find((req) => req.id === id);
      if (request && request.leaveType === "离职" && request.status !== "已删除") {
        try {
          await axios.patch(`http://localhost:8080/admin/leaveRequests/${id}`, { status: "已删除" });
          request.status = "已删除";
          alert(`已删除 ${request.employeeName} 的离职申请`);
        } catch (error) {
          console.error("删除操作失败:", error);
          alert("删除操作失败，请稍后重试。");
        }
      } else {
        alert("该离职申请已删除或无法删除");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    getStatusClass(status) {
      switch (status) {
        case "待审批":
          return "status-pending";
        case "已批准":
          return "status-approved";
        case "已拒绝":
          return "status-rejected";
        case "已删除":
          return "status-deleted";
        default:
          return "";
      }
    },
    getButtonClass(status) {
      return {
        "btn-pending": status === "待审批",
        "btn-approved": status === "已批准",
        "btn-rejected": status === "已拒绝",
        "btn-deleted": status === "已删除"
      };
    }
  }
};
</script>

<style scoped>
.manage-leave {
  padding: 20px;
  font-family: 'SimSun', serif;
}

h2 {
  color: #343a40;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

p {
  margin-bottom: 20px;
  text-align: center;
  color: #6c757d;
}

/* 将返回按钮放到右上角 */
.back-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  background-color: #0056b3;
}

/* 搜索框美化 */
.search-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-container input {
  width: 300px;
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-container input:focus {
  outline: none;
  border-color: #007bff;
}

/* 表格样式 */
.table-container {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f9;
  color: #555;
}

td {
  color: #333;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

/* 按钮样式 */
button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button:first-of-type {
  background-color: #28a745;
  color: white;
}

button:first-of-type:hover:not(:disabled) {
  background-color: #218838;
}

button:last-of-type {
  background-color: #dc3545;
  color: white;
}

button:last-of-type:hover:not(:disabled) {
  background-color: #c82333;
}

.status-pending {
  color: #ffc107;
  font-weight: bold;
}

.status-approved {
  color: #28a745;
  font-weight: bold;
}

.status-rejected {
  color: #dc3545;
  font-weight: bold;
}

.status-deleted {
  color: #6c757d;
  font-style: italic;
}

.no-data {
  text-align: center;
  margin-top: 20px;
  color: #6c757d;
  font-size: 16px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #007bff;
  margin-top: 20px;
}

/* 分页控件 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-container button {
  padding: 5px 15px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-container button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-container select {
  padding: 5px 10px;
  margin-left: 10px;
}

.table-container {
  margin-bottom: 30px; /* 给表格和分页之间留出空隙 */
}
</style>
