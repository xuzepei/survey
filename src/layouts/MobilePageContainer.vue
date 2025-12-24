<!-- layouts/MobilePageContainer.vue -->
<template>
    <div class="mobile-page-container">
        <slot />
    </div>
</template>

<style scoped>
.mobile-page-container {
    width: 100%;
    max-width: 600px;
    min-width: 300px;
    padding: 20px;
}
</style>
