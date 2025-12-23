<!-- layouts/PageContainer.vue -->
<template>
    <div class="page-container">
        <slot />
    </div>
</template>

<style scoped>
.page-container {
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    padding: 20px;
}
</style>
