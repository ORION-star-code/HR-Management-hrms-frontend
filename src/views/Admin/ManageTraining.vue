<template>
  <div class="manage-training">
    <router-link to="/admin" class="back-button">返回上一级</router-link>
    <header class="training-header">
      <h1>培训活动管理</h1>
      <p>查看并管理员工的培训活动，支持新增、编辑和删除培训活动。</p>
    </header>
    <main class="training-content">
      <!-- 搜索与新增按钮 -->
      <div class="actions">
        <input
          type="text"
          v-model="searchQuery.name"
          placeholder="搜索培训活动..."
          class="search-input"
        />
        <button class="add-button" @click="openAddModal">新增培训活动</button>
      </div>
      <!-- 培训活动表格 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>活动名称</th>
              <th>活动描述</th>
              <th>培训日期</th>
              <th>最大参与人数</th>
              <th>地点</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in filteredActivities" :key="activity.id">
              <td>{{ activity.id }}</td>
              <td>{{ activity.name }}</td>
              <td>{{ activity.description }}</td>
              <td>{{ activity.startDate }} - {{ activity.endDate }}</td>
              <td>{{ activity.maxParticipants }}</td>
              <td>{{ activity.location }}</td>
              <td>{{ activity.createdAt }}</td>
              <td>{{ activity.updatedAt }}</td>
              <td>
                <button class="edit-button" @click="openEditModal(activity)">编辑</button>
                <button class="delete-button" @click="deleteActivity(activity.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="filteredActivities.length === 0" class="no-data">暂无培训活动记录</p>
      </div>

      <!-- 分页控件 -->
      <div class="pagination">
        <button @click="fetchActivities(page - 1)" :disabled="page === 1">上一页</button>
        <span>页数: {{ page }} / {{ totalPages }}</span>
        <button @click="fetchActivities(page + 1)" :disabled="page === totalPages">下一页</button>
      </div>

      <!-- 模态框 -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>{{ isEdit ? "编辑培训活动" : "新增培训活动" }}</h3>
          <form @submit.prevent="isEdit ? updateActivity() : addActivity()">
            <input v-model="currentActivity.name" type="text" placeholder="活动名称" required />
            <textarea v-model="currentActivity.description" placeholder="活动描述" required></textarea>
            <input v-model="currentActivity.startDate" type="date" placeholder="开始日期" required />
            <input v-model="currentActivity.endDate" type="date" placeholder="结束日期" required />
            <input v-model="currentActivity.maxParticipants" type="number" placeholder="最大参与人数" required />
            <input v-model="currentActivity.location" type="text" placeholder="地点" required />
            <button type="submit" class="save-button">{{ isEdit ? "保存" : "添加" }}</button>
          </form>
          <button class="close-button" @click="closeModal">关闭</button>
        </div>
      </div>
    </main>

    <!-- 加载指示器 -->
    <div v-if="isLoading" class="loading-spinner">加载中...</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activities: [],
      page: 1,
      totalPages: 1,
      searchQuery: { name: "" },
      showModal: false,
      isEdit: false,
      currentActivity: {
        id: null,
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        maxParticipants: null,
        location: "",
      },
      isLoading: false,
    };
  },
    computed: {
      filteredActivities() {
        // 检查 activities 是否为有效的数组
        if (!Array.isArray(this.activities) || this.activities.length === 0) {
          return []; // 返回空数组，避免 undefined 错误
        }
        // 过滤活动，支持搜索功能
        return this.activities.filter((activity) =>
          activity.name && activity.name.includes(this.searchQuery.name) // 确保 activity.name 存在
        );
      },
    },
  methods: {
        async fetchActivities(page = 1) {
      this.isLoading = true;
      try {
        const response = await axios.get("http://localhost:8080/admin/training/list", {
          params: { page, limit: 10 }, // 发送分页请求
        });

        // 确保数据结构正确
        if (response.data && Array.isArray(response.data.activities)) {
          this.activities = response.data.activities;  // 更新活动数据
          this.totalPages = response.data.totalPages;  // 更新总页数
          this.page = page;  // 更新当前页码
        }
      } catch (error) {
        console.error("获取培训活动数据失败:", error);
      } finally {
        this.isLoading = false; // 关闭加载指示器
      }
    },
    openAddModal() {
      this.isEdit = false;
      this.currentActivity = { id: null, name: "", description: "", startDate: "", endDate: "", maxParticipants: null, location: "" };
      this.showModal = true;
    },
    openEditModal(activity) {
      this.isEdit = true;
      this.currentActivity = { ...activity };
      this.showModal = true;
    },
    async addActivity() {
      console.log(this.currentActivity);  // 打印当前活动的数据
      try {
        // 发送请求，添加培训活动
        const response = await axios.post("http://localhost:8080/admin/training/add", this.currentActivity);
        console.log("返回的数据：", response.data);  // 打印返回的数据

        // 成功添加后，刷新当前页的活动数据
        this.fetchActivities(this.page); // 使用当前页码刷新活动列表

        this.closeModal(); // 关闭模态框
        alert("培训活动添加成功！");
      } catch (error) {
        alert("添加培训活动失败，请稍后再试！");
        console.error("添加培训活动失败:", error);
      }
},
    async updateActivity() {
      try {
        await axios.put(`http://localhost:8080/admin/training/edit/${this.currentActivity.id}`, this.currentActivity);
        const index = this.activities.findIndex((activity) => activity.id === this.currentActivity.id);
        this.activities[index] = { ...this.currentActivity };
        this.closeModal();
        alert("培训活动更新成功！");
      } catch (error) {
        alert("更新培训活动失败，请稍后再试！");
        console.error("更新培训活动失败:", error);
      }
    },
    async deleteActivity(id) {
      if (confirm("确定要删除这项培训活动吗？")) {
        try {
          await axios.delete(`http://localhost:8080/admin/training/delete/${id}`);
          this.activities = this.activities.filter((activity) => activity.id !== id);
          alert("培训活动删除成功！");
        } catch (error) {
          alert("删除培训活动失败，请稍后再试！");
          console.error("删除培训活动失败:", error);
        }
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
mounted() {
  this.fetchActivities();  // 初次加载时获取活动列表
}
};
</script>

<style scoped>
/* 页面布局 */
.manage-training {
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
.training-header {
  text-align: center;
  margin-bottom: 30px;
}

.training-header h1 {
  font-size: 36px;
  color: #007bff;
  margin-bottom: 10px;
}

.training-header p {
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
.training-content {
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
.edit-button {
  background: #ffc107;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
}

.edit-button:hover {
  background: #e0b800;
}

.delete-button {
  background: #ff4500;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background: #e04300;
}

/* 模态框 */
.modal-overlay {
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

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.modal input,
.modal textarea {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #007bff;
  border-radius: 5px;
}

.save-button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
}

.close-button {
  margin-top: 10px;
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.loading-spinner {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
