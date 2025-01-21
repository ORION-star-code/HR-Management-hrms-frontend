<template>
  <div class="salary">
    <h1>员工薪资管理</h1>

    <!-- 本月薪资 -->
    <el-card class="salary-details" shadow="always">
      <h2>本月薪资</h2>
      <el-row>
        <el-col :span="12">底薪：</el-col>
        <el-col :span="12">{{ formatCurrency(currentSalary.base) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">满勤奖：</el-col>
        <el-col :span="12">{{ formatCurrency(currentSalary.attendance) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">业绩奖金：</el-col>
        <el-col :span="12">{{ formatCurrency(currentSalary.performance) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">总薪资：</el-col>
        <el-col :span="12" class="total">{{ formatCurrency(currentTotal) }}</el-col>
      </el-row>
    </el-card>

    <!-- 薪资历史 -->
    <el-card class="salary-history" shadow="always">
      <h2>薪资历史</h2>
      <el-table :data="salaryHistory" style="width: 100%" border>
        <el-table-column prop="paymentDate" label="月份" width="120"></el-table-column>
        <el-table-column prop="baseSalary" label="底薪" :formatter="formatColumn"></el-table-column>
        <el-table-column prop="attendanceBonus" label="满勤奖" :formatter="formatColumn"></el-table-column>
        <el-table-column prop="performanceBonus" label="业绩奖金" :formatter="formatColumn"></el-table-column>
        <el-table-column label="总薪资" :formatter="(row) => formatCurrency(calculateTotal(row))"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentSalary: {
        base: 0,
        attendance: 0,
        performance: 0
      },
      salaryHistory: [],
      employeeId: localStorage.getItem('employeeId') || this.$route.params.employeeId, // 确保传递employeeId
    };
  },
  computed: {
    currentTotal() {
      return this.currentSalary.base + this.currentSalary.attendance + this.currentSalary.performance;
    }
  },
  methods: {
    // 格式化货币
    formatCurrency(value) {
      if (isNaN(value)) {
        return '¥0.00';
      }
      return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);
    },
    // 计算薪资总额
    calculateTotal(salary) {
      return salary.baseSalary + salary.attendanceBonus + salary.performanceBonus;
    },
    // 格式化列显示货币
    formatColumn(row, column, cellValue) {
      return this.formatCurrency(cellValue);
    },
    // 获取薪资数据
    async fetchSalaryData() {
      try {
        const response = await axios.get('http://localhost:8080/employee/salary', {
          params: {
            employeeId: this.employeeId, // 确保传递employeeId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // 添加认证 token
          },
        });
        const data = response.data;

        // 确保响应数据格式正确
        if (data && data.length > 0) {
          // 获取当前薪资数据
          this.currentSalary = data[0];
          // 获取历史薪资数据
          this.salaryHistory = data.slice(1);
        } else {
          console.error('无效的响应数据格式', data);
        }
      } catch (error) {
        console.error("获取薪资数据失败", error);
      }
    }
  },
  mounted() {
    this.fetchSalaryData();
  }
};
</script>

<style scoped>
.salary {
  padding: 20px;
  font-family: '微软雅黑', sans-serif;
}

.salary-details, .salary-history {
  margin-bottom: 20px;
}

.salary-history .el-table {
  background-color: #f9f9f9;
}

.salary-details .total {
  font-weight: bold;
  color: #409EFF;
}

.el-table th {
  background-color: #f2f2f2;
  color: #409EFF;
  font-weight: bold;
}

.el-table tr {
  transition: background-color 0.3s ease;
}

.el-table tr:hover {
  background-color: #f5faff;
}

h1, h2 {
  text-align: center;
  color: #333;
}

h1 {
  font-size: 28px;
  margin-bottom: 30px;
}

h2 {
  font-size: 22px;
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 10px;
}

.el-col {
  font-size: 16px;
}

.el-button {
  background-color: #409EFF;
  color: white;
  border-radius: 5px;
}

.el-button:hover {
  background-color: #3386cc;
}
</style>
