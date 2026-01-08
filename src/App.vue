<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from './stores/user'
import { useViewportStore } from './stores/viewport'

// new line for feature-test branch
const userStore = useUserStore()
const viewportStore = useViewportStore()

if (userStore.token) {
    userStore.initUserInfo()
} else {
    userStore.isUserInfoReady = true
}

onMounted(() => {
    viewportStore.checkScreen()
    window.addEventListener('resize', viewportStore.checkScreen)
})

onUnmounted(() => {
    window.removeEventListener('resize', viewportStore.checkScreen)
})
</script>

<style>
*,
*::before,
*::after {
    margin: 0;
    box-sizing: border-box;
}

a {
    text-decoration: none;
    color: black;
}
#app {
    display: flex;
    min-height: 100vh;
    background-color: white;
}
</style>
