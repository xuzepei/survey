<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <el-button type="primary" @click="$router.push('/')">
      Go Home
    </el-button>
  </div>
</template>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 80px;
  margin: 0;
}
</style>
