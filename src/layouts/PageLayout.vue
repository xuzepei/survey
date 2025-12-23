<!-- layouts/PageLayout.vue -->
<template>
    <div class="page-bg">
        <slot />
    </div>
</template>

<style scoped>
.page-bg {
    min-height: 100vh;
    width: 100%;
    background-color: var(--survey-bg-color);
    display: flex;
    justify-content: center;
}
</style>
