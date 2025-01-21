<template>
  <div class="manage-employees">
    <header class="employees-header">
      <h1>管理员工信息</h1>
      <p>查看并管理员工信息，支持新增、编辑和删除员工。</p>
      <router-link to="/admin" class="back-button">返回上一级</router-link>
    </header>
    <main class="employees-content">
      <div class="actions">
        <input
          type="text"
          v-model="searchQuery.name"
          placeholder="搜索员工姓名..."
          class="search-input"
        />
        <input
          type="text"
          v-model="searchQuery.position"
          placeholder="搜索职位..."
          class="search-input"
        />
        <input
          type="text"
          v-model="searchQuery.department"
          placeholder="搜索部门..."
          class="search-input"
        />
        <button class="add-button" @click="openAddModal">新增员工</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>职位</th>
              <th>部门</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department }}</td>
              <td>
                <button class="edit-button" @click="openEditModal(employee)">
                  编辑
                </button>
                <button class="delete-button" @click="deleteEmployee(employee.id)">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="filteredEmployees.length === 0" class="no-data">
          暂无符合条件的员工信息
        </p>
      </div>
    </main>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEdit ? "编辑员工信息" : "新增员工" }}</h3>
        <form @submit.prevent="isEdit ? updateEmployee() : addEmployee()">
          <input
            v-model="currentEmployee.name"
            type="text"
            placeholder="姓名"
            required
          />
          <input
            v-model="currentEmployee.position"
            type="text"
            placeholder="职位"
            required
          />
          <input
            v-model="currentEmployee.department"
            type="text"
            placeholder="部门"
            required
          />
          <input
            v-model="currentEmployee.user_id"
            type="text"
            placeholder="用户ID"
            required
          />
          <!-- 新增性别选择框 -->
          <div>
            <label>性别：</label>
            <select v-model="currentEmployee.gender" required>
              <option value="" disabled>请选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <!-- 添加薪资基数输入框 -->
          <input
            v-model="currentEmployee.salary_base"
            type="number"
            placeholder="薪资基数"
            required
          />
          <button type="submit" class="save-button">
            {{ isEdit ? "保存" : "添加" }}
          </button>
        </form>
        <button class="close-button" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
 data() {
  return {
    employees: [],
    searchQuery: {
      name: "",
      position: "",
      department: "",
    },
    showModal: false,
    isEdit: false,
    currentEmployee: {
      id: null,
      name: "",
      position: "",
      department: "",
      user_id: "", // 用户ID
      gender: "",  // 性别
      salary_base: null, // 薪资基数
    },
  };
}
,
 computed: {
  filteredEmployees() {
    return this.employees.filter((employee) =>
      (employee.name && employee.name.includes(this.searchQuery.name || "")) &&
      (employee.position && employee.position.includes(this.searchQuery.position || "")) &&
      (employee.department && employee.department.includes(this.searchQuery.department || ""))
    );
  },
},
  methods: {
    // 获取员工信息
    async fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:8080/admin/employees/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 使用 token 验证
          },
        });
        this.employees = response.data;
      } catch (error) {
        console.error("获取员工数据失败:", error);
        this.$message.error("获取员工数据失败，请稍后重试。");
      }
    },
    // 打开添加员工模态框
    openAddModal() {
      this.isEdit = false;
      this.currentEmployee = { id: null, name: "", position: "", department: "", user_id: "", gender: "" };
      this.showModal = true;
    },
    // 打开编辑员工模态框
    openEditModal(employee) {
      this.isEdit = true;
      this.currentEmployee = { ...employee };
      this.showModal = true;
    },
    // 添加员工
    async addEmployee() {
      if (!this.currentEmployee.user_id || !this.currentEmployee.gender || !this.currentEmployee.salary_base) {
        this.$message.error("请确保为员工指定有效的用户ID、性别和薪资基数！");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/admin/employees/add",
          this.currentEmployee,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.employees.push(response.data);
        this.closeModal();
        this.$message.success("员工添加成功！");
      } catch (error) {
        console.error("添加员工失败:", error);
        this.$message.error("添加员工失败，请稍后重试。");
      }
    },
  async updateEmployee() {
  if (!this.currentEmployee.salary_base) {
    this.$message.error("请确保为员工指定薪资基数！");
    return;
  }

      try {
        await axios.put(
          `http://localhost:8080/admin/employees/edit/${this.currentEmployee.id}`,
          this.currentEmployee,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const index = this.employees.findIndex(
          (e) => e.id === this.currentEmployee.id
        );
        this.employees[index] = { ...this.currentEmployee };
        this.closeModal();
        this.$message.success("员工信息更新成功！");
      } catch (error) {
        console.error("更新员工信息失败:", error);
        this.$message.error("更新员工信息失败，请稍后重试。");
      }
    },

    // 删除员工
    async deleteEmployee(id) {
      if (confirm("确定要删除这位员工吗？")) {
        try {
          await axios.delete(`http://localhost:8080/admin/employees/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.employees = this.employees.filter(
            (employee) => employee.id !== id
          );
          this.$message.success("员工删除成功！");
        } catch (error) {
          console.error("删除员工失败:", error);
          this.$message.error("删除员工失败，请稍后重试。");
        }
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
  mounted() {
    this.fetchEmployees();
  },
};
</script>

<style scoped>
/* 页面布局 */
.manage-employees {
  font-family: "Arial", sans-serif;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}

/* 标题样式 */
.employees-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.employees-header h1 {
  font-size: 32px;
  color: #ff7f50;
  margin-bottom: 10px;
}

.employees-header p {
  font-size: 16px;
  color: #ff6347;
}

.back-button {
  position: absolute;
  right: 20px;
  top: 20px;
  background: #ff4500;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  background: #e04300;
  transform: scale(1.05);
}

.back-button:active {
  background: #d43600;
  transform: scale(1);
}

/* 搜索与新增按钮 */
.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 29%;
  padding: 10px;
  border: 1px solid #ff6347;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 5px;
}

.add-button {
  background: linear-gradient(135deg, #ff7f50, #ff4500);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-button:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

/* 表格 */
.table-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #ff7f50;
  color: white;
  font-size: 16px;
}

td {
  color: #555;
  font-size: 14px;
}

tbody tr:hover {
  background-color: #ffecd2;
}

.edit-button {
  background: #ffcc00;
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

.modal input {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ff7f50;
  border-radius: 5px;
}

.save-button {
  background: #ff7f50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.save-button:hover {
  background: #e04300;
}

.close-button {
  margin-top: 10px;
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.close-button:hover {
  background: #5a6268;
  transform: scale(1.05);
}

.close-button:active {
  background: #4e555b;
  transform: scale(1);
}
</style>
