<template>
    <From-Layout>
        <h1>Sign up</h1>
        <el-form
            ref="formRef"
            label-position="top"
            style="width: 100%"
            :model="form"
            :rules="rules"
            hide-required-asterisk
        >
            <el-form-item label="Username" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input
                    type="password"
                    v-model="form.password"
                    show-password
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    style="width: 100%; margin-top: 20px"
                    @click="register"
                    :disabled="loading"
                >
                    Sign up
                </el-button>
                <span style="width: 100%; font-size: 12px; text-align: center">
                    Already have an account, please
                    <router-link to="/login">log in</router-link>
                </span>
            </el-form-item>
        </el-form>
    </From-Layout>
</template>

<script setup lang="ts">
import { instance } from '@/axios'
import FromLayout from '@/layout/Form-Layout.vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
    username: '',
    email: '',
    password: '',
})

const rules: FormRules = {
    username: [
        { required: true, message: 'Please input username', trigger: 'blur' },
    ],
    email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
        {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
        },
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        {
            min: 6,
            message: 'Password must be at least 6 characters',
            trigger: 'blur',
        },
    ],
}

const register = async () => {
    if (loading.value) return
    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch {
        return
    }

    try {
        loading.value = true
        await instance.post('/register', {
            username: form.username,
            email: form.email,
            password: form.password,
        })

        ElMessage.success('注册成功')

        setTimeout(() => {
            router.push('/login')
            loading.value = false
        }, 1000)
    } catch (err: any) {
        ElMessage.error(err || '注册失败')
        loading.value = false
    }
}
</script>

<style scoped></style>
