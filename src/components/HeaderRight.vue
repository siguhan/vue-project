<template>
    <div v-if="!userStore.isUserInfoReady"></div>
    <div v-else-if="userStore.userInfo.isLogin">
        <span style="margin-right: 10px">
            Welcome, {{ userStore.userInfo.username }}
        </span>
        <el-button type="danger" plain @click="userStore.logout()">
            logout
        </el-button>
    </div>
    <div v-else>
        <el-button type="primary" plain @click="toSignUp">sign up</el-button>
        <el-button type="primary" @click="toLogin">login in</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const toSignUp = () => {
    router.push('/register')
}

const toLogin = () => {
    router.push('/login')
}
</script>

<style scoped></style>
