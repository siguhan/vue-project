<template>
    <div class="page">
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.page {
    display: flex;
    justify-content: center;
    width: 100%;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15vh;
    min-width: 300px;
    max-width: 400px;
    width: 100%;
    padding: 12px;
}
</style>
