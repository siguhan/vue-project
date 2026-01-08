<template>
    <From-Layout>
        <h1>Log in</h1>
        <el-form
            ref="formRef"
            label-position="top"
            style="width: 100%"
            :model="form"
            :rules="rules"
            hide-required-asterisk
        >
            <el-form-item label="Email" prop="email">
                <el-input
                    v-model="form.email"
                    placeholder="Enter your email"
                ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    placeholder="Enter your password"
                    show-password
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width: 100%; margin-top: 20px"
                    @click="login"
                    :disabled="loading"
                >
                    Log In
                </el-button>
                <span style="width: 100%; font-size: 12px; text-align: center">
                    Don't have an account yet? Please
                    <router-link to="/register">sign up</router-link>
                </span>
            </el-form-item>
        </el-form>
    </From-Layout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { instance } from '@/axios'
import FromLayout from '@/layout/Form-Layout.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/shared/roles'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const formRef = ref()

const loading = ref(false)

const form = reactive({
    email: '',
    password: '',
})

const rules: FormRules = {
    email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
        {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
        },
    ],
    password: [
        {
            required: true,
            message: 'Please input password',
            trigger: ['blur', 'change'],
        },
        {
            min: 6,
            message: 'Password length should be at least 6 characters',
            trigger: 'blur',
        },
    ],
}

const login = async () => {
    if (loading.value) return

    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch (error) {
        return
    }

    try {
        loading.value = true
        const token: string = await instance.post('/login', {
            email: form.email,
            password: form.password,
        })

        userStore.setToken(token)
        userStore.initUserInfo()
        authStore.initAuthInfo()

        ElMessage.success('登录成功')

        setTimeout(() => {
            if (authStore.authInfo.role === Role.ADMIN) {
                router.push('/admin')
            } else {
                router.push('/')
            }
            loading.value = false
        }, 1000)
    } catch (err: any) {
        ElMessage.error(err || '登录失败')
        loading.value = false
    }
}
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}
</style>
