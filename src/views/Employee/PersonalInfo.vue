<template>
  <div class="personal-info">
    <h2>个人信息管理</h2>
    <p>管理和更新您的个人信息，包括头像设置。</p>

    <!-- 员工信息与头像并排显示，头像放置右侧并使背景颜色与面板一致 -->
    <div class="info-avatar-section">
      <!-- 显示员工个人信息 -->
      <div class="info-section">
        <h3>员工信息</h3>
        <div v-if="info">
          <div class="info-row">
            <span class="info-label">姓名:</span> <span class="info-value">{{ info.name }}</span>
            <button class="update-btn" @click="editInfo('name')">更新</button>
          </div>
          <div class="info-row">
            <span class="info-label">邮箱:</span> <span class="info-value">{{ info.email }}</span>
            <button class="update-btn" @click="editInfo('email')">更新</button>
          </div>
          <div class="info-row">
            <span class="info-label">电话:</span> <span class="info-value">{{ info.phone }}</span>
            <button class="update-btn" @click="editInfo('phone')">更新</button>
          </div>
          <div class="info-row">
            <span class="info-label">职位:</span> <span class="info-value">{{ info.position }}</span>
            <button class="update-btn" @click="editInfo('position')">更新</button>
          </div>
          <div class="info-row">
            <span class="info-label">部门:</span> <span class="info-value">{{ info.department }}</span>
            <button class="update-btn" @click="editInfo('department')">更新</button>
          </div>
        </div>
      </div>

      <!-- 头像设置部分，放置右侧并使背景颜色与面板一致 -->
      <div class="avatar-section">
        <el-card class="avatar-card">
          <h3>头像设置</h3>
          <el-upload
            action="http://localhost:8080/upload/avatar"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            class="avatar-uploader"
            :show-file-list="false"
            :data="uploadData"
          >
            <i class="el-icon-plus avatar-icon"></i>
          </el-upload>
        </el-card>
      </div>
    </div>

    <!-- 个人信息编辑表单（仅在点击“更新”时显示）-->
    <div v-if="isEditing" class="info-form-container">
      <form class="info-form" @submit.prevent="updateInfo">
        <div v-if="editableField">
          <label :for="editableField">{{ editableField }}:</label>
          <input
            v-model="info[editableField]"
            :id="editableField"
            :type="editableField === 'email' ? 'email' : 'text'"
            required
          />
          <span v-if="errors[editableField]" class="error">{{ errors[editableField] }}</span>
          <button type="submit" class="submit-btn">保存修改</button>
        </div>
      </form>
    </div>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      info: {
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
      },
      errors: {},
      successMessage: '',
      employeeId: this.$route.params.employeeId || localStorage.getItem('employeeId'),
      isEditing: false,
      editableField: "",  // 用来存储当前正在编辑的字段
    };
  },
  computed: {
    uploadData() {
      return {
        employeeId: this.employeeId  // 传递员工 ID 给后端
      };
    }
  },
  methods: {
    // 显示编辑框并设置当前编辑的字段
    editInfo(field) {
      this.isEditing = true;
      this.editableField = field;  // 设置当前正在编辑的字段
    },

    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.info[this.editableField]) {
        this.errors[this.editableField] = `${this.editableField}不能为空`;
        isValid = false;
      }

      return isValid;
    },

    async updateInfo() {
      if (this.validateForm()) {
        try {
          const updatedInfo = { ...this.info, employeeId: this.employeeId };
          await axios.put(
            `http://localhost:8080/employee/update`,
            updatedInfo,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            }
          );
          this.successMessage = '个人信息已成功更新';
          setTimeout(() => {
            this.successMessage = '';
            this.isEditing = false; // 更新完后关闭编辑模式
          }, 3000);
        } catch (error) {
          console.error("更新失败:", error);
          this.$message.error("更新个人信息失败");
        }
      }
    },

    handleUploadSuccess(response) {
      console.log('头像上传成功，响应数据:', response);
      this.$message.success("头像上传成功！");
    },

    async fetchUserInfo() {
      try {
        const employeeId = localStorage.getItem("employeeId");  // 从 localStorage 获取 employeeId
        if (!employeeId) {
          this.$message.error("员工ID未找到！");
          return;
        }
        console.log('employeeId:', employeeId); // 打印 employeeId 确认是否正确

        const response = await axios.get("http://localhost:8080/employee/info", {
          params: {
            employeeId: employeeId,  // 将 employeeId 作为查询参数传递
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,  // 确保添加了认证 token
          },
        });

        // 处理返回的员工信息
        this.info.name = response.data.name;
        this.info.email = response.data.email;
        this.info.phone = response.data.phone;
        this.info.position = response.data.position;
        this.info.department = response.data.department;
      } catch (error) {
        console.error("获取用户信息失败:", error);
        this.$message.error("获取员工信息失败");
      }
    },
  },
  mounted() {
    this.fetchUserInfo();  // 页面加载时获取用户信息
  },
};
</script>

<style scoped>
.personal-info {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #495057;
}

h2 {
  color: #343a40;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

p {
  margin-bottom: 30px;
  text-align: center;
  font-size: 16px;
  color: #6c757d;
}

.info-avatar-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 30px;
}

.info-section {
  flex-basis: 70%;
  text-align: left;
}

.avatar-section {
  flex-basis: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-card {
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa; /* 背景色与面板颜色一致 */
  border-radius: 8px;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #3498db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-icon {
  font-size: 32px;
  color: #8e44ad;
}

.update-btn {
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 12px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.update-btn:hover {
  background-color: #2980b9;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-label {
  font-weight: bold;
  width: 80px;
}

.info-value {
  flex-grow: 1;
  margin-right: 10px;
}

.info-form-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.info-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  color: #495057;
}

input[type="text"],
input[type="email"],
input[type="tel"] {
  padding: 10px;
  font-size: 16px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid #ced4da;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus {
  border-color: #3498db;
  outline: none;
}

button {
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

button:hover {
  background-color: #2980b9;
}

.error {
  color: red;
  font-size: 14px;
}

.success {
  color: green;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}
</style>
