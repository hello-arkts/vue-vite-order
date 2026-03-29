<template>
  <div class="jump-page">
    <NavBar title="返回" />
    <div class="jump-page-container">
      <div class='jump-page-content'>

      </div>
      <div class="jump-page-btn-group">
        <el-button type="primary">联系客服</el-button>
        <el-button type="primary">立即申请</el-button>
        <el-button type="primary">联系客服</el-button>
        <el-button type="primary">立即申请</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";

</script>

<style scoped>
.jump-page {
  min-height: 100vh;
  background: #FBF9ED;
  display: flex;
  flex-direction: column;
}

.jump-page-container {
  padding:8px 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.jump-page-btn-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>