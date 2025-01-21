<template>
  <div class="resignation-application">
    <el-card class="resignation-card">
      <h3 class="resignation-title">离职申请</h3>
      <el-form :model="resignationForm" label-width="120px" class="resignation-form" @submit.prevent="submitResignation">
        <el-form-item label="离职原因" required>
          <el-input v-model="resignationForm.reason" type="textarea" class="resignation-input" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitResignation" class="resignation-button">提交申请</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      resignationForm: {
        reason: "",
      },
    };
  },
  methods: {
    async submitResignation() {
      try {
        await axios.post('http://localhost:8080/employee/resignation', this.resignationForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 使用认证 token
          },
        });
        this.$message.success("离职申请已提交！");
        this.resignationForm = {}; // 重置表单
      } catch (error) {
        console.error("提交离职申请失败", error);
        this.$message.error("离职申请提交失败，请稍后重试");
      }
    },
  },
};
</script>

<style scoped>
.resignation-application {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.resignation-card {
  width: 500px;
  padding: 20px;
}

.resignation-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.resignation-form {
  margin-top: 20px;
}

.resignation-input {
  width: 100%;
}

.resignation-button {
  width: 100%;
}
</style>
