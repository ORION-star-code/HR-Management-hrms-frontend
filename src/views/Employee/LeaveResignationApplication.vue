<template>
  <div class="application">
    <el-card class="application-card" shadow="always">
      <h3 class="application-title">{{ isLeave ? '请假申请' : '离职申请' }}</h3>

      <!-- 表单 -->
      <el-form :model="form" label-width="120px" ref="form" :rules="formRules" @submit.prevent="submitForm">
        <!-- 申请类型选择 -->
        <el-form-item label="申请类型" required prop="leaveType">
          <el-select v-model="form.leaveType" placeholder="请选择申请类型" :disabled="loading">
            <el-option label="病假" value="sick" />
            <el-option label="事假" value="personal" />
            <el-option label="年假" value="annual" v-if="isLeave" />
            <el-option label="离职" value="resignation" v-if="!isLeave" />
          </el-select>
        </el-form-item>

        <!-- 请假相关日期 -->
        <el-form-item v-if="isLeave" label="开始时间" required prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" :disabled="loading" />
        </el-form-item>

        <el-form-item v-if="isLeave" label="结束时间" required prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束日期" :disabled="loading" />
        </el-form-item>

        <!-- 理由 -->
        <el-form-item label="理由" required prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入申请理由" :disabled="loading" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
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
import axios from "axios";

export default {
  data() {
    return {
      form: {
        leaveType: "", // 修改字段名为 leaveType
        reason: "", // 理由
        startDate: "", // 开始日期
        endDate: "", // 结束日期
      },
      loading: false, // 控制按钮和表单禁用状态
      isLeave: true, // 判断是请假还是离职申请，默认是请假
      employeeId: localStorage.getItem('employeeId') || this.$route.params.employeeId,
      formRules: {
        leaveType: [{ required: true, message: "请选择申请类型", trigger: "change" }],
        reason: [{ required: true, message: "请输入申请理由", trigger: "blur" }],
        startDate: [{ required: this.isLeave, message: "请选择开始日期", trigger: "change" }],
        endDate: [{ required: this.isLeave, message: "请选择结束日期", trigger: "change" }]
      }
    };
  },
  methods: {
    // 根据申请类型切换表单
    switchFormType() {
      this.isLeave = this.form.leaveType !== "resignation"; // 修改为 leaveType
    },

    // 提交表单
    async submitForm() {
      // 表单验证
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const url = this.isLeave
              ? "http://localhost:8080/employee/leave" // 请假申请
              : "http://localhost:8080/employee/resignation"; // 离职申请
            await axios.post(url, this.form, {
              params: {
                employeeId: this.employeeId, // Ensure employeeId is passed correctly
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            this.$message.success(`${this.isLeave ? "请假" : "离职"}申请已提交！`);
            this.form = {}; // 清空表单
          } catch (error) {
            console.error("申请提交失败", error);
            this.$message.error(`${this.isLeave ? "请假" : "离职"}申请提交失败，请稍后重试`);
          } finally {
            this.loading = false;
          }
        } else {
          console.log("表单验证失败!");
        }
      });
    },
  },
  watch: {
    "form.leaveType": "switchFormType", // 当申请类型变化时，切换表单
  },
};
</script>

<style scoped>
.application {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.application-card {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.application-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #409eff;
}

.el-form-item {
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

@media (max-width: 768px) {
  .application-card {
    padding: 20px;
  }
}
</style>
