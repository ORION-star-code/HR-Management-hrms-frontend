<template>
  <div class="avatar-setting">
    <el-card class="avatar-card">
      <h3>头像设置</h3>
      <el-upload
        action="http://localhost:8080/upload/avatar"
        list-type="picture-card"
        :on-success="handleUploadSuccess"
        class="avatar-uploader"
        :before-upload="beforeUpload"
        :data="uploadData"
      >
        <i class="el-icon-plus avatar-icon"></i>
      </el-upload>

      <!-- 显示已上传的头像 -->
      <div v-if="avatarUrl">
        <img :src="avatarUrl" alt="avatar" class="avatar-img" />
        <el-button @click="deleteAvatar">删除头像</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarUrl: '',  // 存储头像的 URL
      employeeId: 123 // 假设这是当前员工的 ID, 需要动态获取
    };
  },
  computed: {
    // 计算属性用于获取上传时的额外数据
    uploadData() {
      return {
        employeeId: this.employeeId  // 传递员工 ID 给后端
      };
    }
  },
  methods: {
    // 上传成功后获取头像URL并保存
    handleUploadSuccess(response) {
      console.log('上传的响应数据:', response);
      this.$message.success("头像上传成功！");
      this.avatarUrl = response.data; // 假设返回的数据是头像的URL
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error("只能上传图片文件!");
      }
      return isImage;
    },
    // 删除头像
    deleteAvatar() {
      this.$axios.delete(`http://localhost:8080/upload/avatar/${this.employeeId}`)
        .then(() => {
          this.$message.success("头像删除成功");
          this.avatarUrl = ''; // 清空头像URL
        })
        .catch(error => {
          this.$message.error("删除失败: " + error.response.data.message);
        });
    }
  }
};
</script>

<style scoped>
.avatar-setting {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.avatar-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
