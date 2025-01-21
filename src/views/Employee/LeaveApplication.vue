<template>
  <div class="leave-application">
    <el-card class="leave-card">
      <h3 class="card-title">请假申请</h3>
      <el-form :model="leaveForm" label-width="120px" @submit.prevent="submitLeave" class="leave-form">
        <el-form-item label="请假类型" required>
          <el-select v-model="leaveForm.type" placeholder="请选择请假类型" :disabled="loading">
            <el-option label="病假" value="sick" />
            <el-option label="事假" value="personal" />
            <el-option label="年假" value="annual" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-date-picker v-model="leaveForm.startDate" type="date" placeholder="选择开始日期" :disabled="loading" />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker v-model="leaveForm.endDate" type="date" placeholder="选择结束日期" :disabled="loading" />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitLeave" 
            :loading="loading" 
            :disabled="loading"
            class="submit-button"
          >
            提交申请
          </el-button>
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
      leaveForm: {
        type: "",
        startDate: "",
        endDate: "",
      },
      loading: false, // 控制按钮和表单禁用状态
    };
  },
  methods: {
    async submitLeave() {
      this.loading = true; // 提交时禁用按钮和表单
      try {
        await axios.post('http://localhost:8080/employee/leave', this.leaveForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 使用认证 token
          },
        });
        this.$message.success("请假申请已提交！");
        this.leaveForm = {}; // 重置表单
      } catch (error) {
        console.error("提交请假申请失败", error);
        this.$message.error("请假申请提交失败，请稍后重试");
      } finally {
        this.loading = false; // 提交后启用按钮和表单
      }
    },
  },
};
</script>

<style scoped>
.leave-application {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.leave-card {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #409EFF;
}

.leave-form .el-form-item {
  margin-bottom: 20px;
}

.submit-button {
  width: 100%;
}

.el-button:disabled {
  background-color: #f0f0f0;
  border-color: #dcdfe6;
  color: #999;
}

.el-select .el-input__inner {
  background-color: #f9f9f9;
}

.el-input__inner {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .leave-card {
    padding: 20px;
  }
}
</style>
