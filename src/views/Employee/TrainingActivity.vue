<template>
  <div class="training-activity">
    <el-card class="training-card" shadow="always">
      <h3 class="training-title">培训活动</h3>

      <!-- 错误提示 -->
      <el-alert v-if="error" type="error" :closable="false" class="error-alert">
        {{ error }}
      </el-alert>

      <!-- 加载状态 -->
      <el-loading v-if="loading" text="加载中..." class="loading-state" />

      <!-- 培训活动表格 -->
      <el-table
        v-if="!loading && !error && trainingData.length > 0"
        :data="trainingData"
        border
        stripe
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="name" label="培训名称" />
        <el-table-column prop="startDate" label="开始时间" :formatter="formatDate" />
        <el-table-column prop="endDate" label="结束时间" :formatter="formatDate" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column prop="feedback" label="反馈" />
      </el-table>

      <!-- 空数据提示 -->
      <el-empty
        v-if="!loading && !error && trainingData.length === 0"
        description="暂无培训记录"
        class="empty-state"
      />
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      trainingData: [],  // 存储培训活动数据
      loading: false,     // 加载状态
      error: null,        // 错误消息
      employeeId: localStorage.getItem('employeeId') || this.$route.params.employeeId,
    };
  },
  methods: {
    async fetchTrainingData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("http://localhost:8080/employee/training", {
          params: {
            employeeId:this.employeeId , // 获取用户 ID
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 使用认证 token
          },
        });

        if (response.data && Array.isArray(response.data)) {
          this.trainingData = response.data.map(item => {
            // 处理时间格式
            item.startDate = new Date(item.startDate).toLocaleDateString(); // 转换为本地日期格式
            item.endDate = new Date(item.endDate).toLocaleDateString(); // 转换为本地日期格式
            return item;
          });
        } else {
          this.error = "返回数据格式不正确";
        }
      } catch (error) {
        this.error = "无法获取培训数据，请稍后再试";
        console.error("Error fetching training data:", error);
      } finally {
        this.loading = false;
      }
    },

    // 格式化日期
    formatDate(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    }
  },
  mounted() {
    this.fetchTrainingData();  // 组件加载时获取数据
  },
};
</script>

<style scoped>
.training-activity {
  padding: 20px;
  background-color: #f5f5f5;
}

.training-card {
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.training-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #409eff;
  font-weight: bold;
  text-align: center;
}

.el-table {
  margin-top: 20px;
  background-color: #ffffff;
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

@media (max-width: 768px) {
  .training-card {
    padding: 15px;
  }
  .training-title {
    font-size: 20px;
  }
}
</style>
